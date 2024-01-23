import {StyleRule, Transformation, Node} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData} from '@linkurious/rest-client';

import {LKOgma} from '../index';
import {Tools} from '../../tools/tools';

export class NodeGroupingTransformation {
  private _ogma: LKOgma;
  public groupRule?: {type: string; property: string};
  public transformation?: Transformation<LkNodeData, LkEdgeData>;
  public nodeGroupingStyleRule!: StyleRule<LkNodeData, LkEdgeData>;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
  }

  /**
   * Set the grouping rule
   */
  public setGroupingRule(type: string, property: string): void {
    console.log('setGroupingRule');
    this.groupRule = {type: type, property: property};
  }

  /**
   * create an edge grouping transformation by edge type
   */
  public async initTransformation(): Promise<void> {
    console.log('initTransformation');
    if (this.transformation === undefined) {
      this.transformation = this._ogma.transformations.addNodeGrouping({
        groupIdFunction: (node) => {
          if (
            this.groupRule === undefined ||
            !Tools.isDefined(node.getData(['properties', this.groupRule.property]))
          ) {
            return undefined;
          } else {
            console.log(`${node.getData(['properties', this.groupRule.property])}`.trim());
            return `${node.getData('categories')[0]}-${node.getData([
              'properties',
              this.groupRule.property
            ])}`.trim();
          }
        },
        nodeGenerator: (nodes) => {
          return {
            data: {
              categories: 'test',
              properties: {
                originalType: nodes.get(0).getData('categories')[0]
              }
            },
            attributes: {
              text: 'a group'
            }
          };
        },
        showContents: true,
        /*onCreated: (metaNode, visible, subNodes, subEdges) => {
          return this._ogma.layouts.force({
            nodes: subNodes,
            duration: 0
          }) as unknown as Promise<void>;
        },*/
        duration: 300,
        padding: 10
      });
    } else {
      await this.refreshTransformation();
    }
  }

  public async refreshTransformation(): Promise<void> {
    console.log('refreshTransformation', this.groupRule, this.transformation?.getId());
    await this.transformation?.refresh();
  }

  /**
   * init edge grouping style
   */
  public initNodeGroupingStyle(): void {
    // TODO check if you can use add node rule
    console.log('initNodeGroupingStyle');
    this.nodeGroupingStyleRule = this._ogma.styles.addRule({
      nodeAttributes: {
        // Any default style will go here
        text: {
          content: (node: Node<LkNodeData> | undefined) => {
            if (node !== undefined && node.isVirtual()) {
              const size = node.getSubNodes()!.filter((e) => !e.hasClass('filtered')).size;
              return `${node.getData(['properties', 'originalType'])} - ${size}`;
            }
          },
          style: 'bold'
        },
        opacity: () => 0.32,
        color: '#f63636'
      },
      nodeSelector: (node) => {
        console.log(
          node.isVirtual() &&
            node.getSubNodes() &&
            node.getSubNodes()!.filter((e) => !e.hasClass('filtered')).size > 0
        );
        return (
          node.isVirtual() &&
          node.getSubNodes() &&
          node.getSubNodes()!.filter((e) => !e.hasClass('filtered')).size > 0
        );
      },
      nodeDependencies: {self: {data: true}}
    });
  }

  public refreshNodeGroupingStyle(): void {
    console.log('refreshNodeGroupingStyle');
    this.nodeGroupingStyleRule?.refresh();
  }
}
