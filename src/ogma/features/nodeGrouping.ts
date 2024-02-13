import {Transformation, Node, NodeList} from '@linkurious/ogma';
import {ConflictValue, LkEdgeData, LkNodeData, MissingValue} from '@linkurious/rest-client';

import {FORCE_LAYOUT_CONFIG, LKOgma} from '../index';
import {Tools} from '../../tools/tools';

export const LKE_NODE_GROUPING_EDGE = 'LKE_NODE_GROUPING_EDGE';

export class NodeGroupingTransformation {
  public transformation?: Transformation<LkNodeData, LkEdgeData>;
  public groupRule?: {ruleName: string; type: string; property: string};
  private _ogma: LKOgma;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
  }

  /**
   * Set the grouping rule
   * @param params
   *  ruleName The name of node grouping rule
   *  type the type of the node
   *  property the property name that will be used to group the nodes
   */
  public setGroupingRule(params?: {ruleName: string; type: string; property: string}): void {
    this.groupRule = params;
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
            this._unpinNode(node);
            const propertyValue = node.getData(['properties', this.groupRule?.property ?? '']);
            // if the property value is of type conflict or invalid value we use the original value
            const originalValue =
              typeof propertyValue === 'object'
                ? (propertyValue as ConflictValue).original
                : propertyValue;
            // groupRule is defined if not we returned undefined
            // node with same value will be part of the same group
            return `${this.groupRule!.type}-${originalValue}`.toLowerCase().trim();
          }
        },
        nodeGenerator: (nodes) => {
          return {
            data: {
              // groupRule is defined as a virtual node only exist if the rule is defined
              categories: [this.groupRule!.type],
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
        opacity: 0.32
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
    // @ts-ignore getContext exists on the transformation but hidden by the types
    const virtualNodes = this.transformation.getContext().virtualNodes;
    const rawNodesList = virtualNodes.getSubNodes();
    const promisesList: Promise<void>[] = [];
    for (let i = 0; i < rawNodesList.length; i++) {
      const subNodes = rawNodesList[i];
      if (subNodes !== undefined) {
        promisesList.push(this._runSubNodesLayout(subNodes));
      }
    }
    await Promise.all(promisesList);
    await this._runForceLayout(virtualNodes);
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
      return `${this.groupRule?.ruleName} - ${size}`;
    }
  }

  /**
   * Listen to transformationEnabled and transformationRefresh events to run the layout on the subnodes
   */
  private _listenToTransformationEvents(): void {
    this._ogma.events.on(
      ['transformationEnabled', 'transformationRefresh'],
      async (transformations) => {
        if (transformations.target.getId() === this.transformation?.getId()) {
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
    const propertyValue = node.getData(['properties', this.groupRule?.property ?? '']);
    return (
      // if the group rule is not defined
      this.groupRule === undefined ||
      // if rule is applied to a different category
      !node.getData('categories').includes(this.groupRule.type) ||
      // if the property value is not defined
      !Tools.isDefined(propertyValue) ||
      // if the property value is missing
      (typeof propertyValue === 'object' && (propertyValue as MissingValue).status === 'missing')
    );
  }

  private _unpinNode(node: Node<LkNodeData, LkEdgeData>): void {
    void node.setAttribute('layoutable', true);
  }
}
