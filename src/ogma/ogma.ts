/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * Created by andrebarata on 2019-01-08.
 */

'use strict';

import Ogma from 'ogma';
import * as o from 'ogma';
import {Filter} from 'types/utilities';

import {RawNode, NodeList, Node, RawEdge, EdgeList, Edge, RawGraph} from './models';

class TypedOgma<ND, ED> extends Ogma {
  addNodes(nodes: RawNode<ND>[], options?: {batchSize?: number}): Promise<NodeList<ND, ED>> {
    return super.addNodes(nodes, options) as Promise<NodeList<ND, ED>>;
  }
  addEdges(edges: RawEdge<ED>[], options?: {batchSize?: number}): Promise<EdgeList<ED, ND>> {
    return super.addEdges(edges, options) as Promise<EdgeList<ED, ND>>;
  }

  addNode(node: RawNode<ND>, options?: any): Node<ND, ED> {
    return super.addNode(node, options) as Node<ND, ED>;
  }

  addEdge(edge: RawEdge<ED>, options?: any): Edge<ED, ND> {
    return super.addEdge(edge, options) as Edge<ED, ND>;
  }

  removeNodes(nodes: NodeList<ND, ED> | Node<ND, ED>[] | o.NodeId[], options?: any): Promise<void> {
    return super.removeNodes(nodes, options);
  }

  removeEdges(edges: EdgeList<ED, ND> | Edge<ED, ND>[] | o.EdgeId[], options?: any): Promise<void> {
    return super.removeEdges(edges, options);
  }

  removeNode(node: Node<ND, ED> | o.NodeId, options?: any): Promise<void> {
    return super.removeNode(node, options);
  }

  removeEdge(edge: Edge<ED, ND> | o.EdgeId, options?: any): Promise<void> {
    return super.removeEdge(edge, options);
  }

  getNodes(selector?: o.NodeId[] | Filter | Node<ND, ED>[]): NodeList<ND, ED> {
    return super.getNodes(selector) as NodeList<ND, ED>;
  }

  getEdges(selector?: o.EdgeId[] | Filter | Edge<ED, ND>[]): EdgeList<ED, ND> {
    return super.getEdges(selector) as EdgeList<ED, ND>;
  }

  getNode(nodeId: o.NodeId): Node<ND, ED> | undefined {
    return super.getNode(nodeId) as Node<ND, ED> | undefined;
  }

  getEdge(edgeId: o.EdgeId): Edge<ED, ND> | undefined {
    return super.getEdge(edgeId) as Edge<ED, ND> | undefined;
  }

  setGraph(
    graph: RawGraph<ND, ED>,
    options?: {
      batchSize?: number;
    }
  ): Promise<{
    nodes: NodeList<ND, ED>;
    edges: EdgeList<ED, ND>;
  }> {
    return super.setGraph(graph, options) as Promise<{
      nodes: NodeList<ND, ED>;
      edges: EdgeList<ED, ND>;
    }>;
  }

  addGraph(
    graph: RawGraph<ND, ED>,
    options?: {
      batchSize?: number;
      locate?: o.LocateOptions;
    }
  ): Promise<{
    nodes: NodeList<ND, ED>;
    edges: EdgeList<ED, ND>;
  }> {
    return super.addGraph(graph, options) as Promise<{
      nodes: NodeList<ND, ED>;
      edges: EdgeList<ED, ND>;
    }>;
  }

  createNodeList(): NodeList<ND, ED> {
    return super.createNodeList() as NodeList<ND, ED>;
  }

  createEdgeList(): EdgeList<ED, ND> {
    return super.createEdgeList() as EdgeList<ED, ND>;
  }

  getConnectedComponents(options?: {filter?: Filter; returnIds?: boolean}): NodeList<ND, ED>[] {
    return super.getConnectedComponents(options) as NodeList<ND, ED>[];
  }

  getConnectedComponentByNode(
    node: Node<ND, ED> | o.NodeId,
    options?: {
      filter?: Filter;
      returnIds?: boolean;
    }
  ): NodeList<ND, ED> {
    return super.getConnectedComponentByNode(node, options) as NodeList<ND, ED>;
  }

  getNodesByClassName(className: string): NodeList<ND, ED> {
    return super.getNodesByClassName(className) as NodeList<ND, ED>;
  }

  getEdgesByClassName(className: string): EdgeList<ED, ND> {
    return super.getEdgesByClassName(className) as EdgeList<ED, ND>;
  }

  getHoveredElement(): Node<ND, ED> | Edge<ED, ND> | null {
    return super.getHoveredElement() as Node<ND, ED> | Edge<ED, ND> | null;
  }

  getPointerInformation(): {
    x: number;
    y: number;
    target: Node<ND, ED> | Edge<ED, ND> | null;
  } {
    return super.getPointerInformation() as {
      x: number;
      y: number;
      target: Node<ND, ED> | Edge<ED, ND> | null;
    };
  }

  getSelectedNodes(): NodeList<ND, ED> {
    return super.getSelectedNodes() as NodeList<ND, ED>;
  }
  getNonSelectedNodes(): NodeList<ND, ED> {
    return super.getNonSelectedNodes() as NodeList<ND, ED>;
  }
  getSelectedEdges(): EdgeList<ED, ND> {
    return super.getSelectedEdges() as EdgeList<ED, ND>;
  }
  getNonSelectedEdges(): EdgeList<ED, ND> {
    return super.getNonSelectedEdges() as EdgeList<ED, ND>;
  }
}

export {TypedOgma as Ogma};
