'use strict';

import sha1 from 'sha1';
import {Color} from '@linkurious/ogma';
import {IEdgeStyle, INodeStyle, IStyleAutoRange} from '@linkurious/rest-client';

import {Tools} from '../tools/tools';

import {StyleRule} from './styleRule';
import {NodeSizeExtrema} from './nodeAttributes';
import {EdgeWidthExtrema} from './edgeAttributes';

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

export class ItemAttributes<T extends INodeStyle | IEdgeStyle> {
  protected colorsCache: Map<string, Color | Array<Color>> = new Map();
  protected _rulesMap: {
    color?: Array<StyleRule<T>>;
    icon?: Array<StyleRule<T>>;
    image?: Array<StyleRule<T>>;
    shape?: Array<StyleRule<T>>;
    size?: Array<StyleRule<T>>;
    width?: Array<StyleRule<T>>;
  } = {};

  constructor(rulesMap: {
    color?: Array<StyleRule<T>>;
    icon?: Array<StyleRule<T>>;
    image?: Array<StyleRule<T>>;
    shape?: Array<StyleRule<T>>;
    size?: Array<StyleRule<T>>;
    width?: Array<StyleRule<T>>;
  }) {
    this.refresh(rulesMap);
  }

  /**
   * Refresh the rules
   */
  public refresh(rulesMap: {
    color?: Array<StyleRule<T>>;
    icon?: Array<StyleRule<T>>;
    image?: Array<StyleRule<T>>;
    shape?: Array<StyleRule<T>>;
    size?: Array<StyleRule<T>>;
    width?: Array<StyleRule<T>>;
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
    return PALETTE[
      ItemAttributes.getRandomUniqueColorPaletteIndex(value, PALETTE.length, ignoreCase)
    ];
  }

  /**
   * Return a number from 0 to number of occurrence in a palette based on a property
   */
  private static getRandomUniqueColorPaletteIndex(
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
  public static getTypeColor(
    rule: StyleRule<IEdgeStyle | INodeStyle>,
    type: string
  ): string | undefined | null {
    if (typeof rule.style.color === 'object' && rule.style.color.input[0] !== 'properties') {
      return ItemAttributes.autoColor(type, rule.style.color.ignoreCase);
    }
    if (!Tools.isDefined(rule.input) && typeof rule.style.color !== 'object') {
      return rule.style.color;
    }
    return null;
  }

  /**
   * return the corresponding size to the value with a linear function
   * @param value
   * @param lower
   * @param higher
   * @param extrema
   */
  public static getAutomaticRangeStyleLinear(
    value: number,
    {max, min}: IStyleAutoRange,
    lower: EdgeWidthExtrema | NodeSizeExtrema,
    higher: EdgeWidthExtrema | NodeSizeExtrema
  ): string | undefined {
    if (max !== undefined && min !== undefined) {
      // apply default style when min equal max
      if (max === min || isNaN(value)) {
        return '100%';
      }

      // calculate the linear function f(x) = ax + b
      const a = (higher - lower) / (max - min);
      const b = (lower * max - higher * min) / (max - min);
      const size = Math.floor(value * a + b);

      return `${size}%`;
    }
  }

  /**
   * return the corresponding size to the value with a logarithmic function
   * @param value
   * @param lower
   * @param higher
   * @param extrema
   */
  public static getAutomaticRangeStyleLog(
    value: number,
    {max, min}: IStyleAutoRange,
    lower: EdgeWidthExtrema | NodeSizeExtrema,
    higher: EdgeWidthExtrema | NodeSizeExtrema
  ): string | undefined {
    if (min !== undefined && max !== undefined) {
      // apply default style when min equal max
      if (max === min || isNaN(value)) {
        return '100%';
      }
      // apply an offset for all the values (including min and max)
      if (min < 1) {
        value += Math.abs(min) + 1;
        max += Math.abs(min) + 1;
        min += Math.abs(min) + 1;
      }
      // calculate the logarithmic function  f(x) = Math.floor(a*log(x) + b)
      const a = (higher - lower) / (Math.log(max) - Math.log(min));
      const b = (lower * Math.log(max) - higher * Math.log(min)) / (Math.log(max) - Math.log(min));
      const size = Math.floor(a * Math.log(value) + b);

      return `${size}%`;
    }
  }

  public isAutoRange(value: string | number | IStyleAutoRange): value is IStyleAutoRange {
    return typeof value === 'object' && value?.type === 'autoRange';
  }
}
