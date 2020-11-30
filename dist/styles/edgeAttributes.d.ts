/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */
import { Color } from 'ogma';
import { LkEdgeData, OgmaEdgeShape } from '@linkurious/rest-client';
import { StyleRule } from './styleRule';
import { ItemAttributes } from './itemAttributes';
export declare class EdgeAttributes extends ItemAttributes {
    constructor(rulesMap: {
        color?: Array<StyleRule>;
        shape?: Array<StyleRule>;
        width?: Array<StyleRule>;
    });
    /**
     * Run the callback if an item match with a style in the array of rules
     */
    private matchStyle;
    /**
     * Generate color for a given node (call only if _rulesMap.color exists)
     */
    color(data: LkEdgeData): Color;
    /**
     * Generate shape for a given node
     */
    shape(data: LkEdgeData): OgmaEdgeShape | undefined;
    /**
     * Generate size for a given node
     */
    width(data: LkEdgeData): string | undefined;
    /**
     * Return an object containing all node attributes needed by Ogma to style a node
     */
    all(data: LkEdgeData): {
        color: Color;
        shape: OgmaEdgeShape | undefined;
        width: string | undefined;
    };
}
