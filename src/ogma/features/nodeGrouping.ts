import {Node, NodeList, PixelSize, Point, StyleRule, Transformation} from '@linkurious/ogma';
import {
  IVizNodeGroupInfo,
  LkEdgeData,
  LkNodeData,
  MissingValue,
  NodeGroupingByAdjacentEdgeType,
  NodeGroupingByPropertyValue,
  NodeGroupingRule,
  NodeGroupingType
} from '@linkurious/rest-client';
import sha1 from 'sha1';

import {LKOgma} from '../index';
import {Tools} from '../../tools/tools';
import {FORCE_LAYOUT_CONFIG, OgmaTools} from '../../tools/ogmaTool';

import {CLEAR_FONT_COLOR} from './styles';

export const LKE_NODE_GROUPING_EDGE = 'LKE_NODE_GROUPING_EDGE';

interface CircularLayoutOptions {
  radii: PixelSize[] | number[];
  cx?: number;
  cy?: number;
  startAngle?: number;
  clockwise?: boolean;
  getRadius?: (radius: PixelSize) => number;
  distanceRatio?: number;
}

export class NodeGroupingTransformation {
  public transformation?: Transformation<LkNodeData, LkEdgeData>;
  public groupRule?: NodeGroupingRule;
  private _nodeGroupingStyleRule?: StyleRule<LkNodeData, LkEdgeData>;
  private _ogma: LKOgma;
  private _nodeGroupingCollapsedStyleRule?: StyleRule<LkNodeData, LkEdgeData>;
  private _collapsedDefaultValue = false;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
  }

  /**
   * Set the grouping rule
   * @param rule of grouping
   */
  public setGroupingRule(rule?: NodeGroupingRule): void {
    this.groupRule = rule;
  }

  /**
   * create a node grouping transformation
   * It uses groupRule to define the rule
   * Group the nodes based on a category type and a property value
   */
  public async initTransformation(): Promise<void> {
    if (this.transformation === undefined) {
      this.transformation = this._ogma.transformations.addNodeGrouping({
        // node with same value will be part of the same group
        groupIdFunction: (node) => {
          if (this._isRuleNotApplicableToNode(node)) {
            return undefined;
          }
          // if groupRule is undefined, the early return would have catch it
          const rule = this.groupRule!;
          if (rule.groupingType === NodeGroupingType.BY_ADJACENT_EDGE_TYPE) {
            return this._getAdjacentEdgeGroupId(node, rule);
          } else {
            return this._getPropertyValueGroupId(node, rule);
          }
        },
        nodeGenerator: (nodes) => {
          const categories = new Set(nodes.getData('categories').flat());
          return {
            data: {
              categories: [],
              subCategories: Array.from(categories),
              collapsed: this._collapsedDefaultValue,
              nodeGroupId: this._findNodeGroupId(nodes)
            }
          };
        },
        onGroupUpdate: async (_, subNodes) => {
          return await this.runSubNodesLayout(subNodes);
        },
        edgeGenerator: () => {
          return {
            data: {
              type: LKE_NODE_GROUPING_EDGE
            }
          };
        },
        showContents: (metaNode) => {
          return !OgmaTools.isGroupCollapsed(metaNode);
        },
        duration: 300,
        padding: 10
      });
    } else {
      await this.refreshTransformation();
    }
  }

  private _getPropertyValueGroupId(
    node: Node<LkNodeData, LkEdgeData>,
    rule: NodeGroupingByPropertyValue
  ) {
    const propertyValue = this._findGroupingPropertyValue(node);
    return `${rule.groupingOptions.itemTypes.join('-')}-${propertyValue}`.toLowerCase().trim();
  }

  private _getAdjacentEdgeGroupId(
    node: Node<LkNodeData, LkEdgeData>,
    rule: NodeGroupingByAdjacentEdgeType
  ) {
    const centralNode = NodeGroupingTransformation._getGroupCentralNode(node, rule);
    return centralNode.getId().toString();
  }

  /**
   * refresh the transformation
   * Called when there is a change in the rule
   */
  public async refreshTransformation(): Promise<void> {
    if (this.transformation !== undefined) {
      await this.transformation.refresh();
      await this._unpinNodes(this._getAllTransformationRawNodes());
    } else {
      await this.initTransformation();
    }
  }

  /**
   * init node grouping style
   */
  public initNodeGroupingStyle(): void {
    this._nodeGroupingStyleRule = this._ogma.styles.addRule({
      nodeAttributes: {
        // Any default style will go here
        text: {
          content: (node: Node<LkNodeData> | undefined): string | undefined => {
            return this._getNodeGroupingCaption(node);
          },
          style: 'bold'
        },
        layer: -1,
        color: 'rgba(240, 240, 240)',
        innerStroke: {
          color: '#7f7f7f',
          width: 2
        }
      },
      nodeSelector: (node) => {
        return node.isVirtual() && !OgmaTools.isGroupCollapsed(node);
      },
      // the style will be updated when data object is updated
      nodeDependencies: {self: {data: true}}
    });

    this._nodeGroupingCollapsedStyleRule = this._ogma.styles.addRule({
      nodeAttributes: {
        text: {
          content: (node: Node<LkNodeData> | undefined): string | undefined => {
            return this._getNodeGroupingCaption(node);
          },
          style: 'bold'
        },
        halo: {
          width: 10,
          color: '#e4ebea',
          strokeColor: '#ccc'
        },
        badges: {
          bottomLeft: (node) => {
            const numberOfSubNodes = node
              .getSubNodes()!
              .filter((node) => !node.hasClass('filtered'))?.size;

            return {
              color: '#3F3D5F',
              minVisibleSize: 20,
              stroke: {
                width: 0,
                color: null
              },
              text: {
                font: 'FontAwesome',
                scale: 0.4,
                color: CLEAR_FONT_COLOR,
                content: `x${numberOfSubNodes}`
              }
            };
          },
          topLeft: () => {
            return {
              color: '#3F3D5F',
              minVisibleSize: 20,
              stroke: {
                width: 0,
                color: null
              },
              text: {
                font: 'FontAwesome',
                scale: 0.4,
                color: CLEAR_FONT_COLOR,
                content: ''
              }
            };
          }
        },
        color: (node: Node | undefined) => {
          if (node !== undefined) {
            // get the colors of the sub-nodes, passing a fake itemData to nodeAttributes.color
            return this._ogma.LKStyles.nodeAttributes.color({
              geo: {},
              isVirtual: false,
              properties: {},
              readAt: 0,
              categories: node.getData('subCategories')
            });
          }
        }
      },
      nodeSelector: (node) => {
        return node.isVirtual() && OgmaTools.isGroupCollapsed(node);
      },
      // the style will be updated when data object is updated
      nodeDependencies: {self: {data: true}}
    });
  }

  public async refreshNodeGroupingStyle(): Promise<void> {
    await this._nodeGroupingStyleRule?.refresh();
    await this._nodeGroupingCollapsedStyleRule?.refresh();
  }

  /**
   * Run the layout on the subnodes of the virtual node
   * @param subNodes nodes part of a virtual node
   */
  public async runSubNodesLayout(
    subNodes: NodeList<LkNodeData, LkEdgeData>
  ): Promise<Point[] | undefined | void> {
    if (subNodes.size === 0 || subNodes.size === 1) {
      return;
    }

    // 2 nodes
    if (subNodes.size === 2) {
      return this._runTwoNodesLayout(subNodes);
    }

    const noEdges = subNodes.getAdjacentEdges({bothExtremities: true}).size === 0;
    if (noEdges) return this._runCirclePack(subNodes);
    // stars
    const center = OgmaTools.isStar(subNodes);
    if (center) {
      const satellites = subNodes.filter((n) => n !== center);
      const positions = this._runCircularLayout({
        radii: satellites.getAttribute('radius'),
        cx: center.getAttribute('x'),
        cy: center.getAttribute('y'),
        clockwise: false,
        distanceRatio: 5
      });
      return [center.getPosition(), ...positions];
    }
    // Chains: if al nodes have degree 1 or 2, place them in a line
    const degrees = subNodes.getDegree();
    if (degrees.every((d) => d > 0 && d <= 2)) {
      await this._runChainLayout(subNodes);
      return;
    }

    return await this._runForceLayout(subNodes);
  }

  /**
   * Get the virtual nodes of the transformation
   * @private
   */
  public getVirtualNodesOfTransformation(): NodeList<LkNodeData, LkEdgeData> {
    // @ts-ignore getContext exists on the transformation but hidden by the types
    return this.transformation.getContext().metaNodes;
  }

  /**
   * Set the node group pin
   * @param nodeGroups object containing the node group id and the layoutable attribute
   */
  public async setNodeGroupingAttributes(nodeGroups: IVizNodeGroupInfo[]): Promise<void> {
    this._ogma
      .getNodes()
      .filter((node) => node.isVirtual())
      .forEach((node) => {
        const nodeGroupInfo = nodeGroups.find(
          (nodeGroup) => nodeGroup.id === node.getData('nodeGroupId')
        );
        if (nodeGroupInfo !== undefined) {
          void node.setAttribute('layoutable', nodeGroupInfo.attributes.layoutable ?? false);
          OgmaTools.setCollapsedGroupProperty(node, nodeGroupInfo.attributes.collapsed ?? false);
        }
      });
  }

  /**
   * set collapse default value, this will be the state of newly created groups
   */
  public setCollapseDefaultValue(value: boolean) {
    this._collapsedDefaultValue = value;
  }

  /**
   * Return the caption of a virtual node
   * @param node reference to the virtual node
   */
  private _getNodeGroupingCaption(node: Node<LkNodeData> | undefined): string | undefined {
    if (node === undefined) {
      return undefined;
    }
    if (this.groupRule === undefined) {
      return undefined;
    }
    const rule = this.groupRule;
    if (rule.groupingType === NodeGroupingType.BY_ADJACENT_EDGE_TYPE) {
      return this._getAdjacentEdgeNodeGroupingCaption(node, rule);
    }
    return this._getPropertyValueNodeGroupingCaption(node, rule);
  }

  private _getAdjacentEdgeNodeGroupingCaption(
    node: Node<LkNodeData>,
    rule: NodeGroupingByAdjacentEdgeType
  ): string {
    const centralNode = NodeGroupingTransformation._getGroupCentralNode(
      node.getSubNodes()!.get(0),
      rule
    );
    return centralNode.getData(['properties', 'name']) as string;
  }

  private _getPropertyValueNodeGroupingCaption(
    node: Node<LkNodeData>,
    rule: NodeGroupingByPropertyValue
  ): string | undefined {
    // TODO: Normally there is no need to check if getSubNodes return a value, Ogma issue
    //https://github.com/Linkurious/ogma/issues/3876
    if (node.isVirtual() && node.getSubNodes()?.get(0) !== undefined) {
      // get the property value of the first node of the group (all nodes share the same property value)
      const lkPropertyValue = node
        .getSubNodes()!
        .get(0)
        .getData(['properties', rule.groupingOptions.propertyKey]);
      const propertyValue = Tools.getValueFromLkProperty(lkPropertyValue);
      const size = node.getSubNodes()!.filter((e) => !e.hasClass('filtered')).size;
      return `${propertyValue} (${size})`;
    }
  }

  /**
   * Run the circle pack layout on the subnodes
   * @param subNodes
   */
  private _runCirclePack(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<Point[]> {
    return Promise.resolve(
      this._ogma.algorithms.circlePack({
        nodes: subNodes,
        margin: 10,
        sort: 'asc',
        dryRun: true
      })
    );
  }

  /**
   * return a grid layout when nodes are represented by multiple chains (a)-(b)-(c)-(d)
   */
  private async _runChainLayout(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    // straighten the chain
    const chain = OgmaTools.topologicalSort(subNodes);
    const sortedNodes = this._ogma.getNodes(chain.chain);
    // we also need to sort the nodes so that they are following the chain
    await this._ogma.layouts.grid({
      nodes: sortedNodes,
      // TODO: test that visually
      colDistance: Math.max(...subNodes.getAttribute('radius').map(Number)) * 4,
      rows: chain.numberOfChain
    });
  }

  private async _runForceLayout(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    await this._ogma.layouts.force({
      nodes: subNodes,
      ...FORCE_LAYOUT_CONFIG
    });
  }

  private _isRuleNotApplicableToNode(node: Node<LkNodeData>): boolean {
    const rule = this.groupRule;
    if (rule === undefined) {
      return true;
    }
    if (rule.groupingType === NodeGroupingType.BY_PROPERTY_VALUE) {
      return this._isPropertyRuleNotApplicableToNode(node, rule);
    } else if (rule.groupingType === NodeGroupingType.BY_ADJACENT_EDGE_TYPE) {
      return this._isRelationshipRuleNotApplicableToNode(node, rule);
    }
    return true;
  }

  private _isRelationshipRuleNotApplicableToNode(
    node: Node<LkNodeData>,
    rule: NodeGroupingByAdjacentEdgeType
  ): boolean {
    // if the node does not have the relationship
    return !this.hasEdgeOfType(node, rule.groupingOptions.edgeType);
  }

  private hasEdgeOfType(node: Node<LkNodeData>, type: string): boolean {
    let hasEdge = false;
    node.getAdjacentEdges().forEach((edge) => {
      if (edge.getData('type') === type) {
        hasEdge = true;
      }
    });
    return hasEdge;
  }

  private _isPropertyRuleNotApplicableToNode(
    node: Node<LkNodeData>,
    rule: NodeGroupingByPropertyValue
  ): boolean {
    const propertyValue = node.getData(['properties', rule.groupingOptions.propertyKey ?? '']);
    return (
      // if rule is applied to a different category
      rule.groupingOptions.itemTypes.every(
        (itemType: string) => !node.getData('categories').includes(itemType)
      ) ||
      // if the property value is not defined
      !Tools.isDefined(propertyValue) ||
      // if the property value is missing
      (typeof propertyValue === 'object' && (propertyValue as MissingValue).status === 'missing')
    );
  }

  /**
   * Unpin list of nodes
   * @param nodes
   * @private
   */
  private async _unpinNodes(nodes: Array<NodeList | null>): Promise<void> {
    await Promise.all(
      nodes.map((nodeList) => {
        if (nodeList !== null) {
          return nodeList.setAttribute('layoutable', true);
        }
      })
    );
  }

  /**
   * Get all the raw nodes part of the transformation
   * @private
   */
  private _getAllTransformationRawNodes(): Array<NodeList | null> {
    const virtualNodes = this.getVirtualNodesOfTransformation();
    return virtualNodes.getSubNodes();
  }

  private _findGroupingPropertyValue(node: Node<LkNodeData>): string {
    // we only use this method when the grouping type is property key
    const rule = this.groupRule as NodeGroupingByPropertyValue;
    const propertyValue = node.getData(['properties', rule.groupingOptions.propertyKey ?? '']);
    return `${Tools.getValueFromLkProperty(propertyValue)}`;
  }

  /**
   * Return a hashed string that represents the group id
   */
  private _findNodeGroupId(nodes: NodeList<LkNodeData, LkEdgeData>): string {
    const rule = this.groupRule!;
    if (rule.groupingType === NodeGroupingType.BY_ADJACENT_EDGE_TYPE) {
      const centralNode = NodeGroupingTransformation._getGroupCentralNode(nodes.get(0), rule);
      return sha1(`${this.groupRule?.name}-${centralNode.getId()}`);
    } else {
      const propertyValue = this._findGroupingPropertyValue(nodes.get(0));
      return sha1(`${rule.name}-${rule.groupingOptions.itemTypes.join('-')}-${propertyValue}`);
    }
  }

  /**
   * For a relation type grouping rule, return the central node from one of the nodes in the group
   */
  private static _getGroupCentralNode(
    node: Node<LkNodeData, LkEdgeData>,
    rule: NodeGroupingByAdjacentEdgeType
  ): Node<LkNodeData, LkEdgeData> {
    const firstAdjacentEdge = node
      // 'raw' will get edges hidden by transformations
      // Use case: in ER, 2 created entities are pointing to the same node
      // node A RESOLVED node C
      // node B RESOLVED node C
      // when grouping by relationship, node A and C will be grouped together
      // node B should also be grouped with node C but since it's already part of a group,
      // it will be alone in a group and point to the other group by a virtual edge
      // impact: without using 'raw', the firstAdjacentEdge will be the virtual edge which is not of the correct type 'RESOLVED'
      // firstAdjacentEdge will be undefined and next line will throw an error
      // Note: this should not happen but in case it happens due to some inconsistency, this fix will prevent this method to throw an error
      .getAdjacentEdges({filter: 'raw'})
      .filter((edge) => edge.getData('type') === rule.groupingOptions.edgeType)
      .get(0);
    const centralNode =
      rule.groupingOptions.centralNodeIs === 'source'
        ? firstAdjacentEdge.getSource()
        : firstAdjacentEdge.getTarget();
    return centralNode;
  }

  public _runCircularLayout({
    radii,
    clockwise = true,
    cx = 0,
    cy = 0,
    startAngle = (3 / 2) * Math.PI,
    getRadius = (radius: PixelSize) => Number(radius),
    distanceRatio = 0.0
  }: CircularLayoutOptions): Point[] {
    const N = radii.length;
    // dummy checks
    if (N === 0) return [];
    if (N === 1) return [{x: cx, y: cy}];

    // minDistance
    const minDistance =
      radii.map(getRadius).reduce((acc, r) => Math.max(acc, r), 0) * (2 + distanceRatio);

    const sweep = 2 * Math.PI - (2 * Math.PI) / N;
    const deltaAngle = sweep / Math.max(1, N - 1);

    const dcos = Math.cos(deltaAngle) - Math.cos(0);
    const dsin = Math.sin(deltaAngle) - Math.sin(0);

    const rMin = Math.sqrt((minDistance * minDistance) / (dcos * dcos + dsin * dsin));
    const r = Math.max(rMin, 0);

    return radii.map((_, i) => {
      const angle = startAngle + i * deltaAngle * (clockwise ? 1 : -1);

      const rx = r * Math.cos(angle);
      const ry = r * Math.sin(angle);
      return {
        x: cx + rx,
        y: cy + ry
      };
    });
  }

  private async _runTwoNodesLayout(nodes: NodeList<LkNodeData, LkEdgeData>) {
    const radii = nodes.getAttribute('radius').map(Number);
    const positions = nodes.getPosition();
    const gap = Math.min(...radii);
    return [positions[0], {x: positions[0].x + gap + radii[0] + radii[1], y: positions[0].y}];
  }
}
