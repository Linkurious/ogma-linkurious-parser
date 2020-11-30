/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2017
 *
 * Created by maximeallex on 2017-03-13.
 */

'use strict';

import merge from 'lodash/merge';
import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';
import defaults from 'lodash/defaults';
import isObject from 'lodash/isObject';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import includes from 'lodash/includes';
import values from 'lodash/values';
import partition from 'lodash/partition';
import concat from 'lodash/concat';
import get from 'lodash/get';
import keys from 'lodash/keys';
import isString from 'lodash/isString';
import mapValues from 'lodash/mapValues';
import sumBy from 'lodash/sumBy';
import sortedUniqBy from 'lodash/sortedUniqBy';
import {GenericObject, LkEdgeData, LkNodeData, LkProperty} from '@linkurious/rest-client';
import {Color} from 'types/utilities';

import {Edge, EdgeList, Node, NodeList} from '../ogma/models';

export {
  merge,
  sortBy,
  isEqual,
  defaults,
  isObject,
  map,
  uniq,
  includes,
  values,
  partition,
  concat,
  get,
  keys,
  isString,
  mapValues,
  sumBy,
  sortedUniqBy
};

export const DEFAULT_DEBOUNCE_TIME = 375;
export const NO_CATEGORIES = 'no_categories';
export const CAPTION_HEURISTIC: string[] = [
  'label',
  'Label',
  'name',
  'Name',
  'title',
  'Title',
  'rdfs:label'
];
export const UNAVAILABLE_KEY = 'no key';
export const UNAVAILABLE_VALUE = 'no value';
export const UNACCEPTABLE_URL = [null, undefined, 'localhost', '127.0.0.1'];
export const UNGUARDED_PAGES: string[] = [
  'admin/data',
  'admin/data/new',
  'admin/datasources',
  'datasource/'
];
export const BUILTIN_GROUP_INDEX_MAP = {
  admin: 0,
  'source manager': 1,
  'read, edit and delete': 2,
  'read and edit': 3,
  read: 4
};

