'use strict';

import * as o from 'ogma';
import {
  GenericObject,
  LkEdgeData,
  LkNodeData,
  OgmaEdgeShape,
  OgmaNodeShape,
  TextOptions
} from '@linkurious/rest-client';

import {NodeList} from '../models';
import {BASE_GREY, EdgeAttributes, LKOgma, NodeAttributes, StyleRule, Tools} from '../..';

export interface StylesConfig {
  nodeColorStyleRules: Array<StyleRule>;
  nodeIconStyleRules: Array<StyleRule>;
  nodeSizeStyleRules: Array<StyleRule>;
  nodeShapeStyleRules?: Array<StyleRule>;
  edgeColorStyleRules: Array<StyleRule>;
  edgeWidthStyleRules: Array<StyleRule>;
  edgeShapeStyleRules?: Array<StyleRule>;
}

const HOVERED_SELECTED_NODE_STYLE: o.NodeAttributesValue = {
  text: {
    style: 'bold',
    backgroundColor: '#fff',
    minVisibleSize: 0
  },
  outerStroke: {width: 2},
  outline: false
};

const HOVERED_SELECTED_EDGE_STYLE: o.EdgeAttributesValue = {
  text: {
    style: 'bold',
    backgroundColor: '#fff',
    minVisibleSize: 0
  },
  outline: false
};

const NODE_HALO_CONFIGURATION = {
  color: '#FFF',
  size: 7,
  scalingMethod: 'scaled',
  strokeWidth: 0,
  hideNonAdjacentEdges: true
} as {
  color: '#FFF';
  size: 7;
  strokeWidth: 0;
};

const EDGE_HALO_CONFIGURATION = {
  color: '#FFF',
  scalingMethod: 'scaled',
  size: 4
} as {
  color: '#FFF';
  size: 4;
};

export const FILTER_OPACITY = 0.2;

export class StylesViz {
  private _ogma: LKOgma;
  private _exportClass!: o.StyleClass;
  private _nodeDefaultStylesRules!: o.StyleRule;
  private _nodeDefaultHaloRules!: o.StyleRule;
  private _edgeDefaultStylesRules!: o.StyleRule;
  private _edgeDefaultHaloRules!: o.StyleRule;

  private _nodeColorAttribute!: NodeAttributes;
  private _ogmaNodeColor!: o.StyleRule;
  private _nodeIconAttribute!: NodeAttributes;
  private _ogmaNodeIcon!: o.StyleRule;
  private _nodeSizeAttribute!: NodeAttributes;
  private _ogmaNodeSize!: o.StyleRule;
  private _nodeShapeAttribute!: NodeAttributes;
  private _ogmaNodeShape!: o.StyleRule;
  private _edgeColorAttribute!: EdgeAttributes;
  private _ogmaEdgeColor!: o.StyleRule;
  private _edgeWidthAttribute!: EdgeAttributes;
  private _ogmaEdgeWidth!: o.StyleRule;
  private _edgeShapeAttribute!: EdgeAttributes;
  private _ogmaEdgeShape!: o.StyleRule;

  constructor(ogma: LKOgma) {
    this._ogma = ogma;
  }

