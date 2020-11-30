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
var index_1 = require("../index");
var OgmaStore_1 = require("./OgmaStore");
var RxViz = /** @class */ (function () {
    function RxViz(ogma) {
        this._store = new OgmaStore_1.OgmaStore({
            selection: new DummyNodeList(),
            items: { node: [], edge: [] },
            changes: undefined,
            animation: false
        });
        this._ogma = ogma;
        this.listenToSelectionEvents();
    }
    Object.defineProperty(RxViz.prototype, "store", {
        get: function () {
            return this._store;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Store new items in state
     */
    RxViz.prototype.storeItems = function (state) {
        return __assign(__assign({}, state), { items: {
                node: this._ogma.getNodes().getId(),
                edge: this._ogma.getEdges().getId()
            } });
    };
    /**
     * Store new node selection in state
     */
    RxViz.prototype.storeNodeSelection = function (state) {
        return __assign(__assign({}, state), { selection: this._ogma.getSelectedNodes() });
    };
    /**
     * store new edge selection in state
     */
    RxViz.prototype.storeEdgeSelection = function (state) {
        return __assign(__assign({}, state), { selection: this._ogma.getSelectedEdges() });
    };
    /**
     * Listen to ogma events and update the state
     */
    RxViz.prototype.listenToSelectionEvents = function () {
        var _this = this;
        var count = 0;
        this._ogma.modules.events.on('animate', function (e) {
            var animationEnd = ++count;
            _this._store.dispatch(function (state) { return (__assign(__assign({}, state), { animation: true })); });
            clearTimeout(_this._animationThrottle);
            _this._animationThrottle = setTimeout(function () {
                if (count === animationEnd) {
                    _this._store.dispatch(function (state) { return (__assign(__assign({}, state), { animation: false })); });
                }
            }, e.duration + index_1.ANIMATION_DURATION + 100);
        });
        this._ogma.events.onDragStart(function () {
            _this._store.dispatch(function (state) { return (__assign(__assign({}, state), { animation: true })); });
        });
        this._ogma.events.onDragEnd(function () {
            _this._store.dispatch(function (state) { return (__assign(__assign({}, state), { animation: false })); });
        });
        this._ogma.events.onNodesAdded(function () {
            _this._store.dispatch(_this.storeItems.bind(_this));
        });
        this._ogma.events.onNodesRemoved(function () {
            _this._store.dispatch(_this.storeItems.bind(_this));
        });
        this._ogma.events.onEdgesAdded(function () {
            _this._store.dispatch(_this.storeItems.bind(_this));
        });
        this._ogma.events.onEdgesRemoved(function () {
            _this._store.dispatch(_this.storeItems.bind(_this));
        });
        this._ogma.events.onNodesSelected(function () {
            _this._store.dispatch(_this.storeNodeSelection.bind(_this));
        });
        this._ogma.events.onEdgesSelected(function () {
            _this._store.dispatch(_this.storeEdgeSelection.bind(_this));
        });
        this._ogma.events.onNodesUnselected(function () {
            _this._store.dispatch(_this.storeNodeSelection.bind(_this));
        });
        this._ogma.events.onEdgesUnselected(function () {
            _this._store.dispatch(_this.storeEdgeSelection.bind(_this));
        });
        this._ogma.events.onNodeDataChange(function (evt) {
            evt.changes.forEach(function (change) {
                _this._store.dispatch(function (state) { return (__assign(__assign({}, state), { changes: {
                        entityType: 'node',
                        input: change.property,
                        value: change.newValues[0]
                    } })); });
            });
        });
        this._ogma.events.onEdgeDataChange(function (evt) {
            evt.changes.forEach(function (change) {
                _this._store.dispatch(function (state) { return (__assign(__assign({}, state), { changes: {
                        entityType: 'edge',
                        input: change.property,
                        value: change.newValues[0]
                    } })); });
            });
        });
    };
    return RxViz;
}());
exports.RxViz = RxViz;
var DummyNodeList = /** @class */ (function () {
    function DummyNodeList() {
        this.size = 0;
        this.isNode = true;
    }
    return DummyNodeList;
}());
exports.DummyNodeList = DummyNodeList;
//# sourceMappingURL=reactive.js.map