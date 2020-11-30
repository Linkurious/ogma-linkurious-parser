import * as o from 'ogma';
import { LkEdgeData, LkNodeData } from '@linkurious/rest-client';
import { LKOgma } from '../index';
import { EdgeList, NodeList } from '../models';
import { OgmaStore } from './OgmaStore';
export interface OgmaState {
    selection: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>;
    items: {
        node: Array<string | number>;
        edge: Array<string | number>;
    };
    changes: {
        entityType: 'node' | 'edge';
        input: o.PropertyPath;
        value: any;
    } | undefined;
    animation: boolean;
}
export declare class RxViz {
    private _ogma;
    private _store;
    private _animationThrottle;
    constructor(ogma: LKOgma);
    get store(): OgmaStore;
    /**
     * Store new items in state
     */
    private storeItems;
    /**
     * Store new node selection in state
     */
    private storeNodeSelection;
    /**
     * store new edge selection in state
     */
    private storeEdgeSelection;
    /**
     * Listen to ogma events and update the state
     */
    private listenToSelectionEvents;
}
export declare class DummyNodeList {
    size: number;
    isNode: boolean;
}
