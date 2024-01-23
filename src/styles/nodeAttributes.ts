'use strict';
import {Color} from '@linkurious/ogma';
import {
  AutoRangeScale,
  IImageDataValue,
  INodeStyle,
  IStyleAutoRange,
  IStyleIcon,
  IStyleImage,
  LkNodeData,
  OgmaNodeShape
} from '@linkurious/rest-client';
import sha1 from 'sha1';

import {Tools} from '../tools/tools';
import {OgmaTools} from '..';

import {StyleRule} from './styleRule';
import {BASE_GREY, ItemAttributes} from './itemAttributes';

export interface OgmaImage extends IStyleImage {
  url?: string;
}

export enum NodeSizeExtrema {
  MIN = 50,
  MAX = 500
}

export class NodeAttributes extends ItemAttributes<INodeStyle> {
  constructor(rulesMap: {
    color?: Array<StyleRule<INodeStyle>>;
    icon?: Array<StyleRule<INodeStyle>>;
    image?: Array<StyleRule<INodeStyle>>;
    shape?: Array<StyleRule<INodeStyle>>;
    size?: Array<StyleRule<INodeStyle>>;
  }) {
    super(rulesMap);
  }

  /**
   * Run the callback if an item match with a style in the array of rules
   */
  private static matchStyle(
    styleRules: Array<StyleRule<INodeStyle>>,
    itemData: LkNodeData,
    callback: (style: StyleRule<INodeStyle>) => unknown
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
    let colors: Array<string | null> = [];
    for (let i = 0; i < itemData.categories.length; ++i) {
      let color = null;
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
              color = ItemAttributes.autoColor(itemData.categories[i], rule.style.color.ignoreCase);
            } else {
              color = ItemAttributes.autoColor(`${propValue}`, rule.style.color.ignoreCase);
            }
          } else {
            color = rule.style.color as string;
          }
          break;
        }
      }
      colors.push(color);
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
        const style = rules[i].style;
        if ('icon' in style && typeof style.icon === 'object') {
          result = {
            icon: {
              content: style.icon?.content as string,
              font: style.icon?.font,
              scale: 0.5,
              color: OgmaTools.isBright(color) ? '#000000' : '#FFFFFF'
            }
          };
        } else if ('image' in style && typeof style.image === 'object') {
          const imageUrlValue = NodeAttributes.getImageUrlFromStyleRule(style.image.url, itemData);
          if (imageUrlValue !== undefined) {
            result = {
              image: {
                url: imageUrlValue,
                scale: style.image.scale,
                fit: style.image.fit,
                tile: style.image.tile,
                minVisibleSize: 0
              }
            };
          }
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
      NodeAttributes.matchStyle(this._rulesMap.shape, itemData, (styleRule) => {
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
      NodeAttributes.matchStyle(
        this._rulesMap.size,
        itemData,
        (styleRule: StyleRule<INodeStyle>) => {
          const sizeStyle = styleRule.style.size as string | number | IStyleAutoRange;
          if (this.isAutoRange(sizeStyle)) {
            if (
              sizeStyle.input !== undefined &&
              sizeStyle.max !== undefined &&
              sizeStyle.min !== undefined
            ) {
              const propertyName: string = sizeStyle.input[1];
              const propertyValue = Tools.parseNumber(itemData.properties[propertyName]);
              const isLog = sizeStyle.scale && sizeStyle.scale === AutoRangeScale.LOGARITHMIC;
              result = NodeAttributes.getAutomaticRangeSize(propertyValue, styleRule, isLog);
            }
          } else {
            result = sizeStyle;
          }
        }
      );
    }
    return result;
  }

  /**
   * return the corresponding size to the value
   * @param value
   * @param rule
   * @param isLog
   */
  public static getAutomaticRangeSize(
    value: number,
    rule: StyleRule<INodeStyle>,
    isLog = false
  ): string | undefined {
    return isLog
      ? this.getAutomaticRangeStyleLog(
          value,
          rule.style.size as IStyleAutoRange,
          NodeSizeExtrema.MIN,
          NodeSizeExtrema.MAX
        )
      : this.getAutomaticRangeStyleLinear(
          value,
          rule.style.size as IStyleAutoRange,
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

  /**
   * Return the value of the image url from a style rule or undefined
   * @param value
   * @param itemData
   */
  public static getImageUrlFromStyleRule(
    value: string | IImageDataValue | undefined,
    itemData: LkNodeData
  ): string | undefined {
    if (typeof value === 'string' && ['imageUrl', 'image'].includes(Tools.getType(value)!)) {
      return value;
    } else if (typeof value === 'object') {
      return Tools.getIn(itemData, value.path);
    }
  }
}