const HTML_COLORS: GenericObject<{hex: string; rgb: string}> = {
  lightsalmon: {hex: '#FFA07A', rgb: 'rbg(255,160,122)'},
  salmon: {hex: '#FA8072', rgb: 'rgb(250,128,114)'},
  darksalmon: {hex: '#E9967A', rgb: 'rgb(233,150,122)'},
  lightcoral: {hex: '#F08080', rgb: 'rgb(240,128,128)'},
  indianred: {hex: '#CD5C5C', rgb: 'rgb(205,92,92)'},
  crimson: {hex: '#DC143C', rgb: 'rgb(220,20,60)'},
  firebrick: {hex: '#B22222', rgb: 'rgb(178,34,34)'},
  red: {hex: '#FF0000', rgb: 'rgb(255,0,0)'},
  darkred: {hex: '#8B0000', rgb: 'rgb(139,0,0)'},
  coral: {hex: '#FF7F50', rgb: 'rgb(255,127,80)'},
  tomato: {hex: '#FF6347', rgb: 'rgb(255,99,71)'},
  orangered: {hex: '#FF4500', rgb: 'rgb(255,69,0)'},
  gold: {hex: '#FFD700', rgb: 'rgb(255,215,0)'},
  orange: {hex: '#FFA500', rgb: 'rgb(255,165,0)'},
  darkorange: {hex: '#FF8C00', rgb: 'rgb(255,140,0)'},
  lightyellow: {hex: '#FFFFE0', rgb: 'rgb(255,255,224)'},
  lemonchiffon: {hex: '#FFFACD', rgb: 'rgb(255,250,205)'},
  lightgoldenrodyellow: {hex: '#FAFAD2', rgb: 'rgb(250,250,210)'},
  papayawhip: {hex: '#FFEFD5', rgb: 'rgb(255,239,213)'},
  moccasin: {hex: '#FFE4B5', rgb: 'rgb(255,228,181)'},
  peachpuff: {hex: '#FFDAB9', rgb: 'rgb(255,218,185)'},
  palegoldenrod: {hex: '#EEE8AA', rgb: 'rgb(238,232,170)'},
  khaki: {hex: '#F0E68C', rgb: 'rgb(240,230,140)'},
  darkkhaki: {hex: '#BDB76B', rgb: 'rgb(189,183,107)'},
  yellow: {hex: '#FFFF00', rgb: 'rgb(255,255,0)'},
  lawngreen: {hex: '#7CFC00', rgb: 'rgb(124,252,0)'},
  chartreuse: {hex: '#7FFF00', rgb: 'rgb(127,255,0)'},
  limegreen: {hex: '#32CD32', rgb: 'rgb(50,205,50)'},
  lime: {hex: '#00FF00', rgb: 'rgb(0.255.0)'},
  forestgreen: {hex: '#228B22', rgb: 'rgb(34,139,34)'},
  green: {hex: '#008000', rgb: 'rgb(0,128,0)'},
  darkgreen: {hex: '#006400', rgb: 'rgb(0,100,0)'},
  greenyellow: {hex: '#ADFF2F', rgb: 'rgb(173,255,47)'},
  yellowgreen: {hex: '#9ACD32', rgb: 'rgb(154,205,50)'},
  springgreen: {hex: '#00FF7F', rgb: 'rgb(0,255,127)'},
  mediumspringgreen: {hex: '#00FA9A', rgb: 'rgb(0,250,154)'},
  lightgreen: {hex: '#90EE90', rgb: 'rgb(144,238,144)'},
  palegreen: {hex: '#98FB98', rgb: 'rgb(152,251,152)'},
  darkseagreen: {hex: '#8FBC8F', rgb: 'rgb(143,188,143)'},
  mediumseagreen: {hex: '#3CB371', rgb: 'rgb(60,179,113)'},
  seagreen: {hex: '#2E8B57', rgb: 'rgb(46,139,87)'},
  olive: {hex: '#808000', rgb: 'rgb(128,128,0)'},
  darkolivegreen: {hex: '#556B2F', rgb: 'rgb(85,107,47)'},
  olivedrab: {hex: '#6B8E23', rgb: 'rgb(107,142,35)'},
  lightcyan: {hex: '#E0FFFF', rgb: 'rgb(224,255,255)'},
  cyan: {hex: '#00FFFF', rgb: 'rgb(0,255,255)'},
  aqua: {hex: '#00FFFF', rgb: 'rgb(0,255,255)'},
  aquamarine: {hex: '#7FFFD4', rgb: 'rgb(127,255,212)'},
  mediumaquamarine: {hex: '#66CDAA', rgb: 'rgb(102,205,170)'},
  paleturquoise: {hex: '#AFEEEE', rgb: 'rgb(175,238,238)'},
  turquoise: {hex: '#40E0D0', rgb: 'rgb(64,224,208)'},
  mediumturquoise: {hex: '#48D1CC', rgb: 'rgb(72,209,204)'},
  darkturquoise: {hex: '#00CED1', rgb: 'rgb(0,206,209)'},
  lightseagreen: {hex: '#20B2AA', rgb: 'rgb(32,178,170)'},
  cadetblue: {hex: '#5F9EA0', rgb: 'rgb(95,158,160)'},
  darkcyan: {hex: '#008B8B', rgb: 'rgb(0,139,139)'},
  teal: {hex: '#008080', rgb: 'rgb(0,128,128)'},
  powderblue: {hex: '#B0E0E6', rgb: 'rgb(176,224,230)'},
  lightblue: {hex: '#ADD8E6', rgb: 'rgb(173,216,230)'},
  lightskyblue: {hex: '#87CEFA', rgb: 'rgb(135,206,250)'},
  skyblue: {hex: '#87CEEB', rgb: 'rgb(135,206,235)'},
  deepskyblue: {hex: '#00BFFF', rgb: 'rgb(0,191,255)'},
  lightsteelblue: {hex: '#B0C4DE', rgb: 'rgb(176,196,222)'},
  dodgerblue: {hex: '#1E90FF', rgb: 'rgb(30,144,255)'},
  cornflowerblue: {hex: '#6495ED', rgb: 'rgb(100,149,237)'},
  steelblue: {hex: '#4682B4', rgb: 'rgb(70,130,180)'},
  royalblue: {hex: '#4169E1', rgb: 'rgb(65,105,225)'},
  blue: {hex: '#0000FF', rgb: 'rgb(0,0,255)'},
  mediumblue: {hex: '#0000CD', rgb: 'rgb(0,0,205)'},
  darkblue: {hex: '#00008B', rgb: 'rgb(0,0,139)'},
  navy: {hex: '#000080', rgb: 'rgb(0,0,128)'},
  midnightblue: {hex: '#191970', rgb: 'rgb(25,25,112)'},
  mediumslateblue: {hex: '#7B68EE', rgb: 'rgb(123,104,238)'},
  slateblue: {hex: '#6A5ACD', rgb: 'rgb(106,90,205)'},
  darkslateblue: {hex: '#483D8B', rgb: 'rgb(72,61,139)'},
  lavender: {hex: '#E6E6FA', rgb: 'rgb(230,230,250)'},
  thistle: {hex: '#D8BFD8', rgb: 'rgb(216,191,216)'},
  plum: {hex: '#DDA0DD', rgb: 'rgb(221,160,221)'},
  violet: {hex: '#EE82EE', rgb: 'rgb(238,130,238)'},
  orchid: {hex: '#DA70D6', rgb: 'rgb(218,112,214)'},
  fuchsia: {hex: '#FF00FF', rgb: 'rgb(255,0,255)'},
  magenta: {hex: '#FF00FF', rgb: 'rgb(255,0,255)'},
  mediumorchid: {hex: '#BA55D3', rgb: 'rgb(186,85,211)'},
  mediumpurple: {hex: '#9370DB', rgb: 'rgb(147,112,219)'},
  blueviolet: {hex: '#8A2BE2', rgb: 'rgb(138,43,226)'},
  darkviolet: {hex: '#9400D3', rgb: 'rgb(148,0,211)'},
  darkorchid: {hex: '#9932CC', rgb: 'rgb(153,50,204)'},
  darkmagenta: {hex: '#8B008B', rgb: 'rgb(139,0,139)'},
  purple: {hex: '#800080', rgb: 'rgb(128,0,128)'},
  indigo: {hex: '#4B0082', rgb: 'rgb(75,0,130)'},
  pink: {hex: '#FFC0CB', rgb: 'rgb(255,192,203)'},
  lightpink: {hex: '#FFB6C1', rgb: 'rgb(255,182,193)'},
  hotpink: {hex: '#FF69B4', rgb: 'rgb(255,105,180)'},
  deeppink: {hex: '#FF1493', rgb: 'rgb(255,20,147)'},
  palevioletred: {hex: '#DB7093', rgb: 'rgb(219,112,147)'},
  mediumvioletred: {hex: '#C71585', rgb: 'rgb(199,21,133)'},
  white: {hex: '#FFFFFF', rgb: 'rgb(255,255,255)'},
  snow: {hex: '#FFFAFA', rgb: 'rgb(255,250,250)'},
  honeydew: {hex: '#F0FFF0', rgb: 'rgb(240,255,240)'},
  mintcream: {hex: '#F5FFFA', rgb: 'rgb(245,255,250)'},
  azure: {hex: '#F0FFFF', rgb: 'rgb(240,255,255)'},
  aliceblue: {hex: '#F0F8FF', rgb: 'rgb(240,248,255)'},
  ghostwhite: {hex: '#F8F8FF', rgb: 'rgb(248,248,255)'},
  whitesmoke: {hex: '#F5F5F5', rgb: 'rgb(245,245,245)'},
  seashell: {hex: '#FFF5EE', rgb: 'rgb(255,245,238)'},
  beige: {hex: '#F5F5DC', rgb: 'rgb(245,245,220)'},
  oldlace: {hex: '#FDF5E6', rgb: 'rgb(253,245,230)'},
  floralwhite: {hex: '#FFFAF0', rgb: 'rgb(255,250,240)'},
  ivory: {hex: '#FFFFF0', rgb: 'rgb(255,255,240)'},
  antiquewhite: {hex: '#FAEBD7', rgb: 'rgb(250,235,215)'},
  linen: {hex: '#FAF0E6', rgb: 'rgb(250,240,230)'},
  lavenderblush: {hex: '#FFF0F5', rgb: 'rgb(255,240,245)'},
  mistyrose: {hex: '#FFE4E1', rgb: 'rgb(255,228,225)'},
  gainsboro: {hex: '#DCDCDC', rgb: 'rgb(220,220,220)'},
  lightgray: {hex: '#D3D3D3', rgb: 'rgb(211,211,211)'},
  silver: {hex: '#C0C0C0', rgb: 'rgb(192,192,192)'},
  darkgray: {hex: '#A9A9A9', rgb: 'rgb(169,169,169)'},
  gray: {hex: '#808080', rgb: 'rgb(128,128,128)'},
  dimgray: {hex: '#696969', rgb: 'rgb(105,105,105)'},
  lightslategray: {hex: '#778899', rgb: 'rgb(119,136,153)'},
  slategray: {hex: '#708090', rgb: 'rgb(112,128,144)'},
  darkslategray: {hex: '#2F4F4F', rgb: 'rgb(47,79,79)'},
  black: {hex: '#000000', rgb: 'rgb(0,0,0)'},
  cornsilk: {hex: '#FFF8DC', rgb: 'rgb(255,248,220)'},
  blanchedalmond: {hex: '#FFEBCD', rgb: 'rgb(255,235,205)'},
  bisque: {hex: '#FFE4C4', rgb: 'rgb(255,228,196)'},
  navajowhite: {hex: '#FFDEAD', rgb: 'rgb(255,222,173)'},
  wheat: {hex: '#F5DEB3', rgb: 'rgb(245,222,179)'},
  burlywood: {hex: '#DEB887', rgb: 'rgb(222,184,135)'},
  tan: {hex: '#D2B48C', rgb: 'rgb(210,180,140)'},
  rosybrown: {hex: '#BC8F8F', rgb: 'rgb(188,143,143)'},
  sandybrown: {hex: '#F4A460', rgb: 'rgb(244,164,96)'},
  goldenrod: {hex: '#DAA520', rgb: 'rgb(218,165,32)'},
  peru: {hex: '#CD853F', rgb: 'rgb(205,133,63)'},
  chocolate: {hex: '#D2691E', rgb: 'rgb(210,105,30)'},
  saddlebrown: {hex: '#8B4513', rgb: 'rgb(139,69,19)'},
  sienna: {hex: '#A0522D', rgb: 'rgb(160,82,45)'},
  brown: {hex: '#A52A2A', rgb: 'rgb(165,42,42)'},
  maroon: {hex: '#800000', rgb: 'rgb(128,0,0)'}
};

