"use strict";
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2020
 *
 * - Created on 2020-08-18.
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
var EnvChecker = /** @class */ (function (_super) {
    __extends(EnvChecker, _super);
    function EnvChecker(check) {
        var _this = _super.call(this, check) || this;
        _this.acceptedValues = Object.values(rest_client_1.EnvTemplateValues);
        return _this;
    }
    Object.defineProperty(EnvChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.ENV,
                shorthand: 'value',
                defaultSerializer: index_1.InputSerialization.ENV
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * TemplateField json-options valcheck field definition.
     *
     * @param nodeCategories
     */
    EnvChecker.prototype.getOptionsFieldDefinition = function () {
        return {
            required: true,
            properties: {
                value: { required: true, values: this.acceptedValues }
            }
        };
    };
    /**
     * Template input value field definition.
     *
     * @param options
     */
    EnvChecker.prototype.getInputFieldDefinition = function (options) {
        return { check: 'string' };
    };
    return EnvChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.EnvChecker = EnvChecker;
//# sourceMappingURL=EnvChecker.js.map