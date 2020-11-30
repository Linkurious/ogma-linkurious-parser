/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-02-08.
 */
import { GenericObject } from '@linkurious/rest-client';
export declare enum Level {
    TEMPLATE = "template",
    FIELD = "field",
    KEY = "key",
    TYPE = "type",
    OPTIONS = "options",
    DATA = "data"
}
export declare enum Message {
    TEMPLATE_NOT_CLOSED = "Template must end with \"}}\", e.g. {{\"field1\":string}}.",
    NO_TEMPLATE_FOUND = "This query must contain at least one template.",
    EMPTY_NAME = "Name cannot be empty, e.g. {{\"field1\":string}}.",
    SINGLE_LINE_NAME = "Name must not contain line breaks.",
    MISSING_OPTIONS = "\"options\" must not be undefined.",
    EMPTY_OPTIONS = "Type \"$type\" accepts options $options.",
    AT_MOST_2_NODE_INPUT = "Templates accept at most 2 \"node\" input.",
    AT_MOST_1_NODE_SET_INPUT = "Templates accept at most 1 \"nodeset\" input.",
    CONFLICTING_TYPES = "\"$key\" cannot be both of type \"$existingType\" and of type \"$newType\".",
    CONFLICTING_OPTIONS = "\"$key\" cannot have both options \"$existingOptions\" and \"$newOptions\".",
    MIXED_NODE_NODE_SET_INPUT = "Templates do not accept a mix of nodes and nodeset inputs.",
    BUG_CANNOT_PARSE_TEMPLATE_KEY = "ParseTemplateKey was invoked on an unchecked query.",
    ENV_INPUT_WITHOUT_GRAPH_INPUT = "Templates do not accept an \"env\" input without a \"node\" or \"nodeset\" input.",
    KEY_NOT_QUOTED = "Name of template should be surrounded by quotes, e.g. {{\"field1\":string}}.",
    TYPE_MISSING = "Name should be followed by \":\" and type, e.g. {{\"field1\":string}}.",
    INVALID_TEMPLATE_FORMAT = "The format of $template is invalid.",
    MISSING_DATA = "Template data must contain the $type \"$field\".",
    PATTERN_MATCH_FAILED = "\"$key\" must match pattern $pattern.",
    INVALID_DATE = "\"$key\" must be a valid date.",
    INVALID_TIMEZONE = "\"$key\" must be a valid timezone.",
    NOT_BEFORE = "\"$key\" must be after $min.",
    NOT_AFTER = "\"$key\" must be before $max.",
    NOT_UNIQUE_ENUM = "Enum values must be unique."
}
export declare class ParserError extends Error {
    readonly level: Level;
    private constructor();
    static errorMessage(message: string, data?: GenericObject<string>): string;
    static template(message: Message, data?: GenericObject<string>): ParserError;
    static field(message: Message, data?: GenericObject<string>): ParserError;
    static key(message: Message, data?: GenericObject<string>): ParserError;
    static type(message: Message, data?: GenericObject<string>): ParserError;
    static options(message: Message, data?: GenericObject<string>): ParserError;
    static data(message: Message, data?: GenericObject<string>): ParserError;
}
