"use strict";
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-02-01.
 */
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
var RawFieldChecker_1 = require("./RawFieldChecker");
var index_1 = require("./index");
var NumberChecker = /** @class */ (function (_super) {
    __extends(NumberChecker, _super);
    function NumberChecker(check) {
        return _super.call(this, check) || this;
    }
    Object.defineProperty(NumberChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.NUMBER,
                shorthand: 'default',
                defaultSerializer: index_1.InputSerialization.NUMBER
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * TemplateField json-options valcheck field definition.
     */
    NumberChecker.prototype.getOptionsFieldDefinition = function () {
        var _this = this;
        var properties = {
            default: { check: 'number' },
            min: { check: 'number' },
            max: { check: 'number' },
            placeholder: { check: 'string' }
        };
        return {
            required: false,
            properties: properties,
            check: function (key, value) {
                _this.check.property(key, value, { properties: properties });
                var options = value;
                _this.check.properties(key, options, {
                    max: { check: ['number', options.min] },
                    min: { check: ['number', undefined, options.max] },
                    default: { check: ['number', options.min, options.max] }
                }, 'inclusive');
            }
        };
    };
    /**
     * Template input value field definition.
     *
     * @param options
     */
    NumberChecker.prototype.getInputFieldDefinition = function (options) {
        options = options || {};
        return {
            check: ['number', options.min, options.max]
        };
    };
    return NumberChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.NumberChecker = NumberChecker;
//# sourceMappingURL=NumberChecker.js.map