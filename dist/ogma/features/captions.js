'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var CaptionsViz = /** @class */ (function () {
    function CaptionsViz(ogma, _nodeMaxTextLength, _edgeMaxTextLength) {
        this._nodeMaxTextLength = _nodeMaxTextLength;
        this._edgeMaxTextLength = _edgeMaxTextLength;
        this._schema = { node: {}, edge: {} };
        this._ogma = ogma;
    }
    /**
     * Refresh the schema
     */
    CaptionsViz.prototype.refreshSchema = function (schema) {
        this._schema = schema;
    };
    /**
     * Create or update nodeCaptionRule
     */
    CaptionsViz.prototype.updateNodeCaptions = function (schema) {
        var _this = this;
        if (schema) {
            this._schema.node = schema;
        }
        if (!__1.Tools.isDefined(this.nodesCaptionsRule)) {
            return new Promise(function (resolve) {
                _this.nodesCaptionsRule = _this._ogma.styles.addRule({
                    nodeAttributes: {
                        text: {
                            content: function (node) {
                                if (node === undefined) {
                                    return "";
                                }
                                var value = __1.Captions.getText(node.getData(), _this._schema.node);
                                return __1.Tools.isDefined(_this._nodeMaxTextLength)
                                    ? __1.Tools.truncate(value, 'middle', _this._nodeMaxTextLength)
                                    : value;
                            }
                        }
                    },
                    nodeDependencies: { self: { data: true } }
                });
                return resolve();
            });
        }
        else {
            return this.nodesCaptionsRule.refresh();
        }
    };
    /**
     * Create or update edgeCaptionRule
     */
    CaptionsViz.prototype.updateEdgeCaptions = function (schema) {
        var _this = this;
        if (schema) {
            this._schema.edge = schema;
        }
        if (!__1.Tools.isDefined(this.edgesCaptionsRule)) {
            return new Promise(function (resolve) {
                _this.edgesCaptionsRule = _this._ogma.styles.addRule({
                    edgeAttributes: {
                        text: {
                            content: function (edge) {
                                if (edge === undefined) {
                                    return "";
                                }
                                var value = __1.Captions.getText(edge.getData(), _this._schema.edge);
                                return __1.Tools.isDefined(_this._edgeMaxTextLength)
                                    ? __1.Tools.truncate(value, 'middle', _this._edgeMaxTextLength)
                                    : value;
                            }
                        }
                    },
                    edgeDependencies: { self: { data: true } }
                });
                return resolve();
            });
        }
        else {
            return this.edgesCaptionsRule.refresh();
        }
    };
    /**
     * Set the class for exported nodes and edges
     */
    CaptionsViz.prototype.setExportCaptionClass = function (textWrappingLength) {
        var _this = this;
        if (!this._exportCaptionClass) {
            this._exportCaptionClass = this._ogma.styles.createClass({
                name: 'exportedCaption',
                nodeAttributes: {
                    text: {
                        content: function (node) {
                            if (node === undefined) {
                                return "";
                            }
                            return __1.Captions.getText(node.getData(), _this._schema.node);
                        }
                    }
                },
                nodeDependencies: { self: { data: true } },
                edgeAttributes: {
                    text: {
                        content: function (edge) {
                            if (edge === undefined) {
                                return "";
                            }
                            return __1.Captions.getText(edge.getData(), _this._schema.edge);
                        }
                    }
                },
                edgeDependencies: { self: { data: true } }
            });
        }
    };
    return CaptionsViz;
}());
exports.CaptionsViz = CaptionsViz;
//# sourceMappingURL=captions.js.map