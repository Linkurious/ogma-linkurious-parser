'use strict';

import {
  IEdgeStyle,
  IStyleRule,
  LkEdgeData,
  LkNodeData,
  INodeStyle,
  SelectorType,
  IStyleIcon,
  IStyleImage,
  IStyles,
  IStyleColor,
  IRangeValues
} from '@linkurious/rest-client';

import {sortBy, Tools} from '../tools/tools';

import {StyleRule} from './styleRule';
import {ItemAttributes} from './itemAttributes';

export enum StyleType {
  COLOR = 'color',
  ICON = 'icon',
  SIZE = 'size',
  IMAGE = 'image',
  SHAPE = 'shape',
  WIDTH = 'width'
}

export interface Legend {
  [key: string]: Array<{label: string; value: string | IStyleIcon | IStyleImage | number}>;
}

export const SORTING_RULE = ['specificity', 'itemType', 'index'];

export class StyleRules {
  private _rules: Array<IStyleRule<INodeStyle | IEdgeStyle>>;

  constructor(rules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    this._rules = rules;
  }

  /**
   * Return an array of StyleRule with only 'color' rules and sorted by specificity, itemType and index
   *
   * @return {Array<StyleRule>}
   */
  public get color(): Array<StyleRule> {
    return sortBy(StyleRules.getBy(StyleType.COLOR, this._rules), SORTING_RULE);
  }

  /**
   * Return an array of StyleRule with only 'icon' rules and sorted by specificity, itemType and index
   *
   * @return {Array<StyleRule>}
   */
  public get icon(): Array<StyleRule> {
    return sortBy(
      [
        ...(StyleRules.getBy(StyleType.ICON, this._rules) || []),
        ...(StyleRules.getBy(StyleType.IMAGE, this._rules) || [])
      ],
      SORTING_RULE
    );
  }

  /**
   * Return an array of StyleRule with only 'image' rules and sorted by specificity, itemType and index
   *
   * @return {Array<StyleRule>}
   */
  public get image(): Array<StyleRule> {
    return sortBy(StyleRules.getBy(StyleType.IMAGE, this._rules), SORTING_RULE);
  }

  /**
   * Return an array of StyleRule with only 'shape' rules and sorted by specificity, itemType and index
   *
   * @return {Array<StyleRule>}
   */
  public get shape(): Array<StyleRule> {
    return sortBy(StyleRules.getBy(StyleType.SHAPE, this._rules), SORTING_RULE);
  }

  /**
   * Return an array of StyleRule with only 'size' rules and sorted by specificity, itemType and index
   *
   * @return {Array<StyleRule>}
   */
  public get size(): Array<StyleRule> {
    return sortBy(StyleRules.getBy(StyleType.SIZE, this._rules), SORTING_RULE);
  }

  /**
   * Return an array of StyleRule with only 'width' rules and sorted by specificity, itemType and index
   *
   * @return {Array<StyleRule>}
   */
  public get width(): Array<StyleRule> {
    return sortBy(StyleRules.getBy(StyleType.WIDTH, this._rules), SORTING_RULE);
  }

  /**
   * Return an object containing for each node style a sorted array of StyleRule
   *
   * @return {{[key: string]: Array<StyleRule>} }
   */
  public get nodeRules(): {[key: string]: Array<StyleRule>} {
    return {
      color: this.color,
      icon: this.icon,
      image: this.image,
      shape: this.shape,
      size: this.size
    };
  }

  /**
   * Return an object containing for each edge style a sorted array of StyleRule
   *
   * @return { {[key: string]: Array<StyleRule>}}
   */
  public get edgeRules(): {[key: string]: Array<StyleRule>} {
    return {
      color: this.color,
      shape: this.shape,
      width: this.width
    };
  }

