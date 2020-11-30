"use strict";
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-13.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_client_1 = require("@linkurious/rest-client");
var difference_1 = __importDefault(require("lodash/difference"));
var nearley = __importStar(require("nearley"));
var utils_1 = require("@linkurious/rest-client/dist/src/utils");
var abstractParser_1 = __importStar(require("../abstractParser"));
var expressionGrammar_1 = __importDefault(require("./expressionGrammar"));
var BASE_URL = rest_client_1.CustomActionVariable.BASE_URL, SOURCE_KEY = rest_client_1.CustomActionVariable.SOURCE_KEY, VISUALIZATION = rest_client_1.CustomActionVariable.VISUALIZATION, NODE_SET = rest_client_1.CustomActionVariable.NODE_SET, EDGE_SET = rest_client_1.CustomActionVariable.EDGE_SET, NODE = rest_client_1.CustomActionVariable.NODE, EDGE = rest_client_1.CustomActionVariable.EDGE;
var CustomActionTemplate = /** @class */ (function () {
    function CustomActionTemplate() {
    }
    /**
     * Encode a node or edge property value to a URL safe value.
     */
    CustomActionTemplate.encodeLkValue = function (item) {
        if (typeof item === 'object' && 'type' in item && item.type === 'date') {
            // `value` is a date with an ISO value property, we return only yyyy-mm-dd
            return encodeURIComponent(item.value.slice(0, 10));
        }
        if (typeof item === 'object' && 'type' in item && item.type === 'datetime') {
            // `value` is a date with an ISO value property, we return only yyyy-mm-ddThh:mm:ss
            return encodeURIComponent(item.value.slice(0, 19));
        }
        return encodeURIComponent(item);
    };
    CustomActionTemplate.isGraphItemExpression = function (element) {
        return element.type === 'ca-expression' && 'itemType' in element;
    };
    CustomActionTemplate.isGraphPropertyExpression = function (element) {
        return element.type === 'ca-expression' && 'property' in element;
    };
    /**
     * We filter out missing, invalid, conflict and undefined from LkProperties
     */
    CustomActionTemplate.getValidLkPropertyKeys = function (lkProperties) {
        var selectedNodeProperties = [];
        for (var _i = 0, _a = Object.keys(lkProperties); _i < _a.length; _i++) {
            var propertyKey = _a[_i];
            var lkProperty = lkProperties[propertyKey];
            if (utils_1.hasValue(lkProperty) && !(typeof lkProperty === 'object' && 'status' in lkProperty)) {
                selectedNodeProperties.push(propertyKey);
            }
        }
        return selectedNodeProperties;
    };
    /**
     * Returns whether a visible custom action should be shown (enabled) or grayed out (disabled).
     */
    CustomActionTemplate.isEnabled = function (customAction, contextData) {
        var commonItemType = (customAction.elements.filter(CustomActionTemplate.isGraphItemExpression)[0] || {}).itemType;
        var allProperties = customAction.elements
            .filter(CustomActionTemplate.isGraphPropertyExpression)
            .map(function (e) { return e.property; })
            .filter(utils_1.hasValue);
        switch (customAction.type) {
            case rest_client_1.CustomActionType.NON_GRAPH: {
                return true;
            }
            case rest_client_1.CustomActionType.NODE: {
                if (commonItemType && !contextData.nodes[0].data.categories.includes(commonItemType)) {
                    return false;
                }
                var selectedNodeProperties = CustomActionTemplate.getValidLkPropertyKeys(contextData.nodes[0].data.properties);
                return !(allProperties.length !== 0 &&
                    difference_1.default(allProperties, selectedNodeProperties).length !== 0);
            }
            case rest_client_1.CustomActionType.EDGE: {
                if (commonItemType && contextData.edges[0].data.type !== commonItemType) {
                    return false;
                }
                var selectedNodeProperties = CustomActionTemplate.getValidLkPropertyKeys(contextData.edges[0].data.properties);
                return !(allProperties.length !== 0 &&
                    difference_1.default(allProperties, selectedNodeProperties).length !== 0);
            }
            case rest_client_1.CustomActionType.NODESET: {
                return (!commonItemType ||
                    contextData.nodes.filter(function (node) { return node.data.categories.includes(commonItemType); })
                        .length !== 0);
            }
            case rest_client_1.CustomActionType.EDGESET: {
                return (!commonItemType ||
                    contextData.edges.filter(function (edge) { return edge.data.type === commonItemType; }).length !== 0);
            }
            default: {
                return false;
            }
        }
    };
    /**
     * Return a rendered custom action template.
     */
    CustomActionTemplate.render = function (customAction, contextData) {
        if (!CustomActionTemplate.isEnabled(customAction, contextData)) {
            return undefined;
        }
        var renderedString = '';
        var _loop_1 = function (element) {
            if (element.type === 'ca-literal') {
                renderedString += element.value;
            }
            else {
                var variable = element.variable;
                var itemType_1 = CustomActionTemplate.isGraphItemExpression(element)
                    ? element.itemType
                    : undefined;
                var property = CustomActionTemplate.isGraphPropertyExpression(element)
                    ? element.property
                    : undefined;
                var value = void 0;
                switch (variable) {
                    case NODE: {
                        var node = contextData.nodes[0];
                        if (property === undefined) {
                            value = encodeURIComponent(node.id);
                        }
                        else {
                            // In isEnabled(), we ensured that all the lkProperties we're gonna encode
                            // are not invalid, missing, conflict or undefined
                            value = CustomActionTemplate.encodeLkValue(node.data.properties[property]);
                        }
                        break;
                    }
                    case EDGE: {
                        var edge = contextData.edges[0];
                        if (property === undefined) {
                            value = encodeURIComponent(edge.id);
                        }
                        else {
                            // In isEnabled(), we ensured that all the lkProperties we're gonna encode
                            // are not invalid, missing, conflict or undefined
                            value = CustomActionTemplate.encodeLkValue(edge.data.properties[property]);
                        }
                        break;
                    }
                    case NODE_SET: {
                        value = contextData.nodes
                            .filter(function (node) {
                            return itemType_1 === undefined ? true : node.data.categories.includes(itemType_1);
                        })
                            .map(function (node) { return encodeURIComponent(node.id); })
                            .join(',');
                        break;
                    }
                    case EDGE_SET: {
                        value = contextData.edges
                            .filter(function (edge) { return (itemType_1 === undefined ? true : edge.data.type === itemType_1); })
                            .map(function (edge) { return encodeURIComponent(edge.id); })
                            .join(',');
                        break;
                    }
                    case VISUALIZATION: {
                        value = encodeURIComponent(contextData.vizId + '');
                        break;
                    }
                    case SOURCE_KEY: {
                        value = encodeURIComponent(contextData.sourceKey);
                        break;
                    }
                    case BASE_URL: {
                        value = contextData.baseURL;
                        break;
                    }
                    default: {
                        value = '';
                        break;
                    }
                }
                renderedString += value;
            }
        };
        for (var _i = 0, _a = customAction.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            _loop_1(element);
        }
        return renderedString;
    };
    /**
     * Return the parsed items from a valid custom action, or the errors from an invalid custom action.
     */
    CustomActionTemplate.parse = function (template, nodeSchema, edgeSchema) {
        if (nodeSchema === void 0) { nodeSchema = { results: [] }; }
        if (edgeSchema === void 0) { edgeSchema = { results: [] }; }
        var elements = [];
        var errors = [];
        var variables = [];
        var validVariablesAndItemTypes = [];
        var abstractTokens = abstractParser_1.default.tokenize(template);
        if (abstractTokens.length === 1 && abstractTokens[0].value.length === template.length) {
            return {
                errors: [
                    {
                        key: rest_client_1.CustomActionParsingErrorKey.NO_EXPRESSIONS,
                        start: 0,
                        end: template.length
                    }
                ]
            };
        }
        var _loop_2 = function (token) {
            var type = token.type, value = token.value, start = token.start, end = token.end;
            if (type === abstractParser_1.AbstractTokenType.LITERAL) {
                elements.push({
                    type: 'ca-literal',
                    value: value
                });
                return "continue";
            }
            var expressionErrors = [];
            var invalidItemType = false;
            var parsingResult = CustomActionTemplate.parseExpression(value, start, end);
            // non-parsable expressions
            if ('key' in parsingResult) {
                expressionErrors.push(parsingResult);
            }
            // parsable expressions
            else {
                var variable = parsingResult.variable, itemType_2 = parsingResult.itemType, property = parsingResult.property;
                // we store all the variables to determine the type of template
                variables.push(variable);
                if (property !== undefined && property.value === '') {
                    expressionErrors.push({
                        key: rest_client_1.CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX,
                        start: start + property.offset,
                        end: end
                    });
                }
                // Variables that need to check its itemType against Schema
                if ([NODE_SET, EDGE_SET, NODE, EDGE].includes(variable.value)) {
                    if (itemType_2 !== undefined) {
                        var nodeEdgeSchema = nodeSchema;
                        var unknownItemType = rest_client_1.CustomActionParsingErrorKey.UNKNOWN_NODE_CATEGORY;
                        if ([EDGE_SET, EDGE].includes(variable.value)) {
                            nodeEdgeSchema = edgeSchema;
                            unknownItemType = rest_client_1.CustomActionParsingErrorKey.UNKNOWN_EDGE_TYPE;
                        }
                        var types = nodeEdgeSchema.results.filter(function (type) { return type.itemType === itemType_2.value; });
                        if (types.length === 0) {
                            invalidItemType = true;
                            expressionErrors.push({
                                key: unknownItemType,
                                start: start + itemType_2.offset,
                                end: start + itemType_2.offset + itemType_2.value.length
                            });
                        }
                    }
                }
                // Variables that are not allowed to have itemType
                if (itemType_2 !== undefined &&
                    [VISUALIZATION, SOURCE_KEY, BASE_URL].includes(variable.value)) {
                    expressionErrors.push({
                        key: rest_client_1.CustomActionParsingErrorKey.INVALID_SEMANTIC,
                        start: start + itemType_2.offset - 1,
                        end: start + itemType_2.offset + itemType_2.value.length,
                        variable: variable.value,
                        unsupportedRestriction: 'type'
                    });
                }
                // Variables that are not allowed to have property
                if (property !== undefined &&
                    [NODE_SET, EDGE_SET, VISUALIZATION, SOURCE_KEY, BASE_URL].includes(variable.value)) {
                    expressionErrors.push({
                        key: rest_client_1.CustomActionParsingErrorKey.INVALID_SEMANTIC,
                        start: start + property.offset - 1,
                        end: start + property.offset + property.value.length,
                        variable: variable.value,
                        unsupportedRestriction: 'property'
                    });
                }
            }
            if (end === template.length) {
                expressionErrors.push({
                    key: rest_client_1.CustomActionParsingErrorKey.UNCLOSED_EXPRESSION,
                    start: start,
                    end: end
                });
            }
            // if parsing and itemType didn't raise an error
            if (!('key' in parsingResult) && !invalidItemType) {
                validVariablesAndItemTypes.push({ parsedExpression: parsingResult, tokenOffset: start });
                var element = {
                    type: 'ca-expression',
                    value: value,
                    variable: parsingResult.variable.value
                };
                var itemType = parsingResult.itemType, property = parsingResult.property;
                if (itemType) {
                    element.itemType = itemType.value;
                }
                if (property) {
                    element.property = property.value;
                }
                elements.push(element);
            }
            errors = errors.concat(expressionErrors);
        };
        for (var _i = 0, abstractTokens_1 = abstractTokens; _i < abstractTokens_1.length; _i++) {
            var token = abstractTokens_1[_i];
            _loop_2(token);
        }
        var candidateType = CustomActionTemplate.resolveCustomActionType(variables);
        if (typeof candidateType === 'object' && 'errors' in candidateType) {
            errors = errors.concat(candidateType.errors);
            return {
                errors: errors
            };
        }
        errors = CustomActionTemplate.checkIncompatibleRestrictions(errors, validVariablesAndItemTypes);
        if (errors.length > 0) {
            return {
                errors: errors
            };
        }
        return {
            type: candidateType,
            elements: elements
        };
    };
    /**
     * For edge and node templates, if there is one element with a type restriction:
     *  - Adds an error for all the elements that don't have restriction
     *  - Adds an error for all the elements with a restriction different than the first restriction found
     */
    CustomActionTemplate.checkIncompatibleRestrictions = function (errors, expressions) {
        var allErrors = errors.slice();
        var variablesWithoutItemType = [];
        var firstItemType = undefined;
        for (var _i = 0, expressions_1 = expressions; _i < expressions_1.length; _i++) {
            var _a = expressions_1[_i], parsedExpression = _a.parsedExpression, tokenOffset = _a.tokenOffset;
            var variable = parsedExpression.variable, itemType = parsedExpression.itemType;
            if (variable.value === rest_client_1.CustomActionVariable.NODE ||
                variable.value === rest_client_1.CustomActionVariable.EDGE) {
                if (utils_1.hasValue(itemType)) {
                    if (!utils_1.hasValue(firstItemType)) {
                        firstItemType = itemType.value;
                    }
                    else if (firstItemType !== itemType.value) {
                        // parsedExpression has an error, its restriction should be the same as firstItemType
                        allErrors.push({
                            key: rest_client_1.CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS,
                            variable: variable.value,
                            restrictionType: variable.value === rest_client_1.CustomActionVariable.NODE ? 'category' : 'type',
                            start: tokenOffset + itemType.offset,
                            end: tokenOffset + itemType.offset + itemType.value.length
                        });
                    }
                }
                else {
                    variablesWithoutItemType.push({
                        value: variable.value,
                        offset: variable.offset,
                        tokenOffset: tokenOffset
                    });
                }
            }
        }
        if (utils_1.hasValue(firstItemType) && variablesWithoutItemType.length !== 0) {
            // there are some that have restriction
            // the ones without itemType (elementsWithoutItemType) have error
            for (var _b = 0, variablesWithoutItemType_1 = variablesWithoutItemType; _b < variablesWithoutItemType_1.length; _b++) {
                var _c = variablesWithoutItemType_1[_b], value = _c.value, offset = _c.offset, tokenOffset = _c.tokenOffset;
                allErrors.push({
                    key: rest_client_1.CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS,
                    variable: value,
                    restrictionType: value === rest_client_1.CustomActionVariable.NODE ? 'category' : 'type',
                    start: tokenOffset + offset,
                    end: tokenOffset + offset + value.length
                });
            }
        }
        return allErrors;
    };
    /**
     * Return a parse expression or a parsing error.
     * Input: (node:PERSON).name
     * Output: {variable: {value: 'node', offset: 1}, itemType: {value: 'PERSON', offset: 6}, property: {value: 'name', offset: 14}}
     */
    CustomActionTemplate.parseExpression = function (tokenValue, tokenStart, tokenEnd) {
        if (tokenValue === '') {
            return {
                key: rest_client_1.CustomActionParsingErrorKey.EMPTY_EXPRESSION,
                start: tokenStart,
                end: tokenEnd
            };
        }
        var parser = new nearley.Parser(nearley.Grammar.fromCompiled(expressionGrammar_1.default));
        try {
            parser.feed(tokenValue);
        }
        catch (ex) {
            // This happens when an expected character (char not defined in grammar.ne) is found
            return {
                key: rest_client_1.CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX,
                start: tokenStart + ex.offset,
                end: tokenStart + ex.offset + 1
            };
        }
        // When parser.feed succeed but does not have any parser.results
        if (parser.results.length === 0) {
            return {
                key: rest_client_1.CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX,
                start: tokenStart + tokenValue.length,
                end: tokenStart + tokenValue.length
            };
        }
        if (!Object.values(rest_client_1.CustomActionVariable).includes(parser.results[0].variable.value)) {
            return {
                key: rest_client_1.CustomActionParsingErrorKey.INVALID_VARIABLE,
                start: tokenStart + parser.results[0].variable.offset,
                end: tokenStart + parser.results[0].variable.offset + parser.results[0].variable.value.length
            };
        }
        return parser.results[0];
    };
    /**
     * Return the type of a custom action or an incompatible-type-combination
     */
    CustomActionTemplate.resolveCustomActionType = function (variables) {
        var errors = [];
        var referenceVariable = undefined;
        for (var _i = 0, variables_1 = variables; _i < variables_1.length; _i++) {
            var _a = variables_1[_i], value = _a.value, offset = _a.offset;
            // Graph variables are ignored as they are compatible with all variables
            if (value === SOURCE_KEY || value === VISUALIZATION || value === BASE_URL) {
                continue;
            }
            // The first variable's value determines our template type
            if (!utils_1.hasValue(referenceVariable)) {
                referenceVariable = value;
                continue;
            }
            // If the first variable is nodeset or edgeset, we don't allow more variables
            // If the first variable is node or edge, all variables have to be the same variable
            if (referenceVariable === NODE_SET ||
                referenceVariable === EDGE_SET ||
                referenceVariable !== value) {
                errors.push({
                    key: rest_client_1.CustomActionParsingErrorKey.INVALID_TEMPLATE_COMBINATION,
                    start: offset,
                    end: offset + value.length,
                    variables: [referenceVariable, value]
                });
            }
        }
        if (errors.length > 0) {
            return { errors: errors };
        }
        return referenceVariable || rest_client_1.CustomActionType.NON_GRAPH;
    };
    return CustomActionTemplate;
}());
exports.default = CustomActionTemplate;
//# sourceMappingURL=index.js.map