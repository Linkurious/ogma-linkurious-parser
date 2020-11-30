/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS
 *
 * - Created on 25/07/18.
 */
import { LkProperties, SearchQuery } from '@linkurious/rest-client';
export interface HighlighterOptions {
    maxValueLength?: number;
    minTokenLength?: number;
    maxTokenLength?: number;
    maxMatchResults?: number;
    localFuzziness?: number;
}
export declare class Highlighter {
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
    private static extractQuotation;
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
    static tokenize(text: string, minLength: number, maxLength: number): Map<string, number[][]>;
    /**
     * Return a number from 0 to 1 to indicate how similar are `a` and `b`.
     * If `a` and `b` differ more characters than `maxEditDistance`, it returns 0.
     * If `allowPrefix` is true and `b` starts with `a`, it returns 1.
     * If `a` and `b` are equal, it also returns 1.
     *
     * @returns {number} a number from 0 to 1. 1 indicates a non-match, and 0 an exact match
     */
    static fuzzyMatch(a: string, b: string, maxEditDistance: number, allowPrefix?: boolean): number;
    /**
     * Return the edit distance among a and b.
     *
     * Source: https://gist.github.com/andrei-m/982927
     *
     * @param {string} a
     * @param {string} b
     * @returns {number}
     */
    private static editDistance;
    static editDistanceFromFuzziness(tokenLength: number, fuzziness: number): number;
    private static isLkDate;
    private static isISODate;
    /**
     * In local search we don't have a searchQuery, but we have query string and fuzziness
     */
    static buildSearchQueryFromString(q: string, params: Required<HighlighterOptions>): SearchQuery;
    /**
     *
     * Example 1: tokenizeForPhraseSearch("hello! WoRlD&(/"£miao5world5f", 2, 4);
     * Output 1: [
     *    {tokenStart: 0, tokenEnd: 5, token: "hello"},
     *    {tokenStart: 7, tokenEnd: 12, token: "world"},
     *    ...
     * ]
     */
    private static tokenizeForPhraseSearch;
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
    static highlight(searchQueryOrString: SearchQuery | string, document: LkProperties, openingTag: string, closingTag: string, options?: HighlighterOptions): Array<{
        field: string;
        value: string;
    }>;
}
