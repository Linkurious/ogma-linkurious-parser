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
Object.defineProperty(exports, "__esModule", { value: true });
var rest_client_1 = require("@linkurious/rest-client");
var __1 = require("..");
var itemAttributes_1 = require("./itemAttributes");
var EdgeAttributes = /** @class */ (function (_super) {
    __extends(EdgeAttributes, _super);
    function EdgeAttributes(rulesMap) {
        return _super.call(this, rulesMap) || this;
    }
    /**
     * Run the callback if an item match with a style in the array of rules
     */
    EdgeAttributes.prototype.matchStyle = function (styleRules, data, callback) {
        if (data === undefined) {
            return;
        }
        for (var i = 0; i < styleRules.length; ++i) {
            if (styleRules[i].canApplyTo(data)) {
                callback(styleRules[i]);
                break;
            }
        }
    };
    /**
     * Generate color for a given node (call only if _rulesMap.color exists)
     */
    EdgeAttributes.prototype.color = function (data) {
        if (!__1.Tools.isDefined(data)) {
            return itemAttributes_1.BASE_GREY;
        }
        var color;
        for (var j = 0; j < this._rulesMap.color.length; ++j) {
            var rule = this._rulesMap.color[j];
            if (rule.canApplyTo(data)) {
                if (typeof rule.style.color === 'string') {
                    color = rule.style.color;
                }
                else if (typeof rule.style.color === 'object') {
                    var propValue = __1.Tools.getInUnsafe(data, rule.style.color.input);
                    color = itemAttributes_1.ItemAttributes.autoColor("" + propValue, rule.style.ignoreCase);
                }
                break;
            }
        }
        return __1.Tools.isDefined(color) ? color : itemAttributes_1.BASE_GREY;
    };
    /**
     * Generate shape for a given node
     */
    EdgeAttributes.prototype.shape = function (data) {
        var result = undefined;
        if (this._rulesMap.shape !== undefined) {
            this.matchStyle(this._rulesMap.shape, data, function (styleRule) {
                result = styleRule.style.shape;
            });
        }
        return result;
    };
    /**
     * Generate size for a given node
     */
    EdgeAttributes.prototype.width = function (data) {
        var result = undefined;
        if (this._rulesMap.width !== undefined) {
            this.matchStyle(this._rulesMap.width, data, function (styleRule) {
                result = styleRule.style.width;
            });
        }
        return result;
    };
    /**
     * Return an object containing all node attributes needed by Ogma to style a node
     */
    EdgeAttributes.prototype.all = function (data) {
        if (!__1.Tools.isDefined(data)) {
            return {
                color: itemAttributes_1.BASE_GREY,
                shape: rest_client_1.OgmaEdgeShape.ARROW,
                width: '100%'
            };
        }
        return {
            color: this.color(data),
            shape: this.shape(data),
            width: this.width(data)
        };
    };
    return EdgeAttributes;
}(itemAttributes_1.ItemAttributes));
exports.EdgeAttributes = EdgeAttributes;
//# sourceMappingURL=edgeAttributes.js.map