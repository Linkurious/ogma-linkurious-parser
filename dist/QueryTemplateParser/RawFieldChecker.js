"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var tools = __importStar(require("../tools/tools"));
// local libs
var ParserError_1 = require("./ParserError");
var RawFieldChecker = /** @class */ (function () {
    function RawFieldChecker(check) {
        this.check = check;
    }
    RawFieldChecker.prototype.needOptions = function (nodeCategories) {
        return this.getOptionsFieldDefinition(nodeCategories).required || false;
    };
    /**
     * Normalize input to be inserted in a graph query.
     *
     * @param input
     * @param options
     */
    RawFieldChecker.prototype.normalizeInput = function (input, options) {
        return { value: input, serializer: this.attributes.defaultSerializer };
    };
    /**
     * Transform the parsed json-options necessary.
     */
    RawFieldChecker.prototype.normalizeOptions = function (options) {
        return options;
    };
    /**
     * Parse template fields json-options.
     *
     * @param jsonOptions
     * @param nodeCategories
     */
    RawFieldChecker.prototype.parseJsonOptions = function (jsonOptions, nodeCategories) {
        var _a;
        var definition = this.getOptionsFieldDefinition(nodeCategories);
        if (jsonOptions === undefined) {
            // Json options are optional, we don't try to parse them
            return undefined;
        }
        var parsedOptions;
        var validOptions = tools.map(definition.properties, function (v, k) { return "\"" + k + "\""; }).join(', ');
        var type = this.attributes.type;
        try {
            parsedOptions = JSON.parse(jsonOptions);
        }
        catch (error) {
            var data = { type: type, options: validOptions };
            if (!jsonOptions.length) {
                throw ParserError_1.ParserError.template(ParserError_1.Message.EMPTY_OPTIONS, data);
            }
            else {
                throw ParserError_1.ParserError.options(ParserError_1.Message.EMPTY_OPTIONS, data);
            }
        }
        var normalizedOptions;
        if (this.check.getType(parsedOptions) === 'object') {
            if (tools.keys(parsedOptions).length === 0) {
                throw ParserError_1.ParserError.options(ParserError_1.Message.EMPTY_OPTIONS, { type: type, options: validOptions });
            }
            normalizedOptions = parsedOptions;
        }
        else {
            normalizedOptions = (_a = {}, _a[this.attributes.shorthand] = parsedOptions, _a);
        }
        this.check.property('options', normalizedOptions, definition);
        return this.normalizeOptions(normalizedOptions);
    };
    /**
     * Validate a template data value.
     *
     * @param input
     * @param quote   Vendor specific methods to validate ids and serialize values
     * @param options
     * @throws {Error} If template data value is not valid
     */
    RawFieldChecker.prototype.validateInput = function (input, quote, options) {
        this.check.property(input.key, input.value, this.getInputFieldDefinition(options));
        var normalizedInput = this.normalizeInput(input.value, options);
        if (typeof quote === 'function') {
            return quote(normalizedInput.value, normalizedInput.serializer);
        }
        else {
            return normalizedInput.value + '';
        }
    };
    return RawFieldChecker;
}());
exports.RawFieldChecker = RawFieldChecker;
//# sourceMappingURL=RawFieldChecker.js.map