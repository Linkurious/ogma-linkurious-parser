'use strict';

import Ogma, {NodeList, EdgeList} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData} from '@linkurious/rest-client';

import {LKOgma} from '../index';

import {OgmaStore} from './OgmaStore';

export interface OgmaState {
  selection: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>;
  items: {node: Array<string | number>; edge: Array<string | number>};
  changes: {entityType: 'node' | 'edge'; input: string | string[] | null; value: any} | undefined;
  animation: boolean;
}

export class RxViz {
  private _ogma: Ogma;
  private _store: OgmaStore = new OgmaStore({
    selection: new DummyNodeList() as any,
    items: {node: [], edge: []},
    changes: undefined,
    animation: false
  });
  private _animationThrottle: any;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
    this.listenToSelectionEvents();
  }

  public get store(): OgmaStore {
    return this._store;
  }

  /**
   * Listen to ogma events and update the state
   */
  public listenToSelectionEvents(): void {
    let currentAnimationEnd = Date.now();
    let isCurrentlyAnimating = false;
    this._ogma.events.on('animate', (e: {duration: number}) => {
      if (!isCurrentlyAnimating) {
        isCurrentlyAnimating = true;
        this._store.dispatch((state) => ({...state, animation: true}));
      }
      const nextAnimationEnd = Math.max(currentAnimationEnd, Date.now() + e.duration);
      if (nextAnimationEnd === currentAnimationEnd) {
        return;
      }
      currentAnimationEnd = nextAnimationEnd;
      const safeAnimationTimeoutMs = currentAnimationEnd - Date.now() + 16; // animation duration + duration of a single frame at 60 fps = 16ms
      clearTimeout(this._animationThrottle);
      this._animationThrottle = setTimeout(() => {
        isCurrentlyAnimating = false;
        this._store.dispatch((state) => ({...state, animation: false}));
      }, safeAnimationTimeoutMs);
    });

    this._ogma.events.on('dragStart', () => {
      this._store.dispatch((state) => ({...state, animation: true}));
    });

    this._ogma.events.on('dragEnd', () => {
      this._store.dispatch((state) => ({...state, animation: false}));
    });

    this._ogma.events.on('addNodes', () => {
      this._store.dispatch(this.storeItems.bind(this));
    });
    this._ogma.events.on('removeNodes', () => {
      this._store.dispatch(this.storeItems.bind(this));
    });
    this._ogma.events.on('addEdges', () => {
      this._store.dispatch(this.storeItems.bind(this));
    });
    this._ogma.events.on('removeEdges', () => {
      this._store.dispatch(this.storeItems.bind(this));
    });

    this._ogma.events.on('nodesSelected', () => {
      this._store.dispatch(this.storeNodeSelection.bind(this));
    });

    this._ogma.events.on('edgesSelected', () => {
      this._store.dispatch(this.storeEdgeSelection.bind(this));
    });

    this._ogma.events.on('nodesUnselected', () => {
      this._store.dispatch(this.storeNodeSelection.bind(this));
    });

    this._ogma.events.on('edgesUnselected', () => {
      this._store.dispatch(this.storeEdgeSelection.bind(this));
    });

    this._ogma.events.on('updateNodeData', (evt) => {
      if (evt !== undefined) {
        evt.changes.forEach((change) => {
          this._store.dispatch((state) => ({
            ...state,
            changes: {
              entityType: 'node',
              input: change.property,
              value: change.newValues[0]
            }
          }));
        });
      }
    });

    this._ogma.events.on('updateEdgeData', (evt) => {
      if (evt !== undefined) {
        evt.changes.forEach((change) => {
          this._store.dispatch((state) => ({
            ...state,
            changes: {
              entityType: 'edge',
              input: change.property,
              value: change.newValues[0]
            }
          }));
        });
      }
    });
  }

  /**
   * Store new items in state
   */
  private storeItems(state: OgmaState): OgmaState {
    return {
      ...state,
      items: {
        node: this._ogma.getNodes().getId(),
        edge: this._ogma.getEdges().getId()
      }
    };
  }

  /**
   * Store new node selection in state
   */
  private storeNodeSelection(state: OgmaState): OgmaState {
    return {
      ...state,
      selection: this._ogma.getSelectedNodes()
    };
  }

  /**
   * store new edge selection in state
   */
  private storeEdgeSelection(state: OgmaState): OgmaState {
    return {
      ...state,
      selection: this._ogma.getSelectedEdges()
    };
  }
}

export class DummyNodeList {
  public size = 0;
  public isNode = true;
}
