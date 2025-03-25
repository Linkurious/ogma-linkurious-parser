import {Transformation, Node, NodeList, StyleRule, PixelSize, Point} from '@linkurious/ogma';
import {
  IVizNodeGroupInfo,
  LkEdgeData,
  LkNodeData,
  MissingValue,
  NodeGroupingRule,
  NodeGroupingByPropertyValue,
  NodeGroupingByAdjacentEdgeType,
  NodeGroupingType
} from '@linkurious/rest-client';
import sha1 from 'sha1';

import {FORCE_LAYOUT_CONFIG, LKOgma} from '../index';
import {Tools} from '../../tools/tools';
import {OgmaTools} from '../../tools/ogmaTool';

export const LKE_NODE_GROUPING_EDGE = 'LKE_NODE_GROUPING_EDGE';
export const LKE_NODE_GROUPING_NODE = 'LKE_NODE_GROUPING_NODE';

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
  public nodeGroupingStyleRule?: StyleRule<LkNodeData, LkEdgeData>;
  private _ogma: LKOgma;

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
          return {
            data: {
              categories: [LKE_NODE_GROUPING_NODE],
              properties: {},
              nodeGroupId: this._findNodeGroupId(nodes)
            }
          };
        },
        edgeGenerator: () => {
          return {
            data: {
              type: LKE_NODE_GROUPING_EDGE
            }
          };
        },
        showContents: true,
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
    this.nodeGroupingStyleRule = this._ogma.styles.addRule({
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
        // TODO: Tools.isDefined(node.getSubNodes()) is a work around for an ogma issue visible when using image export plugin with Node grouping
        // remove when updating to Ogma v5.1.x
        return node.isVirtual() && Tools.isDefined(node.getSubNodes());
      },
      // the style will be updated when data object is updated
      nodeDependencies: {self: {data: true}}
    });
  }

  public async refreshNodeGroupingStyle(): Promise<void> {
    await this.nodeGroupingStyleRule?.refresh();
  }

  /**
   * run layout on all subnodes of virtual nodes
   */
  public async runLayoutOnAllSubNodes(): Promise<void> {
    await this._ogma.transformations.afterNextUpdate();
    const rawNodesList = this._getAllTransformationRawNodes();
    const promisesList: Promise<void>[] = [];
    for (let i = 0; i < rawNodesList.length; i++) {
      // rawNodesList[i] is not null because each group has at least one node
      const subNodes = rawNodesList[i]!;
      promisesList.push(this.runSubNodesLayout(subNodes));
    }
    await Promise.all(promisesList);
  }

  /**
   * Run the layout on the subnodes of the virtual node
   * @param subNodes nodes part of a virtual node
   */
  public async runSubNodesLayout(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    if (subNodes.size === 0 || subNodes.size === 1) {
      return;
    }

    // 2 nodes
    if (subNodes.size === 2) {
      await this._runTwoNodesLayout(subNodes);
      return;
    }

    const noEdges = subNodes.getAdjacentEdges({bothExtremities: true}).size === 0;
    if (noEdges) return this._runCirclePack(subNodes);
    // stars
    const center = this.isStar(subNodes);
    if (center) {
      const satellites = subNodes.filter((n) => n !== center);
      const positions = this._runCircularLayout({
        radii: satellites.getAttribute('radius'),
        cx: center.getAttribute('x'),
        cy: center.getAttribute('y'),
        clockwise: false,
        distanceRatio: 5
      });
      const list = center.toList().concat(satellites);
      await list.setAttributes([center.getPosition(), ...positions]);
      return;
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
  public async setNodeGroupPin(nodeGroups: IVizNodeGroupInfo[]): Promise<void> {
    this._ogma
      .getNodes()
      .filter((node) => node.isVirtual())
      .forEach((node) => {
        const nodeGroupInfo = nodeGroups.find(
          (nodeGroup) => nodeGroup.id === node.getData('nodeGroupId')
        );
        if (nodeGroupInfo !== undefined) {
          void node.setAttribute('layoutable', nodeGroupInfo.attributes.layoutable ?? false);
        }
      });
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
  private async _runCirclePack(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    await this._ogma.algorithms.circlePack({
      nodes: subNodes,
      margin: 10,
      sort: 'asc'
    });
  }

  private async _runChainLayout(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    // straighten the chain
    const sortedNodes = this._ogma.getNodes(OgmaTools.topologicalSort(subNodes));
    // we also need to sort the nodes so that they are following the chain
    await this._ogma.layouts.grid({
      nodes: sortedNodes,
      // TODO: test that visually
      colDistance: Math.max(...subNodes.getAttribute('radius').map(Number)) * 4,
      rows: 1
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
      // 'all' will get even edges hidden by transformations
      // Use case: in ER, 2 created entities are pointing to the same group
      // Note: this should not happen but in case it happens due to some inconsistency, this fix will allow the grouping to kind of work
      // limitation: one node will be alone in its own group
      // however, without this 'all' filter, the edge would be hidden by the transformation (not found) and 'firstAdjacentEdge' would be undefined
      // in this case, the next line would throw an error
      .getAdjacentEdges({filter: 'all'})
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
    await nodes.setAttributes([
      positions[0],
      {x: positions[0].x + gap + radii[0] + radii[1], y: positions[0].y}
    ]);
  }

  private isStar(nodes: NodeList) {
    for (const id of nodes.getId()) {
      const node = this._ogma.getNode(id)!;
      const adjacent = node.getAdjacentNodes();
      const isStar = node.getDegree() > 2 && adjacent.getDegree().every((d) => d === 1);
      if (isStar && adjacent.size + 1 === nodes.size) return node;
    }
    return false;
  }
}
