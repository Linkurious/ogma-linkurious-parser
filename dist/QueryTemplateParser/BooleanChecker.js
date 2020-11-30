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
var BooleanChecker = /** @class */ (function (_super) {
    __extends(BooleanChecker, _super);
    function BooleanChecker(check) {
        return _super.call(this, check) || this;
    }
    Object.defineProperty(BooleanChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.BOOLEAN,
                shorthand: 'default',
                defaultSerializer: index_1.InputSerialization.BOOLEAN
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * TemplateField json-options valcheck field definition.
     */
    BooleanChecker.prototype.getOptionsFieldDefinition = function () {
        return {
            required: false,
            properties: {
                default: { type: 'boolean' }
            }
        };
    };
    /**
     * Template input value field definition.
     *
     * @param options
     */
    BooleanChecker.prototype.getInputFieldDefinition = function (options) {
        return { check: 'boolean' };
    };
    return BooleanChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.BooleanChecker = BooleanChecker;
//# sourceMappingURL=BooleanChecker.js.map