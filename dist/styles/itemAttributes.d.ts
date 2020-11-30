import { Color } from 'types/utilities';
import { StyleRule } from './styleRule';
export declare const BASE_GREY = "#7f7f7f";
export declare const PALETTE: string[];
export declare class ItemAttributes {
    protected colorsCache: Map<string, Color | Array<Color>>;
    protected _rulesMap: {
        color?: Array<StyleRule>;
        icon?: Array<StyleRule>;
        image?: Array<StyleRule>;
        shape?: Array<StyleRule>;
        size?: Array<StyleRule>;
        width?: Array<StyleRule>;
    };
    constructor(rulesMap: {
        color?: Array<StyleRule>;
        icon?: Array<StyleRule>;
        image?: Array<StyleRule>;
        shape?: Array<StyleRule>;
        size?: Array<StyleRule>;
        width?: Array<StyleRule>;
    });
    /**
     * Refresh the rules
     */
    refresh(rulesMap: {
        color?: Array<StyleRule>;
        icon?: Array<StyleRule>;
        image?: Array<StyleRule>;
        shape?: Array<StyleRule>;
        size?: Array<StyleRule>;
        width?: Array<StyleRule>;
    }): void;
    /**
     * Return the color for a node when style color is auto
     */
    static autoColor(value: string, ignoreCase?: boolean): string;
    /**
     * Return a number from 0 to number of occurrence in a palette based on a property
     */
    private static sha1Modulo;
    /**
     * Get color of a type
     */
    static getTypeColor(rule: StyleRule, type: string): string | null;
}
