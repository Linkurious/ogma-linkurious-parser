/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2017
 *
 * Created by maximeallex on 2017-03-13.
 */
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
import { GenericObject, LkEdgeData, LkNodeData, LkProperty } from '@linkurious/rest-client';
import { Color } from 'types/utilities';
import { Edge, EdgeList, Node, NodeList } from '../ogma/models';
export { merge, sortBy, isEqual, defaults, isObject, map, uniq, includes, values, partition, concat, get, keys, isString, mapValues, sumBy, sortedUniqBy };
export declare const DEFAULT_DEBOUNCE_TIME = 375;
export declare const NO_CATEGORIES = "no_categories";
export declare const CAPTION_HEURISTIC: string[];
export declare const UNAVAILABLE_KEY = "no key";
export declare const UNAVAILABLE_VALUE = "no value";
export declare const UNACCEPTABLE_URL: (string | null | undefined)[];
export declare const UNGUARDED_PAGES: string[];
export declare const BUILTIN_GROUP_INDEX_MAP: {
    admin: number;
    'source manager': number;
    'read, edit and delete': number;
    'read and edit': number;
    read: number;
};
export declare class Tools {
    /**
     * Return 'image' or 'url' depending on the given string
     *
     * @param {string} value
     * @return {"image" | "url"}
     */
    static getType(value: string): 'image' | 'url' | 'imageUrl' | undefined;
    /**
     * @param {number} duration
     * @param {T} [returnValue]
     * @return {Promise<T>}
     */
    static promiseDelay<T>(duration: number, returnValue?: T): Promise<T>;
    static sanitizeUrlParams(locationSearch: string): any;
    /**
     * Return true if the given string is an url that match the schema handled by LKE
     *
     * @param {string}  value
     * @return {boolean}
     */
    private static isUrl;
    /**
     * Return true if the given string is an url with an image extension
     *
     * @param {string}  value
     * @return {boolean}
     */
    private static isImage;
    /**
     * Return true if `n` is (or can be parsed as) a float, but is NOT an integer
     *
     * @param {any} n
     * @return {number} a number (NaN is `n` cannot be parsed as a number)
     */
    static parseNumber(n: unknown): number;
    /**
     * Returns true if:
     * - n is an Integer
     * - n is a string that represents an Integer (allow '.' or ',' as decimal separator)
     *
     * @param {any} n
     * @return {boolean}
     */
    static isInt(n: any): boolean;
    /**
     * Return true if `n` is (or can be parsed as) a float, but is NOT an integer
     *
     * @param {any} n
     * @return {boolean}
     */
    static isFloat(n: any): boolean;
    /**
     * Return true if `n` is (or can be parsed as) a number
     *
     * @param {any} n
     * @return {boolean}
     */
    static isNumber(n: any): boolean;
    /**
     * Return true if `n` is (or can be parsed as) a date
     *
     * @param {any} n
     * @return {boolean}
     */
    static isDate(n: any): boolean;
    /**
     * Parse the given value and return a float number or NaN
     *
     * @param {any} n
     * @return {number}
     */
    static parseFloat(n: unknown): number;
    /**
     * Return a shortened version of a number
     *
     * @param {number} number
     * @return {string}
     */
    static shortenNumber(number: number): string;
    /**
     * Return a parse decimal with a max of 6 decimal values
     *
     * @param {'floor' | 'ceil'} round
     * @param {number} min
     * @param {number} max
     * @param {number} value
     * @return {number}
     */
    static parseDecimal(round: 'floor' | 'ceil', min: number, max: number, value: number): number;
    /**
     * Format number as a readable number with en format
     * see http://www.statisticalconsultants.co.nz/blog/how-the-world-separates-its-digits.html
     * todo: use space a delimiter in counties that accept this notation.
     *
     * @param {number} n
     * @return {string}
     */
    static formatNumber(n: number): string;
    /**
     * From "+03:00" return the offset in milliseconds
     * @param timezone
     */
    static timezoneToMilliseconds(timezone: string | undefined): number;
    static sanitizeFormattedNumber(str: string): number;
    /**
     * Return a formatted date as a string
     */
    static formatDate(isoString: string, isDatetime?: boolean, timezone?: number): string | null;
    /**
     * Return a clone of an object
     *
     * @param o
     * @return {any}
     */
    static clone(o: any): any;
    /**
     * Return a copy of an object
     *
     * @param o
     * @return {any}
     */
    static copy(o: any): any;
    /**
     * Return a clone of a Node or Array<Node>
     *
     * @param nodes
     * @return {any}
     */
    static cloneNodes(nodes: any): any;
    /**
     * Return a node or a Array<Node> with the styles reset
     *
     * @param element
     * @return {any}
     */
    static sanitizeStyles(element: any): any;
    /**
     * Return a propertyKey from a property path as string
     *
     * @param {string} key
     * @return {string}
     */
    static getPropertyKey(key: string): string;
    /**
     * mapSeries implementation
     *
     * @param elements
     * @param mapFunction
     * @return {Promise<Array>}
     */
    static mapSeries<T>(elements: Array<T>, mapFunction: (any: any) => Promise<any>): Promise<any>;
    /**
     * Return sourceKey or sourceIndex value from current url + its type
     *
     * @param {string} locationSearch
     * @return {Array<string>}
     */
    static getSourceParameter(locationSearch: string): Array<string>;
    /**
     * take only the last response from server
     *
     * @param self
     * @param fn
     */
    static keepLatest(self: any, fn: Function): any;
    /**
     * Return a readable string of an interval
     *
     * @param {number} min
     * @param {number} max
     * @param {number} uniqValue
     * @return {string}
     */
    static intervalToString(min: number, max: number, uniqValue?: number): string;
    /**
     * Return the min and max of a set of values
     *
     * @param {Array<number>} values
     * @return {[number , number]}
     */
    static getBoundaries(values: Array<number>): [number, number] | undefined;
    /**
     * Return an array of number from an array of string
     *
     * @param {Array<any>} values
     * @return {Array<number>}
     */
    static toNumbers(values: Array<string>): Array<number>;
    /**
     * Remove indexes from an Array
     *
     * @param {Array<any>} arr
     * @param {Array<number>} indexes
     * @return {Array<any>}
     */
    static pullAt(arr: Array<any>, indexes: Array<number>): Array<any>;
    /**
     * Merge two array keeping only the distinct elements
     *
     * @param {Array<any>} originalArr
     * @param {Array<number>} newArr
     * @return {Array<any>}
     */
    static pushUniq(originalArr: Array<any>, newArr: Array<any>): Array<any>;
    /**
     * Check equality of two values
     *
     * @param {any} value
     * @param {any} other
     * @return {boolean}
     */
    static isEqual(value: any, other: any): boolean;
    /**
     * Check that a value is defined : not null and not undefined
     *
     * @param {any} value
     * @return {boolean}
     */
    static isDefined(value: any): boolean;
    /**
     * Return true if a string is not composed only by invisible char
     *
     * @param {string} value
     * @return {boolean}
     */
    static isStringFilled(value: string): boolean;
    /**
     * Return true if a value is not undefined, not null and not an empty string
     *
     * @param value
     * @return {boolean}
     */
    static valueExists(value: any): boolean;
    /**
     * Sort an array alphabetically depending of a key if array is an array of object
     *
     * @param {Array<any>} arr
     * @param {string} objKey
     * @param {boolean} addUndefined
     * @return {Array<any>}
     */
    static sortAlphabetically(arr: Array<any>, objKey?: string, addUndefined?: boolean): Array<any>;
    /**
     * Sort an form array alphabetically depending of a key if array is an array of object
     *
     * @param {Array<any>} arr
     * @param {string} objKey
     * @return {Array<any>}
     */
    static sortFormArrayAlphabetically(arr: Array<any>, objKey?: string): any[];
    /**
     * Return an Array without duplicated keys
     *
     * @param {Array<any>} arr
     * @param {string} key
     * @return {Array<any>}
     */
    static uniqBy(arr: Array<any>, key?: string): Array<any>;
    static getExtendedArray(values: Array<{
        value: any;
        count: number;
    }>): Array<number | string>;
    /**
     * Recreate a nested object from a array of string, defining the path of a value and a final value
     *
     * @param {Array<string>} path
     * @param value
     * @return {any}
     */
    static getNestedStructure(path: Array<string | number>, value: any): any;
    /**
     * Return a value from a nested object depending on a keyPath
     */
    static getIn(ref: unknown, path: Array<string | number>): any;
    static getInUnsafe(ref: any, path: Array<string | number>): any;
    /**
     * Force browser to repaint before calling next method
     *
     * @return {Promise<any>}
     */
    static forceRepaint(): Promise<any>;
    /**
     * Return a string of form 'Number px' from a number
     *
     * @param {number} num
     * @return {string}
     */
    static numberToPixels(num: number): string;
    /**
     * Return an object containing only properties that change in regard of an original object and cast
     * numbers
     *
     * @param sourceToDiff
     * @param originalValue
     * @return {any}
     */
    static getDiff<T extends GenericObject, K extends keyof T>(sourceToDiff: Partial<T>, originalValue: T): Partial<T>;
    static isNode(item: Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData>): item is Node<LkNodeData, LkEdgeData>;
    static isEdge(item: Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData>): item is Edge<LkEdgeData, LkNodeData>;
    static isNodeList(items: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>): items is NodeList<LkNodeData, LkEdgeData>;
    /**
     * Move an occurrence in an array
     *
     * @param {Array<T>} arr
     * @param {number} oldIndex
     * @param {number} newIndex
     * @return {Array<T>}
     */
    static moveInArray<T>(arr: Array<T>, oldIndex: number, newIndex: number): Array<T>;
    private static safeSet;
    /**
     * Safely set in a value in nested object
     *
     * @param {T} obj
     * @param {K1} key
     * @return {(value: T[K1]) => T}
     */
    static setIn<T extends object, K1 extends keyof T>(obj: T, key: K1): (value: T[K1]) => T;
    static setIn<T extends object, K1 extends keyof T, K2 extends keyof T[K1]>(obj: T, key1: K1, key2: K2): (value: T[K1][K2]) => T;
    static setIn<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(obj: T, key1: K1, key2: K2, key3: K3): (value: T[K1][K2][K3]) => T;
    static setIn<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(obj: T, key1: K1, key2: K2, key3: K3, key4: K4): (value: T[K1][K2][K3][K4]) => T;
    static setIn<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4]>(obj: T, key1: K1, key2: K2, key3: K3, key4: K4, key5: K5): (value: T[K1][K2][K3][K4][K5]) => T;
    static setIn<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5]>(obj: T, key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6): (value: T[K1][K2][K3][K4][K5][K6]) => T;
    static setIn<T extends object, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6]>(obj: T, key1: K1, key2: K2, key3: K3, key4: K4, key5: K5, key6: K6, key7: K7): (value: T[K1][K2][K3][K4][K5][K6][K7]) => T;
    /**
     * Return the property type based on his values
     *
     * @param {Array<any>} values
     * @return {'number' | 'string' }
     */
    static getPropertyType(values: Array<any>): 'number' | 'string';
    /**
     * Return true if the date is on the requested format and if is a valid date
     *
     * @param {string} date
     * @return {boolean}
     */
    static isValidFilterDate(date: string): boolean;
    /**
     * Return the date as a string on the expected format
     *
     * @param {Date} date
     * @param {boolean} isSeconds
     */
    static getFilterFormattedDate(date: Date, isSeconds?: boolean): string | undefined;
    /**
     * Return the timestamp from a string date with a local timezone offset
     */
    static getFilterFormattedTimestamp(date: string, hours: 'start' | 'end' | 'none', inSeconds?: boolean): number | undefined;
    /**
     * Return true if the input is a node or a edge list
     *
     * @param {NodeList | EdgeList | any} list
     * @return {boolean}
     */
    static isItemList(list: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>): boolean;
    /**
     * Return true if the color tone is "bright"
     *
     * @param {string} color
     * @returns {boolean}
     */
    static isBright(color: Color): boolean;
    /**
     * Return the same list with markers to highlight
     *
     * @param {Array<any>} list
     * @param {string} query
     * @returns {Array<any>}
     */
    static highlightSearch(list: Array<any>, query: string): Array<any>;
    /**
     * Return the entry list filtered by key and value using the entry query
     *
     * @param {Array<{ key: string, value: any }>} list
     * @param {string} query
     * @returns {Array<{ key: string, value: any }>}
     */
    static getFilteredList(list: Array<{
        key: string;
        value: any;
    }>, query: string): Array<{
        key: string;
        value: any;
    }>;
    static getFilteredProperties(list: Array<{
        key: string;
        value: LkProperty;
    }>, query: string): Array<{
        key: string;
        value: LkProperty;
    }>;
    /**
     * Get the amount of hidden neighbors from a list of nodes
     *
     * @param nodes
     */
    static getHiddenNeighbors(nodes: NodeList<LkNodeData, LkEdgeData>): number;
    /**
     * Return the visible degree of a node without self connection (self edge)
     *
     * @param {Node} node
     * @return {number}
     */
    static getDegreeWithoutSelfConnection(node: Node<LkNodeData, LkEdgeData>): number;
    /**
     * Return an array sorted by strings that start with a specific string
     *
     * @param {Array<string>} array
     * @param {string} startWith
     * @returns {Array<string>}
     */
    static sortByStartWith(array: Array<string>, startWith: string): Array<string>;
    /**
     * Anonymize a string by hashing it
     *
     * @param s
     */
    static hash(s: string): string;
    /**
     * Truncate a text
     */
    static truncate(value: unknown, position: 'middle' | 'end', limit?: number): string;
    /**
     * return the correct property value
     */
    static getPropertyValue(property: LkProperty, invalidAsString?: boolean, formattedDates?: boolean): undefined | null | string | number | boolean | Array<string>;
    static getValueFromLkProperty(property: LkProperty): null | string | number | boolean;
}