  /**
   * Set nodes default styles based on the configuration
   */
  public setNodesDefaultStyles(
    nodeStyleConf:
      | {
          nodeRadius?: number;
          shape?: OgmaNodeShape;
          text?: TextOptions & {
            nodePosition?: 'right' | 'left' | 'top' | 'bottom' | 'center';
          };
        }
      | undefined
  ): void {
    // setting selection and hover attributes
    this._ogma.styles.setHoveredNodeAttributes(HOVERED_SELECTED_NODE_STYLE);
    this._ogma.styles.setSelectedNodeAttributes(HOVERED_SELECTED_NODE_STYLE);
    // setting default styles
    this._nodeDefaultStylesRules = this._ogma.styles.addRule({
      nodeAttributes: {
        text: {
          minVisibleSize:
            nodeStyleConf !== undefined &&
            nodeStyleConf.text !== undefined &&
            nodeStyleConf.text.minVisibleSize
              ? nodeStyleConf.text.minVisibleSize
              : 12,
          maxLineLength:
            nodeStyleConf !== undefined &&
            nodeStyleConf.text !== undefined &&
            nodeStyleConf.text.maxLineLength !== undefined
              ? nodeStyleConf.text.maxLineLength
              : 30,
          position:
            nodeStyleConf !== undefined &&
            nodeStyleConf.text !== undefined &&
            nodeStyleConf.text.nodePosition !== undefined
              ? nodeStyleConf.text.nodePosition
              : 'bottom',
          backgroundColor:
            nodeStyleConf !== undefined &&
            nodeStyleConf.text !== undefined &&
            nodeStyleConf.text.backgroundColor !== undefined
              ? nodeStyleConf.text.backgroundColor
              : 'null',
          font:
            nodeStyleConf !== undefined &&
            nodeStyleConf.text !== undefined &&
            nodeStyleConf.text.font !== undefined
              ? nodeStyleConf.text.font
              : 'roboto',
          color:
            nodeStyleConf !== undefined &&
            nodeStyleConf.text !== undefined &&
            nodeStyleConf.text.color !== undefined
              ? nodeStyleConf.text.color
              : 'black',
          size:
            nodeStyleConf !== undefined &&
            nodeStyleConf.text !== undefined &&
            nodeStyleConf.text.size !== undefined
              ? nodeStyleConf.text.size
              : 14,
          margin: 5
        },
        radius: this.defaultNodeRadius(nodeStyleConf),
        icon: {
          minVisibleSize: 15
        },
        color: '#7f7f7f',
        shape:
          nodeStyleConf !== undefined && nodeStyleConf.shape !== undefined
            ? nodeStyleConf.shape
            : ('circle' as OgmaNodeShape),
        innerStroke: {
          width: 3
        },
        outline: false
      }
    });
  }

  /**
   * Set edges default styles based on the configuration
   */
  public setEdgesDefaultStyles(
    edgeStyleConf:
      | {
          edgeWidth?: number;
          shape?: OgmaEdgeShape;
          text?: TextOptions;
        }
      | undefined
  ): void {
    // setting selection and hover attributes
    this._ogma.styles.setHoveredEdgeAttributes(HOVERED_SELECTED_EDGE_STYLE);
    this._ogma.styles.setSelectedEdgeAttributes(HOVERED_SELECTED_EDGE_STYLE);
    // setting default styles
    this._edgeDefaultStylesRules = this._ogma.styles.addRule({
      edgeAttributes: {
        text: {
          minVisibleSize:
            edgeStyleConf !== undefined &&
            edgeStyleConf.text !== undefined &&
            edgeStyleConf.text.minVisibleSize
              ? edgeStyleConf.text.minVisibleSize
              : 3,
          maxLineLength:
            edgeStyleConf !== undefined &&
            edgeStyleConf.text !== undefined &&
            edgeStyleConf.text.maxLineLength !== undefined
              ? edgeStyleConf.text.maxLineLength
              : 30,
          backgroundColor:
            edgeStyleConf !== undefined &&
            edgeStyleConf.text !== undefined &&
            edgeStyleConf.text.backgroundColor !== undefined
              ? edgeStyleConf.text.backgroundColor
              : null,
          font:
            edgeStyleConf !== undefined &&
            edgeStyleConf.text !== undefined &&
            edgeStyleConf.text.font !== undefined
              ? edgeStyleConf.text.font
              : 'roboto',
          color:
            edgeStyleConf !== undefined &&
            edgeStyleConf.text !== undefined &&
            edgeStyleConf.text.color !== undefined
              ? edgeStyleConf.text.color
              : 'black',
          size:
            edgeStyleConf !== undefined &&
            edgeStyleConf.text !== undefined &&
            edgeStyleConf.text.size !== undefined
              ? edgeStyleConf.text.size
              : 14
        },
        width: this.defaultEdgeWidth(edgeStyleConf),
        shape:
          edgeStyleConf !== undefined && edgeStyleConf.shape !== undefined
            ? edgeStyleConf.shape
            : 'arrow',
        color: '#7f7f7f'
      }
    });
  }

