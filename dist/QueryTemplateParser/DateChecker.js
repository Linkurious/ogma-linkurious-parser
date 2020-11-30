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
var rest_client_1 = require("@linkurious/rest-client");
var RawFieldChecker_1 = require("./RawFieldChecker");
var ParserError_1 = require("./ParserError");
var index_1 = require("./index");
var DateChecker = /** @class */ (function (_super) {
    __extends(DateChecker, _super);
    function DateChecker(check) {
        return _super.call(this, check) || this;
    }
    Object.defineProperty(DateChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.DATE,
                shorthand: 'format',
                defaultSerializer: index_1.InputSerialization.NATIVE_DATE
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateChecker.prototype, "defaultFormat", {
        get: function () {
            return {
                iso: 'yyyy-MM-dd',
                rx: /^\d{4}[-]\d{2}[-]\d{2}$/
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check is a date is between start and end.
     *
     * @param start
     * @param end
     */
    DateChecker.between = function (start, end) {
        return {
            check: function (key, value) {
                var date = new Date(value);
                var min = start ? new Date(start).getTime() : -Infinity;
                var max = end ? new Date(end).getTime() : +Infinity;
                if (min > date.getTime()) {
                    throw ParserError_1.ParserError.options(ParserError_1.Message.NOT_BEFORE, { key: key, min: start + '' });
                }
                if (max < date.getTime()) {
                    // We know that end is defined because max is not infinity
                    throw ParserError_1.ParserError.options(ParserError_1.Message.NOT_AFTER, { key: key, max: end + '' });
                }
            }
        };
    };
    /**
     * TemplateField json-options valcheck field definition.
     */
    DateChecker.prototype.getOptionsFieldDefinition = function () {
        var _this = this;
        var checkDate = function (key, value) {
            _this.check.string(key, value, true);
            if (!_this.defaultFormat.rx.test(value)) {
                throw ParserError_1.ParserError.options(ParserError_1.Message.PATTERN_MATCH_FAILED, {
                    key: key,
                    pattern: _this.defaultFormat.iso
                });
            }
            var dateCandidate = Date.parse(value);
            if (dateCandidate !== dateCandidate) {
                // IE compatible NaN check
                throw ParserError_1.ParserError.options(ParserError_1.Message.INVALID_DATE, { key: key });
            }
        };
        var acceptedFormats = Object.values(rest_client_1.DateTemplateFormat);
        var properties = {
            format: { required: true, values: acceptedFormats },
            min: { required: false, check: checkDate },
            max: { required: false, check: checkDate },
            default: { required: false, check: checkDate }
        };
        return {
            required: true,
            properties: properties,
            check: function (key, value) {
                _this.check.property(key, value, { properties: properties });
                var options = value;
                _this.check.properties(key, options, {
                    min: DateChecker.between(undefined, options.max),
                    max: DateChecker.between(options.min, undefined),
                    default: DateChecker.between(options.min, options.max)
                }, 'inclusive');
            }
        };
    };
    /**
     * Template input value field definition.
     *
     * @param options
     */
    DateChecker.prototype.getInputFieldDefinition = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return {
            check: function (key, value) {
                _this.check.type(key, value, 'string');
                var date = new Date(value);
                _this.check.date(key, date, false);
                _this.check.date(key, value, true);
                _this.check.property(key, value, DateChecker.between(options.min, options.max));
            }
        };
    };
    /**
     * Pad single digits with '0'.
     *
     * @param n
     */
    DateChecker.padDigit = function (n) {
        if (n < 10) {
            return '0' + n;
        }
        return n + '';
    };
    DateChecker.defaultFormatting = function (date, format) {
        return format
            .replace(/y{4}/i, date.getUTCFullYear() + '')
            .replace(/(^|[^:])m{2}/i, '$1' + DateChecker.padDigit(date.getUTCMonth() + 1))
            .replace(/d{2}/i, DateChecker.padDigit(date.getUTCDate()))
            .replace('hh', DateChecker.padDigit(date.getUTCHours()))
            .replace(/([:])m{2}/, '$1' + DateChecker.padDigit(date.getUTCMinutes()))
            .replace('ss', DateChecker.padDigit(date.getUTCSeconds()));
    };
    /**
     * Format `date` to string
     *
     * @param date
     * @param format
     * @param defaultFormatISO
     */
    DateChecker.formatDate = function (date, format, defaultFormatISO) {
        switch (format) {
            case rest_client_1.DateTemplateFormat.TIMESTAMP:
                return date.getTime() / 1000 + '';
            case rest_client_1.DateTemplateFormat.TIMESTAMP_MS:
                return date.getTime() + '';
            case rest_client_1.DateTemplateFormat.ISO:
                return DateChecker.defaultFormatting(date, defaultFormatISO);
            default:
                return DateChecker.defaultFormatting(date, format);
        }
    };
    /**
     * Normalize input to be inserted in a graph query.
     */
    DateChecker.prototype.normalizeInput = function (input, options) {
        if (options.format === rest_client_1.DateTemplateFormat.NATIVE) {
            //only use the date part of the ISO string
            var date = input.split('T')[0];
            return { value: date, serializer: index_1.InputSerialization.NATIVE_DATE };
        }
        else {
            var formattedDate = DateChecker.formatDate(new Date(input), options.format, this.defaultFormat.iso);
            return { value: formattedDate, serializer: index_1.InputSerialization.STRING };
        }
    };
    return DateChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.DateChecker = DateChecker;
//# sourceMappingURL=DateChecker.js.map