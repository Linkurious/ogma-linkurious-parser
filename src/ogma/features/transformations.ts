'use strict';

import {GenericObject, IEdgeGroupStyle, LkEdgeData, LkNodeData} from '@linkurious/rest-client';
import {
  Edge,
  EdgeExtremity,
  EdgeStyle,
  EdgeType,
  PixelSize,
  StyleRule,
  Transformation
} from '@linkurious/ogma';

import {LKOgma} from '../index';

import {LKE_NODE_GROUPING_EDGE} from './nodeGrouping';

const DEFAULT_EDGE_GROUP_STYLE: {
  color: string;
  shape: {
    body?: EdgeType;
    head?: EdgeExtremity;
    tail?: EdgeExtremity;
    style?: EdgeStyle;
  };
  width: PixelSize;
} = {
  color: '#000000',
  shape: {
    style: 'dashed',
    head: 'arrow'
  },
  width: 1.5
};

export class TransformationsViz {
  private _ogma: LKOgma;
  public groupedEdges: GenericObject<boolean>;
  public edgeGroupStyle!: IEdgeGroupStyle;
  public transformation!: Transformation<LkNodeData, LkEdgeData>;
  public edgeGroupingStyleRule!: StyleRule<LkNodeData, LkEdgeData>;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
    this.groupedEdges = {};
  }

  /**
   * create an edge grouping transformation by edge type
   */
  public async initTransformation(): Promise<void> {
    if (this.transformation === undefined) {
      this.transformation = this._ogma.transformations.addEdgeGrouping({
        separateEdgesByDirection: true,
        selector: (edge) => {
          return this.groupedEdges[edge.getData('type')];
        },
        groupIdFunction: (edge) => edge.getData('type'),
        generator: (edges) => {
          return {
            data: {
              properties: {
                originalType: edges.getData('type')[0]
              }
            }
          };
        }
      });
    } else {
      await this.transformation.refresh();
    }
  }

  /**
   * init edge grouping style
   */
  public initEdgeGroupingStyle(): void {
    this.edgeGroupingStyleRule = this._ogma.styles.addRule({
      edgeAttributes: {
        ...DEFAULT_EDGE_GROUP_STYLE,
        ...(this.edgeGroupStyle as any),
        text: {
          content: (edge: Edge<LkEdgeData> | undefined) => {
            // check it the edge is virtual and was not created by node grouping
            if (
              edge !== undefined &&
              edge.getSubEdges() !== null &&
              edge.getData('type') !== LKE_NODE_GROUPING_EDGE
            ) {
              const size = edge.getSubEdges()!.filter((e) => !e.hasClass('filtered')).size;
              return `${edge.getData(['properties', 'originalType'])} - ${size}`;
            }
          },
          style: 'bold'
        }
      },
      edgeSelector: (edge) =>
        edge.isVirtual() &&
        edge.getSubEdges() &&
        edge.getSubEdges()!.filter((e) => !e.hasClass('filtered')).size > 0,
      edgeDependencies: {self: {data: true}}
    });
  }

  public refreshEdgeGroupingStyle(): void {
    if (this.edgeGroupingStyleRule !== undefined) {
      this.edgeGroupingStyleRule.refresh();
    }
  }
}
