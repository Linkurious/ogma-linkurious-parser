import * as ogma from 'ogma';
import { IOgmaConfig, LkEdgeData, LkNodeData, VizEdge, VizNode } from '@linkurious/rest-client';
import { StylesViz } from './features/styles';
import { OgmaStore } from './features/OgmaStore';
import { CaptionsViz } from './features/captions';
import { EdgeList, NodeList } from './models';
import { Ogma } from './ogma';
export declare const ANIMATION_DURATION = 750;
export declare class LKOgma extends Ogma<LkNodeData, LkEdgeData> {
    LKStyles: StylesViz;
    LKCaptions: CaptionsViz;
    store: OgmaStore;
    nodeCategoriesWatcher: ogma.NonObjectPropertyWatcher;
    edgeTypeWatcher: ogma.NonObjectPropertyWatcher;
    private readonly _multiSelectionKey;
    private _reactive;
    constructor(_configuration: IOgmaConfig);
    /**
     * Initialize selection behavior
     */
    initSelection(): void;
    /**
     * Initialize graph
     */
    init(visualization: {
        nodes: Array<VizNode>;
        edges: Array<VizEdge>;
    }): Promise<void>;
    /**
     * Return the list of non filtered nodes
     */
    getNonFilteredNodes(items?: Array<any>): NodeList<LkNodeData, LkEdgeData>;
    /**
     * Return the list of filtered nodes
     */
    getFilteredNodes(items?: Array<any>): NodeList<LkNodeData, LkEdgeData>;
    /**
     * Return the list of non filtered edges
     */
    getNonFilteredEdges(items?: Array<any>): EdgeList<LkEdgeData, LkNodeData>;
    /**
     * Return the list of filtered edges
     */
    getFilteredEdges(items?: Array<any>): EdgeList<LkEdgeData, LkNodeData>;
    /**
     * Do a full reset on ogma and streams of ogma
     */
    shutDown(): void;
    private initStyles;
    private initCaptions;
}
