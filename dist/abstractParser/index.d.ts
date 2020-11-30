/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-08-13.
 */
export declare enum AbstractTokenType {
    LITERAL = "literal",
    EXPRESSION = "expression"
}
export interface AbstractToken {
    type: AbstractTokenType;
    value: string;
    start: number;
    end: number;
}
export interface AbstractTokenDelimiters {
    opening: string;
    closing: string;
    openingRE: RegExp;
    closingRE: RegExp;
}
export default class AbstractTemplate {
    static tokenize(rawTemplate: string, config?: AbstractTokenDelimiters): AbstractToken[];
}
