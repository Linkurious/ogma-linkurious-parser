"use strict";
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2018-01-22.
 */
// external libs
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Valcheck_1 = require("valcheck/lib/valcheck/Valcheck");
// local libs
var rest_client_1 = require("@linkurious/rest-client");
var tools = __importStar(require("../tools/tools"));
var NodeChecker_1 = require("./NodeChecker");
var NodeSetChecker_1 = require("./NodeSetChecker");
var StringChecker_1 = require("./StringChecker");
var NumberChecker_1 = require("./NumberChecker");
var BooleanChecker_1 = require("./BooleanChecker");
var EnumChecker_1 = require("./EnumChecker");
var DateChecker_1 = require("./DateChecker");
var DateTimeChecker_1 = require("./DateTimeChecker");
var EnvChecker_1 = require("./EnvChecker");
var ParserError_1 = require("./ParserError");
var InputSerialization;
(function (InputSerialization) {
    InputSerialization["NODE"] = "node";
    InputSerialization["NODE_SET"] = "nodeset";
    InputSerialization["NUMBER"] = "number";
    InputSerialization["STRING"] = "string";
    InputSerialization["BOOLEAN"] = "boolean";
    InputSerialization["NATIVE_DATE"] = "date";
    InputSerialization["NATIVE_DATE_TIME"] = "datetime";
    InputSerialization["ENV"] = "env";
})(InputSerialization = exports.InputSerialization || (exports.InputSerialization = {}));
var QueryTemplateParser = /** @class */ (function () {
    function QueryTemplateParser(errorHandler, bugHandler) {
        var _a;
        var throwTypeError = function (message) {
            throw ParserError_1.ParserError.type(message);
        };
        var throwOptionsError = function (message) {
            throw ParserError_1.ParserError.options(message);
        };
        this.checkType = new Valcheck_1.Valcheck(throwTypeError, bugHandler);
        this.checkOptions = new Valcheck_1.Valcheck(throwOptionsError, bugHandler);
        this.handleError = errorHandler;
        this.handleBug =
            bugHandler ||
                (function (bug) {
                    throw new Error(bug);
                });
        this.templateCheckers = (_a = {},
            _a[rest_client_1.TemplateFieldType.NUMBER] = new NumberChecker_1.NumberChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.STRING] = new StringChecker_1.StringChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.ENUM] = new EnumChecker_1.EnumChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.NODE] = new NodeChecker_1.NodeChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.NODE_SET] = new NodeSetChecker_1.NodeSetChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.DATE] = new DateChecker_1.DateChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.DATE_TIME] = new DateTimeChecker_1.DateTimeChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.BOOLEAN] = new BooleanChecker_1.BooleanChecker(this.checkOptions),
            _a[rest_client_1.TemplateFieldType.ENV] = new EnvChecker_1.EnvChecker(this.checkOptions),
            _a);
    }
    Object.defineProperty(QueryTemplateParser, "TEMPLATE_RX", {
        get: function () {
            // Captures anything within templateFields brackets. Format: {{...}}
            // 1) [{]{2} opening brackets for the template field
            // 2) ([^{].*?) match any character, excludes additional opening brackets
            // 3) [}]{2,3} closing brackets, can be 3 if json-options are defined as json
            // [\s\S] Match whitespace and non whitespace characters equivalent to (. | \n)
            return /[{]{2}(?:[^{][\s\S]*?)?[}]{2,3}/g;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryTemplateParser, "FIELD_RX", {
        get: function () {
            // Captures `JSON-name`, `type` and `JSON-options`. Format: "`JSON-name` : `type` [ : `JSON-options` ]"
            // 1) \s*"(.*)"\s* matches `JSON-name`, must be within quotes, spaces around are ignored
            // 2) :\s*(\w*)\s* matches `type`, must be a word, spaces around are ignored
            // 3) (?::(.*))? Non capturing group matches `JSON-options` only when `type` is followed by ":"
            // [\s\S] Match whitespace and non whitespace characters equivalent to (. | \n)
            return /^(\s*"([\s\S]+)"\s*):(\s*\w+\s*)(?::([\s\S]*))?$/g;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return true if the `query` contains template fields.
     *
     * @param query
     */
    QueryTemplateParser.isTemplate = function (query) {
        return QueryTemplateParser.TEMPLATE_RX.test(query);
    };
    /**
     * Correct the offset with changes recorded in the correction table.
     *
     * @param offset
     * @param correctionTable
     */
    QueryTemplateParser.correctOffset = function (offset, correctionTable) {
        correctionTable = tools.sortBy(correctionTable, 'offset');
        for (var _i = 0, correctionTable_1 = correctionTable; _i < correctionTable_1.length; _i++) {
            var correction = correctionTable_1[_i];
            if (offset >= correction.offset) {
                offset += correction.displacement;
            }
        }
        return offset;
    };
    /**
     * @param template
     * @param statistics
     */
    QueryTemplateParser.prototype.checkTemplateField = function (template, statistics, ignoreEnv) {
        var checkedTemplates = statistics.checkedTemplates, checkedTypes = statistics.checkedTypes, validTemplates = statistics.validTemplates;
        // increment the types count in statistics
        var checkedType = checkedTypes.get(template.type) || {
            count: 0,
            keys: new Set([template.key])
        };
        checkedType.count += 1;
        checkedType.keys.add(template.key);
        checkedTypes.set(template.type, checkedType);
        // 1) template fields with more than 2 node templates with different keys
        if (template.type === rest_client_1.TemplateFieldType.NODE && checkedType.keys.size > 2) {
            throw ParserError_1.ParserError.template(ParserError_1.Message.AT_MOST_2_NODE_INPUT);
        }
        // 2) template fields contain more than 1 nodeset input
        if (template.type === rest_client_1.TemplateFieldType.NODE_SET && checkedType.keys.size > 1) {
            throw ParserError_1.ParserError.template(ParserError_1.Message.AT_MOST_1_NODE_SET_INPUT);
        }
        var duplicate = checkedTemplates.get(template.key);
        if (duplicate === undefined) {
            checkedTemplates.set(template.key, { count: 1, value: template });
            if (template.type !== rest_client_1.TemplateFieldType.ENV || !ignoreEnv) {
                validTemplates.push(template);
            }
        }
        else {
            // the query contains duplicate templates
            duplicate.count += 1;
            var existingTemplate = duplicate.value;
            // 3) template is already seen but types don't match
            if (existingTemplate.type !== template.type) {
                throw ParserError_1.ParserError.template(ParserError_1.Message.CONFLICTING_TYPES, {
                    key: template.key,
                    existingType: existingTemplate.type,
                    newType: template.type
                });
            }
            var exists = function (o) { return o !== undefined && o !== null; };
            // 4) template is already seen but options don't match
            if (exists(template.options) &&
                exists(existingTemplate.options) &&
                !tools.isEqual(existingTemplate.options, template.options)) {
                var currentOptions = JSON.stringify(template.options);
                var existingOptions = JSON.stringify(existingTemplate.options);
                throw ParserError_1.ParserError.template(ParserError_1.Message.CONFLICTING_OPTIONS, {
                    key: template.key,
                    existingOptions: existingOptions,
                    newOptions: currentOptions
                });
            }
            // 5) template was already seen but options were not defined
            if (exists(template.options)) {
                existingTemplate.options = template.options;
            }
        }
        // 6) template fields contain a mix of nodes and nodeset inputs
        if (checkedTypes.has(rest_client_1.TemplateFieldType.NODE) && checkedTypes.has(rest_client_1.TemplateFieldType.NODE_SET)) {
            throw ParserError_1.ParserError.template(ParserError_1.Message.MIXED_NODE_NODE_SET_INPUT);
        }
        // 7) template fields contain an env template field but no node or nodeset inputs
        if (checkedTypes.has(rest_client_1.TemplateFieldType.ENV) &&
            !(checkedTypes.has(rest_client_1.TemplateFieldType.NODE_SET) || checkedTypes.has(rest_client_1.TemplateFieldType.NODE))) {
            throw ParserError_1.ParserError.template(ParserError_1.Message.ENV_INPUT_WITHOUT_GRAPH_INPUT);
        }
    };
    /**
     * @param templateString
     */
    QueryTemplateParser.prototype.parseTemplateKey = function (templateString) {
        var parsedField = QueryTemplateParser.FIELD_RX.exec(templateString);
        var key = parsedField && parsedField[2];
        if (key === null || key === undefined) {
            return this.handleBug(ParserError_1.Message.BUG_CANNOT_PARSE_TEMPLATE_KEY);
        }
        return key;
    };
    QueryTemplateParser.prototype.findFailedMatchCause = function (templateString) {
        var quoted = function (s) { return /^\s*["]([\s\S]*?)["]/g.test(s); };
        var quotedButEmpty = function (s) { return /^\s*["](\s*?)["]/g.test(s); };
        var quotedAndTyped = function (s) { return /^\s*["]([\s\S]*?)["]\s*[:][^\s]+/g.test(s); };
        if (!quoted(templateString)) {
            // e.g: {{a}} or {{"a}} or {{a"}} or {{}}
            return ParserError_1.ParserError.key(ParserError_1.Message.KEY_NOT_QUOTED);
        }
        else if (quotedButEmpty(templateString)) {
            // e.g: {{""}} or {{"   "}}
            return ParserError_1.ParserError.key(ParserError_1.Message.EMPTY_NAME);
        }
        if (!quotedAndTyped(templateString)) {
            // e.g: {{"a":}} or {{"a":  }} or {{"a"}}
            return ParserError_1.ParserError.type(ParserError_1.Message.TYPE_MISSING);
        }
        // we could not find the cause, let's return a generic message.
        return ParserError_1.ParserError.field(ParserError_1.Message.INVALID_TEMPLATE_FORMAT, { template: templateString });
    };
    /**
     * Return the position of any template field left opened.
     */
    QueryTemplateParser.prototype.findNonClosedTemplateField = function (text, offset) {
        if (offset === void 0) { offset = 0; }
        var beforeNextTemplateRx = /^([\s\S]*?)(?:[{]{2}|$)/g; // grab everything before the next opening brackets "...{{"
        var isClosedRx = /[}]{2}/g; // if the tested section contains closing brackets "}}"
        var isOpenedRx = /[{]{2}([^{][\s\S]*)/g; // grab everything after the opening brackets "{{..."
        var match = isOpenedRx.exec(text);
        if (match !== null) {
            // the template is definitely opened let's grab the content.
            var content = match[1];
            var beforeNext = beforeNextTemplateRx.exec(content);
            if (beforeNext !== null) {
                // we reached the start of the next template or the end of the string.
                // let's check if the template was closed.
                if (isClosedRx.test(beforeNext[1])) {
                    // the template is definitely closed, now let's check the rest of the string
                    // +2 to exclude the opening brackets in content offset
                    return this.findNonClosedTemplateField(content, offset + match.index + 2);
                }
                // the template was not closed let's return the position.
                // +2 to include the opening brackets in the highlight
                return { offset: offset + match.index, length: beforeNext[1].length + 2 };
            }
        }
    };
    /**
     * Extract JSON-name, type and JSON-options from `templateString`.
     */
    QueryTemplateParser.extractComponents = function (templateString) {
        var match = QueryTemplateParser.FIELD_RX.exec(templateString);
        if (match === null) {
            return null;
        }
        var key = match[1], strippedKey = match[2], type = match[3], jsonOptions = match[4];
        var components = {
            key: {
                value: strippedKey,
                highlight: {
                    offset: match.index,
                    length: key.length
                }
            },
            type: {
                value: type.trim(),
                highlight: {
                    offset: match.index + key.length + 1,
                    length: type.length
                }
            }
        };
        if (jsonOptions !== undefined) {
            components.jsonOptions = {
                value: jsonOptions,
                highlight: {
                    offset: components.type.highlight.offset + type.length + 1,
                    length: jsonOptions.length
                }
            };
        }
        return components;
    };
    /**
     * Extract and parse JSON-name, type and JSON-options from `templateString`.
     *
     * @param templateString
     * @param nodeCategories
     * @throws {Error} If `templateFieldDescription` does not match the format `JSON-name : type [ : JSON-options ]`
     */
    QueryTemplateParser.prototype.parseTemplateField = function (templateString, nodeCategories) {
        var components = QueryTemplateParser.extractComponents(templateString);
        if (components === null) {
            throw this.findFailedMatchCause(templateString);
        }
        if (tools.includes(components.key.value, '\n')) {
            throw ParserError_1.ParserError.key(ParserError_1.Message.SINGLE_LINE_NAME);
        }
        var type = components.type.value;
        this.checkType.values('type', type, tools.values(rest_client_1.TemplateFieldType));
        var templateChecker = this.templateCheckers[type];
        var jsonOptions = tools.get(components, 'jsonOptions.value');
        var parsedOptions = templateChecker.parseJsonOptions(jsonOptions, nodeCategories);
        // JSON-options could be optional depending on the type
        if (parsedOptions !== undefined) {
            return {
                key: components.key.value,
                type: type,
                options: parsedOptions
            };
        }
        else {
            return {
                key: components.key.value,
                type: type
            };
        }
    };
    /**
     * Parse a raw query template into template fields.
     * - Extract from `rawQueryTemplate` all template fields with the format `{{ JSON-name : type [ : JSON-options ] }}`
     * - Create a `templateFields` object mapping each `JSON-name` to it's type and JSON-options
     *
     * e.g.: MATCH (n)-[e]->(n2) where id(n)={{"n":node:"Person"}} and id(n2)={{"n2":node}}
     * => {
     *      n: {
     *        type: 'node',
     *        options: {categories: ['Person']}
     *      },
     *      n2: {
     *        type: 'node'
     *      }
     *    }
     *
     * @param rawQueryTemplate
     * @param nodeCategories
     * @param strict           Whether to fail if `query` contains not template fields
     */
    QueryTemplateParser.prototype.parse = function (rawQueryTemplate, nodeCategories, strict, ignoreEnv) {
        var notClosedHighlight = this.findNonClosedTemplateField(rawQueryTemplate);
        if (notClosedHighlight !== undefined) {
            return this.handleError(ParserError_1.Message.TEMPLATE_NOT_CLOSED, notClosedHighlight);
        }
        if (!QueryTemplateParser.isTemplate(rawQueryTemplate)) {
            if (strict) {
                return this.handleError(ParserError_1.Message.NO_TEMPLATE_FOUND);
            }
            return [];
        }
        var templateRx = QueryTemplateParser.TEMPLATE_RX;
        var statistics = {
            checkedTemplates: new Map(),
            checkedTypes: new Map(),
            validTemplates: [],
            needOptions: [],
            hasOptions: new Set()
        };
        do {
            var match = templateRx.exec(rawQueryTemplate);
            if (match === null) {
                break;
            }
            var template = this.getTemplateFieldContent(match[0]);
            if (template.length === 0) {
                return this.handleError(ParserError_1.Message.EMPTY_NAME, { offset: match.index, length: match[0].length });
            }
            try {
                var templateField = this.parseTemplateField(template, nodeCategories);
                this.checkTemplateField(templateField, statistics, ignoreEnv);
                if (this.templateCheckers[templateField.type].needOptions(nodeCategories)) {
                    if (templateField.options === undefined) {
                        statistics.needOptions.push({
                            key: templateField.key,
                            index: match.index,
                            template: template
                        });
                    }
                    else {
                        statistics.hasOptions.add(templateField.key);
                    }
                }
            }
            catch (error) {
                var highlight = this.calculateHighlight(error.level, QueryTemplateParser.extractComponents(template), match.index, 
                // Add +4 on template length to include brackets `{{}}`
                template.length + 4);
                return this.handleError(error.message, highlight);
            }
        } while (true);
        for (var _i = 0, _a = statistics.needOptions; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b.key, index = _b.index, template = _b.template;
            if (!statistics.hasOptions.has(key)) {
                var highlight = this.calculateHighlight(ParserError_1.Level.OPTIONS, QueryTemplateParser.extractComponents(template), index, 
                // Add +4 on template length to include brackets `{{}}`
                template.length + 4);
                return this.handleError(ParserError_1.Message.MISSING_OPTIONS, highlight);
            }
        }
        return this.orderTemplateFields(statistics.validTemplates);
    };
    QueryTemplateParser.prototype.getTemplateFieldContent = function (template) {
        // we get the content of the template by removing the enclosing brackets '{{}}'
        // the reason we don't use the capture group is that it removes the last `}` if json-options are used
        return template.substring(2, template.length - 2);
    };
    /**
     * Calculate error highlight based on `level`.
     */
    QueryTemplateParser.prototype.calculateHighlight = function (level, components, templateOffset, templateLength) {
        if (components !== null) {
            if (level === ParserError_1.Level.KEY) {
                return {
                    offset: components.key.highlight.offset + templateOffset + 2,
                    length: components.key.highlight.length
                };
            }
            if (level === ParserError_1.Level.TYPE) {
                return {
                    offset: components.type.highlight.offset + templateOffset + 2,
                    length: components.type.highlight.length
                };
            }
            if (level === ParserError_1.Level.OPTIONS) {
                if (components.jsonOptions && components.jsonOptions.highlight) {
                    return {
                        offset: components.jsonOptions.highlight.offset + templateOffset + 2,
                        length: components.jsonOptions.highlight.length
                    };
                }
                else {
                    return {
                        offset: components.type.highlight.offset +
                            (components.type.highlight.length || 0) +
                            templateOffset +
                            2
                    };
                }
            }
        }
        if (level !== ParserError_1.Level.TEMPLATE) {
            // we couldn't highlight a specific component, let's highlight the content of the template
            return {
                offset: templateOffset + 2,
                length: templateLength - 4
            };
        }
        return { offset: templateOffset, length: templateLength };
    };
    /**
     * Enforce the ordering of the template fields.
     * nodeset and nodes fields should appear first
     *
     *
     * @param templateFields
     */
    QueryTemplateParser.prototype.orderTemplateFields = function (templateFields) {
        var _a = tools.partition(templateFields, function (_a) {
            var type = _a.type;
            return type === rest_client_1.TemplateFieldType.NODE || type === rest_client_1.TemplateFieldType.NODE_SET;
        }), graph = _a[0], nonGraph = _a[1];
        return tools.concat(graph, nonGraph);
    };
    /**
     * Get graph query input type from template fields.
     *
     * @param templateFields
     */
    QueryTemplateParser.getInputType = function (templateFields) {
        var seenNode = false;
        for (var _i = 0, templateFields_1 = templateFields; _i < templateFields_1.length; _i++) {
            var templateField = templateFields_1[_i];
            if (templateField.type === 'nodeset') {
                return rest_client_1.GraphQueryInputType.NODESET;
            }
            if (templateField.type === 'node') {
                if (seenNode) {
                    return rest_client_1.GraphQueryInputType._2_NODES;
                }
                seenNode = true;
            }
        }
        if (seenNode) {
            return rest_client_1.GraphQueryInputType._1_NODE;
        }
        return rest_client_1.GraphQueryInputType.NONE;
    };
    /**
     * Validate each `templateData` value against the type
     * in `templateFields` mapped with the same key.
     *
     * Return a list of `templateData` for each node input of a `1-node` query
     * Return a list with a single `templateData` for other input types
     *
     * Each templateData is validated and the values are quoted with the `quote` method
     *
     * @param templateData
     * @param templateFields
     * @param quote          Vendor specific method to validate ids and serialize values
     * @throws {Error} If values in `templateData` are not valid with respect to `templateFields`
     */
    QueryTemplateParser.prototype.getValidTemplateDataSet = function (templateData, templateFields, quote) {
        var validTemplateData = {};
        var batched = false;
        var firstKey = templateFields[0].key;
        var checkedBatchValues = [];
        // 1) decide whether we created a batched template data or not
        if (QueryTemplateParser.getInputType(templateFields) === rest_client_1.GraphQueryInputType._1_NODE) {
            // If graph input is 1_NODE, the first template field is the node template
            if (Array.isArray(templateData[firstKey])) {
                batched = true;
            }
        }
        var _loop_1 = function (templateField) {
            var value = templateData[templateField.key];
            if (value === undefined) {
                throw ParserError_1.ParserError.data(ParserError_1.Message.MISSING_DATA, {
                    field: templateField.key,
                    type: templateField.type
                });
            }
            var checker = this_1.templateCheckers[templateField.type];
            var check = checker.validateInput.bind(checker);
            if (batched && templateField.key === firstKey) {
                // 2) If we create a batched template data, validate all the values
                checkedBatchValues = value.map(function (v) {
                    return check({ key: templateField.key, value: v }, quote, templateField.options);
                });
            }
            else {
                validTemplateData[templateField.key] = check({ key: templateField.key, value: value }, quote, templateField.options);
            }
        };
        var this_1 = this;
        // validate and quote template data
        for (var _i = 0, templateFields_2 = templateFields; _i < templateFields_2.length; _i++) {
            var templateField = templateFields_2[_i];
            _loop_1(templateField);
        }
        // 3) Duplicate template data for each checked value.
        if (checkedBatchValues.length > 0) {
            return checkedBatchValues.map(function (v) {
                var _a;
                return tools.defaults((_a = {}, _a[firstKey] = v, _a), validTemplateData);
            });
        }
        return [validTemplateData];
    };
    /**
     * @param rawQueryTemplate
     * @param templateData
     */
    QueryTemplateParser.prototype.bindTemplate = function (rawQueryTemplate, templateData) {
        var _this = this;
        var offsetCorrectionTable = [];
        var query = rawQueryTemplate.replace(QueryTemplateParser.TEMPLATE_RX, function (match, offset) {
            // When TEMPLATE_RX contains no capture group, the second param of the replacer is the offset
            var templateString = _this.getTemplateFieldContent(match);
            var value = templateData[_this.parseTemplateKey(templateString)];
            offsetCorrectionTable.push({
                offset: offset + value.length,
                displacement: match.length - value.length // displacement is the correction to be applied after offset
            });
            return value;
        });
        return {
            query: query,
            correctionTable: offsetCorrectionTable
        };
    };
    /**
     * Replace `rawQueryTemplate` fields with `templateData` values.
     * - Detect fields in `rawQueryTemplate` with the format `{{ JSON-name : type [ : JSON-options ] }}`
     * - Replace the fields with corresponding `templateData[JSON-name]`
     *
     * e.g.:
     * - rawQueryTemplate = MATCH (n)-[e]->(n2) where id(n)={{"n":node:"Person"}}
     * - templateData = {n: 42}
     * => MATCH (n)-[e]->(n2) where id(n)=42
     *
     * @param rawQueryTemplate Templated GraphQuery content
     * @param templateData     Key/value pair to be filled in rawQueryTemplate
     * @param templateFields
     * @param quote
     * @throws {Error} If any field found in `rawQueryTemplate` does not match the format `JSON-name : type [ : JSON-options ]`
     */
    QueryTemplateParser.prototype.generateRawQueries = function (rawQueryTemplate, templateData, templateFields, quote) {
        var _this = this;
        try {
            return this.getValidTemplateDataSet(templateData, templateFields, quote).map(function (data) {
                return _this.bindTemplate(rawQueryTemplate, data);
            });
        }
        catch (error) {
            return this.handleError(error.message);
        }
    };
    return QueryTemplateParser;
}());
exports.default = QueryTemplateParser;
//# sourceMappingURL=index.js.map