  /**
   * Set nodes default styles based on the configuration
   */
  public setNodesDefaultHalo(): void {
    // setting default halo style
    this._nodeDefaultHaloRules = this._ogma.styles.addRule({
      nodeAttributes: {
        halo: (node: o.Node | undefined) => {
          if (
            node !== undefined &&
            !node.hasClass('filtered') &&
            (node.isSelected() ||
              node
                .getAdjacentNodes({})
                .filter((n) => !n.hasClass('filtered'))
                .isSelected()
                .includes(true) ||
              node
                .getAdjacentEdges()
                .filter((e) => !e.hasClass('filtered'))
                .isSelected()
                .includes(true))
          ) {
            return {
              ...NODE_HALO_CONFIGURATION,
              scalingMethod: this._ogma.geo.enabled() ? 'fixed' : 'scaled'
            } as {
              color: '#FFF';
              size: 7;
              strokeWidth: 0;
            };
          }
          return null;
        }
      }
    });
  }

  /**
   * Set edges default styles based on the configuration
   */
  public setEdgesDefaultHalo(): void {
    // setting default halo styles
    this._edgeDefaultHaloRules = this._ogma.styles.addRule({
      edgeAttributes: {
        halo: (edge: o.Edge | undefined) => {
          if (
            edge !== undefined &&
            !edge.hasClass('filtered') &&
            (edge.isSelected() ||
              edge
                .getExtremities()
                .filter((n) => !n.hasClass('filtered'))
                .isSelected()
                .includes(true))
          ) {
            return {
              ...EDGE_HALO_CONFIGURATION,
              scalingMethod: this._ogma.geo.enabled() ? 'fixed' : 'scaled'
            } as {
              color: '#FFF';
              size: 4;
            };
          }
          return null;
        }
      }
    });
  }

  /**
   * Return the default node radius set in configuration or 5
   *
   * @returns {number}
   */
  private defaultNodeRadius(styles: any): number {
    return this.defaultStylesHas(styles, ['nodeRadius']) ? styles.nodeRadius : 5;
  }

  /**
   * Return the default edge width set in configuration or 1
   *
   * @returns {number}
   */
  private defaultEdgeWidth(styles: any): number {
    return this.defaultStylesHas(styles, ['edgeWidth']) ? styles.edgeWidth : 1;
  }

  /**
   * Check if a style property exists in the default styles object
   */
  private defaultStylesHas(styles: GenericObject<unknown>, propertyPath: Array<string>): boolean {
    if (!Tools.isDefined(styles)) {
      return false;
    }
    return Tools.getIn(styles, propertyPath) !== undefined;
  }

  /**
   * Set styles for the class "filtered"
   */
  public setFilterClass(): void {
    this._ogma.styles.createClass({
      name: 'filtered',
      nodeAttributes: {
        opacity: FILTER_OPACITY,
        layer: -1,
        detectable: false,
        badges: {
          topRight: {
            text: null
          },
          bottomRight: {
            text: null
          }
        },
        text: null,
        color: 'rgb(240, 240, 240)',
        innerStroke: {
          width: 1,
          color: BASE_GREY,
          minVisibleSize: 1
        },
        shape: 'circle',
        image: null,
        icon: null,
        radius: '100%'
      },
      edgeAttributes: {
        opacity: FILTER_OPACITY,
        layer: -1,
        detectable: false,
        text: null,
        color: BASE_GREY,
        shape: 'line',
        width: 0.2
      }
    });
  }

