"use strict";
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by andrebarata on 2018-05-22.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var rest_client_1 = require("@linkurious/rest-client");
var __1 = require("..");
var Filters = /** @class */ (function () {
    function Filters() {
    }
    /**
     * Returns whether the node/edge should be *filtered* (a.k.a. *hidden*).
     *
     * Notes:
     * 1. `filterRules` are rules that match what should be filtered/hidden.
     * 2. `filterRules` are combined inclusively: as soon as one rule returns `true` for
     *    an item, the item can be hidden/filtered.
     *
     * @param filterRules
     * @param itemData
     */
    Filters.isFiltered = function (filterRules, itemData) {
        if (!__1.Tools.isDefined(itemData)) {
            return false;
        }
        if ('categories' in itemData) {
            return this.getFilterFunction(filterRules, true)(itemData);
        }
        else {
            return this.getFilterFunction(filterRules, false)(itemData);
        }
    };
    Filters.getFilterFunction = function (filterRules, isNode) {
        var filterKey = JSON.stringify(filterRules, null, '');
        // This cast is needed to tell the TypeScript compiler to trust us that "isNode" and "T" are dependent.
        var filterCache = (isNode ? this.nodeCache : this.edgeCache);
        var filterFunc = filterCache.get(filterKey);
        if (!filterFunc) {
            filterFunc = this.createFilterFunction(filterRules, isNode);
            if (filterCache.size > this.FILTER_CACHE_SIZE) {
                filterCache.clear();
            }
            filterCache.set(filterKey, filterFunc);
        }
        return filterFunc;
    };
    Filters.createFilterFunction = function (filterRules, isNode) {
        var _this = this;
        var filterFunctions = filterRules.map(function (filter) {
            return _this.filterToFilterFunction(filter, isNode);
        });
        /**
         * For each filterFunction, as soon as we find a filterFunction that says that a given
         * node/edge should be filtered/hidden, we return `true` for the node/edge.
         */
        return function (itemData) {
            for (var _i = 0, filterFunctions_1 = filterFunctions; _i < filterFunctions_1.length; _i++) {
                var filterFunction = filterFunctions_1[_i];
                if (filterFunction(itemData)) {
                    return true;
                }
            }
            return false;
        };
    };
    Filters.filterToFilterFunction = function (filter, isNode) {
        switch (filter.type) {
            case rest_client_1.SelectorType.ANY:
                return this.createAnyFilterFunction(filter, isNode);
            case rest_client_1.SelectorType.IS:
                return this.createIsFilterFunction(filter, isNode);
            case rest_client_1.SelectorType.NO_VALUE:
                return this.createNoValueFilterFunction(filter, isNode);
            case rest_client_1.SelectorType.RANGE:
                return this.createRangeFilterFunction(filter, isNode);
            case rest_client_1.SelectorType.NAN:
                return this.createNaNFilterFunction(filter, isNode);
        }
    };
    Filters.createAnyFilterFunction = function (filter, isNode) {
        if (isNode) {
            return function (itemData) {
                if (filter.itemType === undefined) {
                    return true;
                }
                return itemData.categories.includes(filter.itemType);
            };
        }
        else {
            // isEdge
            return function (itemData) { return itemData.type === filter.itemType; };
        }
    };
    Filters.createIsFilterFunction = function (filter, isNode) {
        if (isNode) {
            return function (itemData) {
                return itemData.categories.includes(filter.itemType) &&
                    __1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true) === filter.value;
            };
        }
        else {
            // isEdge
            return function (itemData) {
                return itemData.type === filter.itemType &&
                    __1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true) === filter.value;
            };
        }
    };
    Filters.createNoValueFilterFunction = function (filter, isNode) {
        if (isNode) {
            return function (itemData) {
                return itemData.categories.includes(filter.itemType) &&
                    !__1.Tools.isDefined(__1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true));
            };
        }
        else {
            // isEdge
            return function (itemData) {
                return itemData.type === filter.itemType &&
                    !__1.Tools.isDefined(__1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true));
            };
        }
    };
    Filters.createNaNFilterFunction = function (filter, isNode) {
        var _this = this;
        if (isNode) {
            return function (itemData) {
                return itemData.categories.includes(filter.itemType) &&
                    _this.isNotANumber(__1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true));
            };
        }
        else {
            // isEdge
            return function (itemData) {
                return itemData.type === filter.itemType &&
                    _this.isNotANumber(__1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true));
            };
        }
    };
    Filters.isNotANumber = function (value) {
        return __1.Tools.isDefined(value) && !__1.Tools.isNumber(value);
    };
    Filters.createRangeFilterFunction = function (filter, isNode) {
        var _this = this;
        if (isNode) {
            return function (itemData) {
                return itemData.categories.includes(filter.itemType) &&
                    _this.valueShouldBeHidden(__1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true), filter.value);
            };
        }
        else {
            // isEdge
            return function (itemData) {
                return itemData.type === filter.itemType &&
                    _this.valueShouldBeHidden(__1.Tools.getPropertyValue(__1.Tools.getIn(itemData, filter.input), true), filter.value);
            };
        }
    };
    /**
     * Returns true if `value` should be filtered/hidden.
     *
     * `range` describes what should be filtered/hidden:
     * - e.g. {"<":10, ">=":20} => hide any value in ]-inf, 10[ *OR* in [20, +inf[
     * - e.g. {"<=":10}         => hide any value in ]-inf, 10]
     * - e.g. {">=":20}         => hide any value in [20, +inf[
     *
     * Returns false (i.e. will not filter/hide) if `value` is not a number.
     */
    Filters.valueShouldBeHidden = function (value, range) {
        var n = __1.Tools.parseFloat(value);
        if (Number.isNaN(n)) {
            return false;
        }
        /**
         * As soon as we find a condition that says that `value` should be filtered/hidden,
         * we return `true`.
         *
         * If `range` contains multiple conditions, all are checked and if any condition causes
         * `value` to be in the filtered/hidden range, we return `true`.
         *
         * If no condition causes `value` to be filtered/hidden, we return `false`.
         */
        return ((range['<'] !== undefined && n < range['<']) ||
            (range['<='] !== undefined && n <= range['<=']) ||
            (range['>'] !== undefined && n > range['>']) ||
            (range['>='] !== undefined && n >= range['>=']));
    };
    Filters.nodeCache = new Map();
    Filters.edgeCache = new Map();
    Filters.FILTER_CACHE_SIZE = 5;
    return Filters;
}());
exports.Filters = Filters;
//# sourceMappingURL=filters.js.map