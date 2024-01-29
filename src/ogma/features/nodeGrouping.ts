import {StyleRule, Transformation, Node, NodeList} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData} from '@linkurious/rest-client';

import {LKOgma} from '../index';
import {Tools} from '../../tools/tools';

export const LKE_NODE_GROUPING_EDGE = 'LKE_NODE_GROUPING_EDGE';

export class NodeGroupingTransformation {
  public transformation?: Transformation<LkNodeData, LkEdgeData>;
  public nodeGroupingStyleRule!: StyleRule<LkNodeData, LkEdgeData>;
  private _ogma: LKOgma;
  // TODO set it to private after
  public groupRule: {ruleName: string; type: string; property: string} | undefined;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
  }

  /**
   * Set the grouping rule
   * @param ruleName The nae of node grouping rule
   * @param type the type of the node
   * @param property the property name that will be used to group the nodes
   */
  public setGroupingRule(ruleName: string, type: string, property: string): void {
    this.groupRule = {ruleName: ruleName, type: type, property: property};
  }

  /**
   * create a node grouping transformation
   * It uses groupRule to define the rule
   */
  public async initTransformation(): Promise<void> {
    console.log('init node grouping transformation');
    if (this.transformation === undefined) {
      this.transformation = this._ogma.transformations.addNodeGrouping({
        groupIdFunction: (node) => {
          if (
            this.groupRule === undefined ||
            !Tools.isDefined(node.getData(['properties', this.groupRule.property]))
          ) {
            return undefined;
          } else {
            return `${this.groupRule.type}-${node.getData(['properties', this.groupRule.property])}`
              .toLowerCase()
              .trim();
          }
        },
        nodeGenerator: (nodes) => {
          return {
            data: {
              categories: [this.groupRule?.type],
              properties: {
                size: nodes.size
              }
            }
          };
        },
        edgeGenerator: () => {
          return {
            data: {
              type: 'LKE_NODE_GROUPING_EDGE'
            }
          };
        },
        showContents: true,
        duration: 300,
        padding: 10
      });
      // await this.runLayoutOnAllSubeNodes();
    } else {
      await this.refreshTransformation();
    }
  }

  /**
   * refresh the transformation
   * Called when there is a change in the rule
   */
  public async refreshTransformation(): Promise<void> {
    await this.transformation?.refresh();
    await this.runLayoutOnAllSubeNodes();
  }

  /**
   * init node grouping style
   */
  public initNodeGroupingStyle(): void {
    // TODO check if you can use add node rule
    this.nodeGroupingStyleRule = this._ogma.styles.addRule({
      nodeAttributes: {
        // Any default style will go here
        text: {
          content: (node: Node<LkNodeData> | undefined): string | undefined => {
            return this.getNodeGroupingCaption(node);
          },
          style: 'bold'
        },
        opacity: 0.32
      },
      nodeSelector: (node) => {
        return node.isVirtual();
      },
      nodeDependencies: {self: {data: true}}
    });
  }

  public refreshNodeGroupingStyle(): void {
    this.nodeGroupingStyleRule?.refresh();
  }

  /**
   * Run the layout on the subnodes of the virtual node
   * @param subNodes nodes part of a virtual node
   */
  private async runSubNodesLayout(subNodes: NodeList<LkNodeData, LkEdgeData>): Promise<void> {
    if (subNodes.size === 0) {
      return;
    }
    // TODO run Circle-packing layout new when there are no edges
    // groupNodes.getAdjacentEdges({ bothExtremities: true }).size === 0
    /* const noEdges = subNodes.getAdjacentEdges({bothExtremities: true}).size === 0;
    console.log('runSubNodesLayout', noEdges, subNodes.toJSON());
    await this._ogma.algorithms.circlePack({
      nodes: subNodes,
      margin: 10,
      sort: 'asc'
    });*/

    await this._ogma.layouts.force({
      steps: 40,
      alignSiblings: true,
      charge: 5,
      gravity: 0.05,
      theta: 0.34,
      nodes: subNodes,
      duration: 0
    });
  }

  /**
   * Return the caption of a virtual node
   * @param node reference to the virtual node
   */
  private getNodeGroupingCaption(node: Node<LkNodeData> | undefined): string | undefined {
    if (node !== undefined && node.isVirtual()) {
      const size = node.getSubNodes()!.filter((e) => !e.hasClass('filtered')).size;
      return `${this.groupRule?.ruleName} - ${size}`;
    }
  }

  public async runLayoutOnAllSubeNodes(): Promise<void> {
    // @ts-ignore getContext exists on the transformation but not in the type
    const virtualNodes = this.transformation.getContext().virtualNodes;
    const rawNodesList = virtualNodes.getSubNodes();
    for (let i = 0; i < rawNodesList.length; i++) {
      const subNodes = rawNodesList[i];
      if (subNodes !== undefined) {
        await this.runSubNodesLayout(subNodes);
      }
    }
    await this.runSubNodesLayout(virtualNodes);
    console.log('runLayoutOnAllSubeNodes');
  }
}
