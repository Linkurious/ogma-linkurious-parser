'use strict';

import { GenericObject, IEdgeGroupStyle, LkEdgeData, LkNodeData, LkProperty } from "@linkurious/rest-client";
import {
  Edge,
  EdgeExtremity,
  EdgeList,
  EdgeStyle,
  EdgeType,
  PixelSize,
  StyleRule,
  Transformation
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
                originalType: edges.getData('type')[0],
                ...this.getGroupedEdgeProperties(edges)
              }
            }
          };
        }
      });
    } else {
      await this.transformation.refresh();
    }
  }

  private getGroupedEdgeProperties(
    edges: EdgeList<LkEdgeData, LkNodeData>
  ): Record<string, unknown> {
    const propertiesMap = new Map<
      string,
      {
        values: Array<LkProperty>;
        aggregatedNumber?: {min: number; max: number};
        aggregatedString?: {countDistinct: number};
      }
    >();
    edges.getData('properties').forEach((properties) => {
      Object.keys(properties).forEach((key) => {
        const isNumber = Tools.isNumber(properties[key]);
        // check if property does not exist  in propertiesMap
        if (!propertiesMap.has(key)) {
          if (isNumber) {
            propertiesMap.set(key, {
              values: [properties[key]],
              aggregatedNumber: {max: properties[key] as number, min: properties[key] as number}
            });
          } else {
            propertiesMap.set(key, {
              values: [properties[key]],
              aggregatedString: {countDistinct: 1}
            });
          }
        } else {
          const currentProperty = propertiesMap.get(key)!;
          if (isNumber) {
            const aggregatedNumber: {min: number; max: number} = currentProperty?.aggregatedNumber!;
            aggregatedNumber.max = Math.max(aggregatedNumber.max, properties[key] as number);
            aggregatedNumber.min = Math.min(aggregatedNumber.min, properties[key] as number);
            currentProperty.values.push(properties[key]);
          } else {
            const aggregatedString = currentProperty.aggregatedString!;
            if (!currentProperty.values.includes(properties[key])) {
              aggregatedString.countDistinct++;
            }
            currentProperty.values.push(properties[key]);
          }
        }
      });
    });
    const properties: Record<string, unknown> = {};
    propertiesMap.forEach(function (value, key) {
      properties['propertyName'] = key;
      if (value.aggregatedNumber !== undefined) {
        properties[`${key}_Max`] = value.aggregatedNumber.max;
        properties[`${key}_Min`] = value.aggregatedNumber.min;
      }
      if (value.aggregatedString !== undefined) {
        properties[`${key}_CountDistinct`] = value.aggregatedString.countDistinct;
      }
      properties[`${key}_Values`] = value.values;
    });
    return properties;
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
