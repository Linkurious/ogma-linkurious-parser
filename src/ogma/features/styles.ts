'use strict';

import * as o from 'ogma';
import {Edge, EdgeAttributesValue, NodeAttributesValue, StyleClass, StyleRule} from 'ogma';
import {
  GenericObject,
  IEdgeStyle,
  INodeStyle,
  IStyleRule,
  LkEdgeData,
  LkNodeData,
  OgmaEdgeShape,
  OgmaNodeShape,
  TextOptions
} from '@linkurious/rest-client';

import {
  BASE_GREY,
  EdgeAttributes,
  LKOgma,
  NodeAttributes,
  OgmaTools,
  StyleRule as LKStyleRule,
  StyleRules,
  StyleType
} from '../..';
import {Tools} from '../../tools/tools';

export interface StylesConfig {
  nodeColorStyleRules: Array<LKStyleRule>;
  nodeIconStyleRules: Array<LKStyleRule>;
  nodeSizeStyleRules: Array<LKStyleRule>;
  nodeShapeStyleRules?: Array<LKStyleRule>;
  edgeColorStyleRules: Array<LKStyleRule>;
  edgeWidthStyleRules: Array<LKStyleRule>;
  edgeShapeStyleRules?: Array<LKStyleRule>;
}

const HOVERED_SELECTED_NODE_STYLE: NodeAttributesValue<LkNodeData, LkEdgeData> = {
  text: {
    style: 'bold',
    backgroundColor: '#fff',
    minVisibleSize: 0
  },
  outerStroke: {width: 2},
  outline: false
};

const HOVERED_SELECTED_EDGE_STYLE: EdgeAttributesValue<LkEdgeData, LkNodeData> = {
  text: {
    style: 'bold',
    backgroundColor: '#fff',
    minVisibleSize: 0
  },
  outline: false
};

const NODE_HALO_CONFIGURATION = {
  color: '#FFF',
  width: 7,
  scalingMethod: 'scaled',
  strokeWidth: 0,
  hideNonAdjacentEdges: false
} as {
  color: '#FFF';
  width: 7;
  strokeWidth: 0;
};

const EDGE_HALO_CONFIGURATION = {
  color: '#FFF',
  scalingMethod: 'scaled',
  width: 4
} as {
  color: '#FFF';
  width: 4;
};

const DEFAULT_OGMA_FONT = "'roboto', sans-serif";
const DARK_FONT_COLOR = '#000';
const CLEAR_FONT_COLOR = '#FFF';

export const FILTER_OPACITY = 0.2;

export class StylesViz {
  private _ogma: LKOgma;
  private _exportClass!: StyleClass;
  private _nodeDefaultStylesRules!: StyleRule<LkNodeData, LkEdgeData>;
  // @ts-ignore
  private _nodeDefaultHaloRules!: StyleRule<LkNodeData, LkEdgeData>;
  private _edgeDefaultStylesRules!: StyleRule<LkNodeData, LkEdgeData>;
  // @ts-ignore
  private _edgeDefaultHaloRules!: StyleRule<LkNodeData, LkEdgeData>;

  private _nodeAttributes: NodeAttributes = new NodeAttributes({});
  private _edgeAttributes: EdgeAttributes = new EdgeAttributes({});

  private _ogmaNodeColor!: StyleRule;
  private _ogmaNodeIcon!: StyleRule;
  private _ogmaNodeSize!: StyleRule;
  private _ogmaNodeShape!: StyleRule;
  private _ogmaEdgeColor!: StyleRule;
  private _ogmaEdgeWidth!: StyleRule;
  private _ogmaEdgeShape!: StyleRule;
  private _defaultConfiguration: {
    node: {
      nodeRadius?: number;
      shape?: OgmaNodeShape;
      text?: TextOptions & {
        nodePosition?: 'right' | 'left' | 'top' | 'bottom' | 'center';
      };
    };
    edge: {
      edgeWidth?: number;
      shape?: OgmaEdgeShape;
      text?: TextOptions;
    };
  };

  constructor(
    ogma: LKOgma,
    configuration: {
      node: {
        nodeRadius?: number;
        shape?: OgmaNodeShape;
        text?: TextOptions & {
          nodePosition?: 'right' | 'left' | 'top' | 'bottom' | 'center';
        };
      };
      edge: {
        edgeWidth?: number;
        shape?: OgmaEdgeShape;
        text?: TextOptions;
      };
    }
  ) {
    this._ogma = ogma;
    this._defaultConfiguration = configuration;
  }

