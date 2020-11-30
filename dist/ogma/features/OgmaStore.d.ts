/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 2019-02-12.
 *
 * File: OgmaStore
 * Description :
 */
import { BehaviorSubject, Observable } from 'rxjs';
import { OgmaState } from './reactive';
export declare class OgmaStore extends BehaviorSubject<OgmaState> {
    constructor(d: OgmaState);
    /**
     * Modify Ogma state based on a method
     */
    dispatch(mapFn: (state: OgmaState) => OgmaState): void;
    /**
     * Return a piece of state
     */
    selectStore<K>(mapFn: (state: OgmaState) => K): Observable<K>;
    /**
     * Clear the state of Ogma
     */
    clear(): void;
}
