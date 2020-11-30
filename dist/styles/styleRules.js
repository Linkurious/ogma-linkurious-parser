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
Object.defineProperty(exports, "__esModule", { value: true });
var rest_client_1 = require("@linkurious/rest-client");
var tools_1 = require("../tools/tools");
var __1 = require("..");
var styleRule_1 = require("./styleRule");
var itemAttributes_1 = require("./itemAttributes");
var StyleType;
(function (StyleType) {
    StyleType["COLOR"] = "color";
    StyleType["ICON"] = "icon";
    StyleType["SIZE"] = "size";
    StyleType["IMAGE"] = "image";
    StyleType["SHAPE"] = "shape";
    StyleType["WIDTH"] = "width";
})(StyleType = exports.StyleType || (exports.StyleType = {}));
exports.SORTING_RULE = ['specificity', 'itemType', 'index'];
var StyleRules = /** @class */ (function () {
    function StyleRules(rules) {
        this._rules = rules;
    }
    Object.defineProperty(StyleRules.prototype, "color", {
        /**
         * Return an array of StyleRule with only 'color' rules and sorted by specificity, itemType and index
         *
         * @return {Array<StyleRule>}
         */
        get: function () {
            return tools_1.sortBy(StyleRules.getBy(StyleType.COLOR, this._rules), exports.SORTING_RULE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleRules.prototype, "icon", {
        /**
         * Return an array of StyleRule with only 'icon' rules and sorted by specificity, itemType and index
         *
         * @return {Array<StyleRule>}
         */
        get: function () {
            return tools_1.sortBy(__spreadArrays((StyleRules.getBy(StyleType.ICON, this._rules) || []), (StyleRules.getBy(StyleType.IMAGE, this._rules) || [])), exports.SORTING_RULE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleRules.prototype, "image", {
        /**
         * Return an array of StyleRule with only 'image' rules and sorted by specificity, itemType and index
         *
         * @return {Array<StyleRule>}
         */
        get: function () {
            return tools_1.sortBy(StyleRules.getBy(StyleType.IMAGE, this._rules), exports.SORTING_RULE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleRules.prototype, "shape", {
        /**
         * Return an array of StyleRule with only 'shape' rules and sorted by specificity, itemType and index
         *
         * @return {Array<StyleRule>}
         */
        get: function () {
            return tools_1.sortBy(StyleRules.getBy(StyleType.SHAPE, this._rules), exports.SORTING_RULE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleRules.prototype, "size", {
        /**
         * Return an array of StyleRule with only 'size' rules and sorted by specificity, itemType and index
         *
         * @return {Array<StyleRule>}
         */
        get: function () {
            return tools_1.sortBy(StyleRules.getBy(StyleType.SIZE, this._rules), exports.SORTING_RULE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleRules.prototype, "width", {
        /**
         * Return an array of StyleRule with only 'width' rules and sorted by specificity, itemType and index
         *
         * @return {Array<StyleRule>}
         */
        get: function () {
            return tools_1.sortBy(StyleRules.getBy(StyleType.WIDTH, this._rules), exports.SORTING_RULE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleRules.prototype, "nodeRules", {
        /**
         * Return an object containing for each node style a sorted array of StyleRule
         *
         * @return {any}
         */
        get: function () {
            return {
                color: this.color,
                icon: this.icon,
                image: this.image,
                shape: this.shape,
                size: this.size
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StyleRules.prototype, "edgeRules", {
        /**
         * Return an object containing for each edge style a sorted array of StyleRule
         *
         * @return {any}
         */
        get: function () {
            return {
                color: this.color,
                shape: this.shape,
                width: this.width
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Generate a legend with an array of style rules and existing items in visualization
     */
    StyleRules.prototype.generateLegend = function (itemsData) {
        var _this = this;
        var result = {};
        if (itemsData.length === 0) {
            return result;
        }
        if ('categories' in itemsData[0]) {
            Object.keys(this.nodeRules).forEach(function (style) {
                result[style] = StyleRules.getLegendForStyle(style, _this.nodeRules[style], itemsData);
            });
        }
        else {
            Object.keys(this.edgeRules).forEach(function (style) {
                result[style] = StyleRules.getLegendForStyle(style, _this.edgeRules[style], itemsData);
            });
        }
        return result;
    };
    /**
     * Return the legend for a specific style type (color, icon, image...)
     */
    StyleRules.getLegendForStyle = function (styleType, styles, itemsData) {
        var result = [];
        var data = itemsData.filter(function (i) { return i; });
        var _loop_1 = function (i) {
            var styleRule = new styleRule_1.StyleRule(styles[i]);
            var ruleExistsInViz = data.some(function (d) {
                return styleRule.canApplyTo(d);
            });
            if (ruleExistsInViz) {
                if (styleType === StyleType.COLOR && typeof styleRule.style.color === 'object') {
                    StyleRules.addLegendAutoColors(data, styleRule, result);
                }
                else if (styleType === StyleType.ICON && 'image' in styleRule.style) {
                    // style is a custom icon
                    var label = __1.Tools.isDefined(styleRule.input)
                        ? StyleRules.getTypeLabel(styleRule.itemType) + "." + styleRule.input[1] + " " + StyleRules.sanitizeValue(styleRule.type, styleRule.value)
                        : "" + StyleRules.getTypeLabel(styleRule.itemType);
                    var value = styleRule.style.image;
                    StyleRules.updateLegend(result, { label: label, value: value });
                }
                else {
                    var label = __1.Tools.isDefined(styleRule.input)
                        ? StyleRules.getTypeLabel(styleRule.itemType) + "." + styleRule.input[1] + " " + StyleRules.sanitizeValue(styleRule.type, styleRule.value)
                        : "" + StyleRules.getTypeLabel(styleRule.itemType);
                    var value = styleRule.style[styleType];
                    StyleRules.updateLegend(result, { label: label, value: value });
                }
            }
        };
        for (var i = 0; i < styles.length; i++) {
            _loop_1(i);
        }
        return result;
    };
    /**
     * Sanitize value for legend
     */
    StyleRules.sanitizeValue = function (styleType, value) {
        switch (styleType) {
            case rest_client_1.SelectorType.NO_VALUE:
                return 'is undefined';
            case rest_client_1.SelectorType.NAN:
                return 'is not an number';
            case rest_client_1.SelectorType.RANGE:
                var template_1 = '';
                Object.keys(value).forEach(function (k, i) {
                    if (i > 0) {
                        template_1 += ' and ';
                    }
                    template_1 += k + " " + value[k];
                });
                return template_1;
        }
        return typeof value === 'object' ? "= " + JSON.stringify(value) : "= " + value;
    };
    /**
     * Add items in legend for automatic coloring
     */
    StyleRules.addLegendAutoColors = function (itemsData, styleRule, currentLegend) {
        var propertyKey = styleRule.style.color.input[1];
        itemsData.forEach(function (data) {
            var propValue = __1.Tools.getIn(data, styleRule.style.color.input);
            if (Array.isArray(propValue)) {
                propValue.forEach(function (value) {
                    var label = styleRule.style.color.input.includes('properties')
                        ? StyleRules.getTypeLabel(styleRule.itemType) + "." + propertyKey + " = " + value
                        : "" + StyleRules.getTypeLabel(value);
                    var color = itemAttributes_1.ItemAttributes.autoColor(value, styleRule.style.color.ignoreCase);
                    StyleRules.updateLegend(currentLegend, { label: label, value: color });
                });
            }
            else {
                var label = styleRule.style.color.input.includes('properties')
                    ? StyleRules.getTypeLabel(styleRule.itemType) + "." + propertyKey + " = " + propValue
                    : "" + StyleRules.getTypeLabel(propValue);
                var value = itemAttributes_1.ItemAttributes.autoColor(propValue, styleRule.style.color.ignoreCase);
                StyleRules.updateLegend(currentLegend, { label: label, value: value });
            }
        });
    };
    /**
     * Return the label of item type for a legend item
     */
    StyleRules.getTypeLabel = function (type) {
        return type === undefined ? 'All' : type === null ? 'Others' : type;
    };
    /**
     * Check if a legend item already exists and overwrite it / push it
     */
    StyleRules.updateLegend = function (legend, _a) {
        var label = _a.label, value = _a.value;
        var indexOfLegendItem = legend.map(function (r) { return r.label; }).indexOf(label);
        if (indexOfLegendItem < 0) {
            legend.push({ label: label, value: value });
        }
        else {
            legend[indexOfLegendItem] = { label: label, value: value };
        }
    };
    /**
     * return an array of StyleRule, containing only the desired style
     */
    StyleRules.getBy = function (styleType, rules) {
        return rules
            .filter(function (style) {
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
            .map(function (style) { return StyleRules.getRule(style, styleType); });
    };
    /**
     * From a RawStyle, generate a StyleRule of a specific style
     */
    StyleRules.getRule = function (rawRule, styleType) {
        var _a;
        var rule = __1.Tools.clone(rawRule);
        rule.style = (_a = {}, _a[styleType] = rule.style[styleType], _a);
        return new styleRule_1.StyleRule(rule);
    };
    return StyleRules;
}());
exports.StyleRules = StyleRules;
//# sourceMappingURL=styleRules.js.map