  /**
   * Generate a legend with an array of style rules and existing items in visualization
   */
  public generateLegend(itemsData: Array<LkNodeData | LkEdgeData>): Legend {
    const result: Legend = {};
    if (itemsData.length === 0) {
      return result;
    }

    if ('categories' in itemsData[0]) {
      Object.keys(this.nodeRules).forEach((style: string) => {
        result[style] = StyleRules.getLegendForStyle(
          style as StyleType,
          this.nodeRules[style],
          itemsData
        );
      });
    } else {
      Object.keys(this.edgeRules).forEach((style: string) => {
        result[style] = StyleRules.getLegendForStyle(
          style as StyleType,
          this.edgeRules[style],
          itemsData
        );
      });
    }
    return result;
  }

  /**
   * Return the legend for a specific style type (color, icon, image...)
   */
  public static getLegendForStyle(
    styleType: StyleType,
    styles: Array<StyleRule>,
    itemsData: Array<LkNodeData | LkEdgeData>
  ): Array<{label: string; value: string | number | IStyleIcon | IStyleImage}> {
    const result: Array<{label: string; value: string | number | IStyleIcon | IStyleImage}> = [];
    const data = itemsData.filter((i) => i);
    for (let i = 0; i < styles.length; i++) {
      const styleRule = new StyleRule(styles[i]);
      const ruleExistsInViz = data.some((itemData) => {
        return styleRule.canApplyTo(itemData);
      });
      if (ruleExistsInViz) {
        if (styleType === StyleType.COLOR && typeof styleRule.style.color === 'object') {
          StyleRules.addLegendAutoColors(data, styleRule, result);
        } else if (styleType === StyleType.ICON && 'image' in styleRule.style) {
          // style is a custom icon
          const label = Tools.isDefined(styleRule.input)
            ? `${StyleRules.getTypeLabel(styleRule.itemType)}.${
                styleRule.input[1]
              } ${StyleRules.sanitizeValue(styleRule.type, styleRule.value)}`
            : `${StyleRules.getTypeLabel(styleRule.itemType)}`;
          const imageStyle = styleRule.style.image as IStyleImage;
          if (
            imageStyle.url &&
            typeof imageStyle.url === 'object' &&
            imageStyle.url.type === 'data'
          ) {
            // If the custom icon is read from a node property-value dynamically, then we
            // skip it from the legend, because it could be a different image for each node,
            // thus bloating the legend.
          } else {
            const value = styleRule.style.image;
            StyleRules.updateLegend(result, {label: label, value: value as string});
          }
        } else {
          const label = Tools.isDefined(styleRule.input)
            ? `${StyleRules.getTypeLabel(styleRule.itemType)}.${
                styleRule.input[1]
              } ${StyleRules.sanitizeValue(styleRule.type, styleRule.value)}`
            : `${StyleRules.getTypeLabel(styleRule.itemType)}`;
          const value =
            styleType === StyleType.WIDTH
              ? (styleRule.style as IEdgeStyle)[styleType]
              : (styleRule.style as INodeStyle)[styleType];
          StyleRules.updateLegend(result, {label: label, value: value as string});
        }
      }
    }

    return result;
  }

  /**
   * Sanitize value for legend
   */
  public static sanitizeValue(
    styleType: SelectorType,
    value: IRangeValues | number | string | boolean
  ): string {
    let template = '';
    switch (styleType) {
      case SelectorType.NO_VALUE:
        return 'is undefined';

      case SelectorType.NAN:
        return 'is not an number';

      case SelectorType.RANGE:
        Object.keys(value).forEach((k, i) => {
          if (i > 0) {
            template += ' and ';
          }
          template += `${k} ${(value as IRangeValues)[k as keyof IRangeValues]}`;
        });
        return template;
    }

    return typeof value === 'object' ? `= ${JSON.stringify(value)}` : `= ${value}`;
  }

