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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_client_1 = require("@linkurious/rest-client");
var tools = __importStar(require("../tools/tools"));
var RawFieldChecker_1 = require("./RawFieldChecker");
var ParserError_1 = require("./ParserError");
var index_1 = require("./index");
var EnumChecker = /** @class */ (function (_super) {
    __extends(EnumChecker, _super);
    function EnumChecker(check) {
        return _super.call(this, check) || this;
    }
    Object.defineProperty(EnumChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.ENUM,
                shorthand: 'values',
                defaultSerializer: index_1.InputSerialization.STRING
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * TemplateField json-options valcheck field definition.
     */
    EnumChecker.prototype.getOptionsFieldDefinition = function () {
        var _this = this;
        var enumValueProperties = {
            value: { required: true, type: ['string', 'number', 'boolean'] },
            label: { required: true, check: 'string' }
        };
        var properties = {
            default: { check: 'string' },
            values: {
                required: true,
                arrayItem: {
                    required: true,
                    check: function (key, value) {
                        _this.check.type(key, value, ['string', 'number', 'boolean', 'object']);
                        if (tools.isObject(value)) {
                            _this.check.properties(key, value, enumValueProperties);
                        }
                    }
                }
            }
        };
        return {
            required: true,
            properties: properties,
            check: function (key, value) {
                _this.check.property(key, value, { properties: properties });
                var options = value;
                var values = tools.map(options.values, function (v) { return (tools.isObject(v) ? v.value : v); });
                if (tools.uniq(values).length !== values.length) {
                    throw ParserError_1.ParserError.options(ParserError_1.Message.NOT_UNIQUE_ENUM);
                }
                _this.check.property(key, value, {
                    properties: {
                        values: { check: ['array', 2] },
                        default: { values: values }
                    },
                    policy: 'inclusive'
                });
            }
        };
    };
    EnumChecker.prototype.normalizeOptions = function (options) {
        var changes = {};
        changes.values = tools.map(options.values, function (value) {
            if (!tools.isObject(value)) {
                return { label: value + '', value: value };
            }
            return value;
        });
        return tools.defaults(changes, options);
    };
    /**
     * Template input value field definition.
     *
     * @param options
     */
    EnumChecker.prototype.getInputFieldDefinition = function (options) {
        if (options === void 0) { options = {}; }
        var values = tools.map(options.values, 'value');
        return { check: ['values', values] };
    };
    /**
     * Normalize input to be inserted in a graph query.
     *
     * @param input
     * @param options
     */
    EnumChecker.prototype.normalizeInput = function (input, options) {
        var serializers = {
            number: index_1.InputSerialization.NUMBER,
            boolean: index_1.InputSerialization.BOOLEAN
        };
        return {
            value: input,
            serializer: serializers[this.check.getType(input)] || this.attributes.defaultSerializer
        };
    };
    return EnumChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.EnumChecker = EnumChecker;
//# sourceMappingURL=EnumChecker.js.map