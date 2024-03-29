'use strict';

import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

import {Tools} from '../../tools/tools';

import {DummyNodeList, OgmaState} from './reactive';

export class OgmaStore extends BehaviorSubject<OgmaState> {
  constructor(d: OgmaState) {
    super(d);
  }

  /**
   * Modify Ogma state based on a method
   */
  public dispatch(mapFn: (state: OgmaState) => OgmaState): void {
    this.next(mapFn(this.value));
  }

  /**
   * Return a piece of state
   */
  public selectStore<K>(mapFn: (state: OgmaState) => K): Observable<K> {
    return this.pipe(
      map(mapFn),
      distinctUntilChanged((p, n) => Tools.isEqual(p, n))
    );
  }

  /**
   * Clear the state of Ogma
   */
  public clear(): void {
    this.next({
      selection: new DummyNodeList() as any,
      items: {node: [], edge: []},
      changes: undefined,
      animation: false
    });
  }
}
