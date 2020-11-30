import { OgmaEdgeShape, OgmaNodeShape, TextOptions } from '@linkurious/rest-client';
import { LKOgma, StyleRule } from '../..';
export interface StylesConfig {
    nodeColorStyleRules: Array<StyleRule>;
    nodeIconStyleRules: Array<StyleRule>;
    nodeSizeStyleRules: Array<StyleRule>;
    nodeShapeStyleRules?: Array<StyleRule>;
    edgeColorStyleRules: Array<StyleRule>;
    edgeWidthStyleRules: Array<StyleRule>;
    edgeShapeStyleRules?: Array<StyleRule>;
}
export declare const FILTER_OPACITY = 0.2;
export declare class StylesViz {
    private _ogma;
    private _exportClass;
    private _nodeDefaultStylesRules;
    private _nodeDefaultHaloRules;
    private _edgeDefaultStylesRules;
    private _edgeDefaultHaloRules;
    private _nodeColorAttribute;
    private _ogmaNodeColor;
    private _nodeIconAttribute;
    private _ogmaNodeIcon;
    private _nodeSizeAttribute;
    private _ogmaNodeSize;
    private _nodeShapeAttribute;
    private _ogmaNodeShape;
    private _edgeColorAttribute;
    private _ogmaEdgeColor;
    private _edgeWidthAttribute;
    private _ogmaEdgeWidth;
    private _edgeShapeAttribute;
    private _ogmaEdgeShape;
    constructor(ogma: LKOgma);
    /**
     * Set nodes default styles based on the configuration
     */
    setNodesDefaultStyles(nodeStyleConf: {
        nodeRadius?: number;
        shape?: OgmaNodeShape;
        text?: TextOptions & {
            nodePosition?: 'right' | 'left' | 'top' | 'bottom' | 'center';
        };
    } | undefined): void;
    /**
     * Set edges default styles based on the configuration
     */
    setEdgesDefaultStyles(edgeStyleConf: {
        edgeWidth?: number;
        shape?: OgmaEdgeShape;
        text?: TextOptions;
    } | undefined): void;
    /**
     * Set nodes default styles based on the configuration
     */
    setNodesDefaultHalo(): void;
    /**
     * Set edges default styles based on the configuration
     */
    setEdgesDefaultHalo(): void;
    /**
     * Return the default node radius set in configuration or 5
     *
     * @returns {number}
     */
    private defaultNodeRadius;
    /**
     * Return the default edge width set in configuration or 1
     *
     * @returns {number}
     */
    private defaultEdgeWidth;
    /**
     * Check if a style property exists in the default styles object
     */
    private defaultStylesHas;
    /**
     * Set styles for the class "filtered"
     */
    setFilterClass(): void;
    /**
     * Set the class for exported nodes and edges
     */
    setExportClass(textWrappingLength?: boolean): void;
    /**
     * Set the rule to display badges
     */
    setBadgeRule(): void;
    /**
     * Delete the rule to display badges
     */
    deleteBadgeRule(): void;
    /**
     * set text overlap to true or false
     *
     * @param {boolean} overlap
     */
    toggleTextOverlap(overlap?: boolean): void;
    /**
     * refresh nodes and edge rules
     *
     */
    refreshRules(): void;
    /**
     * Create / refresh an ogma rule for node colors
     */
    refreshNodeColors(colorStyleRules: Array<StyleRule>): void;
    /**
     * Create / refresh an ogma rule for node icons
     *
     * @param {Array<any>} iconStyleRules
     */
    refreshNodeIcons(iconStyleRules: Array<StyleRule>): void;
    /**
     * Create / refresh an ogma rule for node sizes
     *
     * @param {Array<any>} sizeStyleRules
     */
    refreshNodeSize(sizeStyleRules: Array<StyleRule>): void;
    /**
     * Create / refresh an ogma rule for node images
     *
     * @param {Array<any>} shapeStyleRules
     */
    refreshNodeShape(shapeStyleRules: Array<StyleRule>): void;
    /**
     * Create / refresh an ogma rule for edge colors
     */
    refreshEdgeColors(colorStyleRules: Array<StyleRule>): void;
    /**
     * Create / refresh an ogma rule for edge width
     *
     * @param {Array<StyleRule>} widthStyleRules
     */
    refreshEdgeWidth(widthStyleRules: Array<StyleRule>): void;
    /**
     * Create / refresh an ogma rule for edge width
     *
     * @param {Array<StyleRule>} shapeStyleRules
     */
    refreshEdgeShape(shapeStyleRules: Array<StyleRule>): void;
}
