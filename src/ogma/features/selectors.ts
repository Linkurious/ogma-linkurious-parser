'use strict';

import {EntityType, LkEdgeData, LkNodeData} from '@linkurious/rest-client';
import {Edge, ItemList, Node} from '@linkurious/ogma';

import {OgmaState} from './reactive';

export type SelectionState = 'selection' | 'multiSelection' | 'noSelection';

/**
 * Return the current size of the selection
 */
export const getSelectionSize = (state: OgmaState): number => {
  return (state.selection as ItemList<LkNodeData>).size;
};

/**
 * Return the current state of the selection
 */
export const getSelectionState = (state: OgmaState): SelectionState => {
  switch ((state.selection as ItemList<LkNodeData>).size) {
    case 1:
      return 'selection';

    case 0:
      return 'noSelection';

    default:
      return 'multiSelection';
  }
};

/**
 * Get the entityType of the current selection
 */
export const getSelectionEntity = (state: OgmaState): EntityType | undefined => {
  if (state.selection.size === 0) {
    return undefined;
  }
  return (state.selection as ItemList<LkNodeData>).isNode ? EntityType.NODE : EntityType.EDGE;
};

/**
 * Return the item selection if there's only one item selected
 */
export const getUniqSelection = (
  state: OgmaState
): Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData> | undefined => {
  return state.selection.size === 1 ? state.selection.get(0) : undefined;
};

/**
 * Return the types of the current selection (if only one item is selected)
 */
export const getUniqSelectionTypes = (state: OgmaState): Array<string> | undefined => {
  const uniqSelection = getUniqSelection(state);
  if (uniqSelection === undefined) {
    return undefined;
  }
  if (uniqSelection.isNode) {
    return uniqSelection.getData('categories');
  } else {
    return [uniqSelection.getData('type')];
  }
};

/**
 * Return the entityType of the current selection if there's only one item selected
 */
export const getUniqSelectionEntity = (state: OgmaState): 'node' | 'edge' | undefined => {
  const uniqSelection = getUniqSelection(state);
  if (uniqSelection === undefined) {
    return undefined;
  }
  if (uniqSelection.isNode) {
    return 'node';
  }
  return 'edge';
};

/**
 * Return the properties of the current selection if there's only one item selected
 */
export const getSelectionProperties = (state: OgmaState): Array<{key: string; value: any}> => {
  const uniqSelection = getUniqSelection(state);
  if (uniqSelection !== undefined) {
    const properties = uniqSelection.getData().properties;
    return Object.keys(properties).map((propKey) => {
      return {
        key: propKey,
        value: properties[propKey]
      };
    });
  }
  return [];
};

/**
 * Return true if the current selection has properties
 */
export const hasSelectionProperties = (state: OgmaState): boolean => {
  return getSelectionProperties(state).length > 0;
};