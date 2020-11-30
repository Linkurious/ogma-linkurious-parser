'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var HOVERED_SELECTED_NODE_STYLE = {
    text: {
        style: 'bold',
        backgroundColor: '#fff',
        minVisibleSize: 0
    },
    outerStroke: { width: 2 },
    outline: false
};
var HOVERED_SELECTED_EDGE_STYLE = {
    text: {
        style: 'bold',
        backgroundColor: '#fff',
        minVisibleSize: 0
    },
    outline: false
};
var NODE_HALO_CONFIGURATION = {
    color: '#FFF',
    size: 7,
    scalingMethod: 'scaled',
    strokeWidth: 0,
    hideNonAdjacentEdges: true
};
var EDGE_HALO_CONFIGURATION = {
    color: '#FFF',
    scalingMethod: 'scaled',
    size: 4
};
exports.FILTER_OPACITY = 0.2;
var StylesViz = /** @class */ (function () {
    function StylesViz(ogma) {
        this._ogma = ogma;
    }
    /**
     * Set nodes default styles based on the configuration
     */
    StylesViz.prototype.setNodesDefaultStyles = function (nodeStyleConf) {
        // setting selection and hover attributes
        this._ogma.styles.setHoveredNodeAttributes(HOVERED_SELECTED_NODE_STYLE);
        this._ogma.styles.setSelectedNodeAttributes(HOVERED_SELECTED_NODE_STYLE);
        // setting default styles
        this._nodeDefaultStylesRules = this._ogma.styles.addRule({
            nodeAttributes: {
                text: {
                    minVisibleSize: nodeStyleConf !== undefined &&
                        nodeStyleConf.text !== undefined &&
                        nodeStyleConf.text.minVisibleSize
                        ? nodeStyleConf.text.minVisibleSize
                        : 12,
                    maxLineLength: nodeStyleConf !== undefined &&
                        nodeStyleConf.text !== undefined &&
                        nodeStyleConf.text.maxLineLength !== undefined
                        ? nodeStyleConf.text.maxLineLength
                        : 30,
                    position: nodeStyleConf !== undefined &&
                        nodeStyleConf.text !== undefined &&
                        nodeStyleConf.text.nodePosition !== undefined
                        ? nodeStyleConf.text.nodePosition
                        : 'bottom',
                    backgroundColor: nodeStyleConf !== undefined &&
                        nodeStyleConf.text !== undefined &&
                        nodeStyleConf.text.backgroundColor !== undefined
                        ? nodeStyleConf.text.backgroundColor
                        : 'null',
                    font: nodeStyleConf !== undefined &&
                        nodeStyleConf.text !== undefined &&
                        nodeStyleConf.text.font !== undefined
                        ? nodeStyleConf.text.font
                        : 'roboto',
                    color: nodeStyleConf !== undefined &&
                        nodeStyleConf.text !== undefined &&
                        nodeStyleConf.text.color !== undefined
                        ? nodeStyleConf.text.color
                        : 'black',
                    size: nodeStyleConf !== undefined &&
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
                shape: nodeStyleConf !== undefined && nodeStyleConf.shape !== undefined
                    ? nodeStyleConf.shape
                    : 'circle',
                innerStroke: {
                    width: 3
                },
                outline: false
            }
        });
    };
    /**
     * Set edges default styles based on the configuration
     */
    StylesViz.prototype.setEdgesDefaultStyles = function (edgeStyleConf) {
        // setting selection and hover attributes
        this._ogma.styles.setHoveredEdgeAttributes(HOVERED_SELECTED_EDGE_STYLE);
        this._ogma.styles.setSelectedEdgeAttributes(HOVERED_SELECTED_EDGE_STYLE);
        // setting default styles
        this._edgeDefaultStylesRules = this._ogma.styles.addRule({
            edgeAttributes: {
                text: {
                    minVisibleSize: edgeStyleConf !== undefined &&
                        edgeStyleConf.text !== undefined &&
                        edgeStyleConf.text.minVisibleSize
                        ? edgeStyleConf.text.minVisibleSize
                        : 3,
                    maxLineLength: edgeStyleConf !== undefined &&
                        edgeStyleConf.text !== undefined &&
                        edgeStyleConf.text.maxLineLength !== undefined
                        ? edgeStyleConf.text.maxLineLength
                        : 30,
                    backgroundColor: edgeStyleConf !== undefined &&
                        edgeStyleConf.text !== undefined &&
                        edgeStyleConf.text.backgroundColor !== undefined
                        ? edgeStyleConf.text.backgroundColor
                        : null,
                    font: edgeStyleConf !== undefined &&
                        edgeStyleConf.text !== undefined &&
                        edgeStyleConf.text.font !== undefined
                        ? edgeStyleConf.text.font
                        : 'roboto',
                    color: edgeStyleConf !== undefined &&
                        edgeStyleConf.text !== undefined &&
                        edgeStyleConf.text.color !== undefined
                        ? edgeStyleConf.text.color
                        : 'black',
                    size: edgeStyleConf !== undefined &&
                        edgeStyleConf.text !== undefined &&
                        edgeStyleConf.text.size !== undefined
                        ? edgeStyleConf.text.size
                        : 14
                },
                width: this.defaultEdgeWidth(edgeStyleConf),
                shape: edgeStyleConf !== undefined && edgeStyleConf.shape !== undefined
                    ? edgeStyleConf.shape
                    : 'arrow',
                color: '#7f7f7f'
            }
        });
    };
    /**
     * Set nodes default styles based on the configuration
     */
    StylesViz.prototype.setNodesDefaultHalo = function () {
        var _this = this;
        // setting default halo style
        this._nodeDefaultHaloRules = this._ogma.styles.addRule({
            nodeAttributes: {
                halo: function (node) {
                    if (node !== undefined &&
                        !node.hasClass('filtered') &&
                        (node.isSelected() ||
                            node
                                .getAdjacentNodes({})
                                .filter(function (n) { return !n.hasClass('filtered'); })
                                .isSelected()
                                .includes(true) ||
                            node
                                .getAdjacentEdges()
                                .filter(function (e) { return !e.hasClass('filtered'); })
                                .isSelected()
                                .includes(true))) {
                        return __assign(__assign({}, NODE_HALO_CONFIGURATION), { scalingMethod: _this._ogma.geo.enabled() ? 'fixed' : 'scaled' });
                    }
                    return null;
                }
            }
        });
    };
    /**
     * Set edges default styles based on the configuration
     */
    StylesViz.prototype.setEdgesDefaultHalo = function () {
        var _this = this;
        // setting default halo styles
        this._edgeDefaultHaloRules = this._ogma.styles.addRule({
            edgeAttributes: {
                halo: function (edge) {
                    if (edge !== undefined &&
                        !edge.hasClass('filtered') &&
                        (edge.isSelected() ||
                            edge
                                .getExtremities()
                                .filter(function (n) { return !n.hasClass('filtered'); })
                                .isSelected()
                                .includes(true))) {
                        return __assign(__assign({}, EDGE_HALO_CONFIGURATION), { scalingMethod: _this._ogma.geo.enabled() ? 'fixed' : 'scaled' });
                    }
                    return null;
                }
            }
        });
    };
    /**
     * Return the default node radius set in configuration or 5
     *
     * @returns {number}
     */
    StylesViz.prototype.defaultNodeRadius = function (styles) {
        return this.defaultStylesHas(styles, ['nodeRadius']) ? styles.nodeRadius : 5;
    };
    /**
     * Return the default edge width set in configuration or 1
     *
     * @returns {number}
     */
    StylesViz.prototype.defaultEdgeWidth = function (styles) {
        return this.defaultStylesHas(styles, ['edgeWidth']) ? styles.edgeWidth : 1;
    };
    /**
     * Check if a style property exists in the default styles object
     */
    StylesViz.prototype.defaultStylesHas = function (styles, propertyPath) {
        if (!__1.Tools.isDefined(styles)) {
            return false;
        }
        return __1.Tools.getIn(styles, propertyPath) !== undefined;
    };
    /**
     * Set styles for the class "filtered"
     */
    StylesViz.prototype.setFilterClass = function () {
        this._ogma.styles.createClass({
            name: 'filtered',
            nodeAttributes: {
                opacity: exports.FILTER_OPACITY,
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
                    color: __1.BASE_GREY,
                    minVisibleSize: 1
                },
                shape: 'circle',
                image: null,
                icon: null,
                radius: '100%'
            },
            edgeAttributes: {
                opacity: exports.FILTER_OPACITY,
                layer: -1,
                detectable: false,
                text: null,
                color: __1.BASE_GREY,
                shape: 'line',
                width: 0.2
            }
        });
    };
    /**
     * Set the class for exported nodes and edges
     */
    StylesViz.prototype.setExportClass = function (textWrappingLength) {
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
        }
        else {
            this._exportClass.update({
                nodeAttributes: {
                    text: {
                        maxLineLength: textWrappingLength ? 30 : 0
                    },
                    halo: null
                }
            });
        }
    };
    /**
     * Set the rule to display badges
     */
    StylesViz.prototype.setBadgeRule = function () {
        this._ogma.styles.createClass({
            name: 'degreeIndicator',
            nodeAttributes: {
                badges: {
                    topRight: function (node) {
                        if (node !== undefined) {
                            var degree = __1.Tools.getHiddenNeighbors(node.toList());
                            var badgeContent = __1.Tools.shortenNumber(degree);
                            if (degree > 0) {
                                var nodeColor = Array.isArray(node.getAttribute('color'))
                                    ? node.getAttribute('color')[0]
                                    : node.getAttribute('color');
                                var textColor = __1.Tools.isBright(nodeColor) ? '#000' : '#FFF';
                                var isSupernode = node.getData(['statistics', 'supernode']);
                                var content = null;
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
                    bottomRight: function (node) {
                        if (node !== undefined && !node.getAttribute('layoutable')) {
                            var nodeColor = Array.isArray(node.getAttribute('color'))
                                ? node.getAttribute('color')[0]
                                : node.getAttribute('color');
                            var textColor = __1.Tools.isBright(nodeColor) ? '#000' : '#FFF';
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
                self: { attributes: ['layoutable'] }
            }
        });
        this._ogma.events.onNodesAdded(function (_a) {
            var nodes = _a.nodes;
            return nodes.addClass('degreeIndicator');
        });
        this._ogma.events.onNodesAdded(function (_a) {
            var nodes = _a.nodes;
            return nodes.addClass('pinnedIndicator');
        });
    };
    /**
     * Delete the rule to display badges
     */
    StylesViz.prototype.deleteBadgeRule = function () {
        this._ogma.getNodes().removeClasses(['degreeIndicator', 'pinnedIndicator'], 0);
    };
    /**
     * set text overlap to true or false
     *
     * @param {boolean} overlap
     */
    StylesViz.prototype.toggleTextOverlap = function (overlap) {
        this._ogma.setOptions({ texts: { preventOverlap: overlap } });
    };
    /**
     * refresh nodes and edge rules
     *
     */
    StylesViz.prototype.refreshRules = function () {
        this._nodeDefaultStylesRules.refresh();
        this._nodeDefaultHaloRules.refresh();
        this._edgeDefaultStylesRules.refresh();
        this._edgeDefaultHaloRules.refresh();
    };
    /**
     * Create / refresh an ogma rule for node colors
     */
    StylesViz.prototype.refreshNodeColors = function (colorStyleRules) {
        var _this = this;
        if (!__1.Tools.isDefined(this._ogmaNodeColor)) {
            this._nodeColorAttribute = new __1.NodeAttributes({ color: colorStyleRules });
            this._ogmaNodeColor = this._ogma.styles.addRule({
                nodeAttributes: {
                    color: function (node) {
                        if (node !== undefined) {
                            return _this._nodeColorAttribute.color(node.getData());
                        }
                    }
                },
                nodeDependencies: { self: { data: true } }
            });
        }
        else {
            this._nodeColorAttribute.refresh({ color: colorStyleRules });
            this._ogmaNodeColor.refresh();
        }
    };
    /**
     * Create / refresh an ogma rule for node icons
     *
     * @param {Array<any>} iconStyleRules
     */
    StylesViz.prototype.refreshNodeIcons = function (iconStyleRules) {
        var _this = this;
        if (!__1.Tools.isDefined(this._ogmaNodeIcon)) {
            this._nodeIconAttribute = new __1.NodeAttributes({ icon: iconStyleRules });
            this._ogmaNodeIcon = this._ogma.styles.addRule({
                nodeAttributes: {
                    icon: function (node) {
                        if (node !== undefined) {
                            return _this._nodeIconAttribute.icon(node.getData()).icon;
                        }
                    },
                    image: function (node) {
                        if (node !== undefined) {
                            return _this._nodeIconAttribute.icon(node.getData()).image;
                        }
                    }
                },
                nodeDependencies: { self: { data: true } }
            });
        }
        else {
            this._nodeIconAttribute.refresh({ icon: iconStyleRules });
            this._ogmaNodeIcon.refresh();
        }
    };
    /**
     * Create / refresh an ogma rule for node sizes
     *
     * @param {Array<any>} sizeStyleRules
     */
    StylesViz.prototype.refreshNodeSize = function (sizeStyleRules) {
        var _this = this;
        if (!__1.Tools.isDefined(this._ogmaNodeSize)) {
            this._nodeSizeAttribute = new __1.NodeAttributes({ size: sizeStyleRules });
            this._ogmaNodeSize = this._ogma.styles.addRule({
                nodeAttributes: {
                    radius: function (node) {
                        if (node !== undefined) {
                            return _this._nodeSizeAttribute.size(node.getData());
                        }
                    }
                },
                nodeDependencies: { self: { data: true } }
            });
        }
        else {
            this._nodeSizeAttribute.refresh({ size: sizeStyleRules });
            this._ogmaNodeSize.refresh();
        }
    };
    /**
     * Create / refresh an ogma rule for node images
     *
     * @param {Array<any>} shapeStyleRules
     */
    StylesViz.prototype.refreshNodeShape = function (shapeStyleRules) {
        var _this = this;
        if (!__1.Tools.isDefined(this._ogmaNodeShape)) {
            this._nodeShapeAttribute = new __1.NodeAttributes({ shape: shapeStyleRules });
            this._ogmaNodeShape = this._ogma.styles.addRule({
                nodeAttributes: {
                    shape: function (node) {
                        if (node !== undefined) {
                            return _this._nodeShapeAttribute.shape(node.getData());
                        }
                    }
                },
                nodeDependencies: { self: { data: true } }
            });
        }
        else {
            this._nodeShapeAttribute.refresh({ shape: shapeStyleRules });
            this._ogmaNodeShape.refresh();
        }
    };
    /**
     * Create / refresh an ogma rule for edge colors
     */
    StylesViz.prototype.refreshEdgeColors = function (colorStyleRules) {
        var _this = this;
        if (!__1.Tools.isDefined(this._ogmaEdgeColor)) {
            this._edgeColorAttribute = new __1.EdgeAttributes({ color: colorStyleRules });
            this._ogmaEdgeColor = this._ogma.styles.addRule({
                edgeAttributes: {
                    color: function (edge) {
                        if (edge !== undefined) {
                            return _this._edgeColorAttribute.color(edge.getData());
                        }
                    }
                },
                edgeDependencies: { self: { data: true } }
            });
        }
        else {
            this._edgeColorAttribute.refresh({ color: colorStyleRules });
            this._ogmaEdgeColor.refresh();
        }
    };
    /**
     * Create / refresh an ogma rule for edge width
     *
     * @param {Array<StyleRule>} widthStyleRules
     */
    StylesViz.prototype.refreshEdgeWidth = function (widthStyleRules) {
        var _this = this;
        if (!__1.Tools.isDefined(this._ogmaEdgeWidth)) {
            this._edgeWidthAttribute = new __1.EdgeAttributes({ width: widthStyleRules });
            this._ogmaEdgeWidth = this._ogma.styles.addRule({
                edgeAttributes: {
                    width: function (edge) {
                        if (edge !== undefined) {
                            return _this._edgeWidthAttribute.width(edge.getData());
                        }
                    }
                },
                edgeDependencies: {
                    self: { data: true }
                }
            });
        }
        else {
            this._edgeWidthAttribute.refresh({ width: widthStyleRules });
            this._ogmaEdgeWidth.refresh();
        }
    };
    /**
     * Create / refresh an ogma rule for edge width
     *
     * @param {Array<StyleRule>} shapeStyleRules
     */
    StylesViz.prototype.refreshEdgeShape = function (shapeStyleRules) {
        var _this = this;
        if (!__1.Tools.isDefined(this._ogmaEdgeShape)) {
            this._edgeShapeAttribute = new __1.EdgeAttributes({ shape: shapeStyleRules });
            this._ogmaEdgeShape = this._ogma.styles.addRule({
                edgeAttributes: {
                    shape: function (edge) {
                        if (edge !== undefined) {
                            return _this._edgeShapeAttribute.shape(edge.getData());
                        }
                    }
                },
                edgeDependencies: { self: { data: true } }
            });
        }
        else {
            this._edgeShapeAttribute.refresh({ shape: shapeStyleRules });
            this._ogmaEdgeShape.refresh();
        }
    };
    return StylesViz;
}());
exports.StylesViz = StylesViz;
//# sourceMappingURL=styles.js.map