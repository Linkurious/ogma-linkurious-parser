'use strict';
import {Color} from '@linkurious/ogma';
import {
  AutoRangeScale,
  IEdgeStyle,
  LkEdgeData,
  OgmaEdgeShape,
  IStyleAutoRange
} from '@linkurious/rest-client';

import {Tools} from '../tools/tools';

import {StyleRule} from './styleRule';
import {BASE_GREY, ItemAttributes} from './itemAttributes';

export enum EdgeWidthExtrema {
  MIN = 50,
  MAX = 200
}

export class EdgeAttributes extends ItemAttributes<IEdgeStyle> {
  constructor(rulesMap: {
    color?: Array<StyleRule<IEdgeStyle>>;
    shape?: Array<StyleRule<IEdgeStyle>>;
    width?: Array<StyleRule<IEdgeStyle>>;
  }) {
    super(rulesMap);
  }

  /**
   * Return rule that can be applied to the data
   */
  private static matchStyle(
    styleRules: Array<StyleRule<IEdgeStyle>>,
    data: LkEdgeData
  ): StyleRule<IEdgeStyle> | undefined {
    if (data === undefined) {
      return;
    }
    for (let i = 0; i < styleRules.length; ++i) {
      if (styleRules[i].canApplyTo(data)) {
        return styleRules[i];
      }
    }
  }

  /**
   * Generate color for a given edge (call only if _rulesMap.color exists)
   */
  public color(data: LkEdgeData): Color {
    if (!Tools.isDefined(data)) {
      return BASE_GREY;
    }
    let color;
    for (let j = 0; j < this._rulesMap.color!.length; ++j) {
      const rule = this._rulesMap.color![j];
      if (rule.canApplyTo(data)) {
        if (typeof rule.style.color === 'string') {
          color = rule.style.color;
        } else if (typeof rule.style.color === 'object') {
          const propValue = Tools.getIn(data, rule.style.color.input);
          color = ItemAttributes.autoColor(`${propValue}`, rule.style.color.ignoreCase);
        }
        break;
      }
    }
    return Tools.isDefined(color) ? color : BASE_GREY;
  }

  /**
   * Generate shape for a given node
   */
  public shape(data: LkEdgeData): OgmaEdgeShape | undefined {
    if (this._rulesMap.shape !== undefined) {
      return EdgeAttributes.matchStyle(this._rulesMap.shape, data)?.style.shape;
    }
  }

  /**
   * Generate size for a given node
   */
  public width(data: LkEdgeData): string | number | undefined {
    if (this._rulesMap.width !== undefined) {
      const styleRule = EdgeAttributes.matchStyle(this._rulesMap.width, data);
      if (styleRule !== undefined) {
        const widthStyle = styleRule?.style.width;
        if (widthStyle !== undefined && this.isAutoRange(widthStyle)) {
          if (
            widthStyle.input !== undefined &&
            widthStyle.max !== undefined &&
            widthStyle.min !== undefined
          ) {
            const propertyName: string = widthStyle.input[1];
            const propertyValue = Tools.parseNumber(data.properties[propertyName]);
            const isLog = widthStyle.scale && widthStyle.scale === AutoRangeScale.LOGARITHMIC;
            return EdgeAttributes.getAutomaticRangeWidth(propertyValue, styleRule, isLog);
          }
        } else {
          return widthStyle;
        }
      }
    }
  }

  /**
   * return the corresponding width to the value
   * @param value
   * @param rule
   * @param isLog
   */
  public static getAutomaticRangeWidth(
    value: number,
    rule: StyleRule<IEdgeStyle>,
    isLog = false
  ): string | undefined {
    return isLog
      ? this.getAutomaticRangeStyleLog(
          value,
          rule.style.width as IStyleAutoRange,
          EdgeWidthExtrema.MIN,
          EdgeWidthExtrema.MAX
        )
      : this.getAutomaticRangeStyleLinear(
          value,
          rule.style.width as IStyleAutoRange,
          EdgeWidthExtrema.MIN,
          EdgeWidthExtrema.MAX
        );
  }

  /**
   * Return an object containing all node attributes needed by Ogma to style a node
   */
  public all(
    data: LkEdgeData
  ): {
    color: Color;
    shape: OgmaEdgeShape | undefined;
    width: string | undefined | number;
  } {
    if (!Tools.isDefined(data)) {
      return {
        color: BASE_GREY,
        shape: OgmaEdgeShape.ARROW,
        width: '100%'
      };
    }
    return {
      color: this.color(data),
      shape: this.shape(data),
      width: this.width(data)
    };
  }
}
