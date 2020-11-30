/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */
import { CaptionConfig, ItemFieldsCaptions, LkEdgeData, LkNodeData } from '@linkurious/rest-client';
export declare class Captions {
    /**
     * Return label for each node
     */
    static getText(itemData: LkNodeData | LkEdgeData, schema: ItemFieldsCaptions): string | null;
    /**
     * Return a readable string from an LkProperty
     */
    private static getLabel;
    /**
     * Return true if caption configuration exists in schema
     */
    static captionExist(itemTypes: Array<string>, schema: ItemFieldsCaptions): boolean;
    /**
     * Generate text from node data and captions schema
     */
    static generateNodeCaption(itemData: LkNodeData, schema: {
        [key: string]: CaptionConfig;
    }): string;
    /**
     * Generate text from edge data and captions schema
     */
    static generateEdgeCaption(itemData: LkEdgeData, schema: {
        [key: string]: CaptionConfig;
    }): string;
}