const URL_PATTERN = /([a-zA-Z][a-zA-Z0-9\+\-\.]*:\/\/[^\s]+)/i;
const IMAGE_PATTERN = /\S+\.(gif|jpe?g|tiff|png|bmp|svg)$/i;
let requestInc = 0;

export class Tools {
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
   * @param {number} duration
   * @param {T} [returnValue]
   * @return {Promise<T>}
   */
  public static promiseDelay<T>(duration: number, returnValue?: T): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(returnValue);
      }, duration);
    });
  }

  /*
   * Sanitize the url params to a object
   */
  public static sanitizeUrlParams(locationSearch: string): any {
    const rawParameters = locationSearch.replace('?', '');
    return rawParameters.split('&').reduce((res, acc) => {
      const param = acc.split('=');
      if (param[0]) {
        return {
          ...res,
          [param[0]]: param[1]
        };
      }
      return res;
    }, {});
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

      n = +n.replace(',', '.');
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
   * Returns true if:
   * - n is an Integer
   * - n is a string that represents an Integer (allow '.' or ',' as decimal separator)
   *
   * @param {any} n
   * @return {boolean}
   */
  public static isInt(n: any) {
    n = Tools.parseNumber(n);

    // (not NaN) && (is floats)
    return Tools.isDefined(n) && n === n && n % 1 === 0;
  }

  /**
   * Return true if `n` is (or can be parsed as) a float, but is NOT an integer
   *
   * @param {any} n
   * @return {boolean}
   */
  public static isFloat(n: any): boolean {
    n = Tools.parseNumber(n);

    // (not NaN) && (is float excluding integers)
    return n === n && n % 1 !== 0;
  }

  /**
   * Return true if `n` is (or can be parsed as) a number
   *
   * @param {any} n
   * @return {boolean}
   */
  public static isNumber(n: any): boolean {
    n = Tools.parseNumber(n);
    return Tools.isDefined(n) && n === n;
  }

  /**
   * Return true if `n` is (or can be parsed as) a date
   *
   * @param {any} n
   * @return {boolean}
   */
  public static isDate(n: any): boolean {
    const d = new Date(n);
    if (Number.isNaN(d.getTime())) {
      return false;
    }
    return d.toISOString().slice(0, 10) === n;
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

  /**
   * Return a shortened version of a number
   *
   * @param {number} number
   * @return {string}
   */
  public static shortenNumber(number: number): string {
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
   * Return a parse decimal with a max of 6 decimal values
   *
   * @param {'floor' | 'ceil'} round
   * @param {number} min
   * @param {number} max
   * @param {number} value
   * @return {number}
   */
  public static parseDecimal(
    round: 'floor' | 'ceil',
    min: number,
    max: number,
    value: number
  ): number {
    const maxDecimal = 6;

    if (!Tools.isDefined(value) || Tools.isInt(value)) {
      return value;
    }

    if (!Tools.isDefined(min) || !Tools.isDefined(max)) {
      const size = (value + '').split('.')[1].length;
      return size > 6 ? parseFloat(value.toFixed(6)) : value;
    }

    const nrSize = Math[round](max - min).toString().length;
    if (nrSize >= maxDecimal) {
      return parseFloat(value.toFixed(1));
    } else {
      return parseFloat(value.toFixed(maxDecimal - nrSize));
    }
  }

  /**
   * Format number as a readable number with en format
   * see http://www.statisticalconsultants.co.nz/blog/how-the-world-separates-its-digits.html
   * todo: use space a delimiter in counties that accept this notation.
   *
   * @param {number} n
   * @return {string}
   */
  public static formatNumber(n: number) {
    return n.toLocaleString('en', {maximumFractionDigits: 3});
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
   * Return a clone of an object
   *
   * @param o
   * @return {any}
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
   * Return a copy of an object
   *
   * @param o
   * @return {any}
   */
  public static copy(o: any): any {
    if (typeof o === 'object') {
      return Object.assign(o);
    }
    return o;
  }

  /**
   * Return a clone of a Node or Array<Node>
   *
   * @param nodes
   * @return {any}
   */
  public static cloneNodes(nodes: any) {
    if (!Array.isArray(nodes)) {
      return this.sanitizeStyles(nodes.toJSON());
    } else {
      return this.sanitizeStyles(JSON.parse(JSON.stringify(nodes)));
    }
  }

  /**
   * Return a node or a Array<Node> with the styles reset
   *
   * @param element
   * @return {any}
   */
  public static sanitizeStyles(element: any) {
    if (Array.isArray(element)) {
      if (element[0] && element[0].attributes && element[0].attributes.halo) {
        element.map((e) => {
          e.attributes.halo = null;
          e.attributes.icon = null;
          e.attributes.outerStroke = null;
          e.attributes.text = null;
          return e;
        });
      }
    } else {
      if (element.attributes && element.attributes.halo) {
        element.attributes.halo = null;
        element.attributes.icon = null;
        element.attributes.outerStroke = null;
        element.attributes.text = null;
      }
    }
    return element;
  }

  /**
   * Return a propertyKey from a property path as string
   *
   * @param {string} key
   * @return {string}
   */
  public static getPropertyKey(key: string): string {
    return key.includes('properties')
      ? key.replace('data.properties.', '')
      : key.replace('data.', '');
  }

  /**
   * mapSeries implementation
   *
   * @param elements
   * @param mapFunction
   * @return {Promise<Array>}
   */
  public static mapSeries<T>(
    elements: Array<T>,
    mapFunction: (any: any) => Promise<any>
  ): Promise<any> {
    let p: Promise<number> = Promise.resolve(0);
    const results: Array<any> = [];
    elements.forEach((element: T) => {
      p = p.then(function () {
        const wrappedPromise = Promise.resolve().then(() => mapFunction(element));
        return wrappedPromise.then((r: any) => results.push(r));
      });
    });
    return p.then(() => results);
  }

  /**
   * Return sourceKey or sourceIndex value from current url + its type
   *
   * @param {string} locationSearch
   * @return {Array<string>}
   */
  public static getSourceParameter(locationSearch: string): Array<string> {
    const sourceParameterHeuristic = ['key', 'sourceIndex'];
    const urlParameters = locationSearch.slice(1).split('&') || [];
    return urlParameters.reduce((result: Array<string>, parameter: string) => {
      const splittedParameter: Array<string> = parameter.split('=');
      if (sourceParameterHeuristic.includes(splittedParameter[0])) {
        result = splittedParameter;
      }
      return result;
    }, []);
  }

  /**
   * take only the last response from server
   *
   * @param self
   * @param fn
   */
  public static keepLatest(self: any, fn: Function): any {
    const currentRequest = ++requestInc;
    return function () {
      if (currentRequest < requestInc) {
        return;
      }
      return fn.apply(self, arguments);
    };
  }

  /**
   * Return a readable string of an interval
   *
   * @param {number} min
   * @param {number} max
   * @param {number} uniqValue
   * @return {string}
   */
  public static intervalToString(min: number, max: number, uniqValue?: number): string {
    if (uniqValue) {
      return Tools.isNumber(uniqValue) && !Tools.isInt(uniqValue)
        ? `${uniqValue.toFixed(2)}`
        : `${uniqValue}`;
    } else if (min === max) {
      return Tools.isNumber(min) && !Tools.isInt(min) ? `${min.toFixed(2)}` : `${min}`;
    } else {
      const parsedMinValue = Tools.isNumber(min) && !Tools.isInt(min) ? min.toFixed(2) : min;
      const parsedMaxValue = Tools.isNumber(max) && !Tools.isInt(max) ? max.toFixed(2) : max;
      return `${parsedMinValue} - ${parsedMaxValue}`;
    }
  }

  /**
   * Return the min and max of a set of values
   *
   * @param {Array<number>} values
   * @return {[number , number]}
   */
  public static getBoundaries(values: Array<number>): [number, number] | undefined {
    const sanitizedValues = values.filter((v) => Tools.isDefined(v) && !isNaN(v) && v !== null);
    if (sanitizedValues.length === 0) {
      return undefined;
    }
    return [Math.min.apply(null, sanitizedValues), Math.max.apply(null, sanitizedValues)];
  }

  /**
   * Return an array of number from an array of string
   *
   * @param {Array<any>} values
   * @return {Array<number>}
   */
  public static toNumbers(values: Array<string>): Array<number> {
    return values.filter((v) => Tools.isDefined(v) && Tools.isNumber(v)).map((v) => +v);
  }

  /**
   * Remove indexes from an Array
   *
   * @param {Array<any>} arr
   * @param {Array<number>} indexes
   * @return {Array<any>}
   */
  public static pullAt(arr: Array<any>, indexes: Array<number>): Array<any> {
    const array = [...arr];
    for (let i = indexes.length - 1; i >= 0; --i) {
      array.splice(indexes[i], 1);
    }
    return array;
  }

  /**
   * Merge two array keeping only the distinct elements
   *
   * @param {Array<any>} originalArr
   * @param {Array<number>} newArr
   * @return {Array<any>}
   */
  public static pushUniq(originalArr: Array<any>, newArr: Array<any>): Array<any> {
    const array = newArr.filter((item) => !originalArr.includes(item));
    return [...originalArr, ...array];
  }

  /**
   * Check equality of two values
   *
   * @param {any} value
   * @param {any} other
   * @return {boolean}
   */
  public static isEqual(value: any, other: any): boolean {
    return isEqual(value, other);
  }

  /**
   * Check that a value is defined : not null and not undefined
   *
   * @param {any} value
   * @return {boolean}
   */
  public static isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }

  /**
   * Return true if a string is not composed only by invisible char
   *
   * @param {string} value
   * @return {boolean}
   */
  public static isStringFilled(value: string): boolean {
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return true;
  }

  /**
   * Return true if a value is not undefined, not null and not an empty string
   *
   * @param value
   * @return {boolean}
   */
  public static valueExists(value: any): boolean {
    return Tools.isDefined(value) && Tools.isStringFilled(value);
  }

  /**
   * Sort an array alphabetically depending of a key if array is an array of object
   *
   * @param {Array<any>} arr
   * @param {string} objKey
   * @param {boolean} addUndefined
   * @return {Array<any>}
   */
  public static sortAlphabetically(
    arr: Array<any>,
    objKey?: string,
    addUndefined?: boolean
  ): Array<any> {
    let set = false;
    let undefinedValue;
    const indexOfUndefinedValue = arr.findIndex((v) =>
      objKey ? typeof v === 'object' && !Tools.isDefined(v[objKey]) : !Tools.isDefined(v)
    );
    if (indexOfUndefinedValue >= 0) {
      set = true;
      undefinedValue = arr.splice(indexOfUndefinedValue, 1)[0];
    }
    const sortedArr = arr.sort((a, b) => {
      const aK = objKey ? a[objKey] : a;
      const bK = objKey ? b[objKey] : b;
      const sanitizedA = typeof aK === 'string' ? aK.toLowerCase() : aK;
      const sanitizedB = typeof bK === 'string' ? bK.toLowerCase() : bK;
      return sanitizedA < sanitizedB ? -1 : sanitizedA > sanitizedB ? 1 : 0;
    });
    if (set === true && addUndefined === true) {
      sortedArr.unshift(undefinedValue);
    }
    return sortedArr;
  }

  /**
   * Sort an form array alphabetically depending of a key if array is an array of object
   *
   * @param {Array<any>} arr
   * @param {string} objKey
   * @return {Array<any>}
   */
  public static sortFormArrayAlphabetically(arr: Array<any>, objKey?: string) {
    return arr.sort((a, b) => {
      const aK = objKey ? a.value[objKey].toLowerCase() : a;
      const bK = objKey ? b.value[objKey].toLowerCase() : b;
      return aK < bK ? -1 : aK > bK ? 1 : 0;
    });
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

  /*
   * Return an array with repeated values depending of the count
   */
  public static getExtendedArray(
    values: Array<{value: any; count: number}>
  ): Array<number | string> {
    if (!Tools.isDefined(values) || values.length === 0) {
      return [];
    }
    const extendedArray: Array<number | string> = [];
    values.forEach((value) => {
      for (let i = 0; i < value.count; i++) {
        extendedArray.push(value.value);
      }
    });
    return extendedArray;
  }

  /**
   * Recreate a nested object from a array of string, defining the path of a value and a final value
   *
   * @param {Array<string>} path
   * @param value
   * @return {any}
   */
  public static getNestedStructure(path: Array<string | number>, value: any): any {
    return path.reduceRight((result, key, i) => {
      if (i === path.length - 1) {
        return {[key]: value};
      }
      return {[key]: result};
    }, {});
  }

  /**
   * Return a value from a nested object depending on a keyPath
   */
  public static getIn(ref: unknown, path: Array<string | number>): any {
    return path.reduce((p, c) => (p && p[c] !== undefined ? p[c] : undefined), Tools.clone(ref));
  }

  public static getInUnsafe(ref: any, path: Array<string | number>): any {
    let result = ref;
    for (let i = 0; i < path.length; ++i) {
      if (result === undefined || result === null) {
        result = undefined;
        break;
      }
      result = result[path[i]];
    }
    return result;
  }

  /**
   * Force browser to repaint before calling next method
   *
   * @return {Promise<any>}
   */
  public static forceRepaint(): Promise<any> {
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        setTimeout(resolve, 10);
      });
    });
  }

  /**
   * Return a string of form 'Number px' from a number
   *
   * @param {number} num
   * @return {string}
   */
  public static numberToPixels(num: number): string {
    return `${Tools.isNumber(num) ? num : 0}px`;
  }

  /**
   * Return an object containing only properties that change in regard of an original object and cast
   * numbers
   *
   * @param sourceToDiff
   * @param originalValue
   * @return {any}
   */
  public static getDiff<T extends GenericObject, K extends keyof T>(
    sourceToDiff: Partial<T>,
    originalValue: T
  ): Partial<T> {
    // TODO change to loop rather than reduce to remove ts-ignore
    // Moving to loop doesn't fix the problem
    return Object.keys(sourceToDiff).reduce((result, key) => {
      if (
        (Tools.isDefined(originalValue[key]) &&
          !Tools.isEqual(sourceToDiff[key], originalValue[key])) ||
        (!Tools.isDefined(originalValue[key]) && Tools.isDefined(sourceToDiff[key]))
      ) {
        // @ts-ignore
        result[key] = sourceToDiff[key];
      }
      return result;
    }, {} as Partial<T>);
  }

  public static isNode(
    item: Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData>
  ): item is Node<LkNodeData, LkEdgeData> {
    return item.isNode;
  }

  public static isEdge(
    item: Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData>
  ): item is Edge<LkEdgeData, LkNodeData> {
    return !item.isNode;
  }

  public static isNodeList(
    items: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>
  ): items is NodeList<LkNodeData, LkEdgeData> {
    return items.isNode;
  }

  /**
   * Move an occurrence in an array
   *
   * @param {Array<T>} arr
   * @param {number} oldIndex
   * @param {number} newIndex
   * @return {Array<T>}
   */
  public static moveInArray<T>(arr: Array<T>, oldIndex: number, newIndex: number): Array<T> {
    const newArray = Tools.clone(arr);
    let element;

    if (
      oldIndex !== newIndex &&
      oldIndex >= 0 &&
      oldIndex <= newArray.length &&
      newIndex >= 0 &&
      newIndex <= newArray.length
    ) {
      element = newArray[oldIndex];
      if (oldIndex > newIndex) {
        newArray.splice(oldIndex, 1);
      } else {
        newArray.splice(oldIndex, 1);
        newIndex -= 1;
      }
      newArray[newIndex] = element;
    }
    return newArray;
  }

  private static safeSet<T extends GenericObject<unknown>>(
    obj: T,
    path: string[],
    value: unknown
  ): T | undefined {
    if (!Tools.isDefined(obj)) {
      return;
    }
    const c: T = <T>Tools.clone(obj);
    let changed: any = c;
    for (let i = 0; i < path.length - 1; ++i) {
      if (changed[path[i]] === undefined) {
        changed[path[i]] = {};
      }
      changed = changed[path[i]];
    }
    changed[path[path.length - 1]] = value;
    return c;
  }

  /**
   * Safely set in a value in nested object
   *
   * @param {T} obj
   * @param {K1} key
   * @return {(value: T[K1]) => T}
   */
  public static setIn<T extends object, K1 extends keyof T>(obj: T, key: K1): (value: T[K1]) => T;
  public static setIn<T extends object, K1 extends keyof T, K2 extends keyof T[K1]>(
    obj: T,
    key1: K1,
    key2: K2
  ): (value: T[K1][K2]) => T;
  public static setIn<
    T extends object,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(obj: T, key1: K1, key2: K2, key3: K3): (value: T[K1][K2][K3]) => T;
  public static setIn<
    T extends object,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(obj: T, key1: K1, key2: K2, key3: K3, key4: K4): (value: T[K1][K2][K3][K4]) => T;
  public static setIn<
    T extends object,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(obj: T, key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): (value: T[K1][K2][K3][K4][K5]) => T;
  public static setIn<
    T extends object,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    obj: T,
    key1: K1,
    key2: K2,
    key3: K3,
    key4: K4,
    key5: K5,
    key6: K6
  ): (value: T[K1][K2][K3][K4][K5][K6]) => T;
  public static setIn<
    T extends object,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    obj: T,
    key1: K1,
    key2: K2,
    key3: K3,
    key4: K4,
    key5: K5,
    key6: K6,
    key7: K7
  ): (value: T[K1][K2][K3][K4][K5][K6][K7]) => T;
  public static setIn(obj: any, ...keys: Array<string>): any {
    return (value: any) => {
      return Tools.safeSet(obj, keys, value);
    };
  }

  /**
   * Return the property type based on his values
   *
   * @param {Array<any>} values
   * @return {'number' | 'string' }
   */
  public static getPropertyType(values: Array<any>): 'number' | 'string' {
    let type: 'number' | 'string' = 'number';
    if (
      values.some((value) => {
        return value.value !== '' && Tools.isDefined(value.value) && !Tools.isNumber(value.value);
      })
    ) {
      type = 'string';
    }
    return type;
  }

  /**
   * Return true if the date is on the requested format and if is a valid date
   *
   * @param {string} date
   * @return {boolean}
   */
  public static isValidFilterDate(date: string): boolean {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!Tools.isDefined(date)) {
      return false;
    }
    if (!date.match(regEx)) {
      return false;
    }
    return Tools.isDate(date);
  }

  /**
   * Return the date as a string on the expected format
   *
   * @param {Date} date
   * @param {boolean} isSeconds
   */
  public static getFilterFormattedDate(date: Date, isSeconds?: boolean): string | undefined {
    if (isNaN(date.getFullYear())) {
      return undefined;
    }
    if (isSeconds) {
      date = new Date(date.getTime() * 1000);
    }
    return (
      date.getFullYear() +
      '-' +
      ((date.getMonth() + 1).toString().length === 1
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      (date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate())
    );
  }

  /**
   * Return the timestamp from a string date with a local timezone offset
   */
  public static getFilterFormattedTimestamp(
    date: string,
    hours: 'start' | 'end' | 'none',
    inSeconds?: boolean
  ): number | undefined {
    let dateObject = new Date(date);

    if (isNaN(dateObject.getFullYear())) {
      return undefined;
    }
    if (hours === 'start') {
      dateObject.setHours(0, 0, 0, 0);
    } else if (hours === 'end') {
      dateObject.setHours(23, 59, 59, 999);
    }
    // Convert milliseconds to seconds
    if (inSeconds) {
      dateObject = new Date(dateObject.getTime() / 1000);
    }
    // In milliseconds
    return dateObject.getTime();
  }

  /**
   * Return true if the input is a node or a edge list
   *
   * @param {NodeList | EdgeList | any} list
   * @return {boolean}
   */
  public static isItemList(
    list: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>
  ): boolean {
    return Tools.isDefined(list.getId);
  }

  /**
   * Return true if the color tone is "bright"
   *
   * @param {string} color
   * @returns {boolean}
   */
  public static isBright(color: Color): boolean {
    if (color === null || !Tools.isStringFilled(color)) {
      return true;
    }
    const hexRegExp = /#[A-Fa-f0-9]{3,6}/;
    const rgbRegExp = /^rgb\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*\)$/i;
    const rgbaRegExp = /^rgba\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)$/i;
    let rgb: string;

    if (hexRegExp.test(color)) {
      if (color.length < 5) {
        color += color.slice(1);
      }
      color = color.replace('#', '');
      const r = parseInt(color[0].toString() + color[1].toString(), 16);
      const g = parseInt(color[2].toString() + color[3].toString(), 16);
      const b = parseInt(color[4].toString() + color[5].toString(), 16);
      rgb = `rgb(${r}, ${g}, ${b})`;
    } else if (
      rgbRegExp.test(color) ||
      rgbaRegExp.test(color) ||
      HTML_COLORS[color.toLowerCase()] !== undefined
    ) {
      rgb = Tools.isDefined(HTML_COLORS[color.toLowerCase()])
        ? HTML_COLORS[color.toLowerCase()]['rgb']
        : color;
    } else {
      return true;
    }

    const [r, g, b] = rgb
      .replace(/\s/g, '')
      .match(/rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,\d{1,3})?\)/)!
      .slice(1, 4);

    if (!Tools.isDefined(r) || !Tools.isDefined(g) || !Tools.isDefined(b)) {
      console.warn('The given color is not a valid rgb formatted color');
      return true;
    }
    return (+r * 299 + +g * 587 + +b * 114) / 1000 > 255 * 0.7;
  }

  /**
   * Return the same list with markers to highlight
   *
   * @param {Array<any>} list
   * @param {string} query
   * @returns {Array<any>}
   */
  public static highlightSearch(list: Array<any>, query: string): Array<any> {
    if (!Tools.isDefined(list) || list.length === 0 || !Tools.isStringFilled(query)) {
      return list;
    }
    list.map((item, i) => {
      if (typeof item === 'string') {
        if (item.toLowerCase().includes(query.toLowerCase())) {
          const index = item.toLowerCase().indexOf(query.toLowerCase());
          const spliced = item.slice(index, index + query.length);
          list[i] = item.replace(spliced, '[match]' + spliced + '[/match]');
        }
      } else {
        const keys = Object.keys(item);
        keys.forEach((key) => {
          if (item[key].toLowerCase().includes(query.toLowerCase())) {
            const index = item[key].toLowerCase().indexOf(query.toLowerCase());
            const spliced = item[key].slice(index, index + query.length);
            item[key] = item[key].replace(spliced, '[match]' + spliced + '[/match]');
          }
        });
        return item;
      }
    });
    return list;
  }

  /**
   * Return the entry list filtered by key and value using the entry query
   *
   * @param {Array<{ key: string, value: any }>} list
   * @param {string} query
   * @returns {Array<{ key: string, value: any }>}
   */
  public static getFilteredList(
    list: Array<{key: string; value: any}>,
    query: string
  ): Array<{key: string; value: any}> {
    if (!Tools.isDefined(list) || !Tools.isDefined(query) || list.length === 0) {
      return [];
    }
    return list.filter(
      (item) =>
        Tools.valueExists(item.value) &&
        (item.key.toString().toLowerCase().includes(query.toLowerCase()) ||
          item.value.toString().toLowerCase().includes(query.toLowerCase()))
    );
  }

  public static getFilteredProperties(
    list: Array<{key: string; value: LkProperty}>,
    query: string
  ): Array<{key: string; value: LkProperty}> {
    if (!Tools.isDefined(list) || !Tools.isDefined(query) || list.length === 0) {
      return [];
    }
    return list.filter((item) => {
      const value = this.getValueFromLkProperty(item.value);
      return (
        item.key.toString().toLowerCase().includes(query.toLowerCase()) ||
        (Tools.isDefined(value) && `${value}`.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }

  /**
   * Get the amount of hidden neighbors from a list of nodes
   *
   * @param nodes
   */
  public static getHiddenNeighbors(nodes: NodeList<LkNodeData, LkEdgeData>): number {
    return nodes.reduce((result: number, node: Node<LkNodeData, LkEdgeData>) => {
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
  public static getDegreeWithoutSelfConnection(node: Node<LkNodeData, LkEdgeData>): number {
    return node.getAdjacentNodes({policy: 'exclude-sources', filter: 'all'}).size;
  }

  /**
   * Return an array sorted by strings that start with a specific string
   *
   * @param {Array<string>} array
   * @param {string} startWith
   * @returns {Array<string>}
   */
  public static sortByStartWith(array: Array<string>, startWith: string): Array<string> {
    if (!Tools.isDefined(array)) {
      return [];
    }
    if (!Tools.isDefined(startWith)) {
      return array;
    }
    return array.sort((a, b) => {
      //order by start with
      if (b.toLowerCase().startsWith(startWith.toLowerCase())) {
        return 1;
      }
      if (a.toLowerCase().startsWith(startWith.toLowerCase())) {
        return -1;
      }
      //order alphabetically when both values don't start with
      if (b.toLowerCase() > a.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Anonymize a string by hashing it
   *
   * @param s
   */
  public static hash(s: string): string {
    let hash = 0;
    if (s.length === 0) {
      return `${hash}`;
    }
    for (let i = 0; i < this.length; i++) {
      const char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      // convert to 32bit integer
      hash = hash & hash;
    }
    // convert to hex
    return hash.toString(16);
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
}
