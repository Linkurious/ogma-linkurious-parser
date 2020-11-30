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
var index_1 = require("./index");
var NodeChecker = /** @class */ (function (_super) {
    __extends(NodeChecker, _super);
    function NodeChecker(check) {
        return _super.call(this, check) || this;
    }
    Object.defineProperty(NodeChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.NODE,
                shorthand: 'categories',
                defaultSerializer: index_1.InputSerialization.NODE
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
    NodeChecker.prototype.getOptionsFieldDefinition = function (nodeCategories) {
        var _this = this;
        return {
            required: false,
            properties: {
                categories: {
                    check: function (key, value) {
                        _this.check.type(key, value, ['string', 'array']);
                        value = Array.isArray(value) ? value : [value];
                        _this.check.stringArray(key, value, undefined, undefined, true);
                        if (nodeCategories && nodeCategories.length > 0) {
                            // validate categories to be in the schema if the list of categories is not empty
                            for (var _i = 0, _a = value; _i < _a.length; _i++) {
                                var category = _a[_i];
                                _this.check.values(key, category, nodeCategories);
                            }
                        }
                    }
                }
            }
        };
    };
    /**
     * Template input value field definition.
     *
     * @param options
     */
    NodeChecker.prototype.getInputFieldDefinition = function (options) {
        var _this = this;
        return {
            check: function (key, value) {
                _this.check.type(key, value, ['string', 'array']);
                if (Array.isArray(value)) {
                    _this.check.stringArray(key, value);
                }
            }
        };
    };
    NodeChecker.prototype.normalizeOptions = function (options) {
        var changes = {};
        if (!Array.isArray(options.categories)) {
            changes.categories = [options.categories];
        }
        return tools.defaults(changes, options);
    };
    return NodeChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.NodeChecker = NodeChecker;
//# sourceMappingURL=NodeChecker.js.map