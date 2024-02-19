import {Transformation, Node, NodeList} from '@linkurious/ogma';
import {
  ConflictValue,
  LkEdgeData,
  LkNodeData,
  MissingValue,
  NodeGroupingRule
} from '@linkurious/rest-client';

import {FORCE_LAYOUT_CONFIG, LKOgma} from '../index';
import {Tools} from '../../tools/tools';

export const LKE_NODE_GROUPING_EDGE = 'LKE_NODE_GROUPING_EDGE';

export class NodeGroupingTransformation {
  public transformation?: Transformation<LkNodeData, LkEdgeData>;
  public groupRule?: NodeGroupingRule;
  private _ogma: LKOgma;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
  }

  /**
   * Set the grouping rule
   * @param rule of grouping
   */
  public setGroupingRule(rule: NodeGroupingRule | undefined): void {
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
        groupIdFunction: (node) => {
          if (this._isRuleNotApplicableToNode(node)) {
            return undefined;
          } else {
            const propertyValue = node.getData([
              'properties',
              this.groupRule?.groupingOptions.propertyKey ?? ''
            ]);
            // if the property value is of type conflict or invalid value we use the original value
            const originalValue =
              typeof propertyValue === 'object'
                ? (propertyValue as ConflictValue).original
                : propertyValue;
            // groupRule is defined if not we returned undefined
            // node with same value will be part of the same group
            return `${this.groupRule?.groupingOptions.itemType}-${originalValue}`
              .toLowerCase()
              .trim();
          }
        },
        nodeGenerator: (nodes) => {
          return {
            data: {
              // groupRule is defined as a virtual node only exist if the rule is defined
              categories: [this.groupRule?.groupingOptions.itemType],
              properties: {
                size: nodes.size
              }
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
        duration: 300,
        padding: 10
      });
      // TODO remove setTimeout when LKE-10453 is fixed
      setTimeout(() => {
        this.transformation!.refresh();
      }, 200);
      this._listenToTransformationEvents();
    } else {
      await this.refreshTransformation();
    }
  }

  /**
   * refresh the transformation
   * Called when there is a change in the rule
   */
  public async refreshTransformation(): Promise<void> {
    if (this.transformation !== undefined) {
      await this.transformation.refresh();
    } else {
      await this.initTransformation();
    }
  }

  /**
   * init node grouping style
   */
  public initNodeGroupingStyle(): void {
    this._ogma.styles.addRule({
      nodeAttributes: {
        // Any default style will go here
        text: {
          content: (node: Node<LkNodeData> | undefined): string | undefined => {
            return this._getNodeGroupingCaption(node);
          },
          style: 'bold'
        },
        layer: -1,
        opacity: 0.32,
        innerStroke: {
          color: 'white',
          width: 4
        }
      },
      nodeSelector: (node) => {
        return node.isVirtual();
      },
      // the style will be updated when data object is updated
      nodeDependencies: {self: {data: true}}
    });
  }

  /**
   * run layout on all subnodes of virtual nodes
   */
  public async runLayoutOnAllSubNodes(): Promise<void> {
    const rawNodesList = this._getAllTransformationRawNodes();
    const promisesList: Promise<void>[] = [];
    for (let i = 0; i < rawNodesList.length; i++) {
      // rawNodesList[i] is not null because each group has at least one node
      const subNodes = rawNodesList[i]!;
      promisesList.push(this._runSubNodesLayout(subNodes));
    }
    await Promise.all(promisesList);
    await this._runForceLayout(this._getVirtualNodesOfTransformation());
  }

  /**
   * Run the layout on the subnodes of the virtual node
   * @param subNodes nodes part of a virtual node
   */
  private async _runSubNodesLayout(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    if (subNodes.size === 0) {
      return;
    }

    const noEdges = subNodes.getAdjacentEdges({bothExtremities: true}).size === 0;
    if (noEdges) {
      await this._runCirclePack(subNodes);
    } else {
      await this._runForceLayout(subNodes);
    }
  }

  /**
   * Return the caption of a virtual node
   * @param node reference to the virtual node
   */
  private _getNodeGroupingCaption(node: Node<LkNodeData> | undefined): string | undefined {
    if (node !== undefined && node.isVirtual()) {
      const size = node.getSubNodes()!.filter((e) => !e.hasClass('filtered')).size;
      return `${this.groupRule?.name} - ${size}`;
    }
  }

  /**
   * Listen to transformationEnabled and transformationRefresh events to run the layout on the subnodes
   */
  private _listenToTransformationEvents(): void {
    this._ogma.events.on(
      ['transformationEnabled', 'transformationRefresh'],
      async (transformations) => {
        console.log('transformationEnabled or transformationRefresh');
        if (transformations.target.getId() === this.transformation?.getId()) {
          this._unpinNodes(this._getAllTransformationRawNodes());
          await this.runLayoutOnAllSubNodes();
        }
      }
    );
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

  private async _runForceLayout(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    await this._ogma.layouts.force({
      nodes: subNodes,
      ...FORCE_LAYOUT_CONFIG
    });
  }

  private _isRuleNotApplicableToNode(node: Node<LkNodeData>): boolean {
    const propertyValue = node.getData([
      'properties',
      this.groupRule?.groupingOptions.propertyKey ?? ''
    ]);
    return (
      // if the group rule is not defined
      this.groupRule === undefined ||
      // if rule is applied to a different category
      !node.getData('categories').includes(this.groupRule.groupingOptions.itemType) ||
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
    const virtualNodes = this._getVirtualNodesOfTransformation();
    return virtualNodes.getSubNodes();
  }

  /**
   * Get the virtual nodes of the transformation
   * @private
   */
  private _getVirtualNodesOfTransformation(): NodeList<LkNodeData, LkEdgeData> {
    // @ts-ignore getContext exists on the transformation but hidden by the types
    return this.transformation.getContext().virtualNodes;
  }
}
