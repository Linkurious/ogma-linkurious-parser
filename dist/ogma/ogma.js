/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * Created by andrebarata on 2019-01-08.
 */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ogma_1 = __importDefault(require("ogma"));
var TypedOgma = /** @class */ (function (_super) {
    __extends(TypedOgma, _super);
    function TypedOgma() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypedOgma.prototype.addNodes = function (nodes, options) {
        return _super.prototype.addNodes.call(this, nodes, options);
    };
    TypedOgma.prototype.addEdges = function (edges, options) {
        return _super.prototype.addEdges.call(this, edges, options);
    };
    TypedOgma.prototype.addNode = function (node, options) {
        return _super.prototype.addNode.call(this, node, options);
    };
    TypedOgma.prototype.addEdge = function (edge, options) {
        return _super.prototype.addEdge.call(this, edge, options);
    };
    TypedOgma.prototype.removeNodes = function (nodes, options) {
        return _super.prototype.removeNodes.call(this, nodes, options);
    };
    TypedOgma.prototype.removeEdges = function (edges, options) {
        return _super.prototype.removeEdges.call(this, edges, options);
    };
    TypedOgma.prototype.removeNode = function (node, options) {
        return _super.prototype.removeNode.call(this, node, options);
    };
    TypedOgma.prototype.removeEdge = function (edge, options) {
        return _super.prototype.removeEdge.call(this, edge, options);
    };
    TypedOgma.prototype.getNodes = function (selector) {
        return _super.prototype.getNodes.call(this, selector);
    };
    TypedOgma.prototype.getEdges = function (selector) {
        return _super.prototype.getEdges.call(this, selector);
    };
    TypedOgma.prototype.getNode = function (nodeId) {
        return _super.prototype.getNode.call(this, nodeId);
    };
    TypedOgma.prototype.getEdge = function (edgeId) {
        return _super.prototype.getEdge.call(this, edgeId);
    };
    TypedOgma.prototype.setGraph = function (graph, options) {
        return _super.prototype.setGraph.call(this, graph, options);
    };
    TypedOgma.prototype.addGraph = function (graph, options) {
        return _super.prototype.addGraph.call(this, graph, options);
    };
    TypedOgma.prototype.createNodeList = function () {
        return _super.prototype.createNodeList.call(this);
    };
    TypedOgma.prototype.createEdgeList = function () {
        return _super.prototype.createEdgeList.call(this);
    };
    TypedOgma.prototype.getConnectedComponents = function (options) {
        return _super.prototype.getConnectedComponents.call(this, options);
    };
    TypedOgma.prototype.getConnectedComponentByNode = function (node, options) {
        return _super.prototype.getConnectedComponentByNode.call(this, node, options);
    };
    TypedOgma.prototype.getNodesByClassName = function (className) {
        return _super.prototype.getNodesByClassName.call(this, className);
    };
    TypedOgma.prototype.getEdgesByClassName = function (className) {
        return _super.prototype.getEdgesByClassName.call(this, className);
    };
    TypedOgma.prototype.getHoveredElement = function () {
        return _super.prototype.getHoveredElement.call(this);
    };
    TypedOgma.prototype.getPointerInformation = function () {
        return _super.prototype.getPointerInformation.call(this);
    };
    TypedOgma.prototype.getSelectedNodes = function () {
        return _super.prototype.getSelectedNodes.call(this);
    };
    TypedOgma.prototype.getNonSelectedNodes = function () {
        return _super.prototype.getNonSelectedNodes.call(this);
    };
    TypedOgma.prototype.getSelectedEdges = function () {
        return _super.prototype.getSelectedEdges.call(this);
    };
    TypedOgma.prototype.getNonSelectedEdges = function () {
        return _super.prototype.getNonSelectedEdges.call(this);
    };
    return TypedOgma;
}(ogma_1.default));
exports.Ogma = TypedOgma;
//# sourceMappingURL=ogma.js.map