import * as o from 'ogma';
export declare type RawItem<ND, ED> = RawNode<ND> | RawEdge<ED>;
export interface RawNode<ND> extends o.RawNode {
    data: ND;
}
export interface RawEdge<ED> extends o.RawEdge {
    data: ED;
}
export interface RawGraph<ND, ED> extends o.RawGraph {
    nodes: RawNode<ND>[];
    edges: RawEdge<ED>[];
}
export interface Item<ND, ED> extends o.Item {
    setData(value: ND | ((item: Item<ND, ED>) => ND)): Item<ND, ED>;
    setData<K1 extends keyof ND>(property: K1, value: ND[K1] | ((item: Item<ND, ED>) => ND[K1])): Item<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2], value: ND[K1][K2] | ((item: Item<ND, ED>) => ND[K1][K2])): Item<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3], value: ND[K1][K2][K3] | ((item: Item<ND, ED>) => ND[K1][K2][K3])): Item<ND, ED>;
    getData<K1 extends keyof ND>(property: K1 | [K1]): ND[K1];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2]): ND[K1][K2];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3]): ND[K1][K2][K3];
    getData(): ND;
    toJSON(options?: {
        attributes?: o.PropertyPath[] | 'all';
        data?: (data: any) => any;
    }): RawItem<ND, ED>;
    toList(): ItemList<ND, ED>;
}
export interface ItemList<ND, ED> extends o.ItemList {
    concat(items: ItemList<ND, ED>): ItemList<ND, ED>;
    dedupe(): ItemList<ND, ED>;
    fillData(value: any): ItemList<ND, ED>;
    filter(callback: (item: Item<ND, ED>, index: number) => boolean): ItemList<ND, ED>;
    forEach(callback: (item: Item<ND, ED>, index: number) => void): void;
    get(index: number): Item<ND, ED>;
    getData(): ND[];
    getData<K1 extends keyof ND>(property: K1 | [K1]): ND[K1][];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2]): ND[K1][K2][];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3]): ND[K1][K2][K3][];
    includes(item: Item<ND, ED>): boolean;
    inverse(): ItemList<ND, ED>;
    map(callback: (item: Item<ND, ED>, index: number) => any): any[];
    setData(values: ND[] | ((item: Node<ND, ED>) => ND)): ItemList<ND, ED>;
    setData<K1 extends keyof ND>(property: K1 | [K1], values: ND[K1][] | ((item: Node<ND, ED>) => ND[K1])): ItemList<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2], values: ND[K1][K2][] | ((item: Node<ND, ED>) => ND[K1][K2])): ItemList<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3], values: ND[K1][K2][K3][] | ((item: Node<ND, ED>) => ND[K1][K2][K3])): ItemList<ND, ED>;
    fillData(values: ND[] | ((item: Node<ND, ED>) => ND)): ItemList<ND, ED>;
    fillData<K1 extends keyof ND>(property: K1 | [K1], value: ND[K1] | ((item: Node<ND, ED>) => ND[K1])): ItemList<ND, ED>;
    fillData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2], value: ND[K1][K2] | ((item: Node<ND, ED>) => ND[K1][K2][])): ItemList<ND, ED>;
    fillData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3], value: ND[K1][K2][K3] | ((item: Node<ND, ED>) => ND[K1][K2][K3])): ItemList<ND, ED>;
    slice(start?: number, end?: number): ItemList<ND, ED>;
    toArray(): Item<ND, ED>[];
    toJSON(options?: {
        attributes?: o.PropertyPath[] | 'all';
        data?: (data: any) => any;
    }): RawItem<ND, ED>[];
    toList(): ItemList<ND, ED>;
}
export interface Node<ND, ED> extends o.Node {
    getAdjacentNodes(options: o.AdjacencyOptions): NodeList<ND, ED>;
    getAdjacentEdges(options?: o.AdjacencyOptions): EdgeList<ED, ND>;
    toList(): NodeList<ND, ED>;
    slice(): NodeList<ND, ED>;
    toJSON(options?: {
        attributes?: Array<o.PropertyPath> | 'all';
        data?: (data: any) => any;
    }): RawNode<ND>;
    get(index: number): this;
    getId(): string;
    setData(value: ND | ((node: Node<ND, ED>) => ND)): Node<ND, ED>;
    setData<K1 extends keyof ND>(property: K1, value: ND[K1] | ((node: Node<ND, ED>) => ND[K1])): Node<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2], value: ND[K1][K2] | ((node: Node<ND, ED>) => ND[K1][K2])): Node<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3], value: ND[K1][K2][K3] | ((node: Node<ND, ED>) => ND[K1][K2][K3])): Node<ND, ED>;
    getData<K1 extends keyof ND>(property: K1 | [K1]): ND[K1];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2]): ND[K1][K2];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3]): ND[K1][K2][K3];
    getData(): ND;
    addClass(className: string, options?: o.AttributeAnimationOptions): Promise<Node<ND, ED>>;
    addClasses(classNames: Array<string>, options?: o.AttributeAnimationOptions): Promise<Node<ND, ED>>;
    removeClass(className: string, options?: o.AttributeAnimationOptions): Promise<Node<ND, ED>>;
    removeClasses(classNames: string[], options?: o.AttributeAnimationOptions): Promise<Node<ND, ED>>;
    setGeoCoordinates(coords: o.GeoCoordinate | null, duration?: number): Promise<Node<ND, ED>>;
    getMetaNode(): Node<ND, ED> | null;
    getSubNodes(): NodeList<ND, ED> | null;
}
export interface NodeList<ND, ED> extends o.NodeList {
    getAdjacentNodes(options?: o.AdjacencyOptions): NodeList<ND, ED>;
    getAdjacentEdges(options?: o.AdjacencyOptions): EdgeList<ED, ND>;
    getConnectedComponents(options: {
        filter?: 'visible';
        returnIds?: boolean;
    }): Array<NodeList<ND, ED>>;
    toList(): NodeList<ND, ED>;
    toArray(): Array<Node<ND, ED>>;
    get(index: number): Node<ND, ED>;
    getId(): Array<string>;
    forEach(callback: (node: Node<ND, ED>, index: number) => void): void;
    map<T>(callback: (node: Node<ND, ED>, index: number) => T): Array<T>;
    filter(callback: (node: Node<ND, ED>, index: number) => boolean): NodeList<ND, ED>;
    dedupe(): NodeList<ND, ED>;
    slice(start: number, end: number): NodeList<ND, ED>;
    includes(node: Node<ND, ED>): boolean;
    inverse(): NodeList<ND, ED>;
    toJSON(options?: {
        attributes?: Array<o.PropertyPath> | 'all';
        data?: (data: unknown) => unknown;
    }): Array<RawNode<ND>>;
    setData(values: ND[] | ((node: Node<ND, ED>) => ND)): NodeList<ND, ED>;
    setData<K1 extends keyof ND>(property: K1 | [K1], values: ND[K1][] | ((node: Node<ND, ED>) => ND[K1])): NodeList<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2], values: ND[K1][K2][] | ((node: Node<ND, ED>) => ND[K1][K2])): NodeList<ND, ED>;
    setData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3], values: ND[K1][K2][K3][] | ((node: Node<ND, ED>) => ND[K1][K2][K3])): NodeList<ND, ED>;
    fillData(values: ND[] | ((node: Node<ND, ED>) => ND)): NodeList<ND, ED>;
    fillData<K1 extends keyof ND>(property: K1 | [K1], value: ND[K1] | ((node: Node<ND, ED>) => ND[K1])): NodeList<ND, ED>;
    fillData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2], value: ND[K1][K2] | ((node: Node<ND, ED>) => ND[K1][K2][])): NodeList<ND, ED>;
    fillData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3], value: ND[K1][K2][K3] | ((node: Node<ND, ED>) => ND[K1][K2][K3])): NodeList<ND, ED>;
    getData(): ND[];
    getData<K1 extends keyof ND>(property: K1 | [K1]): ND[K1][];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1]>(property: [K1, K2]): ND[K1][K2][];
    getData<K1 extends keyof ND, K2 extends keyof ND[K1], K3 extends keyof ND[K1][K2]>(property: [K1, K2, K3]): ND[K1][K2][K3][];
    getMetaNode(): Array<Node<ND, ED> | null>;
    getSubNodes(): Array<NodeList<ND, ED> | null>;
}
export interface Edge<ED, ND> extends o.Edge {
    getParallelEdges(options: any): EdgeList<ED, ND>;
    fastGetAdjacentElements(): {
        nodes: NodeList<ND, ED>;
        edges: EdgeList<ED, ND>;
    };
    toList(): EdgeList<ED, ND>;
    getSource(): Node<ND, ED>;
    getTarget(): Node<ND, ED>;
    getExtremities(): NodeList<ND, ED>;
    setSource(source: Node<ND, ED>): void;
    setTarget(target: Node<ND, ED>): void;
    toJSON(options?: {}): RawEdge<ED>;
    get(index: number): this;
    getId(): string;
    setData(value: ED | ((edge: Edge<ED, ND>) => ED)): Edge<ED, ND>;
    setData<K1 extends keyof ED>(property: K1 | [K1], value: ED[K1] | ((edge: Edge<ED, ND>) => ED[K1])): Edge<ED, ND>;
    setData<K1 extends keyof ED, K2 extends keyof ED[K1]>(property: [K1, K2], value: ED[K1][K2] | ((edge: Edge<ED, ND>) => ED[K1][K2])): Edge<ED, ND>;
    setData<K1 extends keyof ED, K2 extends keyof ED[K1], K3 extends keyof ED[K1][K2]>(property: [K1, K2, K3], value: ED[K1][K2][K3] | ((edge: Edge<ED, ND>) => ED[K1][K2][K3])): Edge<ED, ND>;
    getData<K1 extends keyof ED>(property: K1 | [K1]): ED[K1];
    getData<K1 extends keyof ED, K2 extends keyof ED[K1]>(property: [K1, K2]): ED[K1][K2];
    getData<K1 extends keyof ED, K2 extends keyof ED[K1], K3 extends keyof ED[K1][K2]>(property: [K1, K2, K3]): ED[K1][K2][K3];
    getData(): ED;
    addClass(className: string, options?: o.AttributeAnimationOptions): Promise<Edge<ED, ND>>;
    addClasses(classNames: Array<string>, options: o.AttributeAnimationOptions): Promise<Edge<ED, ND>>;
    removeClass(className: string, options?: o.AttributeAnimationOptions): Promise<Edge<ED, ND>>;
    removeClasses(classNames: string[], options: o.AttributeAnimationOptions): Promise<Edge<ED, ND>>;
    getMetaEdge(): Edge<ED, ND> | null;
    getSubEdges(): EdgeList<ED, ND> | null;
}
export interface EdgeList<ED, ND> extends o.EdgeList {
    getParallelEdges(options?: {
        filter?: 'visible' | 'raw' | 'all';
    }): EdgeList<ED, ND>;
    fastGetAdjacentElements(): EdgeList<ED, ND>;
    toList(): EdgeList<ED, ND>;
    toArray(): Array<Edge<ED, ND>>;
    getId(): Array<string>;
    getSource(): NodeList<ND, ED>;
    getTarget(): NodeList<ND, ED>;
    getExtremities(): NodeList<ND, ED>;
    get(index: number): Edge<ED, ND>;
    getId(): Array<string>;
    forEach(callback: (edge: Edge<ED, ND>, index: number) => void): void;
    map(callback: (edge: Edge<ED, ND>, index: number) => any): Array<any>;
    filter(callback: (edge: Edge<ED, ND>, index: number) => boolean): EdgeList<ED, ND>;
    reduce(callback: (accumulator: any, currentValue: Edge<ED, ND>, index: number) => any, initialValue: any): any;
    concat(edges: EdgeList<ED, ND>): EdgeList<ED, ND>;
    dedupe(): EdgeList<ED, ND>;
    slice(start: number, end: number): EdgeList<ED, ND>;
    includes(edge: Edge<ED, ND>): boolean;
    inverse(): EdgeList<ED, ND>;
    toJSON(options?: {}): RawEdge<ED>[];
    setData(values: ED[] | ((edge: Edge<ND, ED>) => ED)): EdgeList<ED, ND>;
    setData<K1 extends keyof ED>(property: K1 | [K1], values: ED[K1][] | ((edge: Edge<ED, ND>) => ED[K1])): EdgeList<ED, ND>;
    setData<K1 extends keyof ED, K2 extends keyof ED[K1]>(property: [K1, K2], values: ED[K1][K2][] | ((edge: Edge<ED, ND>) => ED[K1][K2][])): EdgeList<ED, ND>;
    setData<K1 extends keyof ED, K2 extends keyof ED[K1], K3 extends keyof ED[K1][K2]>(property: [K1, K2, K3], values: ED[K1][K2][K3][] | ((edge: Edge<ED, ND>) => ED[K1][K2][K3])): EdgeList<ED, ND>;
    fillData(values: ED[] | ((edge: Edge<ED, ND>) => ED)): EdgeList<ED, ND>;
    fillData<K1 extends keyof ED>(property: K1 | [K1], value: ED[K1] | ((edge: Edge<ED, ND>) => ED[K1])): EdgeList<ED, ND>;
    fillData<K1 extends keyof ED, K2 extends keyof ED[K1]>(property: [K1, K2], value: ED[K1][K2] | ((edge: Edge<ED, ND>) => ED[K1][K2][])): EdgeList<ED, ND>;
    fillData<K1 extends keyof ED, K2 extends keyof ED[K1], K3 extends keyof ED[K1][K2]>(property: [K1, K2, K3], value: ED[K1][K2][K3] | ((edge: Edge<ED, ND>) => ED[K1][K2][K3])): EdgeList<ED, ND>;
    getData(): ND[];
    getData<K1 extends keyof ED>(property: K1 | [K1]): ED[K1][];
    getData<K1 extends keyof ED, K2 extends keyof ED[K1]>(property: [K1, K2]): ED[K1][K2][];
    getData<K1 extends keyof ED, K2 extends keyof ED[K1], K3 extends keyof ED[K1][K2]>(property: [K1, K2, K3]): ED[K1][K2][K3][];
    addClass(className: string, options?: o.AttributeAnimationOptions): Promise<EdgeList<ED, ND>>;
    addClasses(classNames: Array<string>, options: o.AttributeAnimationOptions): Promise<EdgeList<ED, ND>>;
    removeClass(className: string, options?: o.AttributeAnimationOptions): Promise<EdgeList<ED, ND>>;
    removeClasses(classNames: string[], options: o.AttributeAnimationOptions): Promise<EdgeList<ED, ND>>;
    getMetaEdge(): Array<Edge<ED, ND> | null>;
    getSubEdges(): Array<EdgeList<ED, ND> | null>;
}
