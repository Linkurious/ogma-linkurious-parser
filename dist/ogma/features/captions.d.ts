import * as o from 'ogma';
import { ItemFieldsCaptions } from '@linkurious/rest-client';
import { LKOgma } from '../..';
export interface CaptionState {
    node: ItemFieldsCaptions;
    edge: ItemFieldsCaptions;
}
export declare class CaptionsViz {
    private _nodeMaxTextLength;
    private _edgeMaxTextLength;
    nodesCaptionsRule: o.StyleRule;
    edgesCaptionsRule: o.StyleRule;
    private _ogma;
    private _schema;
    private _exportCaptionClass;
    constructor(ogma: LKOgma, _nodeMaxTextLength: number | undefined, _edgeMaxTextLength: number | undefined);
    /**
     * Refresh the schema
     */
    refreshSchema(schema: CaptionState): void;
    /**
     * Create or update nodeCaptionRule
     */
    updateNodeCaptions(schema?: ItemFieldsCaptions): Promise<void>;
    /**
     * Create or update edgeCaptionRule
     */
    updateEdgeCaptions(schema?: ItemFieldsCaptions): Promise<void>;
    /**
     * Set the class for exported nodes and edges
     */
    setExportCaptionClass(textWrappingLength?: boolean): void;
}
