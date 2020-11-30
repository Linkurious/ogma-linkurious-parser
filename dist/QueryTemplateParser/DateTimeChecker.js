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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rest_client_1 = require("@linkurious/rest-client");
var tools = __importStar(require("../tools/tools"));
var ParserError_1 = require("./ParserError");
var DateChecker_1 = require("./DateChecker");
var RawFieldChecker_1 = require("./RawFieldChecker");
var index_1 = require("./index");
var DateTimeChecker = /** @class */ (function (_super) {
    __extends(DateTimeChecker, _super);
    function DateTimeChecker(check) {
        var _this = _super.call(this, check) || this;
        _this.defaultFormat = {
            iso: 'YYYY-MM-DDThh:mm:ss',
            rx: /^\d{4}[-]\d{2}[-]\d{2}[T]\d{2}[:]\d{2}[:]\d{2}$/
        };
        return _this;
    }
    Object.defineProperty(DateTimeChecker.prototype, "attributes", {
        get: function () {
            return {
                type: rest_client_1.TemplateFieldType.DATE_TIME,
                shorthand: 'format',
                defaultSerializer: index_1.InputSerialization.NATIVE_DATE_TIME
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Transform the parsed json-options necessary.
     */
    DateTimeChecker.prototype.normalizeOptions = function (options) {
        var changes = {};
        var dateTimeOptionsKeys = ['min', 'max', 'default'];
        for (var _i = 0, dateTimeOptionsKeys_1 = dateTimeOptionsKeys; _i < dateTimeOptionsKeys_1.length; _i++) {
            var key = dateTimeOptionsKeys_1[_i];
            if (options[key] !== undefined) {
                // In output `min`, `max`, `default` value are always expressed in `YYYY-MM-DDThh:mm:ssZ`.
                // If timezone was defined, they are corrected with the appropriate timezone.
                changes[key] = this.localeToUTC0(options[key], options.timezone);
            }
        }
        return tools.defaults(changes, options);
    };
    /**
     * Convert a locale date string to a UTC-0 date string.
     *
     * e.g: date: 1969-01-01T11:18:23 timezone: +05:30 ---> 1969-01-01T05:48:23.000Z
     */
    DateTimeChecker.prototype.localeToUTC0 = function (date, timezone) {
        if (timezone === void 0) { timezone = 'Z'; }
        // this method assumes that date is not in UTC-0 (does not end with Z)
        return new Date(date + timezone).toISOString();
    };
    /**
     * Convert a UTC-0 date string to a locale date string with a defined timezone.
     *
     * e.g: date: 1998-06-01T09:18:23.000Z timezone: +05:30 ---> 1998-06-01T14:48:23.000+05:30
     */
    DateTimeChecker.prototype.UTC0ToLocale = function (date, timezone) {
        // this method assumes that date is in UTC-0 (ends with timezone = Z)
        if (timezone === 'Z') {
            // timezone is UTC-0, nothing to do.
            return date;
        }
        // if date is UTC-0 then the date was corrected with the given timezone
        // so we add or remove the time difference.
        var oppositeSign = timezone.startsWith('+') ? '-' : '+';
        var originalDate = date.slice(0, -1) + timezone.replace(timezone.charAt(0), oppositeSign);
        date = new Date(originalDate).toISOString().slice(0, -1);
        return date + timezone;
    };
    /**
     * Normalize input to be inserted in a graph query.
     */
    DateTimeChecker.prototype.normalizeInput = function (input, options) {
        var timezone = options.timezone;
        if (options.format === rest_client_1.DatetimeTemplateFormat.NATIVE) {
            if (options.timezone) {
                // If timezone is defined, we re-correct the date by adding the timezone to the UTC-0 date
                // before passing it to the quote function.
                // e.g: quote('YY-MM-DDThh:mm:ss+XX:YY', InputSerialization.NATIVE_DATE_TIME)
                input = this.UTC0ToLocale(input, timezone);
            }
            else {
                // If timezone is not defined, the date does not have a timezone, suffix 'Z' should be removed
                // e.g: quote('YY-MM-DDThh:mm:ss', InputSerialization.NATIVE_DATE_TIME)
                var lastChar = input.charAt(input.length - 1);
                if (lastChar === 'Z') {
                    input = input.slice(0, -1);
                }
            }
            return { value: input, serializer: index_1.InputSerialization.NATIVE_DATE_TIME };
        }
        else {
            var formattedDate = DateChecker_1.DateChecker.formatDate(new Date(input), options.format, this.defaultFormat.iso);
            return { value: formattedDate, serializer: index_1.InputSerialization.STRING };
        }
    };
    /**
     * TemplateField json-options valcheck field definition.
     */
    DateTimeChecker.prototype.getOptionsFieldDefinition = function () {
        var _this = this;
        // TODO Copied from DateChecker, avoid duplicate code
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
        var acceptedFormats = Object.values(rest_client_1.DatetimeTemplateFormat);
        var properties = {
            format: { required: true, values: acceptedFormats },
            min: { required: false, check: checkDate },
            max: { required: false, check: checkDate },
            default: { required: false, check: checkDate },
            timezone: {
                required: false,
                check: function (key, value) {
                    var timezonePattern = '[+-]HH:MM | Z';
                    var timezoneRx = /(^[+-]\d{2}:\d{2}$)|(^[Z]$)/;
                    _this.check.string(key, value, true);
                    if (!timezoneRx.test(value)) {
                        throw ParserError_1.ParserError.options(ParserError_1.Message.PATTERN_MATCH_FAILED, {
                            key: key,
                            pattern: timezonePattern
                        });
                    }
                    // we use a dummy date to validate the timezone using the date parser.
                    var dateCandidate = Date.parse('1969-12-31T23:00:00.000' + value);
                    if (dateCandidate !== dateCandidate) {
                        // IE compatible NaN check
                        throw ParserError_1.ParserError.options(ParserError_1.Message.INVALID_TIMEZONE, { key: key });
                    }
                }
            }
        };
        return {
            required: true,
            properties: properties,
            check: function (key, value) {
                _this.check.property(key, value, { properties: properties });
                var options = value;
                _this.check.properties(key, options, {
                    min: DateChecker_1.DateChecker.between(undefined, options.max),
                    max: DateChecker_1.DateChecker.between(options.min, undefined),
                    default: DateChecker_1.DateChecker.between(options.min, options.max)
                }, 'inclusive');
            }
        };
    };
    /**
     * Template input value field definition. Copied from DateChecker.
     *
     * @param options
     */
    DateTimeChecker.prototype.getInputFieldDefinition = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return {
            check: function (key, value) {
                _this.check.type(key, value, 'string');
                var date = new Date(value);
                _this.check.date(key, date, false);
                _this.check.date(key, value, true);
                _this.check.property(key, value, DateChecker_1.DateChecker.between(options.min, options.max));
            }
        };
    };
    return DateTimeChecker;
}(RawFieldChecker_1.RawFieldChecker));
exports.DateTimeChecker = DateTimeChecker;
//# sourceMappingURL=DateTimeChecker.js.map