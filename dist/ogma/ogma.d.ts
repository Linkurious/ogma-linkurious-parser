/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * Created by andrebarata on 2019-01-08.
 */
import Ogma from 'ogma';
import * as o from 'ogma';
import { Filter } from 'types/utilities';
import { RawNode, NodeList, Node, RawEdge, EdgeList, Edge, RawGraph } from './models';
declare class TypedOgma<ND, ED> extends Ogma {
    addNodes(nodes: RawNode<ND>[], options?: {
        batchSize?: number;
    }): Promise<NodeList<ND, ED>>;
    addEdges(edges: RawEdge<ED>[], options?: {
        batchSize?: number;
    }): Promise<EdgeList<ED, ND>>;
    addNode(node: RawNode<ND>, options?: any): Node<ND, ED>;
    addEdge(edge: RawEdge<ED>, options?: any): Edge<ED, ND>;
    removeNodes(nodes: NodeList<ND, ED> | Node<ND, ED>[] | o.NodeId[], options?: any): Promise<void>;
    removeEdges(edges: EdgeList<ED, ND> | Edge<ED, ND>[] | o.EdgeId[], options?: any): Promise<void>;
    removeNode(node: Node<ND, ED> | o.NodeId, options?: any): Promise<void>;
    removeEdge(edge: Edge<ED, ND> | o.EdgeId, options?: any): Promise<void>;
    getNodes(selector?: o.NodeId[] | Filter | Node<ND, ED>[]): NodeList<ND, ED>;
    getEdges(selector?: o.EdgeId[] | Filter | Edge<ED, ND>[]): EdgeList<ED, ND>;
    getNode(nodeId: o.NodeId): Node<ND, ED> | undefined;
    getEdge(edgeId: o.EdgeId): Edge<ED, ND> | undefined;
    setGraph(graph: RawGraph<ND, ED>, options?: {
        batchSize?: number;
    }): Promise<{
        nodes: NodeList<ND, ED>;
        edges: EdgeList<ED, ND>;
    }>;
    addGraph(graph: RawGraph<ND, ED>, options?: {
        batchSize?: number;
        locate?: o.LocateOptions;
    }): Promise<{
        nodes: NodeList<ND, ED>;
        edges: EdgeList<ED, ND>;
    }>;
    createNodeList(): NodeList<ND, ED>;
    createEdgeList(): EdgeList<ED, ND>;
    getConnectedComponents(options?: {
        filter?: Filter;
        returnIds?: boolean;
    }): NodeList<ND, ED>[];
    getConnectedComponentByNode(node: Node<ND, ED> | o.NodeId, options?: {
        filter?: Filter;
        returnIds?: boolean;
    }): NodeList<ND, ED>;
    getNodesByClassName(className: string): NodeList<ND, ED>;
    getEdgesByClassName(className: string): EdgeList<ED, ND>;
    getHoveredElement(): Node<ND, ED> | Edge<ED, ND> | null;
    getPointerInformation(): {
        x: number;
        y: number;
        target: Node<ND, ED> | Edge<ED, ND> | null;
    };
    getSelectedNodes(): NodeList<ND, ED>;
    getNonSelectedNodes(): NodeList<ND, ED>;
    getSelectedEdges(): EdgeList<ED, ND>;
    getNonSelectedEdges(): EdgeList<ED, ND>;
}
export { TypedOgma as Ogma };
