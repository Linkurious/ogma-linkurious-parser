'use strict';
import {Color} from 'ogma';
import {LkNodeData, OgmaNodeShape, IStyleImage, IStyleIcon} from '@linkurious/rest-client';
import sha1 from 'sha1';

import {Tools} from '../tools/tools';

import {StyleRule} from './styleRule';
import {BASE_GREY, ItemAttributes} from './itemAttributes';
import {Tools} from "../tools/tools";
import {OgmaTools} from "..";

export interface OgmaImage extends IStyleImage {
  url?: string;
}

export enum NodeSizeExtrema {
  MIN = 50,
  MAX = 500
}

export class NodeAttributes extends ItemAttributes {
  constructor(rulesMap: {
    color?: Array<StyleRule>;
    icon?: Array<StyleRule>;
    image?: Array<StyleRule>;
    shape?: Array<StyleRule>;
    size?: Array<StyleRule>;
  }) {
    super(rulesMap);
  }

  /**
   * Run the callback if an item match with a style in the array of rules
   */
  private matchStyle(
    styleRules: Array<StyleRule>,
    itemData: LkNodeData,
    callback: (style: StyleRule) => unknown
  ): void {
    if (!Tools.isDefined(itemData)) {
      return;
    }
    if (!Tools.isDefined(styleRules)) {
      return;
    }
    for (let i = 0; i < styleRules.length; ++i) {
      if (styleRules[i].canApplyTo(itemData)) {
        callback(styleRules[i]);
        break;
      }
    }
  }

  /**
   * Generate color for a given node (call only if _rulesMap.color is defined
   */
  public color(itemData: LkNodeData): Color | Array<Color> {
    if (!Tools.isDefined(itemData)) {
      return [BASE_GREY];
    }
    const hash = sha1(JSON.stringify(itemData));
    const cachedColor = this.colorsCache.get(hash);
    if (cachedColor !== undefined) {
      return cachedColor;
    }
    let colors = [];
    for (let i = 0; i < itemData.categories.length; ++i) {
      let c = null;
      for (let j = 0; j < this._rulesMap.color!.length; ++j) {
        const rule = this._rulesMap.color![j];
        if (
          rule.itemType !== undefined &&
          rule.itemType !== null &&
          rule.itemType !== itemData.categories[i]
        ) {
          continue;
        }
        if (rule.canApplyTo(itemData)) {
          if (typeof rule.style.color === 'object') {
            const propValue = Tools.getIn(itemData, rule.style.color.input);
            if (Array.isArray(propValue)) {
              c = ItemAttributes.autoColor(itemData.categories[i], rule.style.ignoreCase);
            } else {
              c = ItemAttributes.autoColor(`${propValue}`, rule.style.ignoreCase);
            }
          } else {
            c = rule.style.color;
          }
          break;
        }
      }
      colors.push(c);
    }
    colors = colors.filter((c) => Tools.isDefined(c));
    if (colors.length === 0) {
      colors = [BASE_GREY];
    }
    const finalColor = colors.length === 1 ? colors[0] : colors;
    this.colorsCache.set(hash, finalColor);
    return finalColor;
  }

  /**
   * Generate icon for a given node
   */
  public icon(
    itemData: LkNodeData
  ): {
    icon?: IStyleIcon;
    image?: OgmaImage | null;
  } {
    const rawColors = this.color(itemData);
    const color = Array.isArray(rawColors) ? rawColors[0] : rawColors;
    let result = {};
    const rules = [...(this._rulesMap.image || []), ...(this._rulesMap.icon || [])];
    if (!Tools.isDefined(itemData)) {
      return {
        icon: {},
        image: {}
      };
    }
    for (let i = 0; i < rules.length; ++i) {
      if (rules[i].canApplyTo(itemData)) {
        if ('icon' in rules[i].style) {
          result = {
            icon: {
              content: rules[i].style.icon.content,
              font: rules[i].style.icon.font,
              scale: 0.5,
              color: OgmaTools.isBright(color) ? '#000000' : '#FFFFFF'
            }
          };
        } else if ('image' in rules[i].style) {
          result = {
            image: {
              url:
                Tools.getType(rules[i].style.image.url) === 'imageUrl' ||
                Tools.getType(rules[i].style.image.url) === 'image'
                  ? rules[i].style.image.url
                  : Tools.getIn(itemData, rules[i].style.image.url.path),
              scale: rules[i].style.image.scale,
              fit: rules[i].style.image.fit,
              tile: rules[i].style.image.tile,
              minVisibleSize: 0
            }
          };
        }
        break;
      }
    }

    return result;
  }

  /**
   * Generate shape for a given node
   */
  public shape(itemData: LkNodeData): OgmaNodeShape | undefined {
    let result = undefined;
    if (this._rulesMap.shape !== undefined) {
      this.matchStyle(this._rulesMap.shape, itemData, (styleRule) => {
        result = styleRule.style.shape;
      });
    }
    return result;
  }

  /**
   * Generate size for a given node
   */
  public size(itemData: LkNodeData): number | undefined {
    let result = undefined;
    if (this._rulesMap.size !== undefined) {
      this.matchStyle(this._rulesMap.size, itemData, (styleRule) => {
        const sizeStyle = styleRule.style.size;
        if (sizeStyle.type === 'autoRange') {
          if (
            sizeStyle.input !== undefined &&
            sizeStyle.max !== undefined &&
            sizeStyle.min !== undefined
          ) {
            const propertyName: string = sizeStyle.input[1];
            const propertyValue = Tools.parseNumber(itemData.properties[propertyName]);
            result = NodeAttributes.getAutomaticRangeSize(propertyValue, styleRule);
          }
        } else {
          result = sizeStyle;
        }
      });
    }
    return result;
  }

  /**
   * return the corresponding size to the value
   * @param value
   * @param rule
   */
  public static getAutomaticRangeSize(value: number, rule: StyleRule): string {
    return this.getAutomaticRangeStyle(
      value,
      rule.style.size,
      NodeSizeExtrema.MIN,
      NodeSizeExtrema.MAX
    );
  }

  /**
   * Return an object containing all node attributes needed by Ogma to style a node
   */
  public all(
    itemData: LkNodeData
  ): {
    radius?: number | undefined;
    color: Color | Array<Color>;
    shape?: OgmaNodeShape | undefined;
    icon?: IStyleIcon;
    image?: IStyleImage | null;
  } {
    if (!Tools.isDefined(itemData)) {
      return {
        color: BASE_GREY
      };
    }
    const generatedIcon = this.icon(itemData);
    return {
      radius: this.size(itemData),
      color: this.color(itemData),
      shape: this.shape(itemData),
      icon: generatedIcon.icon,
      image: generatedIcon.image
    };
  }
}
