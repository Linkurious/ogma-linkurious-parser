"use strict";
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractTokenType;
(function (AbstractTokenType) {
    AbstractTokenType["LITERAL"] = "literal";
    AbstractTokenType["EXPRESSION"] = "expression";
})(AbstractTokenType = exports.AbstractTokenType || (exports.AbstractTokenType = {}));
// Returns an array with the indexes of the match of regexp on str
function getMatchIndexes(str, regexp) {
    // In ES2020 return [...str.matchAll(regexp)].map(el => el.index) would do the trick
    var res = [];
    while (true) {
        var match = regexp.exec(str);
        if (match === null) {
            break;
        }
        res.push(match.index);
    }
    return res;
}
var AbstractTemplate = /** @class */ (function () {
    function AbstractTemplate() {
    }
    AbstractTemplate.tokenize = function (rawTemplate, config) {
        if (config === void 0) { config = {
            opening: '{{',
            closing: '}}',
            openingRE: /{{(?!{)/g,
            closingRE: /}}(?!})/g
        }; }
        var openingLength = config.opening.length;
        var closingLength = config.closing.length;
        var tokens = [];
        // Indexes of double opening/closing braces in the `rawTemplate`
        var openings = getMatchIndexes(rawTemplate, config.openingRE);
        var closings = getMatchIndexes(rawTemplate, config.closingRE);
        var i = 0; // Pointer for opening indexes list.
        var j = 0; // Pointer for closing indexes list.
        var l = 0; // `urlTemplate` index for last literal beginning.
        while (true) {
            // Loop ends because we run out of openings.
            // We push the remaining literal if any.
            if (i >= openings.length) {
                var literalToken = rawTemplate.substring(l, rawTemplate.length);
                if (literalToken.length > 0) {
                    tokens.push({
                        type: AbstractTokenType.LITERAL,
                        value: literalToken,
                        start: l,
                        end: rawTemplate.length
                    });
                }
                break;
            }
            // Loops ends because we were looking for closings but run out of them.
            // We push the last literal if any which is previous to the unclosed expression.
            // We push the last expression whose closing double brace was not found.
            if (j >= closings.length) {
                var literalToken = rawTemplate.substring(l, openings[i]);
                if (literalToken.length > 0) {
                    tokens.push({
                        type: AbstractTokenType.LITERAL,
                        value: literalToken,
                        start: l,
                        end: openings[i]
                    });
                }
                tokens.push({
                    type: AbstractTokenType.EXPRESSION,
                    value: rawTemplate.substring(openings[i] + openingLength, rawTemplate.length),
                    start: openings[i] + openingLength,
                    end: rawTemplate.length
                });
                break;
            }
            // We look for the next closing for each opening outside an expression,
            // if a closing is found we have an expression, and the string, if any, before
            // this expression is a literal.
            if (openings[i] > closings[j]) {
                j++;
            }
            else {
                var literalToken = rawTemplate.substring(l, openings[i]);
                var expressionToken = rawTemplate.substring(openings[i] + openingLength, closings[j]);
                if (literalToken.length > 0) {
                    tokens.push({
                        type: AbstractTokenType.LITERAL,
                        value: literalToken,
                        start: l,
                        end: openings[i]
                    });
                }
                tokens.push({
                    type: AbstractTokenType.EXPRESSION,
                    value: expressionToken,
                    start: openings[i] + openingLength,
                    end: closings[i]
                });
                l = closings[j] + closingLength;
                // We move to the next opening outside the expression.
                while (i < openings.length) {
                    if (openings[i] > closings[j]) {
                        break;
                    }
                    else {
                        i++;
                    }
                }
            }
        }
        return tokens;
    };
    return AbstractTemplate;
}());
exports.default = AbstractTemplate;
//# sourceMappingURL=index.js.map