'use strict';

import {
  IEdgeStyle,
  IStyleRule,
  LkEdgeData,
  LkNodeData,
  INodeStyle,
  SelectorType,
  IStyleAutoRange
} from '@linkurious/rest-client';

import {ItemAttributes} from '..';
import {Tools} from '../tools/tools';

export enum StyleRuleType {
  AUTO_RANGE = 'autoRange'
}

export class StyleRule implements IStyleRule<INodeStyle | IEdgeStyle> {
  public type: SelectorType;
  public input: string[] | undefined;
  public index: number;
  public itemType?: string;
  public value: any;
  public style: any;

  constructor(model: IStyleRule<INodeStyle | IEdgeStyle>) {
    this.type = model.type;
    this.input = model.input;
    this.index = model.index;
    this.itemType = model.itemType;
    this.style = model.style;
    this.value = model.value;
  }

  public static isAutomaticRange(rule: IStyleRule<IEdgeStyle | INodeStyle>): boolean {
    return (
      rule.style !== undefined &&
      (((rule.style as IEdgeStyle).width !== undefined &&
        ((rule.style as IEdgeStyle).width as IStyleAutoRange).type === StyleRuleType.AUTO_RANGE) ||
        ((rule.style as INodeStyle).size !== undefined &&
          ((rule.style as INodeStyle).size as IStyleAutoRange).type === StyleRuleType.AUTO_RANGE))
    );
  }

  /**
   * Return an int describing specificity of the style. 4 = very specific / 1 = not specific
   *
   * @return {number}
   */
  get specificity(): 1 | 2 | 3 | 4 {
    if (this.itemType !== undefined && this.input !== undefined) {
      return 4;
    }
    if (this.itemType === undefined && this.input !== undefined) {
      return 3;
    }
    if (this.itemType !== undefined && this.input === undefined) {
      return 2;
    }
    return 1;
  }

  /**
   * Return true if this style match values
   */
  public matchValues(
    itemType: string | undefined,
    input: Array<string> | undefined,
    value: any
  ): boolean {
    if (Tools.isDefined(input)) {
      return (
        ((itemType === this.itemType || !Tools.isDefined(this.itemType)) &&
          Tools.isEqual(['properties', ...input], this.input) &&
          Tools.isEqual(value, this.value)) ||
        (this.type === 'any' &&
          !Tools.isDefined(this.input) &&
          typeof this.style.color === 'object' &&
          this.style.color.input[1] === input[0])
      );
    }

    if (Tools.isDefined(this.itemType)) {
      return itemType === this.itemType && !Tools.isDefined(this.input);
    }

    return !Tools.isDefined(this.input);
  }

  public static inputExists(
    type: SelectorType,
    input: Array<string> | undefined
  ): input is Array<string> {
    return type !== SelectorType.ANY;
  }

  /**
   * Return true if a style can apply to a node
   */
  public canApplyTo(data: LkNodeData | LkEdgeData): boolean {
    const types = 'categories' in data ? data.categories : [data.type];
    let typePredicate = false;
    switch (this.type) {
      case SelectorType.ANY:
        typePredicate = StyleRule.checkAny(data, this.style);
        break;

      case SelectorType.NO_VALUE:
        if (StyleRule.inputExists(this.type, this.input)) {
          typePredicate = StyleRule.checkNoValue(data, this.input);
        }
        break;

      case SelectorType.NAN:
        if (StyleRule.inputExists(this.type, this.input)) {
          typePredicate = StyleRule.checkNan(data, this.input);
        }
        break;

      case SelectorType.RANGE:
        if (StyleRule.inputExists(this.type, this.input)) {
          typePredicate = StyleRule.checkRange(Tools.getIn(data, this.input), this.value);
        }
        break;

      case SelectorType.IS:
        if (StyleRule.inputExists(this.type, this.input)) {
          typePredicate = StyleRule.checkIs(data, this.input, this.value);
        }
        break;
    }
    return typePredicate && StyleRule.checkItemType(types, this.itemType);
  }

  /**
   * Return true or false on rule type 'any' if the current node match the rule
   */
  public static checkAny(data: LkNodeData | LkEdgeData, style: INodeStyle | IEdgeStyle): boolean {
    // return true if autoColor by a property and this property exists in node
    if (typeof style.color === 'object') {
      return Tools.isDefined(Tools.getIn(data, style.color.input));
    }
    return true;
  }

  /**
   * Return true or false on rule type 'noValue' if the current node match the rule
   */
  public static checkNoValue(data: LkNodeData | LkEdgeData, input: Array<string>): boolean {
    return !Tools.valueExists(Tools.getIn(data, input));
  }

  /**
   * Return true or false on rule type 'NaN' if the current node match the rule
   */
  public static checkNan(data: LkNodeData | LkEdgeData, input: Array<string>): boolean {
    return !Tools.isNumber(Tools.getIn(data, input));
  }

  /**
   * Return true if predicate is true for the node value
   *
   * @param value
   * @param comparator
   * @return {boolean}
   */
  public static checkRange(
    value: number,
    comparator: {[key in '<=' | '<' | '>' | '>=']?: number}
  ): boolean {
    return (
      (comparator['<='] === undefined || value <= comparator['<=']) &&
      (comparator['<'] === undefined || value < comparator['<']) &&
      (comparator['>'] === undefined || value > comparator['>']) &&
      (comparator['>='] === undefined || value >= comparator['>='])
    );
  }

  /**
   * Return true or false on rule type 'is' if the current node match the rule
   */
  public static checkIs(data: LkNodeData | LkEdgeData, input: Array<string>, value: any): boolean {
    if (!Tools.isDefined(input)) {
      return false;
    }
    const itemValue = Tools.getIn(data, input);
    let formattedValue = itemValue;
    if (
      Tools.isDefined(itemValue) &&
      typeof itemValue === 'object' &&
      (itemValue.type === 'date' || itemValue.type === 'datetime')
    ) {
      let timezone = itemValue.timezone;
      if (itemValue.timezone === 'Z') {
        timezone = '+00:00';
      }
      formattedValue = Tools.formatDate(
        itemValue.value,
        itemValue.type === 'datetime',
        Tools.timezoneToMilliseconds(timezone) / 1000
      );
    }
    return Tools.isEqual(formattedValue, value);
  }

  /**
   * Check that value of itemType match for the node
   */
  public static checkItemType(types: Array<string>, itemType: string | undefined): boolean {
    return StyleRule.matchCategory(types, itemType) || StyleRule.matchAny(itemType);
  }

  /**
   * Return true if itemType is defined and category exists in an array of categories
   *
   * @param {Array<string> | string} types
   * @param {string} itemType
   * @return {boolean}
   */
  public static matchCategory(
    types: Array<string> | string,
    itemType: string | undefined
  ): boolean {
    return (
      Tools.isDefined(itemType) &&
      (Array.isArray(types) ? types.includes(itemType) : Tools.isEqual(types, itemType))
    );
  }

  /**
   * Return true if itemType is undefined
   *
   * @param {string} itemType
   * @return {boolean}
   */
  public static matchAny(itemType: any | null): boolean {
    return itemType === undefined;
  }

  /**
   * Return the color for a type
   */
  public getTypeColor(type: string): string | undefined | null {
    let color;
    if (
      StyleRule.checkItemType([type], this.itemType) &&
      this.type === SelectorType.ANY &&
      !Tools.isDefined(this.input)
    ) {
      color = ItemAttributes.getTypeColor(this, type);
    }
    return color;
  }
}