  /**
   * Set the class for exported nodes and edges
   */
  public setExportClass(textWrappingLength?: boolean): void {
    if (!this._exportClass) {
      this._exportClass = this._ogma.styles.createClass({
        name: 'exported',
        nodeAttributes: {
          text: {
            minVisibleSize: 0,
            font: 'arial',
            backgroundColor: null,
            maxLineLength: textWrappingLength ? 30 : 0,
            scale: 0.3,
            backgroundArrowBaseSize: 0,
            margin: 0,
            scaling: true,
            tip: false
          },
          halo: null
        },
        edgeAttributes: {
          text: {
            scale: 3.0,
            scaling: true,
            font: 'arial',
            backgroundColor: null,
            minVisibleSize: 0,
            size: 3,
            margin: 0
          },
          halo: null,
          shape: 'tapered'
        }
      });
    } else {
      this._exportClass.update({
        nodeAttributes: {
          text: {
            maxLineLength: textWrappingLength ? 30 : 0
          },
          halo: null
        }
      });
    }
  }

  /**
   * Set the rule to display badges
   */
  public setBadgeRule() {
    this._ogma.styles.createClass({
      name: 'degreeIndicator',
      nodeAttributes: {
        badges: {
          topRight: (node) => {
            if (node !== undefined) {
              const degree = Tools.getHiddenNeighbors(
                node.toList() as NodeList<LkNodeData, LkEdgeData>
              );
              const badgeContent = Tools.shortenNumber(degree);
              if (degree > 0) {
                const nodeColor = Array.isArray(node.getAttribute('color'))
                  ? node.getAttribute('color')[0]
                  : node.getAttribute('color');
                const textColor = Tools.isBright(nodeColor) ? '#000' : '#FFF';
                const isSupernode = node.getData(['statistics', 'supernode']);
                let content = null;
                if (+badgeContent !== 0) {
                  content = isSupernode ? badgeContent + '+' : badgeContent;
                }
                return {
                  color: 'inherit',
                  minVisibleSize: 20,
                  stroke: {
                    width: 0,
                    color: null
                  },
                  text: {
                    font: 'roboto',
                    scale: 0.4,
                    color: textColor,
                    content: content
                  }
                };
              }
            }
          }
        }
      }
    });
    this._ogma.styles.createClass({
      name: 'pinnedIndicator',
      nodeAttributes: {
        badges: {
          bottomRight: (node) => {
            if (node !== undefined && !node.getAttribute('layoutable')) {
              const nodeColor = Array.isArray(node.getAttribute('color'))
                ? node.getAttribute('color')[0]
                : node.getAttribute('color');
              const textColor = Tools.isBright(nodeColor) ? '#000' : '#FFF';
              return {
                color: 'inherit',
                minVisibleSize: 20,
                stroke: {
                  width: 0,
                  color: null
                },
                text: {
                  font: 'FontAwesome',
                  scale: 0.4,
                  color: textColor,
                  content: node.getAttribute('layoutable') ? null : '\uf08d'
                }
              };
            }
          }
        }
      },
      nodeDependencies: {
        self: {attributes: ['layoutable']}
      }
    });
    this._ogma.events.onNodesAdded(({nodes}) => nodes.addClass('degreeIndicator'));
    this._ogma.events.onNodesAdded(({nodes}) => nodes.addClass('pinnedIndicator'));
  }

  /**
   * Delete the rule to display badges
   */
  public deleteBadgeRule() {
    this._ogma.getNodes().removeClasses(['degreeIndicator', 'pinnedIndicator'], 0);
  }

  /**
   * set text overlap to true or false
   *
   * @param {boolean} overlap
   */
  public toggleTextOverlap(overlap?: boolean): void {
    this._ogma.setOptions({texts: {preventOverlap: overlap}});
  }

  /**
   * refresh nodes and edge rules
   *
   */
  public refreshRules(): void {
    this._nodeDefaultStylesRules.refresh();
    this._nodeDefaultHaloRules.refresh();
    this._edgeDefaultStylesRules.refresh();
    this._edgeDefaultHaloRules.refresh();
  }

