import type {Node, NodeList, StyleRule, Transformation} from '@linkurious/ogma';
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
import {BADGE_COLOR} from '../../tools/colorPalette';

import {CLEAR_FONT_COLOR, DEFAULT_OGMA_FONT} from './styles';

export const LKE_NODE_GROUPING_EDGE = 'LKE_NODE_GROUPING_EDGE';

export class NodeGroupingTransformation {
  public transformation?: Transformation<LkNodeData, LkEdgeData>;
  public groupRule?: NodeGroupingRule;
  private _nodeGroupingStyleRule?: StyleRule<LkNodeData, LkEdgeData>;
  private _ogma: LKOgma;
  private _nodeGroupingCollapsedStyleRule?: StyleRule<LkNodeData, LkEdgeData>;
  private _collapsedDefaultValue = false;
  private _nodeGroupingAttributes: IVizNodeGroupInfo[] = [];

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
          const nodeGroupId = this._findNodeGroupId(nodes);
          return {
            data: {
              categories: [],
              subCategories: Array.from(categories),
              collapsed: this._getDefaultCollapsedState(nodeGroupId),
              nodeGroupId: nodeGroupId
            },
            attributes: {
              layoutable: this._getDefaultLayoutableValue(nodeGroupId)
            }
          };
        },
        onGroupUpdate: (n, subNodes) => {
          if (subNodes.size === 1) {
            return;
          }
          return {
            layout: 'force',
            params: {...FORCE_LAYOUT_CONFIG}
          };
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
    await this._ogma.transformations.afterNextUpdate();
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

    this._initIntermediateGroupStyle();

    this._nodeGroupingCollapsedStyleRule = this._ogma.styles.addRule({
      nodeAttributes: {
        text: {
          content: (node: Node<LkNodeData> | undefined): string | undefined => {
            return this._getNodeGroupingCaption(node);
          },
          style: 'bold'
        },
        halo: {
          width: 4,
          color: '#e4ebea',
          strokeColor: '#ccc'
        },
        badges: {
          bottomLeft: (node) => {
            const numberOfSubNodes = node
              .getSubNodes()!
              .filter((node) => !node.hasClass('filtered'))?.size;

            return {
              color: BADGE_COLOR,
              minVisibleSize: 20,
              stroke: {
                width: 2,
                color: '#FFFFFF'
              },
              text: {
                font: Tools.isDefined(this._ogma.LKStyles.nodeFont)
                  ? this._ogma.LKStyles.nodeFont
                  : DEFAULT_OGMA_FONT,
                scale: 0.4,
                color: CLEAR_FONT_COLOR,
                content: `x${numberOfSubNodes}`
              }
            };
          },
          topLeft: () => {
            return {
              color: BADGE_COLOR,
              minVisibleSize: 20,
              stroke: {
                width: 2,
                color: '#FFFFFF'
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
        },
        icon: (node: Node | undefined) => {
          const categories = node?.getData('subCategories') as Array<string>;
          if (!Tools.isDefined(node) || categories.length > 1) {
            return;
          }
          // get the icon of the sub-nodes, passing a fake itemData to nodeAttributes.icon
          return this._ogma.LKStyles.nodeAttributes.icon({
            geo: {},
            isVirtual: false,
            properties: {},
            readAt: 0,
            categories: categories
          }).icon;
        }
      },
      nodeSelector: (node) => {
        return node.isVirtual() && OgmaTools.isGroupCollapsed(node) && !node.hasClass('filtered');
      }
    });

    this._setSubSelectedClass();
  }

  public async refreshNodeGroupingStyle(): Promise<void> {
    await this._nodeGroupingStyleRule?.refresh();
    await this._nodeGroupingCollapsedStyleRule?.refresh();
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
   * Set node initial attributes
   * @param nodeGroups object containing the node group id and the layoutable attribute
   */
  public setNodeGroupingAttributes(nodeGroups: IVizNodeGroupInfo[]): void {
    this._nodeGroupingAttributes = nodeGroups;
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
    if (!Tools.isDefined(node) || !Tools.isDefined(this.groupRule)) {
      return undefined;
    }
    if (this.groupRule.groupingType === NodeGroupingType.BY_ADJACENT_EDGE_TYPE) {
      return this._getAdjacentEdgeNodeGroupingCaption(node, this.groupRule);
    }
    return this._getPropertyValueNodeGroupingCaption(node, this.groupRule);
  }

  private _getAdjacentEdgeNodeGroupingCaption(
    node: Node<LkNodeData>,
    rule: NodeGroupingByAdjacentEdgeType
  ): string | undefined {
    const subNodes = node.getSubNodes();
    if (!Tools.isDefined(subNodes) || !Tools.isDefined(subNodes.get(0))) {
      return undefined;
    }
    const centralNode = NodeGroupingTransformation._getGroupCentralNode(subNodes.get(0), rule);
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
    return !this._hasEdgeOfType(node, rule.groupingOptions.edgeType);
  }

  private _hasEdgeOfType(node: Node<LkNodeData>, type: string): boolean {
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
    return rule.groupingOptions.centralNodeIs === 'source'
      ? firstAdjacentEdge.getSource()
      : firstAdjacentEdge.getTarget();
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
   * Initialize the style for the intermediate group state, when transitioning from expanded to collapsed
   */
  private _initIntermediateGroupStyle() {
    this._ogma.styles.addRule({
      nodeAttributes: {
        color: 'rgba(240, 240, 240)'
      },
      nodeSelector: (node) => {
        return node.isVirtual() && OgmaTools.isGroupCollapsed(node);
      },
      // the style will be updated when data object is updated
      nodeDependencies: {self: {data: true}}
    });
  }

  private _getDefaultCollapsedState(nodeGroupId: string): boolean {
    const nodeAttributes = this._nodeGroupingAttributes.find((node) => {
      return node.id === nodeGroupId;
    });
    if (Tools.isDefined(nodeAttributes) && Tools.isDefined(nodeAttributes.attributes.collapsed)) {
      return nodeAttributes.attributes.collapsed;
    }
    return this._collapsedDefaultValue;
  }

  private _getDefaultLayoutableValue(nodeGroupId: string): boolean {
    const nodeAttributes = this._nodeGroupingAttributes.find((node) => {
      return node.id === nodeGroupId;
    });
    if (Tools.isDefined(nodeAttributes) && Tools.isDefined(nodeAttributes.attributes.layoutable)) {
      return nodeAttributes.attributes.layoutable;
    }
    return true;
  }

  /**
   * Set styles for the class "filtered"
   */
  private _setSubSelectedClass(): void {
    this._ogma.styles.createClass({
      name: 'subSelection',
      nodeAttributes: {
        halo: {
          width: 4,
          color: '#e67a8f',
          strokeColor: '#ccc'
        }
      }
    });
  }
}
