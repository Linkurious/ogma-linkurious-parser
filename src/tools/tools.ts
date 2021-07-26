'use strict';

import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import {Node, NodeList} from 'ogma';
import {LkNodeData, LkProperty} from '@linkurious/rest-client';

export {sortBy};
const URL_PATTERN = /([a-zA-Z][a-zA-Z0-9\+\-\.]*:\/\/[^\s]+)/i;
const IMAGE_PATTERN = /\S+\.(gif|jpe?g|tiff|png|bmp|svg)$/i;
export const CAPTION_HEURISTIC: string[] = [
  'label',
  'Label',
  'name',
  'Name',
  'title',
  'Title',
  'rdfs:label'
];

export class Tools {
  public static isEqual(v1: unknown, v2: unknown): boolean {
    return isEqual(v1, v2);
  }

  /**
   * Check that a value is defined : not null and not undefined
   *
   * @param {any} value
   * @return {boolean}
   */
  public static isDefined<T>(value: T): value is NonNullable<T> {
    return value !== undefined && value !== null;
  }

  /**
   * Truncate a text
   */
  public static truncate(value: unknown, position: 'middle' | 'end', limit = 0): string {
    const suffix = '\u2026';
    if (!Tools.isDefined(value)) {
      return ``;
    }
    const valueToTruncate = `${value}`;
    if (valueToTruncate.length <= limit + 1) {
      return valueToTruncate;
    }
    const fixedLimit = limit - 1;
    switch (position) {
      case 'middle':
        return (
          valueToTruncate.substring(0, Math.ceil(fixedLimit / 2)) +
          suffix +
          valueToTruncate.substring(valueToTruncate.length - Math.floor(fixedLimit / 2))
        );

      case 'end':
        return valueToTruncate.substring(0, fixedLimit) + suffix;
    }
  }

  /**
   * Return a value from a nested object depending on a keyPath
   */
  public static getIn(ref: any, path: Array<string | number>): any {
    const result = path.reduce((p, c) => (p && p[c] !== undefined ? p[c] : undefined), ref);
    return Tools.clone(result);
  }

  /**
   * Return a clone of an object
   */
  public static clone(o: any) {
    return typeof o === 'object'
      ? JSON.parse(
          JSON.stringify(o, (k, v) => {
            return v instanceof Set ? {} : v;
          })
        )
      : o;
  }

  /**
   * Get the amount of hidden neighbors from a list of nodes
   *
   * @param nodes
   */
  public static getHiddenNeighbors(nodes: NodeList<LkNodeData>): number {
    return nodes.reduce((result: number, node: Node<LkNodeData>) => {
      const statistics = node.getData('statistics');
      if (statistics !== undefined) {
        const hiddenNeighbors =
          statistics.degree !== undefined && !statistics.supernode
            ? statistics.degree - Tools.getDegreeWithoutSelfConnection(node)
            : statistics.supernodeDegree;
        if (hiddenNeighbors !== undefined && hiddenNeighbors > 0) {
          return (result += hiddenNeighbors);
        }
      }
      return result;
    }, 0);
  }

  /**
   * Return the visible degree of a node without self connection (self edge)
   *
   * @param {Node} node
   * @return {number}
   */
  public static getDegreeWithoutSelfConnection(node: Node<LkNodeData>): number {
    return node.getAdjacentNodes({policy: 'exclude-sources', filter: 'raw'}).size;
  }

  /**
   * Return a formatted version of a number
   */
  public static formatNumber(number: number): string {
    let div = 1;
    let suffix = '';
    const sign = number < 0 ? '-' : '';
    number = Math.abs(number);

    if (number >= 1000000) {
      div = 1000000;
      suffix = 'M';
    } else if (number >= 1000) {
      div = 1000;
      suffix = 'k';
    }
    const nn = number / div;
    // if there is a decimal value and nn < 10
    if (nn < 10 && nn % 1 !== 0) {
      return sign + nn.toFixed(1) + suffix;
    } else {
      return sign + Math.floor(nn) + suffix;
    }
  }

  /**
   * Return true if a string is not composed only by invisible char
   *
   * @param {string} value
   * @return {boolean}
   */
  public static isStringFilled(value: string): boolean {
    return value.trim() !== '';
  }

  public static getValueFromLkProperty(property: LkProperty): null | string | number | boolean {
    if (typeof property === 'object' && 'type' in property) {
      if (!('original' in property) && !('value' in property)) {
        return null;
      }
      if ('original' in property) {
        return `${property.original}`;
      }
      if ('value' in property) {
        return Tools.formatDate(
          new Date(
            new Date(property.value).getTime() + Tools.timezoneToMilliseconds(property.timezone)
          ).toISOString()
        );
      }
    }
    return property;
  }

