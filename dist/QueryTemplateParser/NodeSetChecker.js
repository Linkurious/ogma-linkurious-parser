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
Object.defineProperty(exports, "__esModule", { value: true });
// local libs
var rest_client_1 = require("@linkurious/rest-client");
var NodeChecker_1 = require("./NodeChecker");
var index_1 = require("./index");
var NodeSetChecker = /** @class */ (function (_super) {
    __extends(NodeSetChecker, _super);
    // TODO NodeSet is not technically a Node because they have different patterns
    function NodeSetChecker(check) {
        return _super.call(this, check) || this;
    }
    Object.defineProperty(NodeSetChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.NODE_SET,
                shorthand: 'categories',
                defaultSerializer: index_1.InputSerialization.NODE_SET
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Template input value field definition.
     *
     * @param options
     */
    NodeSetChecker.prototype.getInputFieldDefinition = function (options) {
        return { check: ['stringArray', 1] };
    };
    return NodeSetChecker;
}(NodeChecker_1.NodeChecker));
exports.NodeSetChecker = NodeSetChecker;
//# sourceMappingURL=NodeSetChecker.js.map