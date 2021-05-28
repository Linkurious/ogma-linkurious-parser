import {
  ItemSelector,
  LkEdgeData,
  LkNodeData,
  IRangeValues,
  SelectorType,
  ISelectorAny,
  ISelectorIs,
  ISelectorNoValue,
  ISelectorNaN,
  ISelectorRange,
  LkItemData
} from '@linkurious/rest-client';

import {Tools} from '../tools/tools';

type FilterFunction<T extends LkItemData> = (itemData: T) => boolean;

export class Filters {
  private static nodeCache: Map<string, FilterFunction<LkNodeData>> = new Map();
  private static edgeCache: Map<string, FilterFunction<LkEdgeData>> = new Map();
  private static FILTER_CACHE_SIZE = 5;

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
  public static isFiltered(
    filterRules: Array<ItemSelector>,
    itemData: LkNodeData | LkEdgeData
  ): boolean {
    if (!Tools.isDefined(itemData)) {
      return false;
    }

    if ('categories' in itemData) {
      return this.getFilterFunction(filterRules, true)(itemData);
    } else {
      return this.getFilterFunction(filterRules, false)(itemData);
    }
  }

  private static getFilterFunction<T extends LkNodeData | LkEdgeData>(
    filterRules: Array<ItemSelector>,
    isNode: boolean
  ): FilterFunction<T> {
    const filterKey = JSON.stringify(filterRules, null, '');

    // This cast is needed to tell the TypeScript compiler to trust us that "isNode" and "T" are dependent.
    const filterCache = (isNode ? this.nodeCache : this.edgeCache) as Map<
      string,
      FilterFunction<T>
    >;

    let filterFunc = filterCache.get(filterKey);
    if (!filterFunc) {
      filterFunc = this.createFilterFunction(filterRules, isNode);
      if (filterCache.size > this.FILTER_CACHE_SIZE) {
        filterCache.clear();
      }
      filterCache.set(filterKey, filterFunc);
    }
    return filterFunc;
  }

  private static createFilterFunction<T extends LkNodeData | LkEdgeData>(
    filterRules: Array<ItemSelector>,
    isNode: boolean
  ): FilterFunction<T> {
    const filterFunctions = filterRules.map((filter: ItemSelector) =>
      this.filterToFilterFunction(filter, isNode)
    );

    /**
     * For each filterFunction, as soon as we find a filterFunction that says that a given
     * node/edge should be filtered/hidden, we return `true` for the node/edge.
     */
    return (itemData: T): boolean => {
      for (const filterFunction of filterFunctions) {
        if (filterFunction(itemData)) {
          return true;
        }
      }
      return false;
    };
  }

  private static filterToFilterFunction<T extends LkNodeData | LkEdgeData>(
    filter: ItemSelector,
    isNode: boolean
  ): FilterFunction<T> {
    switch (filter.type) {
      case SelectorType.ANY:
        return this.createAnyFilterFunction(filter, isNode);
      case SelectorType.IS:
        return this.createIsFilterFunction(filter, isNode);
      case SelectorType.NO_VALUE:
        return this.createNoValueFilterFunction(filter, isNode);
      case SelectorType.RANGE:
        return this.createRangeFilterFunction(filter, isNode);
      case SelectorType.NAN:
        return this.createNaNFilterFunction(filter, isNode);
    }
  }

  private static createAnyFilterFunction<T extends LkNodeData | LkEdgeData>(
    filter: ISelectorAny,
    isNode: boolean
  ): FilterFunction<T> {
    if (isNode) {
      return (itemData: T) => {
        if (filter.itemType === undefined) {
          return true;
        }
        return (itemData as LkNodeData).categories.includes(filter.itemType);
      };
    } else {
      // isEdge
      return (itemData: T) => (itemData as LkEdgeData).type === filter.itemType;
    }
  }

  private static createIsFilterFunction<T extends LkNodeData | LkEdgeData>(
    filter: ISelectorIs,
    isNode: boolean
  ): FilterFunction<T> {
    if (isNode) {
      return (itemData: T) =>
        (itemData as LkNodeData).categories.includes(filter.itemType) &&
        Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true) === filter.value;
    } else {
      // isEdge
      return (itemData: T) =>
        (itemData as LkEdgeData).type === filter.itemType &&
        Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true) === filter.value;
    }
  }

  private static createNoValueFilterFunction<T extends LkNodeData | LkEdgeData>(
    filter: ISelectorNoValue,
    isNode: boolean
  ): FilterFunction<T> {
    if (isNode) {
      return (itemData: T) =>
        (itemData as LkNodeData).categories.includes(filter.itemType) &&
        !Tools.isDefined(Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true));
    } else {
      // isEdge
      return (itemData: T) =>
        (itemData as LkEdgeData).type === filter.itemType &&
        !Tools.isDefined(Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true));
    }
  }

  private static createNaNFilterFunction<T extends LkNodeData | LkEdgeData>(
    filter: ISelectorNaN,
    isNode: boolean
  ): FilterFunction<T> {
    if (isNode) {
      return (itemData: T) =>
        (itemData as LkNodeData).categories.includes(filter.itemType) &&
        this.isNotANumber(Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true));
    } else {
      // isEdge
      return (itemData: T) =>
        (itemData as LkEdgeData).type === filter.itemType &&
        this.isNotANumber(Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true));
    }
  }

  private static isNotANumber(value: any) {
    return Tools.isDefined(value) && !Tools.isNumber(value);
  }

  public static createRangeFilterFunction<T extends LkNodeData | LkEdgeData>(
    filter: ISelectorRange,
    isNode: boolean
  ): FilterFunction<T> {
    if (isNode) {
      return (itemData: T) =>
        (itemData as LkNodeData).categories.includes(filter.itemType) &&
        this.valueShouldBeHidden(
          Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true),
          filter.value
        );
    } else {
      // isEdge
      return (itemData: T) =>
        (itemData as LkEdgeData).type === filter.itemType &&
        this.valueShouldBeHidden(
          Tools.getPropertyValue(Tools.getIn(itemData, filter.input), true),
          filter.value
        );
    }
  }

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
  public static valueShouldBeHidden(value: unknown, range: IRangeValues): boolean {
    const n = Tools.parseFloat(value);
    if (Number.isNaN(n)) {
      return false;
    }

    /**
     * As soon as we find a condition that says that `value` should be filtered/hidden,
     * we return `true`.
     *
     * If `range` contains multiple conditions, all are checked and if any condition causes
     * `value` to be in the filtered/hidden range, we return `true`.
     *
     * If no condition causes `value` to be filtered/hidden, we return `false`.
     */
    return (
      (range['<'] !== undefined && n < range['<']) ||
      (range['<='] !== undefined && n <= range['<=']) ||
      (range['>'] !== undefined && n > range['>']) ||
      (range['>='] !== undefined && n >= range['>='])
    );
  }
}
