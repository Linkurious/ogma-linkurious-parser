/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */

'use strict';

import sha1 from 'sha1';
import {Color} from 'ogma';

import {Tools} from '..';

import {StyleRule} from './styleRule';
import {EdgeWidthExtrema} from './edgeAttributes';
import {NodeSizeExtrema} from './nodeAttributes';

export const BASE_GREY = '#7f7f7f';
export const PALETTE = [
  '#9467bd',
  '#e377c2',
  '#1f77b4',
  '#17becf',
  '#2ca02c',
  '#bcbd22',
  '#d62728',
  '#ff7f0e',
  '#8c564b',
  '#c5b0d5',
  '#f7b6d2',
  '#aec7e8',
  '#9edae5',
  '#98df8a',
  '#dbdb8d',
  '#ff9896',
  '#ffbb78',
  '#c49c94'
];

export class ItemAttributes {
  protected colorsCache: Map<string, Color | Array<Color>> = new Map();
  protected _rulesMap: {
    color?: Array<StyleRule>;
    icon?: Array<StyleRule>;
    image?: Array<StyleRule>;
    shape?: Array<StyleRule>;
    size?: Array<StyleRule>;
    width?: Array<StyleRule>;
  } = {};

  constructor(rulesMap: {
    color?: Array<StyleRule>;
    icon?: Array<StyleRule>;
    image?: Array<StyleRule>;
    shape?: Array<StyleRule>;
    size?: Array<StyleRule>;
    width?: Array<StyleRule>;
  }) {
    this.refresh(rulesMap);
  }

  /**
   * Refresh the rules
   */
  public refresh(rulesMap: {
    color?: Array<StyleRule>;
    icon?: Array<StyleRule>;
    image?: Array<StyleRule>;
    shape?: Array<StyleRule>;
    size?: Array<StyleRule>;
    width?: Array<StyleRule>;
  }): void {
    if (rulesMap.color !== undefined) {
      this.colorsCache = new Map();
    }
    this._rulesMap = {
      color: rulesMap.color ? [...rulesMap.color].reverse() : this._rulesMap.color,
      icon: rulesMap.icon ? [...rulesMap.icon].reverse() : this._rulesMap.icon,
      image: rulesMap.image ? [...rulesMap.image].reverse() : this._rulesMap.image,
      shape: rulesMap.shape ? [...rulesMap.shape].reverse() : this._rulesMap.shape,
      size: rulesMap.size ? [...rulesMap.size].reverse() : this._rulesMap.size,
      width: rulesMap.width ? [...rulesMap.width].reverse() : this._rulesMap.width
    };
  }

  /**
   * Return the color for a node when style color is auto
   */
  public static autoColor(value: string, ignoreCase?: boolean): string {
    if (!Tools.isDefined(value)) {
      return BASE_GREY;
    }
    return PALETTE[ItemAttributes.sha1Modulo(value, PALETTE.length, ignoreCase)];
  }

  /**
   * Return a number from 0 to number of occurrence in a palette based on a property
   */
  private static sha1Modulo(
    input: string,
    modulo: number,
    ignoreCase: boolean | undefined
  ): number {
    if (ignoreCase) {
      input = input.toLowerCase();
    }
    return +('0x' + sha1(input).substr(-4)) % modulo;
  }

  /**
   * Get color of a type
   */
  public static getTypeColor(rule: StyleRule, type: string): string | null {
    if (typeof rule.style.color === 'object' && rule.style.color.input[0] !== 'properties') {
      return ItemAttributes.autoColor(type, rule.style.color.ignoreCase);
    }
    if (!Tools.isDefined(rule.input) && typeof rule.style.color !== 'object') {
      return rule.style.color;
    }
    return null;
  }

  /**
   * return the corresponding size to the value
   * @param value
   * @param lower
   * @param higher
   * @param extrema
   */
  public static getAutomaticRangeStyle(
    value: number,
    {max, min}: {max: number; min: number},
    lower: EdgeWidthExtrema | NodeSizeExtrema,
    higher: EdgeWidthExtrema | NodeSizeExtrema
  ): string {
    // apply default style when min equal max
    if (max === min) {
      return '100%';
    }

    // calculate the linear function f(x) = ax + b
    const a = (higher - lower) / (max - min);
    const b = (lower * max - higher * min) / (max - min);
    const size = Math.floor(value * a + b);

    return `${size}%`;
  }
}
