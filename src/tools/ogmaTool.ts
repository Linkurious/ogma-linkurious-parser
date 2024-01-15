'use strict';
import {Color, NodeList, Node, EdgeList, Edge} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData} from '@linkurious/rest-client';

import {Tools} from './tools';
import {HTML_COLORS} from './colorPalette';

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

    const [r, g, b] = rgb
      .replace(/\s/g, '')
      .match(/rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(,\d{1,3})?\)/)!
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
}
