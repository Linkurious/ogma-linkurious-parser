'use strict';
import {Color} from '@linkurious/ogma';
import {LkEdgeData, OgmaEdgeShape} from '@linkurious/rest-client';

import {Tools} from '../tools/tools';

import {StyleRule} from './styleRule';
import {BASE_GREY, ItemAttributes} from './itemAttributes';

export enum EdgeWidthExtrema {
  MIN = 50,
  MAX = 200
}

export class EdgeAttributes extends ItemAttributes {
  constructor(rulesMap: {
    color?: Array<StyleRule>;
    shape?: Array<StyleRule>;
    width?: Array<StyleRule>;
  }) {
    super(rulesMap);
  }

  /**
   * Return rule that can be applied to the data
   */
  private static matchStyle(styleRules: Array<StyleRule>, data: LkEdgeData): StyleRule | undefined {
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
          color = ItemAttributes.autoColor(`${propValue}`, rule.style.ignoreCase);
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
  public width(data: LkEdgeData): string | undefined {
    if (this._rulesMap.width !== undefined) {
      const styleRule = EdgeAttributes.matchStyle(this._rulesMap.width, data);
      const widthStyle = styleRule?.style.width;
      if (Tools.isDefined(styleRule) && widthStyle.type === 'autoRange') {
        if (
          widthStyle.input !== undefined &&
          widthStyle.max !== undefined &&
          widthStyle.min !== undefined
        ) {
          const propertyName: string = widthStyle.input[1];
          const propertyValue = Tools.parseNumber(data.properties[propertyName]);
          //to update with the correct enum type
          return widthStyle.scale && widthStyle.scale === 'logarithmic'
            ? EdgeAttributes.getAutomaticRangeWidth(propertyValue, styleRule, true)
            : EdgeAttributes.getAutomaticRangeWidth(propertyValue, styleRule);
        }
      } else {
        return widthStyle;
      }
    }
  }

  /**
   * return the corresponding width to the value
   * @param value
   * @param rule
   * @param isLog
   */
  public static getAutomaticRangeWidth(value: number, rule: StyleRule, isLog = false): string {
    return isLog
      ? this.getAutomaticRangeStyleLog(
          value,
          rule.style.size,
          EdgeWidthExtrema.MIN,
          EdgeWidthExtrema.MAX
        )
      : this.getAutomaticRangeStyleLinear(
          value,
          rule.style.size,
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
    width: string | undefined;
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
