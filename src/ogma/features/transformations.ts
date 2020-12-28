'use strict';

import {GenericObject, IEdgeGroupStyle, LkEdgeData, LkNodeData} from '@linkurious/rest-client';
import {Edge, EdgeExtremity, EdgeStyle, EdgeType, PixelSize, StyleRule, Transformation} from 'ogma';

import {LKOgma} from '../index';

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
  private _groupedEdges!: GenericObject<boolean>;
  private _edgeGroupStyle!: IEdgeGroupStyle;
  private _transformation!: Transformation<LkNodeData, LkEdgeData>;
  private _edgeGroupingStyleRule!: StyleRule<LkNodeData, LkEdgeData>;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
  }

  get groupedEdges() {
    return this._groupedEdges;
  }

  set groupedEdges(groupedEdges: GenericObject<boolean>) {
    this._groupedEdges = groupedEdges;
  }

  get transformation(): Transformation<LkNodeData, LkEdgeData> {
    return this._transformation;
  }

  set transformation(value: Transformation<LkNodeData, LkEdgeData>) {
    this._transformation = value;
  }

  get edgeGroupStyle(): IEdgeGroupStyle {
    return this._edgeGroupStyle;
  }

  set edgeGroupStyle(value: IEdgeGroupStyle) {
    this._edgeGroupStyle = value;
  }

  get edgeGroupingStyleRule(): StyleRule<LkNodeData, LkEdgeData> {
    return this._edgeGroupingStyleRule;
  }

  set edgeGroupingStyleRule(value: StyleRule<LkNodeData, LkEdgeData>) {
    this._edgeGroupingStyleRule = value;
  }

  /**
   * create an edge grouping transformation by edge type and setting the appropriate data
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
      this.transformation.refresh();
    }
  }

  /**
   * init edge grouping style
   */
  public async initEdgeGroupingStyle() {
    this.edgeGroupingStyleRule = this._ogma.styles.addRule({
      edgeAttributes: {
        ...DEFAULT_EDGE_GROUP_STYLE,
        ...(this.edgeGroupStyle as any),
        text: {
          content: (edge: Edge<LkEdgeData> | undefined) => {
            if (edge !== undefined && edge.getSubEdges() !== null) {
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

  public refreshEdgeGroupingCaptions(): void {
    if (this.edgeGroupingStyleRule !== undefined) {
      this.edgeGroupingStyleRule.refresh();
    }
  }
}
