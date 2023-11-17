'use strict';

import {IEdgeGroupStyle, LkEdgeData, LkNodeData, LkProperty} from '@linkurious/rest-client';
import {
  Edge,
  EdgeExtremity,
  EdgeStyle,
  EdgeType,
  PixelSize,
  StyleRule,
  Transformation,
  EdgeList
} from '@linkurious/ogma';

import {LKOgma} from '../index';
import {Tools} from '../../tools/tools';

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

export interface GroupedEdgesProperties {
  [propertyKey: string]: {
    type: string;
    values: LkProperty[];
  };
}

export interface GroupedEdgesPropertiesTypes {
  [propertyKey: string]: {
    type: string;
  };
}
export interface GroupedEdges {
  [type: string]: {
    transformation: boolean;
    properties?: GroupedEdgesPropertiesTypes;
  };
}
export class TransformationsViz {
  private _ogma: LKOgma;
  public groupedEdges: GroupedEdges;
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
          return this.groupedEdges[edge.getData('type')].transformation;
        },
        groupIdFunction: (edge) => edge.getData('type'),
        generator: (edges) => {
          return {
            data: {
              properties: {
                originalType: edges.getData('type')[0],
                ...this.getGroupedEdgesProperties(edges)
              }
            }
          };
        }
      });
    } else {
      await this.transformation.refresh();
    }
  }

  private getGroupedEdgesProperties(
    edges: EdgeList<LkEdgeData, LkNodeData>
  ): Record<string, LkProperty> {
    const propsMap: GroupedEdgesProperties = {} as GroupedEdgesProperties;
    if (this.groupedEdges[edges.getData('type')[0]].properties) {
      edges.getData('properties').forEach((properties) => {
        Object.keys(properties).forEach((key) => {
          const property = this.groupedEdges[edges.getData('type')[0]].properties![key];
          // check if property does not exist  in propsMap
          if (!propsMap[key]) {
            propsMap[key] = {
              values: [properties[key]],
              type: property.type
            };
          } else {
            propsMap[key].values.push(properties[key]);
          }
        });
      });
    }
    const properties: Record<string, LkProperty> = {};
    if (propsMap) {
      Object.keys(propsMap).forEach((key) => {
        if (propsMap[key].type === 'number') {
          properties[`${key}_Sum`] = this.generateSum(propsMap[key].values);
          // Other operators for numbers
        }
      });
    }
    return properties;
  }

  // to be moved to helpers during implementation
  public generateSum(values: LkProperty[]): number {
    let result = 0;
    values.forEach((value) => {
      if (Tools.isNumber(value)) {
        result += Number(value);
      }
    });
    return result;
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

  public refreshEdgeGroupingStyle(): void {
    if (this.edgeGroupingStyleRule !== undefined) {
      this.edgeGroupingStyleRule.refresh();
    }
  }
}
