'use strict';

import Ogma, {NodeList, EdgeList} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData} from '@linkurious/rest-client';

import {ANIMATION_DURATION, LKOgma} from '../index';

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
      selection: this._ogma.getSelectedNodes() as NodeList<LkNodeData, LkEdgeData>
    };
  }

  /**
   * store new edge selection in state
   */
  private storeEdgeSelection(state: OgmaState): OgmaState {
    return {
      ...state,
      selection: this._ogma.getSelectedEdges() as EdgeList<LkEdgeData, LkNodeData>
    };
  }

  /**
   * Listen to ogma events and update the state
   */
  private listenToSelectionEvents(): void {
    let count = 0;
    (this._ogma as any).modules.events.on('animate', (e: {duration: number}) => {
      const animationEnd = ++count;
      this._store.dispatch((state) => ({...state, animation: true}));
      clearTimeout(this._animationThrottle);
      this._animationThrottle = setTimeout(() => {
        if (count === animationEnd) {
          this._store.dispatch((state) => ({...state, animation: false}));
        }
      }, e.duration + ANIMATION_DURATION + 100);
    });

    this._ogma.events.onDragStart(() => {
      this._store.dispatch((state) => ({...state, animation: true}));
    });

    this._ogma.events.onDragEnd(() => {
      this._store.dispatch((state) => ({...state, animation: false}));
    });

    this._ogma.events.onNodesAdded(() => {
      this._store.dispatch(this.storeItems.bind(this));
    });
    this._ogma.events.onNodesRemoved(() => {
      this._store.dispatch(this.storeItems.bind(this));
    });
    this._ogma.events.onEdgesAdded(() => {
      this._store.dispatch(this.storeItems.bind(this));
    });
    this._ogma.events.onEdgesRemoved(() => {
      this._store.dispatch(this.storeItems.bind(this));
    });

    this._ogma.events.onNodesSelected(() => {
      this._store.dispatch(this.storeNodeSelection.bind(this));
    });

    this._ogma.events.onEdgesSelected(() => {
      this._store.dispatch(this.storeEdgeSelection.bind(this));
    });

    this._ogma.events.onNodesUnselected(() => {
      this._store.dispatch(this.storeNodeSelection.bind(this));
    });

    this._ogma.events.onEdgesUnselected(() => {
      this._store.dispatch(this.storeEdgeSelection.bind(this));
    });

    this._ogma.events.onNodeDataChange((evt) => {
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

    this._ogma.events.onEdgeDataChange((evt) => {
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
}

export class DummyNodeList {
  public size = 0;
  public isNode = true;
}
