"use strict";
/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS
 *
 * - Created on 25/07/18.
 */
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
var rest_client_1 = require("@linkurious/rest-client");
var utils_1 = require("@linkurious/rest-client/dist/src/utils");
var MAX_VALUE_LENGTH_BYTE = 10000; // 10 kB
var DIACRITIC_CHARACTERS = /[\u0300-\u036f]/g;
var NOT_A_LETTER = /[\s.:,;?!"'`~@#$€£%^&*(){}[\]_\-+=|\\<>/]/;
var OPENING_TAG = '[match]';
var CLOSING_TAG = '[/match]';
var ISO_DATE_RE = /^\d+-\d\d-\d\d((T\d\d(:\d\d(:\d\d(\.\d{1,3})?)?)?)(Z|[+-]\d\d(:\d\d)?)?)?$/;
var Highlighter = /** @class */ (function () {
    function Highlighter() {
    }
    /**
     * Extract the best quotation of size `maxLength` of `text`, a text already highlighted
     * with `openingTag` and `closingTag`.
     *
     * @param {string}              text
     * @param {Map<string, number>} tokenScores
     * @param {string}              openingTag
     * @param {string}              closingTag
     * @param {number}              [maxLength]
     * @returns {string}
     */
    Highlighter.extractQuotation = function (text, tokenScores, openingTag, closingTag, maxLength) {
        if (maxLength === null || maxLength === undefined || text.length <= maxLength) {
            return text;
        }
        // 1) split the text in words; a matching word (enclosed by tags) is going to be its own word.
        var wordsStr = text.split(openingTag).join(' ' + openingTag);
        wordsStr = wordsStr.split(closingTag).join(closingTag + ' ');
        var words = wordsStr.replace(/\s+/g, ' ').trim().split(' ');
        // 2) count `charsUpToIndex`: number of characters contained in `word` up to the i-th word included
        // and discover which ones are the indices of the highlighted words (`interestingIndexes`)
        var interestingIndexes = [];
        var charsUpToIndex = [];
        for (var i = 0; i < words.length; ++i) {
            charsUpToIndex[i] = i === 0 ? words[0].length : charsUpToIndex[i - 1] + words[i].length + 1; // +1 for the space char
            var word = words[i];
            // if i'm enclosed by tag
            if (word.startsWith(openingTag) &&
                word.indexOf(closingTag) === word.length - closingTag.length) {
                interestingIndexes.push(i);
                // fix `charsUpToIndex` s.t. the tag lengths don't influence the number of characters
                charsUpToIndex[i] -= openingTag.length + closingTag.length;
            }
        }
        // 3) find end given any fixed start
        var end = [];
        for (var i = 0; i < words.length; ++i) {
            var firstIndex = end[i - 1] || i;
            end[i] = end[i - 1] || i;
            for (var y = firstIndex; y < words.length; ++y) {
                if (charsUpToIndex[y] - (i === 0 ? 0 : charsUpToIndex[i - 1] + 1) <= maxLength) {
                    end[i] = y + 1; // +1 because we have [start, end)
                }
                else {
                    break; // length can only go increasing
                }
            }
        }
        // 4) find best start
        var bestStart = 0;
        var bestScore = 0; // how many highlighted words (weighted by their matching score) appear in the quotation
        var contextBestScore = 0; // sum of the min distances among the highlighted words and the borders of the window
        // 4.1) compute score of all the cases
        for (var i = 0; i < words.length; ++i) {
            var score = 0;
            var contextScore = 0;
            for (var y = 0; y < interestingIndexes.length; ++y) {
                var index = interestingIndexes[y];
                if (index < i) {
                    continue;
                }
                if (index < end[i]) {
                    score += tokenScores.get(words[index]);
                    contextScore += Math.min(index - i, end[i] - 1 - index);
                }
                else {
                    break; // index can only go increasing
                }
            }
            if (score > bestScore || (score === bestScore && contextScore > contextBestScore)) {
                bestStart = i;
                bestScore = score;
                contextBestScore = contextScore;
            }
        }
        var resultString = words.slice(bestStart, end[bestStart]).join(' ');
        if (bestStart !== 0) {
            resultString = '... ' + resultString;
        }
        if (end[bestStart] !== words.length) {
            resultString = resultString + ' ...';
        }
        return resultString;
    };
    /**
     * NOTE: if a literal is longer than `maxLength` it gets truncated
     * but the indices are of the original token.
     *
     * @example
     * tokenize('hello! WoRlD&(/"£miao5world5f', 2, 4);
     * // -> {hell: [[0, 5]], worl: [[7, 5], [22, 5]], miao: [[17, 4]]}
     *
     * @param {string} text
     * @param {number} minLength
     * @param {number} maxLength
     * @returns {Map<string, number[][]>}
     */
    Highlighter.tokenize = function (text, minLength, maxLength) {
        text = text.normalize('NFD').replace(DIACRITIC_CHARACTERS, '');
        var result = new Map();
        var addResult = function (literal, firstIndex, length) {
            literal = literal.slice(0, maxLength);
            if (literal.length < minLength) {
                return;
            }
            if (!result.has(literal)) {
                result.set(literal, []);
            }
            result.get(literal).push([firstIndex, length]);
        };
        var curLiteral = null;
        var curFirstIndex = null;
        var curLen = null;
        for (var i = 0; i < text.length && i < MAX_VALUE_LENGTH_BYTE; ++i) {
            var c = text[i].toLowerCase();
            if (!c.match(NOT_A_LETTER)) {
                // is a letter
                if (curLiteral) {
                    curLiteral += c;
                    curLen++;
                }
                else {
                    curLiteral = c;
                    curFirstIndex = i;
                    curLen = 1;
                }
            }
            else {
                if (curLiteral) {
                    addResult(curLiteral, curFirstIndex, curLen);
                    curLiteral = null;
                    curFirstIndex = null;
                    curLen = null;
                }
            }
        }
        if (curLiteral) {
            // if curLiteral is defined, curFirstIndex and curLen are numbers
            addResult(curLiteral, curFirstIndex, curLen);
        }
        return result;
    };
    /**
     * Return a number from 0 to 1 to indicate how similar are `a` and `b`.
     * If `a` and `b` differ more characters than `maxEditDistance`, it returns 0.
     * If `allowPrefix` is true and `b` starts with `a`, it returns 1.
     * If `a` and `b` are equal, it also returns 1.
     *
     * @returns {number} a number from 0 to 1. 1 indicates a non-match, and 0 an exact match
     */
    Highlighter.fuzzyMatch = function (a, b, maxEditDistance, allowPrefix) {
        // if (a.length === 0) {return b.length;} // `a` and `b` are never empty
        // if (b.length === 0) {return a.length;}
        if (allowPrefix === void 0) { allowPrefix = false; }
        if (allowPrefix && b.startsWith(a)) {
            return 1; // if `a` is a prefix of `b`, it's a match
        }
        if (Math.abs(a.length - b.length) > maxEditDistance) {
            return 0; // if the difference in length is too high is not a match
        }
        var editDistance = Highlighter.editDistance(a, b);
        if (editDistance > maxEditDistance) {
            return 0;
        }
        else {
            return 1 - editDistance / a.length;
        }
    };
    /**
     * Return the edit distance among a and b.
     *
     * Source: https://gist.github.com/andrei-m/982927
     *
     * @param {string} a
     * @param {string} b
     * @returns {number}
     */
    Highlighter.editDistance = function (a, b) {
        var tmp, i, j, prev, val;
        // swap to save some memory O(min(a,b)) instead of O(a)
        if (a.length > b.length) {
            tmp = a;
            a = b;
            b = tmp;
        }
        var row = new Array(a.length + 1);
        // init the row
        for (i = 0; i <= a.length; i++) {
            row[i] = i;
        }
        // fill in the rest
        for (i = 1; i <= b.length; i++) {
            prev = i;
            for (j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) {
                    val = row[j - 1]; // match
                }
                else {
                    val = Math.min(row[j - 1] + 1, // substitution
                    Math.min(prev + 1, // insertion
                    row[j] + 1)); // deletion
                }
                row[j - 1] = prev;
                prev = val;
            }
            row[a.length] = prev;
        }
        return row[a.length];
    };
    Highlighter.editDistanceFromFuzziness = function (tokenLength, fuzziness) {
        return Math.min(Math.round(tokenLength * fuzziness), 2);
    };
    Highlighter.isLkDate = function (o) {
        return typeof o === 'object' && o !== null && 'value' in o;
    };
    Highlighter.isISODate = function (input) {
        // check valid grammar
        if (!ISO_DATE_RE.test(input)) {
            return false;
        }
        // check valid values
        var candidateValue = new Date(input);
        return isFinite(candidateValue.getTime());
    };
    /**
     * In local search we don't have a searchQuery, but we have query string and fuzziness
     */
    Highlighter.buildSearchQueryFromString = function (q, params) {
        var tokens = Array.from(Highlighter.tokenize(q, params.minTokenLength, params.maxTokenLength).keys());
        return {
            fuzziness: params.localFuzziness,
            entityType: rest_client_1.EntityType.NODE,
            filters: [],
            phrases: [],
            terms: tokens.map(function (token, index) {
                return ({
                    // We decided to prefix the last term if it's not followed by whitespaces
                    prefix: index === tokens.length - 1 && !/\s/.test(q[q.length - 1]),
                    term: token
                });
            }),
            propertiesPerTypes: {}
        };
    };
    /**
     *
     * Example 1: tokenizeForPhraseSearch("hello! WoRlD&(/"£miao5world5f", 2, 4);
     * Output 1: [
     *    {tokenStart: 0, tokenEnd: 5, token: "hello"},
     *    {tokenStart: 7, tokenEnd: 12, token: "world"},
     *    ...
     * ]
     */
    Highlighter.tokenizeForPhraseSearch = function (text) {
        text = text.normalize('NFD').replace(DIACRITIC_CHARACTERS, '');
        var tokens = [];
        var token = undefined;
        for (var index = 0; index < text.length; index++) {
            var char = text[index].toLowerCase();
            if (/[a-zA-Z0-9]/.test(char)) {
                token = utils_1.hasValue(token) ? token + char : char;
            }
            else if (utils_1.hasValue(token)) {
                tokens.push({
                    tokenStart: index - token.length,
                    tokenEnd: index,
                    token: token
                });
                token = undefined;
            }
        }
        if (utils_1.hasValue(token)) {
            tokens.push({
                tokenStart: text.length - token.length,
                tokenEnd: text.length,
                token: token
            });
        }
        return tokens;
    };
    /**
     * This function looks for tokens of `searchQuery` inside `document`.
     *
     * For every property key that match, this function will return the property key in `field` and
     * the property value in `value` properly truncated and highlighted:
     * - Wrap every token of `searchQuery` that is contained in `value` like: [match]word[/match].
     * - If `value` is longer than MAX_LENGTH_SEARCH_RESULT, it will be shortened by extracting
     * a fragment where the highest number of matched words appear.
     *
     * @example
     * document: {name: 'Linkurious', description: 'The Linkurious company makes Software', ...}
     * searchQuery.terms[0].terms: ['Linkurios']
     * options.fuzziness: 0.4
     * options.maxValueLength: 20
     *
     * returns:
     * [{
     *   field: 'name',
     *   value: '[match]Linkurious[/match]'
     * }, {
     *   field: 'description',
     *   value: 'The [match]Linkurious[/match] company ...'
     * }]
     *
     * @param {SearchQuery | string} searchQueryOrString
     * @param {GenericObject<unknown>} document
     * @param {string} openingTag
     * @param {string} closingTag
     * @param {object} [options]
     * @param {number} [options.maxValueLength=80]
     * @param {number} [options.minTokenLength=2]
     * @param {number} [options.maxTokenLength=7]
     * @param {number} [options.maxMatchResults=5]
     * @returns {Array<{field: string, value: string}>}
     */
    Highlighter.highlight = function (searchQueryOrString, document, openingTag, closingTag, options) {
        var searchQuery = {};
        var params = __assign({ maxValueLength: 80, minTokenLength: 2, maxTokenLength: 7, maxMatchResults: 5, localFuzziness: 0.3 }, (options || {}));
        if (typeof searchQueryOrString === 'string') {
            searchQuery = Highlighter.buildSearchQueryFromString(searchQueryOrString, params);
        }
        else {
            searchQuery = searchQueryOrString;
        }
        var docTokens = {};
        Object.keys(document).forEach(function (key) {
            var propertyValue = document[key];
            var value;
            if (typeof propertyValue === 'string' ||
                typeof propertyValue === 'number' ||
                typeof propertyValue === 'boolean') {
                value = '' + propertyValue;
            }
            else if ('value' in propertyValue) {
                // LkDate or LkDateTime
                value = propertyValue.value;
            }
            else if ('original' in propertyValue) {
                // InvalidValue or ConflictValue
                value = propertyValue.original;
            }
            docTokens[key] = utils_1.hasValue(value)
                ? Highlighter.tokenize(value, params.minTokenLength, params.maxTokenLength)
                : undefined;
        });
        var allMatches = new Map();
        for (var field in document) {
            allMatches.set(field, []);
        }
        // 1) for each term statement
        for (var i = 0; i < searchQuery.terms.length; ++i) {
            var searchTerm = searchQuery.terms[i].term.toLowerCase();
            // 1.1) for each field in the document
            for (var field in docTokens) {
                var fieldTokensMap = docTokens[field];
                // 1.2) if searchTerm parses as a date (Server issue #2072)
                if (Highlighter.isISODate(searchTerm)) {
                    var docField = document[field];
                    if (Highlighter.isLkDate(docField) && docField.value.startsWith(searchTerm)) {
                        // null indicates to highlight the whole string
                        // also we set a low score to prevent a filter match to hide other highlights
                        allMatches.get(field).push([0, null, 0.01]);
                        continue;
                    }
                }
                // only string fields are tokenized
                if (fieldTokensMap === undefined) {
                    continue;
                }
                var fieldTokensArray = Array.from(fieldTokensMap.keys());
                // check if the term statement is only relevant to a specific field
                if (searchQuery.terms[i].key !== undefined && field !== searchQuery.terms[i].key) {
                    continue;
                }
                var _loop_1 = function (y) {
                    var fieldToken = fieldTokensArray[y];
                    // 1.4) check if a match
                    var maxEditDistance = Highlighter.editDistanceFromFuzziness(searchTerm.length, searchQuery.fuzziness);
                    var score = Highlighter.fuzzyMatch(searchTerm, fieldToken, maxEditDistance, searchQuery.terms[i].prefix);
                    if (score > 0) {
                        // for every match we have one field containing the position, the length and the score
                        // the tokenization provides the first two, we manually add the score
                        var fieldMatches = fieldTokensMap.get(fieldToken).map(function (o) { return o.concat(score); });
                        // @ts-ignore
                        [].push.apply(allMatches.get(field), fieldMatches);
                    }
                };
                // 1.3) for each token in the field
                for (var y = 0; y < fieldTokensArray.length; ++y) {
                    _loop_1(y);
                }
            }
        }
        // 2) for each phrase statement
        for (var i = 0; i < searchQuery.phrases.length; ++i) {
            var searchPhrase = searchQuery.phrases[i].phrase;
            // 2.1) for each field in the document
            for (var field in document) {
                // check if the phrase statement is only relevant to a specific field
                if (searchQuery.phrases[i].key !== undefined && field !== searchQuery.phrases[i].key) {
                    continue;
                }
                var fieldText = document[field];
                if (typeof fieldText !== 'string') {
                    continue;
                }
                // 2.2) tokenize the search text and the target text
                var phraseTokens = Highlighter.tokenizeForPhraseSearch(searchPhrase);
                var fieldTokens = Highlighter.tokenizeForPhraseSearch(fieldText);
                // 2.3) check if all phraseTokens match consecutively a subarray of fieldTokens
                fieldToken: for (var j = 0; j < fieldTokens.length; j++) {
                    for (var k = 0; k < phraseTokens.length; k++) {
                        var isMatch = utils_1.hasValue(fieldTokens[j + k]) &&
                            (fieldTokens[j + k].token === phraseTokens[k].token ||
                                (searchQuery.phrases[i].prefix &&
                                    k === phraseTokens.length - 1 &&
                                    fieldTokens[j + k].token.startsWith(phraseTokens[k].token)));
                        if (!isMatch) {
                            continue fieldToken;
                        }
                    }
                    // 2.4) push the match, the indices of the phrase that contains the tokens that found a match
                    var phraseStart = fieldTokens[j].tokenStart;
                    var phraseLength = fieldTokens[j + phraseTokens.length - 1].tokenEnd - fieldTokens[j].tokenStart;
                    allMatches.get(field).push([phraseStart, phraseLength, 1]);
                }
            }
        }
        // 3) for each filter
        for (var i = 0; i < searchQuery.filters.length; ++i) {
            var field = searchQuery.filters[i].key;
            if (field in document) {
                // null indicates to highlight the whole string
                // also we set a low score to prevent a filter match to hide other highlights
                allMatches.get(field).push([0, null, 0.01]);
            }
        }
        // 4) pick the best field
        // in `allMatches` we have all the pairs of start/end indices to highlight for each field
        // we choose the field with the highest number of highlights
        var matchingFields = [];
        for (var field in document) {
            var valueLength = void 0;
            var docField = document[field];
            var value = void 0;
            if (typeof docField === 'string') {
                valueLength = docField.length;
                value = docField;
            }
            else if (typeof docField === 'number') {
                // numerical filter statements
                value = '' + docField;
                valueLength = 1;
            }
            else if (Highlighter.isLkDate(docField)) {
                // date/datetime filter statements
                value = docField.value;
                valueLength = 1;
            }
            else {
                // neither string, number or date
                continue;
            }
            // The order of matching fields is defined by the following formula
            // We sum all the scores of a given field and divide the result by the length of the value
            var sum = allMatches.get(field).reduce(function (acc, next) { return acc + next[2]; }, 0);
            var fieldScore = sum / valueLength;
            if (fieldScore > 0) {
                matchingFields.push({ score: fieldScore, field: field, value: value });
            }
        }
        // sort in descending order by score
        matchingFields.sort(function (f1, f2) { return f2.score - f1.score; });
        matchingFields = matchingFields.slice(0, params.maxMatchResults);
        return matchingFields.map(function (matchingField) {
            var field = matchingField.field;
            var value = matchingField.value;
            var fieldMatches = allMatches.get(matchingField.field);
            // we sort fieldMatches by token index in increasing order and by score in decreasing order
            // This way, when we deduplicate in the next step, we avoid multiple matches
            // in the same position and we keep only the one with the highest score
            fieldMatches.sort(function (u1, u2) { return u1[0] - u2[0] || u2[2] - u1[2]; });
            // we remove duplicate highlighted token (we keep the highest score)
            var sortedUniq = [];
            var lastTokenIndex = undefined;
            for (var _i = 0, fieldMatches_1 = fieldMatches; _i < fieldMatches_1.length; _i++) {
                var fieldMatch = fieldMatches_1[_i];
                if (lastTokenIndex !== fieldMatch[0]) {
                    lastTokenIndex = fieldMatch[0];
                    sortedUniq.push(fieldMatch);
                }
            }
            fieldMatches = sortedUniq;
            var offset = 0;
            var tokenScores = new Map();
            for (var i = 0; i < fieldMatches.length; ++i) {
                var openingTagPos = offset + fieldMatches[i][0];
                var closingTagPos = void 0;
                if (fieldMatches[i][1] === null) {
                    // null indicates to highlight the whole string
                    closingTagPos = value.length;
                }
                else {
                    closingTagPos = openingTagPos + fieldMatches[i][1];
                }
                var score = fieldMatches[i][2];
                // We set the score in tokenScores, in case we need to make a quotation
                tokenScores.set(OPENING_TAG + value.slice(openingTagPos, closingTagPos) + CLOSING_TAG, score);
                value =
                    value.slice(0, openingTagPos) +
                        OPENING_TAG +
                        value.slice(openingTagPos, closingTagPos) +
                        CLOSING_TAG +
                        value.slice(closingTagPos);
                // every time we add openingTag and closingTag we introduce an offset for all the indices
                offset += OPENING_TAG.length + CLOSING_TAG.length;
            }
            value = Highlighter.extractQuotation(value, tokenScores, OPENING_TAG, CLOSING_TAG, params.maxValueLength)
                .replace(/\[match\]/g, openingTag)
                .replace(/\[\/match\]/g, closingTag);
            return {
                field: field,
                value: value
            };
        });
    };
    return Highlighter;
}());
exports.Highlighter = Highlighter;
//# sourceMappingURL=highlighter.js.map