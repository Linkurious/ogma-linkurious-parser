/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-04-19.
 */
import { EdgeStyle, IStyleRule, LkEdgeData, LkNodeData, NodeStyle, SelectorType } from '@linkurious/rest-client';
export declare class StyleRule implements IStyleRule<NodeStyle | EdgeStyle> {
    type: SelectorType;
    input: string[] | undefined;
    index: number;
    itemType?: string;
    value: any;
    style: any;
    constructor(model: IStyleRule<NodeStyle | EdgeStyle>);
    /**
     * Return an int describing specificity of the style. 4 = very specific / 1 = not specific
     *
     * @return {number}
     */
    get specificity(): number;
    /**
     * Return true if this style match values
     */
    matchValues(itemType: string | null, input: Array<string>, value: any): boolean;
    static inputExists(type: SelectorType, input: Array<string> | undefined): input is Array<string>;
    /**
     * Return true if a style can apply to a node
     */
    canApplyTo(data: LkNodeData | LkEdgeData): boolean;
    /**
     * Return true or false on rule type 'any' if the current node match the rule
     */
    static checkAny(data: LkNodeData | LkEdgeData, style: NodeStyle | EdgeStyle): boolean;
    /**
     * Return true or false on rule type 'noValue' if the current node match the rule
     */
    static checkNoValue(data: LkNodeData | LkEdgeData, input: Array<string>): boolean;
    /**
     * Return true or false on rule type 'NaN' if the current node match the rule
     */
    static checkNan(data: LkNodeData | LkEdgeData, input: Array<string>): boolean;
    /**
     * Return true if predicate is true for the node value
     *
     * @param value
     * @param comparator
     * @return {boolean}
     */
    static checkRange(value: number, comparator: {
        [key: string]: number;
    }): boolean;
    /**
     * Return true or false on rule type 'is' if the current node match the rule
     */
    static checkIs(data: LkNodeData | LkEdgeData, input: Array<string>, value: any): boolean;
    /**
     * Check that value of itemType match for the node
     */
    static checkItemType(types: Array<string>, itemType: string | undefined): boolean;
    /**
     * Return true if itemType is defined and category exists in an array of categories
     *
     * @param {Array<string> | string} types
     * @param {string} itemType
     * @return {boolean}
     */
    static matchCategory(types: Array<string> | string, itemType: string): boolean;
    /**
     * Return true if itemType is undefined
     *
     * @param {string} itemType
     * @return {boolean}
     */
    static matchAny(itemType: any | null): boolean;
    /**
     * Return the color for a type
     */
    getTypeColor(type: string): string | undefined | null;
}
