/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-04-19.
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
var __1 = require("..");
var StyleRule = /** @class */ (function () {
    function StyleRule(model) {
        this.type = model.type;
        this.input = model.input;
        this.index = model.index;
        this.itemType = model.itemType;
        this.style = model.style;
        this.value = model.value;
    }
    Object.defineProperty(StyleRule.prototype, "specificity", {
        /**
         * Return an int describing specificity of the style. 4 = very specific / 1 = not specific
         *
         * @return {number}
         */
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return true if this style match values
     */
    StyleRule.prototype.matchValues = function (itemType, input, value) {
        if (__1.Tools.isDefined(input)) {
            return (((itemType === this.itemType || !__1.Tools.isDefined(this.itemType)) &&
                __1.Tools.isEqual(__spreadArrays(['properties'], input), this.input) &&
                __1.Tools.isEqual(value, this.value)) ||
                (this.type === 'any' &&
                    !__1.Tools.isDefined(this.input) &&
                    typeof this.style.color === 'object' &&
                    this.style.color.input[1] === input[0]));
        }
        if (__1.Tools.isDefined(this.itemType)) {
            return itemType === this.itemType && !__1.Tools.isDefined(this.input);
        }
        return !__1.Tools.isDefined(this.input);
    };
    StyleRule.inputExists = function (type, input) {
        return type !== rest_client_1.SelectorType.ANY;
    };
    /**
     * Return true if a style can apply to a node
     */
    StyleRule.prototype.canApplyTo = function (data) {
        var types = 'categories' in data ? data.categories : [data.type];
        var typePredicate = false;
        switch (this.type) {
            case rest_client_1.SelectorType.ANY:
                typePredicate = StyleRule.checkAny(data, this.style);
                break;
            case rest_client_1.SelectorType.NO_VALUE:
                if (StyleRule.inputExists(this.type, this.input)) {
                    typePredicate = StyleRule.checkNoValue(data, this.input);
                }
                break;
            case rest_client_1.SelectorType.NAN:
                if (StyleRule.inputExists(this.type, this.input)) {
                    typePredicate = StyleRule.checkNan(data, this.input);
                }
                break;
            case rest_client_1.SelectorType.RANGE:
                if (StyleRule.inputExists(this.type, this.input)) {
                    typePredicate = StyleRule.checkRange(__1.Tools.getIn(data, this.input), this.value);
                }
                break;
            case rest_client_1.SelectorType.IS:
                if (StyleRule.inputExists(this.type, this.input)) {
                    typePredicate = StyleRule.checkIs(data, this.input, this.value);
                }
                break;
        }
        return typePredicate && StyleRule.checkItemType(types, this.itemType);
    };
    /**
     * Return true or false on rule type 'any' if the current node match the rule
     */
    StyleRule.checkAny = function (data, style) {
        // return true if autoColor by a property and this property exists in node
        if (typeof style.color === 'object') {
            return __1.Tools.isDefined(__1.Tools.getIn(data, style.color.input));
        }
        return true;
    };
    /**
     * Return true or false on rule type 'noValue' if the current node match the rule
     */
    StyleRule.checkNoValue = function (data, input) {
        return !__1.Tools.valueExists(__1.Tools.getIn(data, input));
    };
    /**
     * Return true or false on rule type 'NaN' if the current node match the rule
     */
    StyleRule.checkNan = function (data, input) {
        return !__1.Tools.isNumber(__1.Tools.getIn(data, input));
    };
    /**
     * Return true if predicate is true for the node value
     *
     * @param value
     * @param comparator
     * @return {boolean}
     */
    StyleRule.checkRange = function (value, comparator) {
        var operators = Object.keys(comparator);
        return operators.every(function (op) {
            switch (op) {
                case '<=':
                    return value <= comparator[op];
                case '<':
                    return value < comparator[op];
                case '>':
                    return value > comparator[op];
                case '>=':
                    return value >= comparator[op];
            }
        });
    };
    /**
     * Return true or false on rule type 'is' if the current node match the rule
     */
    StyleRule.checkIs = function (data, input, value) {
        if (!__1.Tools.isDefined(input)) {
            return false;
        }
        var itemValue = __1.Tools.getIn(data, input);
        var formattedValue = itemValue;
        if (__1.Tools.isDefined(itemValue) &&
            typeof itemValue === 'object' &&
            (itemValue.type === 'date' || itemValue.type === 'datetime')) {
            var timezone = itemValue.timezone;
            if (itemValue.timezone === 'Z') {
                timezone = '+00:00';
            }
            formattedValue = __1.Tools.formatDate(itemValue.value, itemValue.type === 'datetime', __1.Tools.timezoneToMilliseconds(timezone) / 1000);
        }
        return __1.Tools.isEqual(formattedValue, value);
    };
    /**
     * Check that value of itemType match for the node
     */
    StyleRule.checkItemType = function (types, itemType) {
        return ((itemType !== undefined && StyleRule.matchCategory(types, itemType)) ||
            StyleRule.matchAny(itemType));
    };
    /**
     * Return true if itemType is defined and category exists in an array of categories
     *
     * @param {Array<string> | string} types
     * @param {string} itemType
     * @return {boolean}
     */
    StyleRule.matchCategory = function (types, itemType) {
        return (__1.Tools.isDefined(itemType) &&
            (Array.isArray(types) ? types.includes(itemType) : __1.Tools.isEqual(types, itemType)));
    };
    /**
     * Return true if itemType is undefined
     *
     * @param {string} itemType
     * @return {boolean}
     */
    StyleRule.matchAny = function (itemType) {
        return itemType === undefined;
    };
    /**
     * Return the color for a type
     */
    StyleRule.prototype.getTypeColor = function (type) {
        var color;
        if (StyleRule.checkItemType([type], this.itemType) &&
            this.type === rest_client_1.SelectorType.ANY &&
            !__1.Tools.isDefined(this.input)) {
            color = __1.ItemAttributes.getTypeColor(this, type);
        }
        return color;
    };
    return StyleRule;
}());
exports.StyleRule = StyleRule;
//# sourceMappingURL=styleRule.js.map