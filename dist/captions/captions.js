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
var __1 = require("..");
var Captions = /** @class */ (function () {
    function Captions() {
    }
    /**
     * Return label for each node
     */
    Captions.getText = function (itemData, schema) {
        var types = 'categories' in itemData ? itemData.categories : [itemData.type];
        if (Captions.captionExist(types, schema)) {
            return 'categories' in itemData
                ? Captions.generateNodeCaption(itemData, schema) || null
                : Captions.generateEdgeCaption(itemData, schema) || null;
        }
        if (itemData.properties !== undefined) {
            var heuristicCaption = Object.keys(itemData.properties).find(function (k) {
                return __1.CAPTION_HEURISTIC.includes(k);
            });
            if (heuristicCaption !== undefined &&
                __1.Tools.isDefined(itemData.properties[heuristicCaption])) {
                return ("" + __1.Tools.getValueFromLkProperty(itemData.properties[heuristicCaption])).trim();
            }
        }
        return null;
    };
    /**
     * Return a readable string from an LkProperty
     */
    Captions.getLabel = function (propertyValue) {
        if (typeof propertyValue === 'object' && 'type' in propertyValue) {
            if (!('original' in propertyValue) && !('value' in propertyValue)) {
                return null;
            }
            if ('original' in propertyValue) {
                return "" + propertyValue.original;
            }
            if ('value' in propertyValue) {
                return __1.Tools.formatDate(new Date(new Date(propertyValue.value).getTime() +
                    __1.Tools.timezoneToMilliseconds(propertyValue.timezone)).toISOString());
            }
        }
        return ("" + propertyValue).trim();
    };
    /**
     * Return true if caption configuration exists in schema
     */
    Captions.captionExist = function (itemTypes, schema) {
        return itemTypes.some(function (type) { return __1.Tools.isDefined(schema[type]); });
    };
    /**
     * Generate text from node data and captions schema
     */
    Captions.generateNodeCaption = function (itemData, schema) {
        var _this = this;
        var categories = itemData.categories;
        var caption = [];
        var captionProps = [];
        categories.forEach(function (category) {
            if (schema[category] && schema[category].active) {
                if (schema[category].displayName) {
                    caption.push(category);
                }
                captionProps = __spreadArrays(captionProps, schema[category].properties);
            }
        });
        __1.Tools.uniqBy(captionProps).forEach(function (propertyKey) {
            if (itemData.properties[propertyKey] !== undefined) {
                caption.push(_this.getLabel(itemData.properties[propertyKey]));
            }
        });
        return caption
            .filter(function (c) { return c !== null; })
            .join(' - ')
            .trim();
    };
    /**
     * Generate text from edge data and captions schema
     */
    Captions.generateEdgeCaption = function (itemData, schema) {
        var type = itemData.type;
        var caption = [];
        var captionProps = [];
        if (schema[type] && schema[type].active) {
            if (schema[type].displayName) {
                caption.push(type);
            }
            captionProps = __spreadArrays(captionProps, schema[type].properties);
            __1.Tools.uniqBy(captionProps).forEach(function (propertyKey) {
                if (__1.Tools.isDefined(itemData.properties[propertyKey])) {
                    caption.push(Captions.getLabel(itemData.properties[propertyKey]));
                }
            });
            return caption.join(' - ').trim();
        }
        return '';
    };
    return Captions;
}());
exports.Captions = Captions;
//# sourceMappingURL=captions.js.map