/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2017
 *
 * Created by maximeallex on 2017-03-13.
 */
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var merge_1 = __importDefault(require("lodash/merge"));
exports.merge = merge_1.default;
var sortBy_1 = __importDefault(require("lodash/sortBy"));
exports.sortBy = sortBy_1.default;
var isEqual_1 = __importDefault(require("lodash/isEqual"));
exports.isEqual = isEqual_1.default;
var defaults_1 = __importDefault(require("lodash/defaults"));
exports.defaults = defaults_1.default;
var isObject_1 = __importDefault(require("lodash/isObject"));
exports.isObject = isObject_1.default;
var map_1 = __importDefault(require("lodash/map"));
exports.map = map_1.default;
var uniq_1 = __importDefault(require("lodash/uniq"));
exports.uniq = uniq_1.default;
var includes_1 = __importDefault(require("lodash/includes"));
exports.includes = includes_1.default;
var values_1 = __importDefault(require("lodash/values"));
exports.values = values_1.default;
var partition_1 = __importDefault(require("lodash/partition"));
exports.partition = partition_1.default;
var concat_1 = __importDefault(require("lodash/concat"));
exports.concat = concat_1.default;
var get_1 = __importDefault(require("lodash/get"));
exports.get = get_1.default;
var keys_1 = __importDefault(require("lodash/keys"));
exports.keys = keys_1.default;
var isString_1 = __importDefault(require("lodash/isString"));
exports.isString = isString_1.default;
var mapValues_1 = __importDefault(require("lodash/mapValues"));
exports.mapValues = mapValues_1.default;
var sumBy_1 = __importDefault(require("lodash/sumBy"));
exports.sumBy = sumBy_1.default;
var sortedUniqBy_1 = __importDefault(require("lodash/sortedUniqBy"));
exports.sortedUniqBy = sortedUniqBy_1.default;
exports.DEFAULT_DEBOUNCE_TIME = 375;
exports.NO_CATEGORIES = 'no_categories';
exports.CAPTION_HEURISTIC = [
    'label',
    'Label',
    'name',
    'Name',
    'title',
    'Title',
    'rdfs:label'
];
exports.UNAVAILABLE_KEY = 'no key';
exports.UNAVAILABLE_VALUE = 'no value';
exports.UNACCEPTABLE_URL = [null, undefined, 'localhost', '127.0.0.1'];
exports.UNGUARDED_PAGES = [
    'admin/data',
    'admin/data/new',
    'admin/datasources',
    'datasource/'
];
exports.BUILTIN_GROUP_INDEX_MAP = {
    admin: 0,
    'source manager': 1,
    'read, edit and delete': 2,
    'read and edit': 3,
    read: 4
};
var HTML_COLORS = {
    lightsalmon: { hex: '#FFA07A', rgb: 'rbg(255,160,122)' },
    salmon: { hex: '#FA8072', rgb: 'rgb(250,128,114)' },
    darksalmon: { hex: '#E9967A', rgb: 'rgb(233,150,122)' },
    lightcoral: { hex: '#F08080', rgb: 'rgb(240,128,128)' },
    indianred: { hex: '#CD5C5C', rgb: 'rgb(205,92,92)' },
    crimson: { hex: '#DC143C', rgb: 'rgb(220,20,60)' },
    firebrick: { hex: '#B22222', rgb: 'rgb(178,34,34)' },
    red: { hex: '#FF0000', rgb: 'rgb(255,0,0)' },
    darkred: { hex: '#8B0000', rgb: 'rgb(139,0,0)' },
    coral: { hex: '#FF7F50', rgb: 'rgb(255,127,80)' },
    tomato: { hex: '#FF6347', rgb: 'rgb(255,99,71)' },
    orangered: { hex: '#FF4500', rgb: 'rgb(255,69,0)' },
    gold: { hex: '#FFD700', rgb: 'rgb(255,215,0)' },
    orange: { hex: '#FFA500', rgb: 'rgb(255,165,0)' },
    darkorange: { hex: '#FF8C00', rgb: 'rgb(255,140,0)' },
    lightyellow: { hex: '#FFFFE0', rgb: 'rgb(255,255,224)' },
    lemonchiffon: { hex: '#FFFACD', rgb: 'rgb(255,250,205)' },
    lightgoldenrodyellow: { hex: '#FAFAD2', rgb: 'rgb(250,250,210)' },
    papayawhip: { hex: '#FFEFD5', rgb: 'rgb(255,239,213)' },
    moccasin: { hex: '#FFE4B5', rgb: 'rgb(255,228,181)' },
    peachpuff: { hex: '#FFDAB9', rgb: 'rgb(255,218,185)' },
    palegoldenrod: { hex: '#EEE8AA', rgb: 'rgb(238,232,170)' },
    khaki: { hex: '#F0E68C', rgb: 'rgb(240,230,140)' },
    darkkhaki: { hex: '#BDB76B', rgb: 'rgb(189,183,107)' },
    yellow: { hex: '#FFFF00', rgb: 'rgb(255,255,0)' },
    lawngreen: { hex: '#7CFC00', rgb: 'rgb(124,252,0)' },
    chartreuse: { hex: '#7FFF00', rgb: 'rgb(127,255,0)' },
    limegreen: { hex: '#32CD32', rgb: 'rgb(50,205,50)' },
    lime: { hex: '#00FF00', rgb: 'rgb(0.255.0)' },
    forestgreen: { hex: '#228B22', rgb: 'rgb(34,139,34)' },
    green: { hex: '#008000', rgb: 'rgb(0,128,0)' },
    darkgreen: { hex: '#006400', rgb: 'rgb(0,100,0)' },
    greenyellow: { hex: '#ADFF2F', rgb: 'rgb(173,255,47)' },
    yellowgreen: { hex: '#9ACD32', rgb: 'rgb(154,205,50)' },
    springgreen: { hex: '#00FF7F', rgb: 'rgb(0,255,127)' },
    mediumspringgreen: { hex: '#00FA9A', rgb: 'rgb(0,250,154)' },
    lightgreen: { hex: '#90EE90', rgb: 'rgb(144,238,144)' },
    palegreen: { hex: '#98FB98', rgb: 'rgb(152,251,152)' },
    darkseagreen: { hex: '#8FBC8F', rgb: 'rgb(143,188,143)' },
    mediumseagreen: { hex: '#3CB371', rgb: 'rgb(60,179,113)' },
    seagreen: { hex: '#2E8B57', rgb: 'rgb(46,139,87)' },
    olive: { hex: '#808000', rgb: 'rgb(128,128,0)' },
    darkolivegreen: { hex: '#556B2F', rgb: 'rgb(85,107,47)' },
    olivedrab: { hex: '#6B8E23', rgb: 'rgb(107,142,35)' },
    lightcyan: { hex: '#E0FFFF', rgb: 'rgb(224,255,255)' },
    cyan: { hex: '#00FFFF', rgb: 'rgb(0,255,255)' },
    aqua: { hex: '#00FFFF', rgb: 'rgb(0,255,255)' },
    aquamarine: { hex: '#7FFFD4', rgb: 'rgb(127,255,212)' },
    mediumaquamarine: { hex: '#66CDAA', rgb: 'rgb(102,205,170)' },
    paleturquoise: { hex: '#AFEEEE', rgb: 'rgb(175,238,238)' },
    turquoise: { hex: '#40E0D0', rgb: 'rgb(64,224,208)' },
    mediumturquoise: { hex: '#48D1CC', rgb: 'rgb(72,209,204)' },
    darkturquoise: { hex: '#00CED1', rgb: 'rgb(0,206,209)' },
    lightseagreen: { hex: '#20B2AA', rgb: 'rgb(32,178,170)' },
    cadetblue: { hex: '#5F9EA0', rgb: 'rgb(95,158,160)' },
    darkcyan: { hex: '#008B8B', rgb: 'rgb(0,139,139)' },
    teal: { hex: '#008080', rgb: 'rgb(0,128,128)' },
    powderblue: { hex: '#B0E0E6', rgb: 'rgb(176,224,230)' },
    lightblue: { hex: '#ADD8E6', rgb: 'rgb(173,216,230)' },
    lightskyblue: { hex: '#87CEFA', rgb: 'rgb(135,206,250)' },
    skyblue: { hex: '#87CEEB', rgb: 'rgb(135,206,235)' },
    deepskyblue: { hex: '#00BFFF', rgb: 'rgb(0,191,255)' },
    lightsteelblue: { hex: '#B0C4DE', rgb: 'rgb(176,196,222)' },
    dodgerblue: { hex: '#1E90FF', rgb: 'rgb(30,144,255)' },
    cornflowerblue: { hex: '#6495ED', rgb: 'rgb(100,149,237)' },
    steelblue: { hex: '#4682B4', rgb: 'rgb(70,130,180)' },
    royalblue: { hex: '#4169E1', rgb: 'rgb(65,105,225)' },
    blue: { hex: '#0000FF', rgb: 'rgb(0,0,255)' },
    mediumblue: { hex: '#0000CD', rgb: 'rgb(0,0,205)' },
    darkblue: { hex: '#00008B', rgb: 'rgb(0,0,139)' },
    navy: { hex: '#000080', rgb: 'rgb(0,0,128)' },
    midnightblue: { hex: '#191970', rgb: 'rgb(25,25,112)' },
    mediumslateblue: { hex: '#7B68EE', rgb: 'rgb(123,104,238)' },
    slateblue: { hex: '#6A5ACD', rgb: 'rgb(106,90,205)' },
    darkslateblue: { hex: '#483D8B', rgb: 'rgb(72,61,139)' },
    lavender: { hex: '#E6E6FA', rgb: 'rgb(230,230,250)' },
    thistle: { hex: '#D8BFD8', rgb: 'rgb(216,191,216)' },
    plum: { hex: '#DDA0DD', rgb: 'rgb(221,160,221)' },
    violet: { hex: '#EE82EE', rgb: 'rgb(238,130,238)' },
    orchid: { hex: '#DA70D6', rgb: 'rgb(218,112,214)' },
    fuchsia: { hex: '#FF00FF', rgb: 'rgb(255,0,255)' },
    magenta: { hex: '#FF00FF', rgb: 'rgb(255,0,255)' },
    mediumorchid: { hex: '#BA55D3', rgb: 'rgb(186,85,211)' },
    mediumpurple: { hex: '#9370DB', rgb: 'rgb(147,112,219)' },
    blueviolet: { hex: '#8A2BE2', rgb: 'rgb(138,43,226)' },
    darkviolet: { hex: '#9400D3', rgb: 'rgb(148,0,211)' },
    darkorchid: { hex: '#9932CC', rgb: 'rgb(153,50,204)' },
    darkmagenta: { hex: '#8B008B', rgb: 'rgb(139,0,139)' },
    purple: { hex: '#800080', rgb: 'rgb(128,0,128)' },
    indigo: { hex: '#4B0082', rgb: 'rgb(75,0,130)' },
    pink: { hex: '#FFC0CB', rgb: 'rgb(255,192,203)' },
    lightpink: { hex: '#FFB6C1', rgb: 'rgb(255,182,193)' },
    hotpink: { hex: '#FF69B4', rgb: 'rgb(255,105,180)' },
    deeppink: { hex: '#FF1493', rgb: 'rgb(255,20,147)' },
    palevioletred: { hex: '#DB7093', rgb: 'rgb(219,112,147)' },
    mediumvioletred: { hex: '#C71585', rgb: 'rgb(199,21,133)' },
    white: { hex: '#FFFFFF', rgb: 'rgb(255,255,255)' },
    snow: { hex: '#FFFAFA', rgb: 'rgb(255,250,250)' },
    honeydew: { hex: '#F0FFF0', rgb: 'rgb(240,255,240)' },
    mintcream: { hex: '#F5FFFA', rgb: 'rgb(245,255,250)' },
    azure: { hex: '#F0FFFF', rgb: 'rgb(240,255,255)' },
    aliceblue: { hex: '#F0F8FF', rgb: 'rgb(240,248,255)' },
    ghostwhite: { hex: '#F8F8FF', rgb: 'rgb(248,248,255)' },
    whitesmoke: { hex: '#F5F5F5', rgb: 'rgb(245,245,245)' },
    seashell: { hex: '#FFF5EE', rgb: 'rgb(255,245,238)' },
    beige: { hex: '#F5F5DC', rgb: 'rgb(245,245,220)' },
    oldlace: { hex: '#FDF5E6', rgb: 'rgb(253,245,230)' },
    floralwhite: { hex: '#FFFAF0', rgb: 'rgb(255,250,240)' },
    ivory: { hex: '#FFFFF0', rgb: 'rgb(255,255,240)' },
    antiquewhite: { hex: '#FAEBD7', rgb: 'rgb(250,235,215)' },
    linen: { hex: '#FAF0E6', rgb: 'rgb(250,240,230)' },
    lavenderblush: { hex: '#FFF0F5', rgb: 'rgb(255,240,245)' },
    mistyrose: { hex: '#FFE4E1', rgb: 'rgb(255,228,225)' },
    gainsboro: { hex: '#DCDCDC', rgb: 'rgb(220,220,220)' },
    lightgray: { hex: '#D3D3D3', rgb: 'rgb(211,211,211)' },
    silver: { hex: '#C0C0C0', rgb: 'rgb(192,192,192)' },
    darkgray: { hex: '#A9A9A9', rgb: 'rgb(169,169,169)' },
    gray: { hex: '#808080', rgb: 'rgb(128,128,128)' },
    dimgray: { hex: '#696969', rgb: 'rgb(105,105,105)' },
    lightslategray: { hex: '#778899', rgb: 'rgb(119,136,153)' },
    slategray: { hex: '#708090', rgb: 'rgb(112,128,144)' },
    darkslategray: { hex: '#2F4F4F', rgb: 'rgb(47,79,79)' },
    black: { hex: '#000000', rgb: 'rgb(0,0,0)' },
    cornsilk: { hex: '#FFF8DC', rgb: 'rgb(255,248,220)' },
    blanchedalmond: { hex: '#FFEBCD', rgb: 'rgb(255,235,205)' },
    bisque: { hex: '#FFE4C4', rgb: 'rgb(255,228,196)' },
    navajowhite: { hex: '#FFDEAD', rgb: 'rgb(255,222,173)' },
    wheat: { hex: '#F5DEB3', rgb: 'rgb(245,222,179)' },
    burlywood: { hex: '#DEB887', rgb: 'rgb(222,184,135)' },
    tan: { hex: '#D2B48C', rgb: 'rgb(210,180,140)' },
    rosybrown: { hex: '#BC8F8F', rgb: 'rgb(188,143,143)' },
    sandybrown: { hex: '#F4A460', rgb: 'rgb(244,164,96)' },
    goldenrod: { hex: '#DAA520', rgb: 'rgb(218,165,32)' },
    peru: { hex: '#CD853F', rgb: 'rgb(205,133,63)' },
    chocolate: { hex: '#D2691E', rgb: 'rgb(210,105,30)' },
    saddlebrown: { hex: '#8B4513', rgb: 'rgb(139,69,19)' },
    sienna: { hex: '#A0522D', rgb: 'rgb(160,82,45)' },
    brown: { hex: '#A52A2A', rgb: 'rgb(165,42,42)' },
    maroon: { hex: '#800000', rgb: 'rgb(128,0,0)' }
};
var URL_PATTERN = /([a-zA-Z][a-zA-Z0-9\+\-\.]*:\/\/[^\s]+)/i;
var IMAGE_PATTERN = /\S+\.(gif|jpe?g|tiff|png|bmp|svg)$/i;
var requestInc = 0;
var Tools = /** @class */ (function () {
    function Tools() {
    }
    /**
     * Return 'image' or 'url' depending on the given string
     *
     * @param {string} value
     * @return {"image" | "url"}
     */
    Tools.getType = function (value) {
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
    };
    /**
     * @param {number} duration
     * @param {T} [returnValue]
     * @return {Promise<T>}
     */
    Tools.promiseDelay = function (duration, returnValue) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(returnValue);
            }, duration);
        });
    };
    /*
     * Sanitize the url params to a object
     */
    Tools.sanitizeUrlParams = function (locationSearch) {
        var rawParameters = locationSearch.replace('?', '');
        return rawParameters.split('&').reduce(function (res, acc) {
            var _a;
            var param = acc.split('=');
            if (param[0]) {
                return __assign(__assign({}, res), (_a = {}, _a[param[0]] = param[1], _a));
            }
            return res;
        }, {});
    };
    /**
     * Return true if the given string is an url that match the schema handled by LKE
     *
     * @param {string}  value
     * @return {boolean}
     */
    Tools.isUrl = function (value) {
        return URL_PATTERN.test(value);
    };
    /**
     * Return true if the given string is an url with an image extension
     *
     * @param {string}  value
     * @return {boolean}
     */
    Tools.isImage = function (value) {
        return IMAGE_PATTERN.test(value);
    };
    /**
     * Return true if `n` is (or can be parsed as) a float, but is NOT an integer
     *
     * @param {any} n
     * @return {number} a number (NaN is `n` cannot be parsed as a number)
     */
    Tools.parseNumber = function (n) {
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
    };
    /**
     * Returns true if:
     * - n is an Integer
     * - n is a string that represents an Integer (allow '.' or ',' as decimal separator)
     *
     * @param {any} n
     * @return {boolean}
     */
    Tools.isInt = function (n) {
        n = Tools.parseNumber(n);
        // (not NaN) && (is floats)
        return Tools.isDefined(n) && n === n && n % 1 === 0;
    };
    /**
     * Return true if `n` is (or can be parsed as) a float, but is NOT an integer
     *
     * @param {any} n
     * @return {boolean}
     */
    Tools.isFloat = function (n) {
        n = Tools.parseNumber(n);
        // (not NaN) && (is float excluding integers)
        return n === n && n % 1 !== 0;
    };
    /**
     * Return true if `n` is (or can be parsed as) a number
     *
     * @param {any} n
     * @return {boolean}
     */
    Tools.isNumber = function (n) {
        n = Tools.parseNumber(n);
        return Tools.isDefined(n) && n === n;
    };
    /**
     * Return true if `n` is (or can be parsed as) a date
     *
     * @param {any} n
     * @return {boolean}
     */
    Tools.isDate = function (n) {
        var d = new Date(n);
        if (Number.isNaN(d.getTime())) {
            return false;
        }
        return d.toISOString().slice(0, 10) === n;
    };
    /**
     * Parse the given value and return a float number or NaN
     *
     * @param {any} n
     * @return {number}
     */
    Tools.parseFloat = function (n) {
        return Tools.parseNumber(n);
    };
    /**
     * Return a shortened version of a number
     *
     * @param {number} number
     * @return {string}
     */
    Tools.shortenNumber = function (number) {
        var div = 1;
        var suffix = '';
        var sign = number < 0 ? '-' : '';
        number = Math.abs(number);
        if (number >= 1000000) {
            div = 1000000;
            suffix = 'M';
        }
        else if (number >= 1000) {
            div = 1000;
            suffix = 'k';
        }
        var nn = number / div;
        // if there is a decimal value and nn < 10
        if (nn < 10 && nn % 1 !== 0) {
            return sign + nn.toFixed(1) + suffix;
        }
        else {
            return sign + Math.floor(nn) + suffix;
        }
    };
    /**
     * Return a parse decimal with a max of 6 decimal values
     *
     * @param {'floor' | 'ceil'} round
     * @param {number} min
     * @param {number} max
     * @param {number} value
     * @return {number}
     */
    Tools.parseDecimal = function (round, min, max, value) {
        var maxDecimal = 6;
        if (!Tools.isDefined(value) || Tools.isInt(value)) {
            return value;
        }
        if (!Tools.isDefined(min) || !Tools.isDefined(max)) {
            var size = (value + '').split('.')[1].length;
            return size > 6 ? parseFloat(value.toFixed(6)) : value;
        }
        var nrSize = Math[round](max - min).toString().length;
        if (nrSize >= maxDecimal) {
            return parseFloat(value.toFixed(1));
        }
        else {
            return parseFloat(value.toFixed(maxDecimal - nrSize));
        }
    };
    /**
     * Format number as a readable number with en format
     * see http://www.statisticalconsultants.co.nz/blog/how-the-world-separates-its-digits.html
     * todo: use space a delimiter in counties that accept this notation.
     *
     * @param {number} n
     * @return {string}
     */
    Tools.formatNumber = function (n) {
        return n.toLocaleString('en', { maximumFractionDigits: 3 });
    };
    /**
     * From "+03:00" return the offset in milliseconds
     * @param timezone
     */
    Tools.timezoneToMilliseconds = function (timezone) {
        if (timezone === undefined) {
            return 0;
        }
        if (timezone === 'Z') {
            return 0;
        }
        var sign = timezone[0];
        var _a = timezone.slice(1).split(':'), hours = _a[0], minutes = _a[1];
        return sign === '+'
            ? this.sanitizeFormattedNumber(hours) * 3.6e6 + this.sanitizeFormattedNumber(minutes) * 60000
            : (this.sanitizeFormattedNumber(hours) * 3.6e6 +
                this.sanitizeFormattedNumber(minutes) * 60000) *
                -1;
    };
    Tools.sanitizeFormattedNumber = function (str) {
        if (str.length === 2 && str.startsWith('0')) {
            return Tools.parseNumber(str[1]);
        }
        return Tools.parseNumber(str);
    };
    /**
     * Return a formatted date as a string
     */
    Tools.formatDate = function (isoString, isDatetime, timezone) {
        // The date received from the server will be always in seconds
        var offsetDate = isoString;
        if (timezone !== undefined) {
            offsetDate = new Date(isoString).getTime() + timezone * 1000;
        }
        var dateObject = new Date(offsetDate);
        if (isNaN(dateObject.getUTCFullYear())) {
            return null;
        }
        var formattedDate = dateObject.getFullYear() +
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
    };
    /**
     * Return a clone of an object
     *
     * @param o
     * @return {any}
     */
    Tools.clone = function (o) {
        return typeof o === 'object'
            ? JSON.parse(JSON.stringify(o, function (k, v) {
                return v instanceof Set ? {} : v;
            }))
            : o;
    };
    /**
     * Return a copy of an object
     *
     * @param o
     * @return {any}
     */
    Tools.copy = function (o) {
        if (typeof o === 'object') {
            return Object.assign(o);
        }
        return o;
    };
    /**
     * Return a clone of a Node or Array<Node>
     *
     * @param nodes
     * @return {any}
     */
    Tools.cloneNodes = function (nodes) {
        if (!Array.isArray(nodes)) {
            return this.sanitizeStyles(nodes.toJSON());
        }
        else {
            return this.sanitizeStyles(JSON.parse(JSON.stringify(nodes)));
        }
    };
    /**
     * Return a node or a Array<Node> with the styles reset
     *
     * @param element
     * @return {any}
     */
    Tools.sanitizeStyles = function (element) {
        if (Array.isArray(element)) {
            if (element[0] && element[0].attributes && element[0].attributes.halo) {
                element.map(function (e) {
                    e.attributes.halo = null;
                    e.attributes.icon = null;
                    e.attributes.outerStroke = null;
                    e.attributes.text = null;
                    return e;
                });
            }
        }
        else {
            if (element.attributes && element.attributes.halo) {
                element.attributes.halo = null;
                element.attributes.icon = null;
                element.attributes.outerStroke = null;
                element.attributes.text = null;
            }
        }
        return element;
    };
    /**
     * Return a propertyKey from a property path as string
     *
     * @param {string} key
     * @return {string}
     */
    Tools.getPropertyKey = function (key) {
        return key.includes('properties')
            ? key.replace('data.properties.', '')
            : key.replace('data.', '');
    };
    /**
     * mapSeries implementation
     *
     * @param elements
     * @param mapFunction
     * @return {Promise<Array>}
     */
    Tools.mapSeries = function (elements, mapFunction) {
        var p = Promise.resolve(0);
        var results = [];
        elements.forEach(function (element) {
            p = p.then(function () {
                var wrappedPromise = Promise.resolve().then(function () { return mapFunction(element); });
                return wrappedPromise.then(function (r) { return results.push(r); });
            });
        });
        return p.then(function () { return results; });
    };
    /**
     * Return sourceKey or sourceIndex value from current url + its type
     *
     * @param {string} locationSearch
     * @return {Array<string>}
     */
    Tools.getSourceParameter = function (locationSearch) {
        var sourceParameterHeuristic = ['key', 'sourceIndex'];
        var urlParameters = locationSearch.slice(1).split('&') || [];
        return urlParameters.reduce(function (result, parameter) {
            var splittedParameter = parameter.split('=');
            if (sourceParameterHeuristic.includes(splittedParameter[0])) {
                result = splittedParameter;
            }
            return result;
        }, []);
    };
    /**
     * take only the last response from server
     *
     * @param self
     * @param fn
     */
    Tools.keepLatest = function (self, fn) {
        var currentRequest = ++requestInc;
        return function () {
            if (currentRequest < requestInc) {
                return;
            }
            return fn.apply(self, arguments);
        };
    };
    /**
     * Return a readable string of an interval
     *
     * @param {number} min
     * @param {number} max
     * @param {number} uniqValue
     * @return {string}
     */
    Tools.intervalToString = function (min, max, uniqValue) {
        if (uniqValue) {
            return Tools.isNumber(uniqValue) && !Tools.isInt(uniqValue)
                ? "" + uniqValue.toFixed(2)
                : "" + uniqValue;
        }
        else if (min === max) {
            return Tools.isNumber(min) && !Tools.isInt(min) ? "" + min.toFixed(2) : "" + min;
        }
        else {
            var parsedMinValue = Tools.isNumber(min) && !Tools.isInt(min) ? min.toFixed(2) : min;
            var parsedMaxValue = Tools.isNumber(max) && !Tools.isInt(max) ? max.toFixed(2) : max;
            return parsedMinValue + " - " + parsedMaxValue;
        }
    };
    /**
     * Return the min and max of a set of values
     *
     * @param {Array<number>} values
     * @return {[number , number]}
     */
    Tools.getBoundaries = function (values) {
        var sanitizedValues = values.filter(function (v) { return Tools.isDefined(v) && !isNaN(v) && v !== null; });
        if (sanitizedValues.length === 0) {
            return undefined;
        }
        return [Math.min.apply(null, sanitizedValues), Math.max.apply(null, sanitizedValues)];
    };
    /**
     * Return an array of number from an array of string
     *
     * @param {Array<any>} values
     * @return {Array<number>}
     */
    Tools.toNumbers = function (values) {
        return values.filter(function (v) { return Tools.isDefined(v) && Tools.isNumber(v); }).map(function (v) { return +v; });
    };
    /**
     * Remove indexes from an Array
     *
     * @param {Array<any>} arr
     * @param {Array<number>} indexes
     * @return {Array<any>}
     */
    Tools.pullAt = function (arr, indexes) {
        var array = __spreadArrays(arr);
        for (var i = indexes.length - 1; i >= 0; --i) {
            array.splice(indexes[i], 1);
        }
        return array;
    };
    /**
     * Merge two array keeping only the distinct elements
     *
     * @param {Array<any>} originalArr
     * @param {Array<number>} newArr
     * @return {Array<any>}
     */
    Tools.pushUniq = function (originalArr, newArr) {
        var array = newArr.filter(function (item) { return !originalArr.includes(item); });
        return __spreadArrays(originalArr, array);
    };
    /**
     * Check equality of two values
     *
     * @param {any} value
     * @param {any} other
     * @return {boolean}
     */
    Tools.isEqual = function (value, other) {
        return isEqual_1.default(value, other);
    };
    /**
     * Check that a value is defined : not null and not undefined
     *
     * @param {any} value
     * @return {boolean}
     */
    Tools.isDefined = function (value) {
        return value !== undefined && value !== null;
    };
    /**
     * Return true if a string is not composed only by invisible char
     *
     * @param {string} value
     * @return {boolean}
     */
    Tools.isStringFilled = function (value) {
        if (typeof value === 'string') {
            return value.trim() !== '';
        }
        return true;
    };
    /**
     * Return true if a value is not undefined, not null and not an empty string
     *
     * @param value
     * @return {boolean}
     */
    Tools.valueExists = function (value) {
        return Tools.isDefined(value) && Tools.isStringFilled(value);
    };
    /**
     * Sort an array alphabetically depending of a key if array is an array of object
     *
     * @param {Array<any>} arr
     * @param {string} objKey
     * @param {boolean} addUndefined
     * @return {Array<any>}
     */
    Tools.sortAlphabetically = function (arr, objKey, addUndefined) {
        var set = false;
        var undefinedValue;
        var indexOfUndefinedValue = arr.findIndex(function (v) {
            return objKey ? typeof v === 'object' && !Tools.isDefined(v[objKey]) : !Tools.isDefined(v);
        });
        if (indexOfUndefinedValue >= 0) {
            set = true;
            undefinedValue = arr.splice(indexOfUndefinedValue, 1)[0];
        }
        var sortedArr = arr.sort(function (a, b) {
            var aK = objKey ? a[objKey] : a;
            var bK = objKey ? b[objKey] : b;
            var sanitizedA = typeof aK === 'string' ? aK.toLowerCase() : aK;
            var sanitizedB = typeof bK === 'string' ? bK.toLowerCase() : bK;
            return sanitizedA < sanitizedB ? -1 : sanitizedA > sanitizedB ? 1 : 0;
        });
        if (set === true && addUndefined === true) {
            sortedArr.unshift(undefinedValue);
        }
        return sortedArr;
    };
    /**
     * Sort an form array alphabetically depending of a key if array is an array of object
     *
     * @param {Array<any>} arr
     * @param {string} objKey
     * @return {Array<any>}
     */
    Tools.sortFormArrayAlphabetically = function (arr, objKey) {
        return arr.sort(function (a, b) {
            var aK = objKey ? a.value[objKey].toLowerCase() : a;
            var bK = objKey ? b.value[objKey].toLowerCase() : b;
            return aK < bK ? -1 : aK > bK ? 1 : 0;
        });
    };
    /**
     * Return an Array without duplicated keys
     *
     * @param {Array<any>} arr
     * @param {string} key
     * @return {Array<any>}
     */
    Tools.uniqBy = function (arr, key) {
        var seen = new Set();
        if (key) {
            var result = [];
            for (var i = 0; i < arr.length; ++i) {
                if (arr[i] && arr[i][key] && !seen.has(arr[i][key])) {
                    seen.add(arr[i][key]);
                    result.push(arr[i]);
                }
                else if (!arr[i][key]) {
                    result.push(arr[i]);
                }
            }
            return result;
        }
        return typeof arr[0] === 'object'
            ? Array.from(new Set(arr.map(function (v) { return JSON.stringify(v); }))).map(function (v) { return JSON.parse(v); })
            : Array.from(new Set(arr));
    };
    /*
     * Return an array with repeated values depending of the count
     */
    Tools.getExtendedArray = function (values) {
        if (!Tools.isDefined(values) || values.length === 0) {
            return [];
        }
        var extendedArray = [];
        values.forEach(function (value) {
            for (var i = 0; i < value.count; i++) {
                extendedArray.push(value.value);
            }
        });
        return extendedArray;
    };
    /**
     * Recreate a nested object from a array of string, defining the path of a value and a final value
     *
     * @param {Array<string>} path
     * @param value
     * @return {any}
     */
    Tools.getNestedStructure = function (path, value) {
        return path.reduceRight(function (result, key, i) {
            var _a, _b;
            if (i === path.length - 1) {
                return _a = {}, _a[key] = value, _a;
            }
            return _b = {}, _b[key] = result, _b;
        }, {});
    };
    /**
     * Return a value from a nested object depending on a keyPath
     */
    Tools.getIn = function (ref, path) {
        return path.reduce(function (p, c) { return (p && p[c] !== undefined ? p[c] : undefined); }, Tools.clone(ref));
    };
    Tools.getInUnsafe = function (ref, path) {
        var result = ref;
        for (var i = 0; i < path.length; ++i) {
            if (result === undefined || result === null) {
                result = undefined;
                break;
            }
            result = result[path[i]];
        }
        return result;
    };
    /**
     * Force browser to repaint before calling next method
     *
     * @return {Promise<any>}
     */
    Tools.forceRepaint = function () {
        return new Promise(function (resolve) {
            window.requestAnimationFrame(function () {
                setTimeout(resolve, 10);
            });
        });
    };
    /**
     * Return a string of form 'Number px' from a number
     *
     * @param {number} num
     * @return {string}
     */
    Tools.numberToPixels = function (num) {
        return (Tools.isNumber(num) ? num : 0) + "px";
    };
    /**
     * Return an object containing only properties that change in regard of an original object and cast
     * numbers
     *
     * @param sourceToDiff
     * @param originalValue
     * @return {any}
     */
    Tools.getDiff = function (sourceToDiff, originalValue) {
        // TODO change to loop rather than reduce to remove ts-ignore
        // Moving to loop doesn't fix the problem
        return Object.keys(sourceToDiff).reduce(function (result, key) {
            if ((Tools.isDefined(originalValue[key]) &&
                !Tools.isEqual(sourceToDiff[key], originalValue[key])) ||
                (!Tools.isDefined(originalValue[key]) && Tools.isDefined(sourceToDiff[key]))) {
                // @ts-ignore
                result[key] = sourceToDiff[key];
            }
            return result;
        }, {});
    };
    Tools.isNode = function (item) {
        return item.isNode;
    };
    Tools.isEdge = function (item) {
        return !item.isNode;
    };
    Tools.isNodeList = function (items) {
        return items.isNode;
    };
    /**
     * Move an occurrence in an array
     *
     * @param {Array<T>} arr
     * @param {number} oldIndex
     * @param {number} newIndex
     * @return {Array<T>}
     */
    Tools.moveInArray = function (arr, oldIndex, newIndex) {
        var newArray = Tools.clone(arr);
        var element;
        if (oldIndex !== newIndex &&
            oldIndex >= 0 &&
            oldIndex <= newArray.length &&
            newIndex >= 0 &&
            newIndex <= newArray.length) {
            element = newArray[oldIndex];
            if (oldIndex > newIndex) {
                newArray.splice(oldIndex, 1);
            }
            else {
                newArray.splice(oldIndex, 1);
                newIndex -= 1;
            }
            newArray[newIndex] = element;
        }
        return newArray;
    };
    Tools.safeSet = function (obj, path, value) {
        if (!Tools.isDefined(obj)) {
            return;
        }
        var c = Tools.clone(obj);
        var changed = c;
        for (var i = 0; i < path.length - 1; ++i) {
            if (changed[path[i]] === undefined) {
                changed[path[i]] = {};
            }
            changed = changed[path[i]];
        }
        changed[path[path.length - 1]] = value;
        return c;
    };
    Tools.setIn = function (obj) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        return function (value) {
            return Tools.safeSet(obj, keys, value);
        };
    };
    /**
     * Return the property type based on his values
     *
     * @param {Array<any>} values
     * @return {'number' | 'string' }
     */
    Tools.getPropertyType = function (values) {
        var type = 'number';
        if (values.some(function (value) {
            return value.value !== '' && Tools.isDefined(value.value) && !Tools.isNumber(value.value);
        })) {
            type = 'string';
        }
        return type;
    };
    /**
     * Return true if the date is on the requested format and if is a valid date
     *
     * @param {string} date
     * @return {boolean}
     */
    Tools.isValidFilterDate = function (date) {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!Tools.isDefined(date)) {
            return false;
        }
        if (!date.match(regEx)) {
            return false;
        }
        return Tools.isDate(date);
    };
    /**
     * Return the date as a string on the expected format
     *
     * @param {Date} date
     * @param {boolean} isSeconds
     */
    Tools.getFilterFormattedDate = function (date, isSeconds) {
        if (isNaN(date.getFullYear())) {
            return undefined;
        }
        if (isSeconds) {
            date = new Date(date.getTime() * 1000);
        }
        return (date.getFullYear() +
            '-' +
            ((date.getMonth() + 1).toString().length === 1
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1) +
            '-' +
            (date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate()));
    };
    /**
     * Return the timestamp from a string date with a local timezone offset
     */
    Tools.getFilterFormattedTimestamp = function (date, hours, inSeconds) {
        var dateObject = new Date(date);
        if (isNaN(dateObject.getFullYear())) {
            return undefined;
        }
        if (hours === 'start') {
            dateObject.setHours(0, 0, 0, 0);
        }
        else if (hours === 'end') {
            dateObject.setHours(23, 59, 59, 999);
        }
        // Convert milliseconds to seconds
        if (inSeconds) {
            dateObject = new Date(dateObject.getTime() / 1000);
        }
        // In milliseconds
        return dateObject.getTime();
    };
    /**
     * Return true if the input is a node or a edge list
     *
     * @param {NodeList | EdgeList | any} list
     * @return {boolean}
     */
    Tools.isItemList = function (list) {
        return Tools.isDefined(list.getId);
    };
    /**
     * Return true if the color tone is "bright"
     *
     * @param {string} color
     * @returns {boolean}
     */
    Tools.isBright = function (color) {
        if (color === null || !Tools.isStringFilled(color)) {
            return true;
        }
        var hexRegExp = /#[A-Fa-f0-9]{3,6}/;
        var rgbRegExp = /^rgb\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*\)$/i;
        var rgbaRegExp = /^rgba\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)$/i;
        var rgb;
        if (hexRegExp.test(color)) {
            if (color.length < 5) {
                color += color.slice(1);
            }
            color = color.replace('#', '');
            var r_1 = parseInt(color[0].toString() + color[1].toString(), 16);
            var g_1 = parseInt(color[2].toString() + color[3].toString(), 16);
            var b_1 = parseInt(color[4].toString() + color[5].toString(), 16);
            rgb = "rgb(" + r_1 + ", " + g_1 + ", " + b_1 + ")";
        }
        else if (rgbRegExp.test(color) ||
            rgbaRegExp.test(color) ||
            HTML_COLORS[color.toLowerCase()] !== undefined) {
            rgb = Tools.isDefined(HTML_COLORS[color.toLowerCase()])
                ? HTML_COLORS[color.toLowerCase()]['rgb']
                : color;
        }
        else {
            return true;
        }
        var _a = rgb
            .replace(/\s/g, '')
            .match(/rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,\d{1,3})?\)/)
            .slice(1, 4), r = _a[0], g = _a[1], b = _a[2];
        if (!Tools.isDefined(r) || !Tools.isDefined(g) || !Tools.isDefined(b)) {
            console.warn('The given color is not a valid rgb formatted color');
            return true;
        }
        return (+r * 299 + +g * 587 + +b * 114) / 1000 > 255 * 0.7;
    };
    /**
     * Return the same list with markers to highlight
     *
     * @param {Array<any>} list
     * @param {string} query
     * @returns {Array<any>}
     */
    Tools.highlightSearch = function (list, query) {
        if (!Tools.isDefined(list) || list.length === 0 || !Tools.isStringFilled(query)) {
            return list;
        }
        list.map(function (item, i) {
            if (typeof item === 'string') {
                if (item.toLowerCase().includes(query.toLowerCase())) {
                    var index = item.toLowerCase().indexOf(query.toLowerCase());
                    var spliced = item.slice(index, index + query.length);
                    list[i] = item.replace(spliced, '[match]' + spliced + '[/match]');
                }
            }
            else {
                var keys_2 = Object.keys(item);
                keys_2.forEach(function (key) {
                    if (item[key].toLowerCase().includes(query.toLowerCase())) {
                        var index = item[key].toLowerCase().indexOf(query.toLowerCase());
                        var spliced = item[key].slice(index, index + query.length);
                        item[key] = item[key].replace(spliced, '[match]' + spliced + '[/match]');
                    }
                });
                return item;
            }
        });
        return list;
    };
    /**
     * Return the entry list filtered by key and value using the entry query
     *
     * @param {Array<{ key: string, value: any }>} list
     * @param {string} query
     * @returns {Array<{ key: string, value: any }>}
     */
    Tools.getFilteredList = function (list, query) {
        if (!Tools.isDefined(list) || !Tools.isDefined(query) || list.length === 0) {
            return [];
        }
        return list.filter(function (item) {
            return Tools.valueExists(item.value) &&
                (item.key.toString().toLowerCase().includes(query.toLowerCase()) ||
                    item.value.toString().toLowerCase().includes(query.toLowerCase()));
        });
    };
    Tools.getFilteredProperties = function (list, query) {
        var _this = this;
        if (!Tools.isDefined(list) || !Tools.isDefined(query) || list.length === 0) {
            return [];
        }
        return list.filter(function (item) {
            var value = _this.getValueFromLkProperty(item.value);
            return (item.key.toString().toLowerCase().includes(query.toLowerCase()) ||
                (Tools.isDefined(value) && ("" + value).toLowerCase().includes(query.toLowerCase())));
        });
    };
    /**
     * Get the amount of hidden neighbors from a list of nodes
     *
     * @param nodes
     */
    Tools.getHiddenNeighbors = function (nodes) {
        return nodes.reduce(function (result, node) {
            var statistics = node.getData('statistics');
            if (statistics !== undefined) {
                var hiddenNeighbors = statistics.degree !== undefined && !statistics.supernode
                    ? statistics.degree - Tools.getDegreeWithoutSelfConnection(node)
                    : statistics.supernodeDegree;
                if (hiddenNeighbors !== undefined && hiddenNeighbors > 0) {
                    return (result += hiddenNeighbors);
                }
            }
            return result;
        }, 0);
    };
    /**
     * Return the visible degree of a node without self connection (self edge)
     *
     * @param {Node} node
     * @return {number}
     */
    Tools.getDegreeWithoutSelfConnection = function (node) {
        return node.getAdjacentNodes({ policy: 'exclude-sources', filter: 'all' }).size;
    };
    /**
     * Return an array sorted by strings that start with a specific string
     *
     * @param {Array<string>} array
     * @param {string} startWith
     * @returns {Array<string>}
     */
    Tools.sortByStartWith = function (array, startWith) {
        if (!Tools.isDefined(array)) {
            return [];
        }
        if (!Tools.isDefined(startWith)) {
            return array;
        }
        return array.sort(function (a, b) {
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
    };
    /**
     * Anonymize a string by hashing it
     *
     * @param s
     */
    Tools.hash = function (s) {
        var hash = 0;
        if (s.length === 0) {
            return "" + hash;
        }
        for (var i = 0; i < this.length; i++) {
            var char = s.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            // convert to 32bit integer
            hash = hash & hash;
        }
        // convert to hex
        return hash.toString(16);
    };
    /**
     * Truncate a text
     */
    Tools.truncate = function (value, position, limit) {
        if (limit === void 0) { limit = 0; }
        var suffix = '\u2026';
        if (!Tools.isDefined(value)) {
            return "";
        }
        var valueToTruncate = "" + value;
        if (valueToTruncate.length <= limit + 1) {
            return valueToTruncate;
        }
        var fixedLimit = limit - 1;
        switch (position) {
            case 'middle':
                return (valueToTruncate.substring(0, Math.ceil(fixedLimit / 2)) +
                    suffix +
                    valueToTruncate.substring(valueToTruncate.length - Math.floor(fixedLimit / 2)));
            case 'end':
                return valueToTruncate.substring(0, fixedLimit) + suffix;
        }
    };
    /**
     * return the correct property value
     */
    Tools.getPropertyValue = function (property, invalidAsString, formattedDates) {
        if (typeof property === 'object' && !Array.isArray(property)) {
            if (!('status' in property)) {
                if ((property.type === 'date' || property.type === 'datetime') && formattedDates) {
                    return Tools.formatDate(property.value, property.type === 'datetime');
                }
                else if (property.type === 'date' || property.type === 'datetime') {
                    return new Date(property.value).getTime();
                }
            }
            else if (invalidAsString) {
                return 'original' in property ? property.original : undefined;
            }
            else {
                return undefined;
            }
        }
        return property;
    };
    Tools.getValueFromLkProperty = function (property) {
        if (typeof property === 'object' && 'type' in property) {
            if (!('original' in property) && !('value' in property)) {
                return null;
            }
            if ('original' in property) {
                return "" + property.original;
            }
            if ('value' in property) {
                return Tools.formatDate(new Date(new Date(property.value).getTime() + Tools.timezoneToMilliseconds(property.timezone)).toISOString());
            }
        }
        return property;
    };
    return Tools;
}());
exports.Tools = Tools;
//# sourceMappingURL=tools.js.map