  /**
   * Create / refresh an ogma rule for node colors
   */
  public refreshNodeColors(colorStyleRules: Array<StyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeColor)) {
      this._nodeColorAttribute = new NodeAttributes({color: colorStyleRules});
      this._ogmaNodeColor = this._ogma.styles.addRule({
        nodeAttributes: {
          color: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeColorAttribute.color(node.getData());
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeColorAttribute.refresh({color: colorStyleRules});
      this._ogmaNodeColor.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for node icons
   *
   * @param {Array<any>} iconStyleRules
   */
  public refreshNodeIcons(iconStyleRules: Array<StyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeIcon)) {
      this._nodeIconAttribute = new NodeAttributes({icon: iconStyleRules});
      this._ogmaNodeIcon = this._ogma.styles.addRule({
        nodeAttributes: {
          icon: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeIconAttribute.icon(node.getData()).icon;
            }
          },
          image: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeIconAttribute.icon(node.getData()).image;
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeIconAttribute.refresh({icon: iconStyleRules});
      this._ogmaNodeIcon.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for node sizes
   *
   * @param {Array<any>} sizeStyleRules
   */
  public refreshNodeSize(sizeStyleRules: Array<StyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeSize)) {
      this._nodeSizeAttribute = new NodeAttributes({size: sizeStyleRules});
      this._ogmaNodeSize = this._ogma.styles.addRule({
        nodeAttributes: {
          radius: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeSizeAttribute.size(node.getData());
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeSizeAttribute.refresh({size: sizeStyleRules});
      this._ogmaNodeSize.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for node images
   *
   * @param {Array<any>} shapeStyleRules
   */
  public refreshNodeShape(shapeStyleRules: Array<StyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeShape)) {
      this._nodeShapeAttribute = new NodeAttributes({shape: shapeStyleRules});
      this._ogmaNodeShape = this._ogma.styles.addRule({
        nodeAttributes: {
          shape: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeShapeAttribute.shape(node.getData());
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeShapeAttribute.refresh({shape: shapeStyleRules});
      this._ogmaNodeShape.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for edge colors
   */
  public refreshEdgeColors(colorStyleRules: Array<StyleRule>): void {
    if (!Tools.isDefined(this._ogmaEdgeColor)) {
      this._edgeColorAttribute = new EdgeAttributes({color: colorStyleRules});
      this._ogmaEdgeColor = this._ogma.styles.addRule({
        edgeAttributes: {
          color: (edge: o.Edge | undefined) => {
            if (edge !== undefined) {
              return this._edgeColorAttribute.color(edge.getData());
            }
          }
        },
        edgeDependencies: {self: {data: true}}
      });
    } else {
      this._edgeColorAttribute.refresh({color: colorStyleRules});
      this._ogmaEdgeColor.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for edge width
   *
   * @param {Array<StyleRule>} widthStyleRules
   */
  public refreshEdgeWidth(widthStyleRules: Array<StyleRule>): void {
    if (!Tools.isDefined(this._ogmaEdgeWidth)) {
      this._edgeWidthAttribute = new EdgeAttributes({width: widthStyleRules});
      this._ogmaEdgeWidth = this._ogma.styles.addRule({
        edgeAttributes: {
          width: (edge: o.Edge | undefined) => {
            if (edge !== undefined) {
              return this._edgeWidthAttribute.width(edge.getData());
            }
          }
        },
        edgeDependencies: {
          self: {data: true}
        }
      });
    } else {
      this._edgeWidthAttribute.refresh({width: widthStyleRules});
      this._ogmaEdgeWidth.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for edge width
   *
   * @param {Array<StyleRule>} shapeStyleRules
   */
  public refreshEdgeShape(shapeStyleRules: Array<StyleRule>): void {
    if (!Tools.isDefined(this._ogmaEdgeShape)) {
      this._edgeShapeAttribute = new EdgeAttributes({shape: shapeStyleRules});
      this._ogmaEdgeShape = this._ogma.styles.addRule({
        edgeAttributes: {
          shape: (edge: o.Edge | undefined) => {
            if (edge !== undefined) {
              return this._edgeShapeAttribute.shape(edge.getData());
            }
          }
        },
        edgeDependencies: {self: {data: true}}
      });
    } else {
      this._edgeShapeAttribute.refresh({shape: shapeStyleRules});
      this._ogmaEdgeShape.refresh();
    }
  }
}
