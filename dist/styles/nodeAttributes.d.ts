/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */
import { Color } from 'ogma';
import { LkNodeData, OgmaNodeShape, StyleIcon, StyleImage } from '@linkurious/rest-client';
import { StyleRule } from './styleRule';
import { ItemAttributes } from './itemAttributes';
export interface OgmaImage extends StyleImage {
    url?: string;
}
export declare class NodeAttributes extends ItemAttributes {
    constructor(rulesMap: {
        color?: Array<StyleRule>;
        icon?: Array<StyleRule>;
        image?: Array<StyleRule>;
        shape?: Array<StyleRule>;
        size?: Array<StyleRule>;
    });
    /**
     * Run the callback if an item match with a style in the array of rules
     */
    private matchStyle;
    /**
     * Generate color for a given node (call only if _rulesMap.color is defined
     */
    color(itemData: LkNodeData): Color | Array<Color>;
    /**
     * Generate icon for a given node
     */
    icon(itemData: LkNodeData): {
        icon?: StyleIcon;
        image?: OgmaImage | null;
    };
    /**
     * Generate shape for a given node
     */
    shape(itemData: LkNodeData): OgmaNodeShape | undefined;
    /**
     * Generate size for a given node
     */
    size(itemData: LkNodeData): number | undefined;
    /**
     * Return an object containing all node attributes needed by Ogma to style a node
     */
    all(itemData: LkNodeData): {
        radius?: number | undefined;
        color: Color | Array<Color>;
        shape?: OgmaNodeShape | undefined;
        icon?: StyleIcon;
        image?: StyleImage | null;
    };
}
