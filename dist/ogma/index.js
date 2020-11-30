"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_client_1 = require("@linkurious/rest-client");
var __1 = require("..");
var styles_1 = require("./features/styles");
var captions_1 = require("./features/captions");
var reactive_1 = require("./features/reactive");
var ogma_1 = require("./ogma");
exports.ANIMATION_DURATION = 750;
var LKOgma = /** @class */ (function (_super) {
    __extends(LKOgma, _super);
    function LKOgma(_configuration) {
        var _newTarget = this.constructor;
        var _this = 
        // set Ogma global configuration
        _super.call(this, _configuration) || this;
        _this.nodeCategoriesWatcher = _this.schema.watchNodeNonObjectProperty({
            path: 'categories',
            unwindArrays: true,
            filter: 'all'
        });
        _this.edgeTypeWatcher = _this.schema.watchEdgeNonObjectProperty({
            path: 'type',
            filter: 'all'
        });
        Object.setPrototypeOf(_this, _newTarget.prototype);
        // set ogma max zoom value  and selection with mouse option (false?)
        _this.setOptions({
            interactions: {
                zoom: {
                    maxValue: function (params) {
                        return 128 / params.smallestNodeSize;
                    }
                },
                selection: {
                    enabled: false
                }
            }
        });
        // TODO: need to override  in LKE
        _this.initSelection();
        // init ogma styles object
        _this.initStyles();
        // init visualization captions
        _this.initCaptions(_configuration);
        _this._reactive = new reactive_1.RxViz(_this);
        _this.store = _this._reactive.store;
        _this.LKStyles.setNodesDefaultStyles(_configuration.options !== undefined && _configuration.options.styles !== undefined
            ? _configuration.options.styles.node
            : undefined);
        _this.LKStyles.setEdgesDefaultStyles(_configuration.options !== undefined && _configuration.options.styles !== undefined
            ? _configuration.options.styles.edge
            : undefined);
        _this._multiSelectionKey = navigator.platform === 'MacIntel' ? 'cmd' : 'ctrl';
        return _this;
    }
    /**
     * Initialize selection behavior
     */
    LKOgma.prototype.initSelection = function () {
        var _this = this;
        this.events.onClick(function (e) {
            if (e.button === 'left') {
                if (e.target !== null) {
                    if (_this.keyboard.isKeyPressed(_this._multiSelectionKey)) {
                        _this.getSelectedNodes().setSelected(false);
                        _this.getSelectedEdges().setSelected(false);
                        e.target.setSelected(true);
                    }
                }
            }
        });
    };
    /**
     * Initialize graph
     */
    LKOgma.prototype.init = function (visualization) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedEntityType, selectedElements, fixedNodes, fixedEdges;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clearGraph();
                        selectedEntityType = undefined;
                        selectedElements = [];
                        fixedNodes = visualization.nodes.map(function (node) {
                            if (node.attributes.selected) {
                                selectedEntityType = rest_client_1.EntityType.NODE;
                                selectedElements.push(node.id);
                            }
                            delete node.attributes.selected;
                            return node;
                        });
                        fixedEdges = visualization.edges.map(function (edge) {
                            if (edge.attributes !== undefined) {
                                if (edge.attributes.selected) {
                                    selectedEntityType = rest_client_1.EntityType.EDGE;
                                    selectedElements.push(edge.id);
                                }
                                delete edge.attributes.selected;
                            }
                            return edge;
                        });
                        return [4 /*yield*/, this.setGraph({
                                nodes: fixedNodes,
                                edges: fixedEdges
                            })];
                    case 1:
                        _a.sent();
                        if (selectedEntityType === rest_client_1.EntityType.NODE) {
                            this.getNodes(selectedElements).setSelected(true);
                        }
                        else if (selectedEntityType === rest_client_1.EntityType.EDGE) {
                            this.getEdges(selectedElements).setSelected(true);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return the list of non filtered nodes
     */
    LKOgma.prototype.getNonFilteredNodes = function (items) {
        return __1.Tools.isDefined(items)
            ? this.getNodes(items).filter(function (i) { return !i.hasClass('filtered'); })
            : this.getNodes().filter(function (i) { return !i.hasClass('filtered'); });
    };
    /**
     * Return the list of filtered nodes
     */
    LKOgma.prototype.getFilteredNodes = function (items) {
        return __1.Tools.isDefined(items)
            ? this.getNodes(items).filter(function (i) { return i.hasClass('filtered'); })
            : this.getNodes().filter(function (i) { return i.hasClass('filtered'); });
    };
    /**
     * Return the list of non filtered edges
     */
    LKOgma.prototype.getNonFilteredEdges = function (items) {
        return __1.Tools.isDefined(items)
            ? this.getEdges(items).filter(function (i) { return !i.hasClass('filtered'); })
            : this.getEdges().filter(function (i) { return !i.hasClass('filtered'); });
    };
    /**
     * Return the list of filtered edges
     */
    LKOgma.prototype.getFilteredEdges = function (items) {
        return __1.Tools.isDefined(items)
            ? this.getEdges(items).filter(function (i) { return i.hasClass('filtered'); })
            : this.getEdges().filter(function (i) { return i.hasClass('filtered'); });
    };
    /**
     * Do a full reset on ogma and streams of ogma
     */
    LKOgma.prototype.shutDown = function () {
        this.destroy();
        if (this.store) {
            this.store.clear();
        }
    };
    LKOgma.prototype.initStyles = function () {
        this.LKStyles = new styles_1.StylesViz(this);
    };
    LKOgma.prototype.initCaptions = function (_configuration) {
        var _a, _b, _c, _d, _e;
        var nodeMaxTextLength = (_e = (_d = (_c = (_b = (_a = _configuration) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.styles) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.text) === null || _e === void 0 ? void 0 : _e.maxTextLength;
        this.LKCaptions = new captions_1.CaptionsViz(this, nodeMaxTextLength, _configuration.options !== undefined &&
            _configuration.options.styles !== undefined &&
            _configuration.options.styles.edge !== undefined &&
            _configuration.options.styles.edge.text !== undefined
            ? _configuration.options.styles.edge.text.maxTextLength
            : undefined);
    };
    return LKOgma;
}(ogma_1.Ogma));
exports.LKOgma = LKOgma;
//# sourceMappingURL=index.js.map