  /**
   * Add items in legend for automatic coloring
   */
  public static addLegendAutoColors(
    itemsData: Array<LkNodeData | LkEdgeData>,
    styleRule: StyleRule,
    currentLegend: Array<{label: string; value: string | number | IStyleIcon | IStyleImage}>
  ): void {
    const colorStyle = styleRule.style.color as IStyleColor;
    const propertyKey: string = colorStyle.input[1];
    itemsData.forEach((data) => {
      const propValue = Tools.getIn(data, colorStyle.input);
      if (Array.isArray(propValue)) {
        propValue.forEach((value) => {
          const label = colorStyle.input.includes('properties')
            ? `${StyleRules.getTypeLabel(styleRule.itemType)}.${propertyKey} = ${value}`
            : `${StyleRules.getTypeLabel(value)}`;
          const color = ItemAttributes.autoColor(value, colorStyle.ignoreCase);
          StyleRules.updateLegend(currentLegend, {label: label, value: color});
        });
      } else {
        const label = colorStyle.input.includes('properties')
          ? `${StyleRules.getTypeLabel(styleRule.itemType)}.${propertyKey} = ${propValue}`
          : `${StyleRules.getTypeLabel(propValue)}`;
        const value = ItemAttributes.autoColor(propValue, colorStyle.ignoreCase);
        StyleRules.updateLegend(currentLegend, {label: label, value: value});
      }
    });
  }

  /**
   * Return the label of item type for a legend item
   */
  public static getTypeLabel(type: string | undefined | null): string {
    return type === undefined ? 'All' : type === null ? 'Others' : type;
  }

  /**
   * Check if a legend item already exists and overwrite it / push it
   */
  public static updateLegend(
    legend: Array<{label: string; value: string | number | IStyleIcon | IStyleImage}>,
    {label, value}: {[key: string]: string}
  ): void {
    const indexOfLegendItem = legend.map((r) => r.label).indexOf(label);
    if (indexOfLegendItem < 0) {
      legend.push({label: label, value: value});
    } else {
      legend[indexOfLegendItem] = {label: label, value: value};
    }
  }

  /**
   * return an array of StyleRule, containing only the desired style
   */
  public static getBy(
    styleType: StyleType,
    rules: Array<IStyleRule<INodeStyle | IEdgeStyle>>
  ): Array<StyleRule> {
    return rules
      .filter((style: IStyleRule<INodeStyle | IEdgeStyle>) => {
        switch (styleType) {
          case StyleType.COLOR:
            return style.style.color !== undefined;

          case StyleType.ICON:
            return 'icon' in style.style && style.style.icon !== undefined;

          case StyleType.IMAGE:
            return 'image' in style.style && style.style.image !== undefined;

          case StyleType.SHAPE:
            return style.style.shape !== undefined;

          case StyleType.SIZE:
            return 'size' in style.style && style.style.size !== undefined;

          case StyleType.WIDTH:
            return 'width' in style.style && style.style.width !== undefined;
        }
      })
      .map((style: IStyleRule<INodeStyle | IEdgeStyle>) => StyleRules.getRule(style, styleType));
  }

  /**
   * From a RawStyle, generate a StyleRule of a specific style
   */
  public static getRule(
    rawRule: IStyleRule<INodeStyle | IEdgeStyle>,
    styleType: StyleType
  ): StyleRule {
    const rule = Tools.clone(rawRule);
    rule.style = {[styleType]: rule.style[styleType]};
    return new StyleRule(rule);
  }

  /**
   * Check for non unique index in styles rules and update them if exists
   */
  public static sanitizeStylesIndex(styles: IStyles): IStyles {
    const seenIndex: Array<number> = [];
    const sanitizedStyles: IStyles = Tools.clone(styles);
    let maxIndex =
      Math.max(...[...styles.node.map((s) => s.index), ...styles.edge.map((s) => s.index)]) + 1;
    sanitizedStyles.node = sanitizedStyles.node.map((style) => {
      if (seenIndex.includes(style.index)) {
        style.index = maxIndex;
        maxIndex++;
      } else {
        seenIndex.push(style.index);
      }
      return style;
    });
    sanitizedStyles.edge = sanitizedStyles.edge.map((style) => {
      if (seenIndex.includes(style.index)) {
        style.index = maxIndex;
        maxIndex++;
      } else {
        seenIndex.push(style.index);
      }
      return style;
    });
    return sanitizedStyles;
  }
}
