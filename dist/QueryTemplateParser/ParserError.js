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
var tools = __importStar(require("../tools/tools"));
var Level;
(function (Level) {
    Level["TEMPLATE"] = "template";
    Level["FIELD"] = "field";
    Level["KEY"] = "key";
    Level["TYPE"] = "type";
    Level["OPTIONS"] = "options";
    Level["DATA"] = "data";
})(Level = exports.Level || (exports.Level = {}));
var Message;
(function (Message) {
    Message["TEMPLATE_NOT_CLOSED"] = "Template must end with \"}}\", e.g. {{\"field1\":string}}.";
    Message["NO_TEMPLATE_FOUND"] = "This query must contain at least one template.";
    Message["EMPTY_NAME"] = "Name cannot be empty, e.g. {{\"field1\":string}}.";
    Message["SINGLE_LINE_NAME"] = "Name must not contain line breaks.";
    Message["MISSING_OPTIONS"] = "\"options\" must not be undefined.";
    Message["EMPTY_OPTIONS"] = "Type \"$type\" accepts options $options.";
    Message["AT_MOST_2_NODE_INPUT"] = "Templates accept at most 2 \"node\" input.";
    Message["AT_MOST_1_NODE_SET_INPUT"] = "Templates accept at most 1 \"nodeset\" input.";
    Message["CONFLICTING_TYPES"] = "\"$key\" cannot be both of type \"$existingType\" and of type \"$newType\".";
    Message["CONFLICTING_OPTIONS"] = "\"$key\" cannot have both options \"$existingOptions\" and \"$newOptions\".";
    Message["MIXED_NODE_NODE_SET_INPUT"] = "Templates do not accept a mix of nodes and nodeset inputs.";
    Message["BUG_CANNOT_PARSE_TEMPLATE_KEY"] = "ParseTemplateKey was invoked on an unchecked query.";
    Message["ENV_INPUT_WITHOUT_GRAPH_INPUT"] = "Templates do not accept an \"env\" input without a \"node\" or \"nodeset\" input.";
    Message["KEY_NOT_QUOTED"] = "Name of template should be surrounded by quotes, e.g. {{\"field1\":string}}.";
    Message["TYPE_MISSING"] = "Name should be followed by \":\" and type, e.g. {{\"field1\":string}}.";
    Message["INVALID_TEMPLATE_FORMAT"] = "The format of $template is invalid.";
    Message["MISSING_DATA"] = "Template data must contain the $type \"$field\".";
    Message["PATTERN_MATCH_FAILED"] = "\"$key\" must match pattern $pattern.";
    Message["INVALID_DATE"] = "\"$key\" must be a valid date.";
    Message["INVALID_TIMEZONE"] = "\"$key\" must be a valid timezone.";
    Message["NOT_BEFORE"] = "\"$key\" must be after $min.";
    Message["NOT_AFTER"] = "\"$key\" must be before $max.";
    Message["NOT_UNIQUE_ENUM"] = "Enum values must be unique.";
})(Message = exports.Message || (exports.Message = {}));
var ParserError = /** @class */ (function (_super) {
    __extends(ParserError, _super);
    function ParserError(level, message) {
        var _this = _super.call(this, message) || this;
        _this.level = level;
        return _this;
    }
    ParserError.errorMessage = function (message, data) {
        if (data === void 0) { data = {}; }
        var build = message;
        tools.keys(data).forEach(function (key) {
            build = build.replace(new RegExp('[$]' + key, 'g'), data[key]);
        });
        return build;
    };
    ParserError.template = function (message, data) {
        if (data === void 0) { data = {}; }
        return new ParserError(Level.TEMPLATE, ParserError.errorMessage(message, data));
    };
    ParserError.field = function (message, data) {
        if (data === void 0) { data = {}; }
        return new ParserError(Level.FIELD, ParserError.errorMessage(message, data));
    };
    ParserError.key = function (message, data) {
        if (data === void 0) { data = {}; }
        return new ParserError(Level.KEY, ParserError.errorMessage(message, data));
    };
    ParserError.type = function (message, data) {
        if (data === void 0) { data = {}; }
        return new ParserError(Level.TYPE, ParserError.errorMessage(message, data));
    };
    ParserError.options = function (message, data) {
        if (data === void 0) { data = {}; }
        return new ParserError(Level.OPTIONS, ParserError.errorMessage(message, data));
    };
    ParserError.data = function (message, data) {
        if (data === void 0) { data = {}; }
        return new ParserError(Level.DATA, ParserError.errorMessage(message, data));
    };
    return ParserError;
}(Error));
exports.ParserError = ParserError;
//# sourceMappingURL=ParserError.js.map