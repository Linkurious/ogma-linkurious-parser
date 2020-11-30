import { LkEdgeData, LkNodeData } from '@linkurious/rest-client';
import { Edge, Node } from '../models';
import { OgmaState } from './reactive';
export declare type SelectionState = 'selection' | 'multiSelection' | 'noSelection';
/**
 * Return the current size of the selection
 */
export declare const getSelectionSize: (state: OgmaState) => number;
/**
 * Return the current state of the selection
 */
export declare const getSelectionState: (state: OgmaState) => SelectionState;
/**
 * Get the entityType of the current selection
 */
export declare const getSelectionEntity: (state: OgmaState) => "node" | "edge" | undefined;
/**
 * Return the item selection if there's only one item selected
 */
export declare const getUniqSelection: (state: OgmaState) => Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData> | undefined;
/**
 * Return the types of the current selection (if only one item is selected)
 */
export declare const getUniqSelectionTypes: (state: OgmaState) => string[] | undefined;
/**
 * Return the entityType of the current selection if there's only one item selected
 */
export declare const getUniqSelectionEntity: (state: OgmaState) => "node" | "edge" | undefined;
/**
 * Return the properties of the current selection if there's only one item selected
 */
export declare const getSelectionProperties: (state: OgmaState) => {
    key: string;
    value: any;
}[];
/**
 * Return true if the current selection has properties
 */
export declare const hasSelectionProperties: (state: OgmaState) => boolean;
