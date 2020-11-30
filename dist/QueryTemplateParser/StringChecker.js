"use strict";
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
var StringChecker = /** @class */ (function (_super) {
    __extends(StringChecker, _super);
    function StringChecker(check) {
        return _super.call(this, check) || this;
    }
    Object.defineProperty(StringChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.STRING,
                shorthand: 'default',
                defaultSerializer: index_1.InputSerialization.STRING
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * TemplateField json-options valcheck field definition.
     */
    StringChecker.prototype.getOptionsFieldDefinition = function () {
        return {
            required: false,
            properties: {
                default: { type: 'string' },
                placeholder: { type: 'string' }
            }
        };
    };
    /**
     * Template input value field definition.
     *
     * @param options
     */
    StringChecker.prototype.getInputFieldDefinition = function (options) {
        return { type: 'string' };
    };
    return StringChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.StringChecker = StringChecker;
//# sourceMappingURL=StringChecker.js.map