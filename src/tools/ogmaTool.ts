'use strict';
import {Color, NodeList, Node, EdgeList, Edge} from 'ogma';
import {
  GenericObject,
  LkEdgeData,
  LkNodeData,
} from '@linkurious/rest-client';
import {Tools} from "./tools";

export const HTML_COLORS: GenericObject<{ hex: string; rgb: string }> = {
  lightsalmon: {hex: '#FFA07A', rgb: 'rbg(255,160,122)'},
  salmon: {hex: '#FA8072', rgb: 'rgb(250,128,114)'},
  darksalmon: {hex: '#E9967A', rgb: 'rgb(233,150,122)'},
  lightcoral: {hex: '#F08080', rgb: 'rgb(240,128,128)'},
  indianred: {hex: '#CD5C5C', rgb: 'rgb(205,92,92)'},
  crimson: {hex: '#DC143C', rgb: 'rgb(220,20,60)'},
  firebrick: {hex: '#B22222', rgb: 'rgb(178,34,34)'},
  red: {hex: '#FF0000', rgb: 'rgb(255,0,0)'},
  darkred: {hex: '#8B0000', rgb: 'rgb(139,0,0)'},
  coral: {hex: '#FF7F50', rgb: 'rgb(255,127,80)'},
  tomato: {hex: '#FF6347', rgb: 'rgb(255,99,71)'},
  orangered: {hex: '#FF4500', rgb: 'rgb(255,69,0)'},
  gold: {hex: '#FFD700', rgb: 'rgb(255,215,0)'},
  orange: {hex: '#FFA500', rgb: 'rgb(255,165,0)'},
  darkorange: {hex: '#FF8C00', rgb: 'rgb(255,140,0)'},
  lightyellow: {hex: '#FFFFE0', rgb: 'rgb(255,255,224)'},
  lemonchiffon: {hex: '#FFFACD', rgb: 'rgb(255,250,205)'},
  lightgoldenrodyellow: {hex: '#FAFAD2', rgb: 'rgb(250,250,210)'},
  papayawhip: {hex: '#FFEFD5', rgb: 'rgb(255,239,213)'},
  moccasin: {hex: '#FFE4B5', rgb: 'rgb(255,228,181)'},
  peachpuff: {hex: '#FFDAB9', rgb: 'rgb(255,218,185)'},
  palegoldenrod: {hex: '#EEE8AA', rgb: 'rgb(238,232,170)'},
  khaki: {hex: '#F0E68C', rgb: 'rgb(240,230,140)'},
  darkkhaki: {hex: '#BDB76B', rgb: 'rgb(189,183,107)'},
  yellow: {hex: '#FFFF00', rgb: 'rgb(255,255,0)'},
  lawngreen: {hex: '#7CFC00', rgb: 'rgb(124,252,0)'},
  chartreuse: {hex: '#7FFF00', rgb: 'rgb(127,255,0)'},
  limegreen: {hex: '#32CD32', rgb: 'rgb(50,205,50)'},
  lime: {hex: '#00FF00', rgb: 'rgb(0.255.0)'},
  forestgreen: {hex: '#228B22', rgb: 'rgb(34,139,34)'},
  green: {hex: '#008000', rgb: 'rgb(0,128,0)'},
  darkgreen: {hex: '#006400', rgb: 'rgb(0,100,0)'},
  greenyellow: {hex: '#ADFF2F', rgb: 'rgb(173,255,47)'},
  yellowgreen: {hex: '#9ACD32', rgb: 'rgb(154,205,50)'},
  springgreen: {hex: '#00FF7F', rgb: 'rgb(0,255,127)'},
  mediumspringgreen: {hex: '#00FA9A', rgb: 'rgb(0,250,154)'},
  lightgreen: {hex: '#90EE90', rgb: 'rgb(144,238,144)'},
  palegreen: {hex: '#98FB98', rgb: 'rgb(152,251,152)'},
  darkseagreen: {hex: '#8FBC8F', rgb: 'rgb(143,188,143)'},
  mediumseagreen: {hex: '#3CB371', rgb: 'rgb(60,179,113)'},
  seagreen: {hex: '#2E8B57', rgb: 'rgb(46,139,87)'},
  olive: {hex: '#808000', rgb: 'rgb(128,128,0)'},
  darkolivegreen: {hex: '#556B2F', rgb: 'rgb(85,107,47)'},
  olivedrab: {hex: '#6B8E23', rgb: 'rgb(107,142,35)'},
  lightcyan: {hex: '#E0FFFF', rgb: 'rgb(224,255,255)'},
  cyan: {hex: '#00FFFF', rgb: 'rgb(0,255,255)'},
  aqua: {hex: '#00FFFF', rgb: 'rgb(0,255,255)'},
  aquamarine: {hex: '#7FFFD4', rgb: 'rgb(127,255,212)'},
  mediumaquamarine: {hex: '#66CDAA', rgb: 'rgb(102,205,170)'},
  paleturquoise: {hex: '#AFEEEE', rgb: 'rgb(175,238,238)'},
  turquoise: {hex: '#40E0D0', rgb: 'rgb(64,224,208)'},
  mediumturquoise: {hex: '#48D1CC', rgb: 'rgb(72,209,204)'},
  darkturquoise: {hex: '#00CED1', rgb: 'rgb(0,206,209)'},
  lightseagreen: {hex: '#20B2AA', rgb: 'rgb(32,178,170)'},
  cadetblue: {hex: '#5F9EA0', rgb: 'rgb(95,158,160)'},
  darkcyan: {hex: '#008B8B', rgb: 'rgb(0,139,139)'},
  teal: {hex: '#008080', rgb: 'rgb(0,128,128)'},
  powderblue: {hex: '#B0E0E6', rgb: 'rgb(176,224,230)'},
  lightblue: {hex: '#ADD8E6', rgb: 'rgb(173,216,230)'},
  lightskyblue: {hex: '#87CEFA', rgb: 'rgb(135,206,250)'},
  skyblue: {hex: '#87CEEB', rgb: 'rgb(135,206,235)'},
  deepskyblue: {hex: '#00BFFF', rgb: 'rgb(0,191,255)'},
  lightsteelblue: {hex: '#B0C4DE', rgb: 'rgb(176,196,222)'},
  dodgerblue: {hex: '#1E90FF', rgb: 'rgb(30,144,255)'},
  cornflowerblue: {hex: '#6495ED', rgb: 'rgb(100,149,237)'},
  steelblue: {hex: '#4682B4', rgb: 'rgb(70,130,180)'},
  royalblue: {hex: '#4169E1', rgb: 'rgb(65,105,225)'},
  blue: {hex: '#0000FF', rgb: 'rgb(0,0,255)'},
  mediumblue: {hex: '#0000CD', rgb: 'rgb(0,0,205)'},
  darkblue: {hex: '#00008B', rgb: 'rgb(0,0,139)'},
  navy: {hex: '#000080', rgb: 'rgb(0,0,128)'},
  midnightblue: {hex: '#191970', rgb: 'rgb(25,25,112)'},
  mediumslateblue: {hex: '#7B68EE', rgb: 'rgb(123,104,238)'},
  slateblue: {hex: '#6A5ACD', rgb: 'rgb(106,90,205)'},
  darkslateblue: {hex: '#483D8B', rgb: 'rgb(72,61,139)'},
  lavender: {hex: '#E6E6FA', rgb: 'rgb(230,230,250)'},
  thistle: {hex: '#D8BFD8', rgb: 'rgb(216,191,216)'},
  plum: {hex: '#DDA0DD', rgb: 'rgb(221,160,221)'},
  violet: {hex: '#EE82EE', rgb: 'rgb(238,130,238)'},
  orchid: {hex: '#DA70D6', rgb: 'rgb(218,112,214)'},
  fuchsia: {hex: '#FF00FF', rgb: 'rgb(255,0,255)'},
  magenta: {hex: '#FF00FF', rgb: 'rgb(255,0,255)'},
  mediumorchid: {hex: '#BA55D3', rgb: 'rgb(186,85,211)'},
  mediumpurple: {hex: '#9370DB', rgb: 'rgb(147,112,219)'},
  blueviolet: {hex: '#8A2BE2', rgb: 'rgb(138,43,226)'},
  darkviolet: {hex: '#9400D3', rgb: 'rgb(148,0,211)'},
  darkorchid: {hex: '#9932CC', rgb: 'rgb(153,50,204)'},
  darkmagenta: {hex: '#8B008B', rgb: 'rgb(139,0,139)'},
  purple: {hex: '#800080', rgb: 'rgb(128,0,128)'},
  indigo: {hex: '#4B0082', rgb: 'rgb(75,0,130)'},
  pink: {hex: '#FFC0CB', rgb: 'rgb(255,192,203)'},
  lightpink: {hex: '#FFB6C1', rgb: 'rgb(255,182,193)'},
  hotpink: {hex: '#FF69B4', rgb: 'rgb(255,105,180)'},
  deeppink: {hex: '#FF1493', rgb: 'rgb(255,20,147)'},
  palevioletred: {hex: '#DB7093', rgb: 'rgb(219,112,147)'},
  mediumvioletred: {hex: '#C71585', rgb: 'rgb(199,21,133)'},
  white: {hex: '#FFFFFF', rgb: 'rgb(255,255,255)'},
  snow: {hex: '#FFFAFA', rgb: 'rgb(255,250,250)'},
  honeydew: {hex: '#F0FFF0', rgb: 'rgb(240,255,240)'},
  mintcream: {hex: '#F5FFFA', rgb: 'rgb(245,255,250)'},
  azure: {hex: '#F0FFFF', rgb: 'rgb(240,255,255)'},
  aliceblue: {hex: '#F0F8FF', rgb: 'rgb(240,248,255)'},
  ghostwhite: {hex: '#F8F8FF', rgb: 'rgb(248,248,255)'},
  whitesmoke: {hex: '#F5F5F5', rgb: 'rgb(245,245,245)'},
  seashell: {hex: '#FFF5EE', rgb: 'rgb(255,245,238)'},
  beige: {hex: '#F5F5DC', rgb: 'rgb(245,245,220)'},
  oldlace: {hex: '#FDF5E6', rgb: 'rgb(253,245,230)'},
  floralwhite: {hex: '#FFFAF0', rgb: 'rgb(255,250,240)'},
  ivory: {hex: '#FFFFF0', rgb: 'rgb(255,255,240)'},
  antiquewhite: {hex: '#FAEBD7', rgb: 'rgb(250,235,215)'},
  linen: {hex: '#FAF0E6', rgb: 'rgb(250,240,230)'},
  lavenderblush: {hex: '#FFF0F5', rgb: 'rgb(255,240,245)'},
  mistyrose: {hex: '#FFE4E1', rgb: 'rgb(255,228,225)'},
  gainsboro: {hex: '#DCDCDC', rgb: 'rgb(220,220,220)'},
  lightgray: {hex: '#D3D3D3', rgb: 'rgb(211,211,211)'},
  silver: {hex: '#C0C0C0', rgb: 'rgb(192,192,192)'},
  darkgray: {hex: '#A9A9A9', rgb: 'rgb(169,169,169)'},
  gray: {hex: '#808080', rgb: 'rgb(128,128,128)'},
  dimgray: {hex: '#696969', rgb: 'rgb(105,105,105)'},
  lightslategray: {hex: '#778899', rgb: 'rgb(119,136,153)'},
  slategray: {hex: '#708090', rgb: 'rgb(112,128,144)'},
  darkslategray: {hex: '#2F4F4F', rgb: 'rgb(47,79,79)'},
  black: {hex: '#000000', rgb: 'rgb(0,0,0)'},
  cornsilk: {hex: '#FFF8DC', rgb: 'rgb(255,248,220)'},
  blanchedalmond: {hex: '#FFEBCD', rgb: 'rgb(255,235,205)'},
  bisque: {hex: '#FFE4C4', rgb: 'rgb(255,228,196)'},
  navajowhite: {hex: '#FFDEAD', rgb: 'rgb(255,222,173)'},
  wheat: {hex: '#F5DEB3', rgb: 'rgb(245,222,179)'},
  burlywood: {hex: '#DEB887', rgb: 'rgb(222,184,135)'},
  tan: {hex: '#D2B48C', rgb: 'rgb(210,180,140)'},
  rosybrown: {hex: '#BC8F8F', rgb: 'rgb(188,143,143)'},
  sandybrown: {hex: '#F4A460', rgb: 'rgb(244,164,96)'},
  goldenrod: {hex: '#DAA520', rgb: 'rgb(218,165,32)'},
  peru: {hex: '#CD853F', rgb: 'rgb(205,133,63)'},
  chocolate: {hex: '#D2691E', rgb: 'rgb(210,105,30)'},
  saddlebrown: {hex: '#8B4513', rgb: 'rgb(139,69,19)'},
  sienna: {hex: '#A0522D', rgb: 'rgb(160,82,45)'},
  brown: {hex: '#A52A2A', rgb: 'rgb(165,42,42)'},
  maroon: {hex: '#800000', rgb: 'rgb(128,0,0)'}
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
    const rgbRegExp = /^rgb\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*\)$/i;
    const rgbaRegExp = /^rgba\(\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*([01]?\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|1|0?\.\d+)\s*\)$/i;
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

  public static isEdge(
    item: Node<LkNodeData, LkEdgeData> | Edge<LkEdgeData, LkNodeData>
  ): item is Edge<LkEdgeData, LkNodeData> {
    return !item.isNode;
  }

  public static isNodeList(
    items: NodeList<LkNodeData, LkEdgeData> | EdgeList<LkEdgeData, LkNodeData>
  ): items is NodeList<LkNodeData, LkEdgeData> {
    return items.isNode;
  }
}
