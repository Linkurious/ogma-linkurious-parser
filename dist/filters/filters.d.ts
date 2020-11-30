/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by andrebarata on 2018-05-22.
 */
import { ItemSelector, LkEdgeData, LkNodeData, RangeValues, SelectorRange, LkItemData } from '@linkurious/rest-client';
declare type FilterFunction<T extends LkItemData> = (itemData: T) => boolean;
export declare class Filters {
    private static nodeCache;
    private static edgeCache;
    private static FILTER_CACHE_SIZE;
    /**
     * Returns whether the node/edge should be *filtered* (a.k.a. *hidden*).
     *
     * Notes:
     * 1. `filterRules` are rules that match what should be filtered/hidden.
     * 2. `filterRules` are combined inclusively: as soon as one rule returns `true` for
     *    an item, the item can be hidden/filtered.
     *
     * @param filterRules
     * @param itemData
     */
    static isFiltered(filterRules: Array<ItemSelector>, itemData: LkNodeData | LkEdgeData): boolean;
    private static getFilterFunction;
    private static createFilterFunction;
    private static filterToFilterFunction;
    private static createAnyFilterFunction;
    private static createIsFilterFunction;
    private static createNoValueFilterFunction;
    private static createNaNFilterFunction;
    private static isNotANumber;
    static createRangeFilterFunction<T extends LkNodeData | LkEdgeData>(filter: SelectorRange, isNode: boolean): FilterFunction<T>;
    /**
     * Returns true if `value` should be filtered/hidden.
     *
     * `range` describes what should be filtered/hidden:
     * - e.g. {"<":10, ">=":20} => hide any value in ]-inf, 10[ *OR* in [20, +inf[
     * - e.g. {"<=":10}         => hide any value in ]-inf, 10]
     * - e.g. {">=":20}         => hide any value in [20, +inf[
     *
     * Returns false (i.e. will not filter/hide) if `value` is not a number.
     */
    static valueShouldBeHidden(value: unknown, range: RangeValues): boolean;
}
export {};
