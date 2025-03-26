import {Color, NodeList, Node, EdgeList, Edge, NodeId} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData} from '@linkurious/rest-client';

import {ANIMATION_DURATION} from '../ogma';

import {Tools} from './tools';
import {HTML_COLORS} from './colorPalette';

export const FORCE_LAYOUT_CONFIG = {
  steps: 120,
  alignSiblings: true,
  charge: 5,
  theta: 0.34,
  duration: ANIMATION_DURATION
};

export class OgmaTools {
  /**
   * Get the amount of hidden neighbors from a list of nodes
   *
   * @param nodes
   */
  public static getHiddenNeighbors(nodes: NodeList<LkNodeData, LkEdgeData>): number {
    return nodes.reduce((result: number, node: Node<LkNodeData, LkEdgeData>) => {
      const statistics = node.getData('statistics');
      if (statistics !== undefined) {
        const hiddenNeighbors =
          statistics.degree !== undefined && !statistics.supernode
            ? statistics.degree - Tools.getDegreeWithoutSelfConnection(node)
            : statistics.supernodeDegree;
        if (hiddenNeighbors !== undefined && hiddenNeighbors > 0) {
          return (result += hiddenNeighbors);
        }
      }
      return result;
    }, 0);
  }

  /**
   * Return the visible degree of a node without self connection (self edge)
   *
   * @param {Node} node
   * @return {number}
   */
  public static getDegreeWithoutSelfConnection(node: Node<LkNodeData, LkEdgeData>): number {
    return node.getAdjacentNodes({policy: 'exclude-sources', filter: 'all'}).size;
  }

  /**
   * Return true if the color tone is "bright"
   *
   * @param {string} color
   * @returns {boolean}
   */
  public static isBright(color: Color): boolean {
    if (color === null || !Tools.isStringFilled(color)) {
      return true;
    }
    const hexRegExp = /#[A-Fa-f0-9]{3,6}/;
    const rgbRegExp =
      /^rgb\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*\)$/i;
    const rgbaRegExp =
      /^rgba\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)$/i;
    let rgb: string;

    if (hexRegExp.test(color)) {
      if (color.length < 5) {
        color += color.slice(1);
      }
      color = color.replace('#', '');
      const r = parseInt(color[0].toString() + color[1].toString(), 16);
      const g = parseInt(color[2].toString() + color[3].toString(), 16);
      const b = parseInt(color[4].toString() + color[5].toString(), 16);
      rgb = `rgb(${r}, ${g}, ${b})`;
    } else if (
      rgbRegExp.test(color) ||
      rgbaRegExp.test(color) ||
      HTML_COLORS[color.toLowerCase()] !== undefined
    ) {
      rgb = Tools.isDefined(HTML_COLORS[color.toLowerCase()])
        ? HTML_COLORS[color.toLowerCase()]['rgb']
        : color;
    } else {
      return true;
    }

    const [r, g, b] = /rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,\d{1,3})?\)/
      .exec(rgb.replace(/\s/g, ''))!
      .slice(1, 4);

    if (!Tools.isDefined(r) || !Tools.isDefined(g) || !Tools.isDefined(b)) {
      console.warn('The given color is not a valid rgb formatted color');
      return true;
    }
    return (+r * 299 + +g * 587 + +b * 114) / 1000 > 255 * 0.7;
  }

  public static isNode(
    item: Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData>
  ): item is Node<LkNodeData, LkEdgeData> {
    return item.isNode;
  }

  public static isNodeList(
    items: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>
  ): items is NodeList<LkNodeData, LkEdgeData> {
    return items.isNode;
  }

  public static topologicalSort(nodes: NodeList): {chain: NodeId[]; numberOfChain: number} {
    const nodesArray = nodes.toArray();
    const startOfChains = nodesArray.filter((n) => n.getDegree() === 1);
    const visited = new Set();
    const stacks: Node[][] = [];
    startOfChains.forEach((node) => {
      let currentNode: Node<LkNodeData, LkEdgeData> | null = node;
      if (visited.has(currentNode)) {
        return;
      }
      const stack = [];
      while (currentNode) {
        stack.push(currentNode);
        visited.add(currentNode);

        const nextNode = currentNode
          .getAdjacentNodes()
          .filter((neighbor) => !visited.has(neighbor))
          .get(0);
        currentNode = nextNode === undefined ? null : nextNode;
      }
      stacks.push(stack);
    });
    stacks.sort((a, b) => b.length - a.length);
    return {chain: stacks.flat().map((n) => n.getId()), numberOfChain: startOfChains.length / 2};
  }

  public static isStar(nodes: NodeList) {
    for (const node of nodes.toArray()) {
      const adjacent = node.getAdjacentNodes();
      const isStar = node.getDegree() > 2 && adjacent.getDegree().every((d) => d === 1);
      if (isStar && adjacent.size + 1 === nodes.size) return node;
    }
    return false;
  }

  /**
   * Return true if the group is collapsed
   */
  public static isGroupCollapsed(node: Node): boolean {
    return node.getData('collapsed') as boolean;
  }

  public static setCollapsedGroupProperty(node: Node<LkNodeData>, collapsed: boolean): void {
    node.setData('collapsed', collapsed);
  }
}
