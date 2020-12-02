/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */

'use strict';
import {Color} from 'ogma';
import {LkEdgeData, OgmaEdgeShape} from '@linkurious/rest-client';

import {StyleRule} from './styleRule';
import {BASE_GREY, ItemAttributes} from './itemAttributes';

export class EdgeAttributes extends ItemAttributes {
  constructor(rulesMap: {
    color?: Array<StyleRule>;
    shape?: Array<StyleRule>;
    width?: Array<StyleRule>;
  }) {
    super(rulesMap);
  }

  /**
   * Run the callback if an item match with a style in the array of rules
   */
  private matchStyle(
    styleRules: Array<StyleRule>,
    data: LkEdgeData,
    callback: (style: StyleRule) => unknown
  ): void {
    if (data === undefined) {
      return;
    }
    for (let i = 0; i < styleRules.length; ++i) {
      if (styleRules[i].canApplyTo(data)) {
        callback(styleRules[i]);
        break;
      }
    }
  }

  /**
   * Generate color for a given node (call only if _rulesMap.color exists)
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
          const propValue = Tools.getInUnsafe(data, rule.style.color.input);
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
    let result = undefined;
    if (this._rulesMap.shape !== undefined) {
      this.matchStyle(this._rulesMap.shape, data, (styleRule) => {
        result = styleRule.style.shape;
      });
    }
    return result;
  }

  /**
   * Generate size for a given node
   */
  public width(data: LkEdgeData): string | undefined {
    let result = undefined;
    if (this._rulesMap.width !== undefined) {
      this.matchStyle(this._rulesMap.width, data, (styleRule) => {
        result = styleRule.style.width;
      });
    }
    return result;
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
