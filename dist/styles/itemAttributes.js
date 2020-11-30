/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */
'use strict';
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
var sha1_1 = __importDefault(require("sha1"));
var __1 = require("..");
exports.BASE_GREY = '#7f7f7f';
exports.PALETTE = [
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
var ItemAttributes = /** @class */ (function () {
    function ItemAttributes(rulesMap) {
        this.colorsCache = new Map();
        this._rulesMap = {};
        this.refresh(rulesMap);
    }
    /**
     * Refresh the rules
     */
    ItemAttributes.prototype.refresh = function (rulesMap) {
        if (rulesMap.color !== undefined) {
            this.colorsCache = new Map();
        }
        this._rulesMap = {
            color: rulesMap.color ? __spreadArrays(rulesMap.color).reverse() : this._rulesMap.color,
            icon: rulesMap.icon ? __spreadArrays(rulesMap.icon).reverse() : this._rulesMap.icon,
            image: rulesMap.image ? __spreadArrays(rulesMap.image).reverse() : this._rulesMap.image,
            shape: rulesMap.shape ? __spreadArrays(rulesMap.shape).reverse() : this._rulesMap.shape,
            size: rulesMap.size ? __spreadArrays(rulesMap.size).reverse() : this._rulesMap.size,
            width: rulesMap.width ? __spreadArrays(rulesMap.width).reverse() : this._rulesMap.width
        };
    };
    /**
     * Return the color for a node when style color is auto
     */
    ItemAttributes.autoColor = function (value, ignoreCase) {
        if (!__1.Tools.isDefined(value)) {
            return exports.BASE_GREY;
        }
        return exports.PALETTE[ItemAttributes.sha1Modulo(value, exports.PALETTE.length, ignoreCase)];
    };
    /**
     * Return a number from 0 to number of occurrence in a palette based on a property
     */
    ItemAttributes.sha1Modulo = function (input, modulo, ignoreCase) {
        if (ignoreCase) {
            input = input.toLowerCase();
        }
        return +('0x' + sha1_1.default(input).substr(-4)) % modulo;
    };
    /**
     * Get color of a type
     */
    ItemAttributes.getTypeColor = function (rule, type) {
        if (typeof rule.style.color === 'object' && rule.style.color.input[0] !== 'properties') {
            return ItemAttributes.autoColor(type, rule.style.color.ignoreCase);
        }
        if (!__1.Tools.isDefined(rule.input) && typeof rule.style.color !== 'object') {
            return rule.style.color;
        }
        return null;
    };
    return ItemAttributes;
}());
exports.ItemAttributes = ItemAttributes;
//# sourceMappingURL=itemAttributes.js.map