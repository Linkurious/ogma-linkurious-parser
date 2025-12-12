'use strict';

import type {
  Edge,
  EdgeAttributesValue,
  Node,
  NodeAttributesValue,
  StyleClass,
  StyleRule
} from '@linkurious/ogma';
import * as o from '@linkurious/ogma';
import {
  GenericObject,
  IEdgeStyle,
  INodeStyle,
  IStyleIcon,
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
import {OgmaImage} from '../../styles/nodeAttributes';
import {BADGE_COLOR} from '../../tools/colorPalette';

export interface StylesConfig {
  nodeColorStyleRules: Array<LKStyleRule>;
  nodeIconStyleRules: Array<LKStyleRule>;
  nodeSizeStyleRules: Array<LKStyleRule>;
  nodeShapeStyleRules?: Array<LKStyleRule>;
  edgeColorStyleRules: Array<LKStyleRule>;
  edgeWidthStyleRules: Array<LKStyleRule>;
  edgeShapeStyleRules?: Array<LKStyleRule>;
}
export const DEFAULT_OGMA_FONT = "'roboto', sans-serif";
export const CLEAR_FONT_COLOR = '#FFF';
export const FILTER_OPACITY = 0.2;

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

const ITEM_DEFAULT_COLOR = '#7f7f7f';

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
  private _pinnedIndicatorRule?: StyleRule<LkNodeData, LkEdgeData>;
  private _degreeIndicatorRule?: StyleRule<LkNodeData, LkEdgeData>;

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
      baseUrl?: string;
    }
  ) {
    this._ogma = ogma;
    this._defaultConfiguration = configuration;
    this._nodeAttributes.setBaseUrl(configuration.baseUrl);
  }

  public get nodeAttributes(): NodeAttributes {
    return this._nodeAttributes;
  }

  public get nodeFont(): string | undefined {
    return this._defaultConfiguration.node?.text?.font;
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
          padding: 5,
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
              : undefined,
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
        color: ITEM_DEFAULT_COLOR,
        shape:
          this._defaultConfiguration.node.shape !== undefined
            ? this._defaultConfiguration.node.shape
            : ('circle' as OgmaNodeShape),
        innerStroke: {
          width: 3
        },
        outline: false
      },
      nodeSelector: (node) => !node.isVirtual()
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
              : undefined,
          font:
            this._defaultConfiguration.edge.text !== undefined &&
            this._defaultConfiguration.edge.text.font !== undefined
              ? this._defaultConfiguration.edge.text.font
              : "'roboto', sans-serif",
          color:
            this._defaultConfiguration.edge?.text !== undefined &&
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
        color: ITEM_DEFAULT_COLOR
      }
    });
  }

  /**
   * Set nodes default styles based on the configuration
   */
  public setNodesDefaultHalo(): void {
    // setting default halo style
    this._nodeDefaultHaloRules = this._ogma.styles.addRule({
      nodeSelector: (node) => node && !node.hasClass('filtered') && !node.isVirtual(),
      nodeAttributes: {
        halo: (node) => {
          if (
            node !== undefined &&
            !node.hasClass('filtered') &&
            (node.isSelected() ||
              node.getAdjacentNodes({}).isSelected().includes(true) ||
              node.getAdjacentEdges().isSelected().includes(true))
          ) {
            return {
              ...NODE_HALO_CONFIGURATION,
              scalingMethod: this._ogma.geo.enabled() ? 'fixed' : 'scaled'
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
            !edge.hasClass('filtered') &&
            (edge.isSelected() || edge.getSource().isSelected() || edge.getTarget().isSelected())
          ) {
            return {
              ...EDGE_HALO_CONFIGURATION,
              scalingMethod: this._ogma.geo.enabled() ? 'fixed' : 'scaled'
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
  private defaultNodeRadius(styles: {nodeRadius?: number}): number {
    return this.defaultStylesHas(styles, ['nodeRadius']) ? styles.nodeRadius! : 5;
  }

  /**
   * Return the default edge width set in configuration or 1
   *
   * @returns {number}
   */
  private defaultEdgeWidth(styles: {edgeWidth?: number}): number {
    return this.defaultStylesHas(styles, ['edgeWidth']) ? styles.edgeWidth! : 1;
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
        layer: (node): number => {
          // if the node is part of a virtual node, it should be on top
          if (node.getMetaNode() !== null) {
            return 1;
          }
          return -1;
        },
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
        radius: '50%'
      },
      edgeAttributes: {
        opacity: FILTER_OPACITY,
        layer: (edge): number => {
          const isEdgeInsideNodeGroup = edge
            .getExtremities()
            .getMetaNode()
            .some((node) => node !== null);
          // if the edge is part of a virtual node, it should be on top
          if (!edge.isVirtual() && isEdgeInsideNodeGroup) {
            return 1;
          }
          return -1;
        },
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
            size: 12,
            maxLineLength: textWrappingLength ? 30 : 0
          },
          halo: null
        },
        edgeAttributes: {
          text: {
            minVisibleSize: 0,
            size: 12
          },
          halo: null
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
    this._degreeIndicatorRule = this._ogma.styles.addRule({
      nodeAttributes: {
        badges: {
          bottomLeft: (node: Node) => this._getDegreeIndicatorBadge(node)
        }
      },
      nodeDependencies: {self: {data: true}}
    });
  }

  /**
   * Refresh the degree indicator badge
   */
  public refreshDegreeIndicator(): void {
    if (this._degreeIndicatorRule) {
      this._degreeIndicatorRule.refresh();
      this._degreeIndicatorRule.update({
        nodeAttributes: {
          badges: {
            bottomLeft: (node: Node) => this._getDegreeIndicatorBadge(node)
          }
        }
      });
    }
  }

  private _getDegreeIndicatorBadge(node: Node): o.Badge | undefined {
    if (node !== undefined) {
      const degree = Tools.getHiddenNeighbors(node.toList());
      const badgeContent = Tools.formatNumber(degree);
      if (degree > 0) {
        const isSupernode = node.getData(['statistics', 'supernode']);
        let content = null;
        if (+badgeContent !== 0) {
          content = isSupernode ? badgeContent + '+' : badgeContent;
        }
        return {
          color: BADGE_COLOR,
          minVisibleSize: 20,
          stroke: {
            width: 2,
            color: '#FFFFFF'
          },
          text: {
            font:
              this._defaultConfiguration.node.text !== undefined &&
              this._defaultConfiguration.node.text.font !== undefined
                ? this._defaultConfiguration.node.text.font
                : DEFAULT_OGMA_FONT,
            scale: 0.4,
            color: CLEAR_FONT_COLOR,
            content: content
          }
        };
      }
    }
  }

  /**
   * Used in other repos to refresh the pin badge style rule
   * LKE-13639: we are using a style rule instead of an Ogma class to get the right size of the nodes when calling _findPinBadgeScale
   */
  public async refreshPinBadgeStyleRule(): Promise<void> {
    if (!Tools.isDefined(this._pinnedIndicatorRule)) {
      this._pinnedIndicatorRule = this._ogma.styles.addRule({
        nodeSelector: (node) => !node.getAttribute('layoutable'),
        nodeAttributes: {
          badges: {
            topRight: (node) => {
              return {
                color: BADGE_COLOR,
                minVisibleSize: 20,
                scale: this._findPinBadgeScale(node),
                stroke: {
                  width: 2,
                  color: '#FFFFFF'
                },
                text: {
                  font: 'FontAwesome',
                  scale: 0.4,
                  color: CLEAR_FONT_COLOR,
                  content: '\uf08d'
                }
              };
            }
          }
        },
        nodeDependencies: {
          self: {attributes: ['layoutable']}
        }
      });
      void this._pinnedIndicatorRule.update({
        // @ts-ignore Suggested  by Ogma team to increase the priority of the rule
        priority: 100
      });
    } else {
      await this._pinnedIndicatorRule.refresh();
      void this._pinnedIndicatorRule.update({
        // @ts-ignore Suggested  by Ogma team to increase the priority of the rule
        priority: 100
      });
    }
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
  public refreshNodeColors(colorStyleRules: Array<LKStyleRule<INodeStyle>>): void {
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
        nodeDependencies: {self: {data: true}},
        nodeSelector: (node) => !node.isVirtual()
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

  public initNodeColors(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>): void {
    const nodeColorRules = this.getStyleRule(
      nodeRules,
      StyleType.COLOR
    ) as LKStyleRule<INodeStyle>[];
    this.refreshNodeColors(nodeColorRules);
  }

  public initNodesIcons(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const nodeIconsRules = this.getStyleRule(
      nodeRules,
      StyleType.ICON
    ) as LKStyleRule<INodeStyle>[];
    this.refreshNodeIcons(nodeIconsRules);
  }

  public initNodesSizes(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>): void {
    const nodeSizeRules = this.getStyleRule(nodeRules, StyleType.SIZE) as LKStyleRule<INodeStyle>[];
    this.refreshNodeSize(nodeSizeRules);
  }

  public initNodesShapes(nodeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const nodeShapesRules = this.getStyleRule(
      nodeRules,
      StyleType.SHAPE
    ) as LKStyleRule<INodeStyle>[];
    this.refreshNodeShape(nodeShapesRules);
  }

  public initEdgesWidth(edgeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const edgesWidthRules = this.getStyleRule(
      edgeRules,
      StyleType.WIDTH
    ) as LKStyleRule<IEdgeStyle>[];
    this.refreshEdgeWidth(edgesWidthRules);
  }

  public initEdgesShape(edgeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>) {
    const edgesShapeRules = this.getStyleRule(
      edgeRules,
      StyleType.SHAPE
    ) as LKStyleRule<IEdgeStyle>[];
    this.refreshEdgeShape(edgesShapeRules);
  }

  public initEdgesColor(edgeRules: Array<IStyleRule<INodeStyle | IEdgeStyle>>): void {
    const edgesColorRules = this.getStyleRule(
      edgeRules,
      StyleType.COLOR
    ) as LKStyleRule<IEdgeStyle>[];
    this.refreshEdgeColors(edgesColorRules);
  }

  /**
   * Create / refresh an ogma rule for node icons
   *
   * @param {Array<any>} iconStyleRules
   */
  public refreshNodeIcons(iconStyleRules: Array<LKStyleRule<INodeStyle>>): void {
    if (!Tools.isDefined(this._ogmaNodeIcon)) {
      this._nodeAttributes.refresh({icon: iconStyleRules});
      this._ogmaNodeIcon = this._ogma.styles.addRule({
        nodeAttributes: {
          icon: (node: o.Node | undefined): IStyleIcon | undefined => {
            if (node !== undefined) {
              return this._nodeAttributes.icon(node.getData()).icon;
            }
          },
          image: (node: o.Node | undefined): OgmaImage | null | undefined => {
            if (node !== undefined && !node.isVirtual()) {
              return this._nodeAttributes.icon(node.getData()).image;
            }
          }
        },
        nodeDependencies: {self: {data: true}},
        nodeSelector: (node) => !node.isVirtual()
      });
    } else {
      this._nodeAttributes.refresh({icon: iconStyleRules});
      void this._ogmaNodeIcon.refresh();
    }
  }

  /**
   * Create / refresh an ogma rule for node sizes
   *
   * @param {Array<any>} sizeStyleRules
   */
  public refreshNodeSize(sizeStyleRules: Array<LKStyleRule<INodeStyle>>): void {
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
        nodeDependencies: {self: {data: true}},
        nodeSelector: (node) => !node.isVirtual()
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
  public refreshNodeShape(shapeStyleRules: Array<LKStyleRule<INodeStyle>>): void {
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
        nodeSelector: (node: o.Node | undefined) => node !== undefined && !node.isVirtual(),
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
  public refreshEdgeColors(colorStyleRules: Array<LKStyleRule<IEdgeStyle>>): void {
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
  public refreshEdgeWidth(widthStyleRules: Array<LKStyleRule<IEdgeStyle>>): void {
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
  public refreshEdgeShape(shapeStyleRules: Array<LKStyleRule<IEdgeStyle>>): void {
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

  /**
   * Calculate the scale of the pin badge related to the node radius
   * This is useful when dealing wih huge nodes, and we don't want the badge to be big
   * If the node is small enough, the badge will be 0.46 of the node radius
   * Else it will be 5 / radius
   */
  private _findPinBadgeScale(node: Node<LkNodeData, LkEdgeData>): number {
    // the maximum radius for the badge
    const MAX = 5;
    const defaultRatio = 0.46;
    const bigNodeRatio = 0.17;
    const radius = this._getNodeRadius(node);
    return radius * defaultRatio > MAX ? bigNodeRatio : defaultRatio;
  }

  /**
   * Get node radius
   * This is a workaround for an ogma issue where the radius of virtual nodes is always set to 5.x
   * The issue is still present in Ogma 5.2
   */
  private _getNodeRadius(node: Node<LkNodeData, LkEdgeData>): number {
    if (!node.isVirtual() || OgmaTools.isGroupCollapsed(node)) {
      return node.getAttribute('radius') as number;
    } else {
      // get the width and height of the box that contains the nodes inside the virtual node
      return this._ogma.transformations.getXYR(node.toList())[0].radius;
    }
  }
}
