/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */
import { EdgeStyle, IStyleRule, LkEdgeData, LkNodeData, NodeStyle, SelectorType, StyleIcon, StyleImage } from '@linkurious/rest-client';
import { StyleRule } from './styleRule';
export declare enum StyleType {
    COLOR = "color",
    ICON = "icon",
    SIZE = "size",
    IMAGE = "image",
    SHAPE = "shape",
    WIDTH = "width"
}
export interface Legend {
    [key: string]: Array<{
        label: string;
        value: string | StyleIcon | StyleImage | number;
    }>;
}
export declare const SORTING_RULE: string[];
export declare class StyleRules {
    private _rules;
    constructor(rules: Array<IStyleRule<NodeStyle | EdgeStyle>>);
    /**
     * Return an array of StyleRule with only 'color' rules and sorted by specificity, itemType and index
     *
     * @return {Array<StyleRule>}
     */
    get color(): Array<StyleRule>;
    /**
     * Return an array of StyleRule with only 'icon' rules and sorted by specificity, itemType and index
     *
     * @return {Array<StyleRule>}
     */
    get icon(): Array<StyleRule>;
    /**
     * Return an array of StyleRule with only 'image' rules and sorted by specificity, itemType and index
     *
     * @return {Array<StyleRule>}
     */
    get image(): Array<StyleRule>;
    /**
     * Return an array of StyleRule with only 'shape' rules and sorted by specificity, itemType and index
     *
     * @return {Array<StyleRule>}
     */
    get shape(): Array<StyleRule>;
    /**
     * Return an array of StyleRule with only 'size' rules and sorted by specificity, itemType and index
     *
     * @return {Array<StyleRule>}
     */
    get size(): Array<StyleRule>;
    /**
     * Return an array of StyleRule with only 'width' rules and sorted by specificity, itemType and index
     *
     * @return {Array<StyleRule>}
     */
    get width(): Array<StyleRule>;
    /**
     * Return an object containing for each node style a sorted array of StyleRule
     *
     * @return {any}
     */
    get nodeRules(): {
        [key: string]: Array<StyleRule>;
    };
    /**
     * Return an object containing for each edge style a sorted array of StyleRule
     *
     * @return {any}
     */
    get edgeRules(): {
        [key: string]: Array<StyleRule>;
    };
    /**
     * Generate a legend with an array of style rules and existing items in visualization
     */
    generateLegend(itemsData: Array<LkNodeData | LkEdgeData>): Legend;
    /**
     * Return the legend for a specific style type (color, icon, image...)
     */
    static getLegendForStyle(styleType: string, styles: Array<StyleRule>, itemsData: Array<LkNodeData | LkEdgeData>): Array<{
        label: string;
        value: string | number | StyleIcon | StyleImage;
    }>;
    /**
     * Sanitize value for legend
     */
    static sanitizeValue(styleType: SelectorType, value: any): string;
    /**
     * Add items in legend for automatic coloring
     */
    static addLegendAutoColors(itemsData: Array<LkNodeData | LkEdgeData>, styleRule: StyleRule, currentLegend: Array<{
        label: string;
        value: string | number | StyleIcon | StyleImage;
    }>): void;
    /**
     * Return the label of item type for a legend item
     */
    static getTypeLabel(type: string | undefined): string;
    /**
     * Check if a legend item already exists and overwrite it / push it
     */
    static updateLegend(legend: Array<{
        label: string;
        value: string | number | StyleIcon | StyleImage;
    }>, { label, value }: {
        [key: string]: string;
    }): void;
    /**
     * return an array of StyleRule, containing only the desired style
     */
    static getBy(styleType: StyleType, rules: Array<IStyleRule<NodeStyle | EdgeStyle>>): Array<StyleRule>;
    /**
     * From a RawStyle, generate a StyleRule of a specific style
     */
    static getRule(rawRule: IStyleRule<NodeStyle | EdgeStyle>, styleType: StyleType): StyleRule;
}