  /**
   * Return a formatted date as a string
   */
  public static formatDate(
    isoString: string,
    isDatetime?: boolean,
    timezone?: number
  ): string | null {
    // The date received from the server will be always in seconds
    let offsetDate: string | number = isoString;
    if (timezone !== undefined) {
      offsetDate = new Date(isoString).getTime() + timezone * 1000;
    }
    const dateObject = new Date(offsetDate);

    if (isNaN(dateObject.getUTCFullYear())) {
      return null;
    }
    let formattedDate =
      dateObject.getFullYear() +
      '-' +
      ((dateObject.getUTCMonth() + 1).toString().length === 1
        ? '0' + (dateObject.getUTCMonth() + 1)
        : dateObject.getUTCMonth() + 1) +
      '-' +
      (dateObject.getUTCDate().toString().length === 1
        ? '0' + dateObject.getUTCDate()
        : dateObject.getUTCDate());

    if (isDatetime) {
      formattedDate +=
        ' ' +
        (dateObject.getUTCHours().toString().length === 1
          ? '0' + dateObject.getUTCHours()
          : dateObject.getUTCHours()) +
        ':' +
        (dateObject.getUTCMinutes().toString().length === 1
          ? '0' + dateObject.getUTCMinutes()
          : dateObject.getUTCMinutes()) +
        ':' +
        (dateObject.getUTCSeconds().toString().length === 1
          ? '0' + dateObject.getUTCSeconds()
          : dateObject.getUTCSeconds());
    }
    return formattedDate;
  }

  /**
   * From "+03:00" return the offset in milliseconds
   * @param timezone
   */
  public static timezoneToMilliseconds(timezone: string | undefined): number {
    if (timezone === undefined) {
      return 0;
    }
    if (timezone === 'Z') {
      return 0;
    }
    const sign = timezone[0];
    const [hours, minutes] = timezone.slice(1).split(':');
    return sign === '+'
      ? this.sanitizeFormattedNumber(hours) * 3.6e6 + this.sanitizeFormattedNumber(minutes) * 60000
      : (this.sanitizeFormattedNumber(hours) * 3.6e6 +
          this.sanitizeFormattedNumber(minutes) * 60000) *
          -1;
  }

  public static sanitizeFormattedNumber(str: string): number {
    if (str.length === 2 && str.startsWith('0')) {
      return Tools.parseNumber(str[1]);
    }
    return Tools.parseNumber(str);
  }

  /**
   * Return true if `n` is (or can be parsed as) a float, but is NOT an integer
   *
   * @param {any} n
   * @return {number} a number (NaN is `n` cannot be parsed as a number)
   */
  public static parseNumber(n: unknown): number {
    // string: try to parse as number (allow ',' as decimal separator)
    if (typeof n === 'string') {
      // prevent the empty string to be parsed as 0
      if (n.trim() === '') {
        return Number.NaN;
      }

      n = +n.replace(',', '.').replace(' ', '');
    }

    // (the string could not be parsed) OR (it was neither string nor number)
    if (typeof n !== 'number') {
      return Number.NaN;
    }

    // false for NaN, +Infinity, -Infinity
    if (!isFinite(n)) {
      return Number.NaN;
    }

    return n;
  }

  /**
   * Return an Array without duplicated keys
   *
   * @param {Array<any>} arr
   * @param {string} key
   * @return {Array<any>}
   */
  public static uniqBy(arr: Array<any>, key?: string): Array<any> {
    const seen = new Set();
    if (key) {
      const result = [];
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i] && arr[i][key] && !seen.has(arr[i][key])) {
          seen.add(arr[i][key]);
          result.push(arr[i]);
        } else if (!arr[i][key]) {
          result.push(arr[i]);
        }
      }
      return result;
    }
    return typeof arr[0] === 'object'
      ? Array.from(new Set(arr.map((v) => JSON.stringify(v)))).map((v) => JSON.parse(v))
      : Array.from(new Set(arr));
  }

  /**
   * Return 'image' or 'url' depending on the given string
   *
   * @param {string} value
   * @return {"image" | "url"}
   */
  public static getType(value: string): 'image' | 'url' | 'imageUrl' | undefined {
    if (Tools.isImage(value) && Tools.isUrl(value)) {
      return 'imageUrl';
    }

    if (Tools.isImage(value)) {
      return 'image';
    }

    if (Tools.isUrl(value)) {
      return 'url';
    }

    return undefined;
  }

  /**
   * Return true if the given string is an url that match the schema handled by LKE
   *
   * @param {string}  value
   * @return {boolean}
   */
  private static isUrl(value: string): boolean {
    return URL_PATTERN.test(value);
  }

  /**
   * Return true if the given string is an url with an image extension
   *
   * @param {string}  value
   * @return {boolean}
   */
  private static isImage(value: string): boolean {
    return IMAGE_PATTERN.test(value);
  }

  /**
   * Return true if a value is not undefined, not null and not an empty string
   */
  public static valueExists(value: string): boolean {
    return Tools.isDefined(value) && Tools.isStringFilled(value);
  }

  /**
   * Return true if `n` is (or can be parsed as) a number
   */
  public static isNumber(n: unknown): boolean {
    n = Tools.parseNumber(n);
    return Tools.isDefined(n) && n === n;
  }

  /**
   * return the correct property value
   */
  public static getPropertyValue(
    property: LkProperty,
    invalidAsString?: boolean,
    formattedDates?: boolean
  ): undefined | null | string | number | boolean | Array<string> {
    if (typeof property === 'object' && !Array.isArray(property)) {
      if (!('status' in property)) {
        if ((property.type === 'date' || property.type === 'datetime') && formattedDates) {
          return Tools.formatDate(property.value, property.type === 'datetime');
        } else if (property.type === 'date' || property.type === 'datetime') {
          return new Date(property.value).getTime();
        }
      } else if (invalidAsString) {
        return 'original' in property ? property.original : undefined;
      } else {
        return undefined;
      }
    }
    return property;
  }

  /**
   * Parse the given value and return a float number or NaN
   *
   * @param {any} n
   * @return {number}
   */
  public static parseFloat(n: unknown): number {
    return Tools.parseNumber(n);
  }
}
