'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
/**
 * Return the current size of the selection
 */
exports.getSelectionSize = function (state) {
    return state.selection.size;
};
/**
 * Return the current state of the selection
 */
exports.getSelectionState = function (state) {
    switch (state.selection.size) {
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
exports.getSelectionEntity = function (state) {
    if (state.selection.size === 0) {
        return undefined;
    }
    return state.selection.isNode ? 'node' : 'edge';
};
/**
 * Return the item selection if there's only one item selected
 */
exports.getUniqSelection = function (state) {
    return state.selection.size === 1 ? state.selection.get(0) : undefined;
};
/**
 * Return the types of the current selection (if only one item is selected)
 */
exports.getUniqSelectionTypes = function (state) {
    var uniqSelection = exports.getUniqSelection(state);
    if (uniqSelection === undefined) {
        return undefined;
    }
    if (__1.Tools.isNode(uniqSelection)) {
        return uniqSelection.getData('categories');
    }
    else {
        return [uniqSelection.getData('type')];
    }
};
/**
 * Return the entityType of the current selection if there's only one item selected
 */
exports.getUniqSelectionEntity = function (state) {
    var uniqSelection = exports.getUniqSelection(state);
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
exports.getSelectionProperties = function (state) {
    var uniqSelection = exports.getUniqSelection(state);
    if (uniqSelection !== undefined) {
        var properties_1 = uniqSelection.getData().properties;
        return Object.keys(properties_1).map(function (propKey) {
            return {
                key: propKey,
                value: properties_1[propKey]
            };
        });
    }
    return [];
};
/**
 * Return true if the current selection has properties
 */
exports.hasSelectionProperties = function (state) {
    return exports.getSelectionProperties(state).length > 0;
};
//# sourceMappingURL=selectors.js.map