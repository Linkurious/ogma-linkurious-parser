/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2016
 *
 * Created by maxime on 2019-02-12.
 *
 * File: OgmaStore
 * Description :
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var tools = __importStar(require("../../tools/tools"));
var reactive_1 = require("./reactive");
var OgmaStore = /** @class */ (function (_super) {
    __extends(OgmaStore, _super);
    function OgmaStore(d) {
        return _super.call(this, d) || this;
    }
    /**
     * Modify Ogma state based on a method
     */
    OgmaStore.prototype.dispatch = function (mapFn) {
        this.next(mapFn(this.value));
    };
    /**
     * Return a piece of state
     */
    OgmaStore.prototype.selectStore = function (mapFn) {
        return this.pipe(operators_1.map(mapFn), operators_1.distinctUntilChanged(function (p, n) { return tools.isEqual(p, n); }));
    };
    /**
     * Clear the state of Ogma
     */
    OgmaStore.prototype.clear = function () {
        this.next({
            selection: new reactive_1.DummyNodeList(),
            items: { node: [], edge: [] },
            changes: undefined,
            animation: false
        });
    };
    return OgmaStore;
}(rxjs_1.BehaviorSubject));
exports.OgmaStore = OgmaStore;
//# sourceMappingURL=OgmaStore.js.map