/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-13.
 */
import { CustomActionParsingError, CustomActionVariable, GraphSchema, LkEdge, LkNode, ParsedCustomAction } from '@linkurious/rest-client';
export interface ContextData {
    baseURL: string;
    sourceKey: string;
    vizId: number;
    nodes: LkNode[];
    edges: LkEdge[];
}
interface CustomActionParsedExpression {
    variable: {
        value: CustomActionVariable;
        offset: number;
    };
    itemType?: {
        value: string;
        offset: number;
    };
    property?: {
        value: string;
        offset: number;
    };
}
export default class CustomActionTemplate {
    /**
     * Encode a node or edge property value to a URL safe value.
     */
    private static encodeLkValue;
    private static isGraphItemExpression;
    private static isGraphPropertyExpression;
    /**
     * We filter out missing, invalid, conflict and undefined from LkProperties
     */
    private static getValidLkPropertyKeys;
    /**
     * Returns whether a visible custom action should be shown (enabled) or grayed out (disabled).
     */
    private static isEnabled;
    /**
     * Return a rendered custom action template.
     */
    static render(customAction: ParsedCustomAction, contextData: ContextData): string | undefined;
    /**
     * Return the parsed items from a valid custom action, or the errors from an invalid custom action.
     */
    static parse(template: string, nodeSchema?: GraphSchema, edgeSchema?: GraphSchema): ParsedCustomAction | {
        errors: CustomActionParsingError[];
    };
    /**
     * For edge and node templates, if there is one element with a type restriction:
     *  - Adds an error for all the elements that don't have restriction
     *  - Adds an error for all the elements with a restriction different than the first restriction found
     */
    private static checkIncompatibleRestrictions;
    /**
     * Return a parse expression or a parsing error.
     * Input: (node:PERSON).name
     * Output: {variable: {value: 'node', offset: 1}, itemType: {value: 'PERSON', offset: 6}, property: {value: 'name', offset: 14}}
     */
    static parseExpression(tokenValue: string, tokenStart: number, tokenEnd: number): CustomActionParsedExpression | CustomActionParsingError;
    /**
     * Return the type of a custom action or an incompatible-type-combination
     */
    private static resolveCustomActionType;
}
export {};
