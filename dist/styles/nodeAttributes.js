/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var itemAttributes_1 = require("./itemAttributes");
var NodeAttributes = /** @class */ (function (_super) {
    __extends(NodeAttributes, _super);
    function NodeAttributes(rulesMap) {
        return _super.call(this, rulesMap) || this;
    }
    /**
     * Run the callback if an item match with a style in the array of rules
     */
    NodeAttributes.prototype.matchStyle = function (styleRules, itemData, callback) {
        if (!__1.Tools.isDefined(itemData)) {
            return;
        }
        if (!__1.Tools.isDefined(styleRules)) {
            return;
        }
        for (var i = 0; i < styleRules.length; ++i) {
            if (styleRules[i].canApplyTo(itemData)) {
                callback(styleRules[i]);
                break;
            }
        }
    };
    /**
     * Generate color for a given node (call only if _rulesMap.color is defined
     */
    NodeAttributes.prototype.color = function (itemData) {
        if (!__1.Tools.isDefined(itemData)) {
            return [itemAttributes_1.BASE_GREY];
        }
        var hash = sha1_1.default(JSON.stringify(itemData));
        var cachedColor = this.colorsCache.get(hash);
        if (cachedColor !== undefined) {
            return cachedColor;
        }
        var colors = [];
        for (var i = 0; i < itemData.categories.length; ++i) {
            var c = null;
            for (var j = 0; j < this._rulesMap.color.length; ++j) {
                var rule = this._rulesMap.color[j];
                if (rule.itemType !== undefined &&
                    rule.itemType !== null &&
                    rule.itemType !== itemData.categories[i]) {
                    continue;
                }
                if (rule.canApplyTo(itemData)) {
                    if (typeof rule.style.color === 'object') {
                        var propValue = __1.Tools.getInUnsafe(itemData, rule.style.color.input);
                        if (Array.isArray(propValue)) {
                            c = itemAttributes_1.ItemAttributes.autoColor(itemData.categories[i], rule.style.ignoreCase);
                        }
                        else {
                            c = itemAttributes_1.ItemAttributes.autoColor("" + propValue, rule.style.ignoreCase);
                        }
                    }
                    else {
                        c = rule.style.color;
                    }
                    break;
                }
            }
            colors.push(c);
        }
        colors = colors.filter(function (c) { return __1.Tools.isDefined(c); });
        if (colors.length === 0) {
            colors = [itemAttributes_1.BASE_GREY];
        }
        var finalColor = colors.length === 1 ? colors[0] : colors;
        this.colorsCache.set(hash, finalColor);
        return finalColor;
    };
    /**
     * Generate icon for a given node
     */
    NodeAttributes.prototype.icon = function (itemData) {
        var rawColors = this.color(itemData);
        var color = Array.isArray(rawColors) ? rawColors[0] : rawColors;
        var result = {};
        var rules = __spreadArrays((this._rulesMap.image || []), (this._rulesMap.icon || []));
        if (!__1.Tools.isDefined(itemData)) {
            return {
                icon: {},
                image: {}
            };
        }
        for (var i = 0; i < rules.length; ++i) {
            if (rules[i].canApplyTo(itemData)) {
                if ('icon' in rules[i].style) {
                    result = {
                        icon: {
                            content: rules[i].style.icon.content,
                            font: rules[i].style.icon.font,
                            scale: 0.5,
                            color: __1.Tools.isBright(color) ? '#000000' : '#FFFFFF'
                        }
                    };
                }
                else if ('image' in rules[i].style) {
                    result = {
                        image: {
                            url: __1.Tools.getType(rules[i].style.image.url) === 'imageUrl' ||
                                __1.Tools.getType(rules[i].style.image.url) === 'image'
                                ? rules[i].style.image.url
                                : __1.Tools.getIn(itemData, rules[i].style.image.url.path),
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
    };
    /**
     * Generate shape for a given node
     */
    NodeAttributes.prototype.shape = function (itemData) {
        var result = undefined;
        if (this._rulesMap.shape !== undefined) {
            this.matchStyle(this._rulesMap.shape, itemData, function (styleRule) {
                result = styleRule.style.shape;
            });
        }
        return result;
    };
    /**
     * Generate size for a given node
     */
    NodeAttributes.prototype.size = function (itemData) {
        var result = undefined;
        if (this._rulesMap.size !== undefined) {
            this.matchStyle(this._rulesMap.size, itemData, function (styleRule) {
                result = styleRule.style.size;
            });
        }
        return result;
    };
    /**
     * Return an object containing all node attributes needed by Ogma to style a node
     */
    NodeAttributes.prototype.all = function (itemData) {
        if (!__1.Tools.isDefined(itemData)) {
            return {
                color: itemAttributes_1.BASE_GREY
            };
        }
        var generatedIcon = this.icon(itemData);
        return {
            radius: this.size(itemData),
            color: this.color(itemData),
            shape: this.shape(itemData),
            icon: generatedIcon.icon,
            image: generatedIcon.image
        };
    };
    return NodeAttributes;
}(itemAttributes_1.ItemAttributes));
exports.NodeAttributes = NodeAttributes;
//# sourceMappingURL=nodeAttributes.js.map