  /**
   * Set nodes default styles based on the configuration
   */
  public setNodesDefaultStyles(): void {
    // setting selection and hover attributes
    this._ogma.styles.setHoveredNodeAttributes(HOVERED_SELECTED_NODE_STYLE);
    this._ogma.styles.setSelectedNodeAttributes(HOVERED_SELECTED_NODE_STYLE);
    // setting default styles
    this._nodeDefaultStylesRules = this._ogma.styles.addRule({
      nodeAttributes: {
        text: {
          minVisibleSize:
            this._defaultConfiguration.node.text !== undefined &&
            this._defaultConfiguration.node.text.minVisibleSize
              ? this._defaultConfiguration.node.text.minVisibleSize
              : 12,
          maxLineLength:
            this._defaultConfiguration.node.text !== undefined &&
            this._defaultConfiguration.node.text.maxLineLength !== undefined
              ? this._defaultConfiguration.node.text.maxLineLength
              : 30,
          position:
            this._defaultConfiguration.node.text !== undefined &&
            this._defaultConfiguration.node.text.nodePosition !== undefined
              ? this._defaultConfiguration.node.text.nodePosition
              : 'bottom',
          backgroundColor:
            this._defaultConfiguration.node.text !== undefined &&
            this._defaultConfiguration.node.text.backgroundColor !== undefined
              ? this._defaultConfiguration.node.text.backgroundColor
              : 'null',
          font:
            this._defaultConfiguration.node.text !== undefined &&
            this._defaultConfiguration.node.text.font !== undefined
              ? this._defaultConfiguration.node.text.font
              : "'roboto', sans-serif",
          color:
            this._defaultConfiguration.node.text !== undefined &&
            this._defaultConfiguration.node.text.color !== undefined
              ? this._defaultConfiguration.node.text.color
              : 'black',
          size:
            this._defaultConfiguration.node.text !== undefined &&
            this._defaultConfiguration.node.text.size !== undefined
              ? this._defaultConfiguration.node.text.size
              : 14,
          margin: 5
        },
        radius: this.defaultNodeRadius(this._defaultConfiguration.node),
        icon: {
          minVisibleSize: 15
        },
        color: '#7f7f7f',
        shape:
          this._defaultConfiguration.node.shape !== undefined
            ? this._defaultConfiguration.node.shape
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
  public setEdgesDefaultStyles(): void {
    // setting selection and hover attributes
    this._ogma.styles.setHoveredEdgeAttributes(HOVERED_SELECTED_EDGE_STYLE);
    this._ogma.styles.setSelectedEdgeAttributes(HOVERED_SELECTED_EDGE_STYLE);
    // setting default styles
    this._edgeDefaultStylesRules = this._ogma.styles.addRule({
      edgeAttributes: {
        text: {
          minVisibleSize:
            this._defaultConfiguration.edge.text !== undefined &&
            this._defaultConfiguration.edge.text.minVisibleSize
              ? this._defaultConfiguration.edge.text.minVisibleSize
              : 3,
          maxLineLength:
            this._defaultConfiguration.edge.text !== undefined &&
            this._defaultConfiguration.edge.text.maxLineLength !== undefined
              ? this._defaultConfiguration.edge.text.maxLineLength
              : 30,
          backgroundColor:
            this._defaultConfiguration.edge.text !== undefined &&
            this._defaultConfiguration.edge.text.backgroundColor !== undefined
              ? this._defaultConfiguration.edge.text.backgroundColor
              : null,
          font:
            this._defaultConfiguration.edge.text !== undefined &&
            this._defaultConfiguration.edge.text.font !== undefined
              ? this._defaultConfiguration.edge.text.font
              : "'roboto', sans-serif",
          color:
            this._defaultConfiguration.edge !== undefined &&
            this._defaultConfiguration.edge.text !== undefined &&
            this._defaultConfiguration.edge.text.color !== undefined
              ? this._defaultConfiguration.edge.text.color
              : 'black',
          size:
            this._defaultConfiguration.edge.text !== undefined &&
            this._defaultConfiguration.edge.text.size !== undefined
              ? this._defaultConfiguration.edge.text.size
              : 14
        },
        width: this.defaultEdgeWidth(this._defaultConfiguration.edge),
        shape:
          this._defaultConfiguration.edge.shape !== undefined
            ? this._defaultConfiguration.edge.shape
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
      nodeSelector: (node) => node && !node.hasClass('filtered'),
      nodeAttributes: {
        halo: (node) => {
          if (
            node !== undefined &&
            (node.isSelected() ||
              node.getAdjacentNodes({}).isSelected().includes(true) ||
              node.getAdjacentEdges().isSelected().includes(true))
          ) {
            return {
              ...NODE_HALO_CONFIGURATION,
              scalingMethod: this._ogma.geo.enabled() ? 'fixed' : 'scaled'
            } as {
              color: '#FFF';
              width: 7;
              strokeWidth: 0;
            };
          }
          return null;
        }
      },
      // recalculate the rule *only* when itself or adjacent
      // elements change their selection status
      nodeDependencies: {
        self: {
          selection: true
        },
        adjacentNodes: {
          selection: true
        },
        adjacentEdges: {
          selection: true
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
      edgeSelector: (edge: Edge) =>
        edge && edge.getSource() && edge.getTarget() && !edge.hasClass('filtered'),
      edgeAttributes: {
        halo: (edge) => {
          if (
            edge &&
            (edge.isSelected() || edge.getSource().isSelected() || edge.getTarget().isSelected())
          ) {
            return {
              ...EDGE_HALO_CONFIGURATION,
              scalingMethod: this._ogma.geo.enabled() ? 'fixed' : 'scaled'
            } as {
              color: '#FFF';
              width: 4;
            };
          }
          return null;
        }
      },
      // this rule will only be invoked when the selection status
      // of the edge or it's extremities is changed
      edgeDependencies: {
        self: {
          selection: true
        },
        extremities: {
          selection: true
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
              const degree = Tools.getHiddenNeighbors(node.toList());
              const badgeContent = Tools.formatNumber(degree);
              if (degree > 0) {
                const nodeColor = Array.isArray(node.getAttribute('color'))
                  ? node.getAttribute('color')![0]
                  : node.getAttribute('color');
                const textColor = OgmaTools.isBright(nodeColor as o.Color)
                  ? DARK_FONT_COLOR
                  : CLEAR_FONT_COLOR;
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
                    font:
                      this._defaultConfiguration.node.text !== undefined &&
                      this._defaultConfiguration.node.text.font !== undefined
                        ? this._defaultConfiguration.node.text.font
                        : DEFAULT_OGMA_FONT,
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
                ? node.getAttribute('color')![0]
                : node.getAttribute('color');
              const textColor = OgmaTools.isBright(nodeColor as o.Color)
                ? DARK_FONT_COLOR
                : CLEAR_FONT_COLOR;
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
    this._ogma.events.onNodesAdded((nodesEvent) => nodesEvent!.nodes.addClass('degreeIndicator'));
    this._ogma.events.onNodesAdded((nodesEvent) => nodesEvent!.nodes.addClass('pinnedIndicator'));
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
    this._edgeDefaultStylesRules.refresh();
  }

  /**
   * Create / refresh an ogma rule for node colors
   */
  public refreshNodeColors(colorStyleRules: Array<LKStyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeColor)) {
      this._nodeAttributes.refresh({color: colorStyleRules});
      this._ogmaNodeColor = this._ogma.styles.addRule({
        nodeAttributes: {
          color: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeAttributes.color(node.getData());
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeAttributes.refresh({color: colorStyleRules});
      this._ogmaNodeColor.refresh();
      // TODO refresh node icons when moving the code from LKE
      // this.refreshIconsColor();
    }
  }

  /**
   * Return an array of StyleRules with only the style that need to be applied
   */
  public getStyleRule(
    state: Array<IStyleRule<INodeStyle | IEdgeStyle>>,
    styleType: StyleType
  ): LKStyleRule[] {
    return new StyleRules(state)[styleType];
  }

  public initNodeColors(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const nodeColorRules = this.getStyleRule(nodeRules, StyleType.COLOR);
    this.refreshNodeColors(nodeColorRules);
  }

  public initNodesIcons(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const nodeIconsRules = this.getStyleRule(nodeRules, StyleType.ICON);
    this.refreshNodeIcons(nodeIconsRules);
  }

  public initNodesSizes(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const nodeSizeRules = this.getStyleRule(nodeRules, StyleType.SIZE);
    this.refreshNodeSize(nodeSizeRules);
  }

  public initNodesShapes(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const nodeShapesRules = this.getStyleRule(nodeRules, StyleType.SHAPE);
    this.refreshNodeShape(nodeShapesRules);
  }

  public initEdgesWidth(edgeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const edgesWidthRules = this.getStyleRule(edgeRules, StyleType.WIDTH);
    this.refreshEdgeWidth(edgesWidthRules);
  }

  public initEdgesShape(edgeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const edgesShapeRules = this.getStyleRule(edgeRules, StyleType.SHAPE);
    this.refreshEdgeShape(edgesShapeRules);
  }

  public initEdgesColor(edgeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const edgesColorRules = this.getStyleRule(edgeRules, StyleType.COLOR);
    this.refreshEdgeColors(edgesColorRules);
  }

  /**
   * Create / refresh an ogma rule for node icons
   *
   * @param {Array<any>} iconStyleRules
   */
  public refreshNodeIcons(iconStyleRules: Array<LKStyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeIcon)) {
      this._nodeAttributes.refresh({icon: iconStyleRules});
      this._ogmaNodeIcon = this._ogma.styles.addRule({
        nodeAttributes: {
          icon: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeAttributes.icon(node.getData()).icon;
            }
          },
          image: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeAttributes.icon(node.getData()).image;
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeAttributes.refresh({icon: iconStyleRules});
      this._ogmaNodeIcon.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for node sizes
   *
   * @param {Array<any>} sizeStyleRules
   */
  public refreshNodeSize(sizeStyleRules: Array<LKStyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeSize)) {
      this._nodeAttributes.refresh({size: sizeStyleRules});
      this._ogmaNodeSize = this._ogma.styles.addRule({
        nodeAttributes: {
          radius: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeAttributes.size(node.getData());
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeAttributes.refresh({size: sizeStyleRules});
      this._ogmaNodeSize.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for node images
   *
   * @param {Array<any>} shapeStyleRules
   */
  public refreshNodeShape(shapeStyleRules: Array<LKStyleRule>): void {
    if (!Tools.isDefined(this._ogmaNodeShape)) {
      this._nodeAttributes.refresh({shape: shapeStyleRules});
      this._ogmaNodeShape = this._ogma.styles.addRule({
        nodeAttributes: {
          shape: (node: o.Node | undefined) => {
            if (node !== undefined) {
              return this._nodeAttributes.shape(node.getData());
            }
          }
        },
        nodeDependencies: {self: {data: true}}
      });
    } else {
      this._nodeAttributes.refresh({shape: shapeStyleRules});
      this._ogmaNodeShape.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for edge colors
   */
  public refreshEdgeColors(colorStyleRules: Array<LKStyleRule>): void {
    if (!Tools.isDefined(this._ogmaEdgeColor)) {
      this._edgeAttributes.refresh({color: colorStyleRules});
      this._ogmaEdgeColor = this._ogma.styles.addRule({
        edgeAttributes: {
          color: (edge: o.Edge | undefined) => {
            if (edge !== undefined) {
              return this._edgeAttributes.color(edge.getData());
            }
          }
        },
        edgeDependencies: {self: {data: true}}
      });
    } else {
      this._edgeAttributes.refresh({color: colorStyleRules});
      this._ogmaEdgeColor.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for edge width
   *
   * @param {Array<LKStyleRule>} widthStyleRules
   */
  public refreshEdgeWidth(widthStyleRules: Array<LKStyleRule>): void {
    if (!Tools.isDefined(this._ogmaEdgeWidth)) {
      this._edgeAttributes.refresh({width: widthStyleRules});
      this._ogmaEdgeWidth = this._ogma.styles.addRule({
        edgeAttributes: {
          width: (edge: o.Edge | undefined) => {
            if (edge !== undefined) {
              return this._edgeAttributes.width(edge.getData());
            }
          }
        },
        edgeDependencies: {
          self: {data: true}
        }
      });
    } else {
      this._edgeAttributes.refresh({width: widthStyleRules});
      this._ogmaEdgeWidth.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for edge width
   *
   * @param {Array<LKStyleRule>} shapeStyleRules
   */
  public refreshEdgeShape(shapeStyleRules: Array<LKStyleRule>): void {
    if (!Tools.isDefined(this._ogmaEdgeShape)) {
      this._edgeAttributes.refresh({shape: shapeStyleRules});
      this._ogmaEdgeShape = this._ogma.styles.addRule({
        edgeAttributes: {
          shape: (edge: o.Edge | undefined) => {
            if (edge !== undefined) {
              return this._edgeAttributes.shape(edge.getData());
            }
          }
        },
        edgeDependencies: {self: {data: true}}
      });
    } else {
      this._edgeAttributes.refresh({shape: shapeStyleRules});
      this._ogmaEdgeShape.refresh();
    }
  }
}
