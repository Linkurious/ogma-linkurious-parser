/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2018-01-22.
 */
import { ErrorHighlight, GenericObject, GraphQueryInputType, Template, TemplateFieldType } from '@linkurious/rest-client';
export interface ModifiedQuery {
    query: string;
    correctionTable: OffsetCorrection[];
}
export interface OffsetCorrection {
    offset: number;
    displacement: number;
}
export interface TemplateCheckerAttributes {
    type: TemplateFieldType;
    shorthand: string;
    defaultSerializer: InputSerialization;
}
export declare enum InputSerialization {
    NODE = "node",
    NODE_SET = "nodeset",
    NUMBER = "number",
    STRING = "string",
    BOOLEAN = "boolean",
    NATIVE_DATE = "date",
    NATIVE_DATE_TIME = "datetime",
    ENV = "env"
}
export declare type TemplateDataValue = string | string[] | number | Date;
export default class QueryTemplateParser<E> {
    private readonly checkType;
    private readonly checkOptions;
    private readonly handleError;
    private readonly handleBug;
    private readonly templateCheckers;
    constructor(errorHandler: (error: string, highlight?: ErrorHighlight) => E, bugHandler?: (bugMessage: string) => E);
    private static readonly TEMPLATE_RX;
    private static readonly FIELD_RX;
    /**
     * Return true if the `query` contains template fields.
     *
     * @param query
     */
    static isTemplate(query: string): boolean;
    /**
     * Correct the offset with changes recorded in the correction table.
     *
     * @param offset
     * @param correctionTable
     */
    static correctOffset(offset: number, correctionTable: OffsetCorrection[]): number;
    /**
     * @param template
     * @param statistics
     */
    private checkTemplateField;
    /**
     * @param templateString
     */
    private parseTemplateKey;
    private findFailedMatchCause;
    /**
     * Return the position of any template field left opened.
     */
    private findNonClosedTemplateField;
    /**
     * Extract JSON-name, type and JSON-options from `templateString`.
     */
    private static extractComponents;
    /**
     * Extract and parse JSON-name, type and JSON-options from `templateString`.
     *
     * @param templateString
     * @param nodeCategories
     * @throws {Error} If `templateFieldDescription` does not match the format `JSON-name : type [ : JSON-options ]`
     */
    private parseTemplateField;
    /**
     * Parse a raw query template into template fields.
     * - Extract from `rawQueryTemplate` all template fields with the format `{{ JSON-name : type [ : JSON-options ] }}`
     * - Create a `templateFields` object mapping each `JSON-name` to it's type and JSON-options
     *
     * e.g.: MATCH (n)-[e]->(n2) where id(n)={{"n":node:"Person"}} and id(n2)={{"n2":node}}
     * => {
     *      n: {
     *        type: 'node',
     *        options: {categories: ['Person']}
     *      },
     *      n2: {
     *        type: 'node'
     *      }
     *    }
     *
     * @param rawQueryTemplate
     * @param nodeCategories
     * @param strict           Whether to fail if `query` contains not template fields
     */
    parse(rawQueryTemplate: string, nodeCategories?: string[], strict?: boolean, ignoreEnv?: boolean): Template[] | E;
    private getTemplateFieldContent;
    /**
     * Calculate error highlight based on `level`.
     */
    private calculateHighlight;
    /**
     * Enforce the ordering of the template fields.
     * nodeset and nodes fields should appear first
     *
     *
     * @param templateFields
     */
    private orderTemplateFields;
    /**
     * Get graph query input type from template fields.
     *
     * @param templateFields
     */
    static getInputType(templateFields: Template[]): GraphQueryInputType;
    /**
     * Validate each `templateData` value against the type
     * in `templateFields` mapped with the same key.
     *
     * Return a list of `templateData` for each node input of a `1-node` query
     * Return a list with a single `templateData` for other input types
     *
     * Each templateData is validated and the values are quoted with the `quote` method
     *
     * @param templateData
     * @param templateFields
     * @param quote          Vendor specific method to validate ids and serialize values
     * @throws {Error} If values in `templateData` are not valid with respect to `templateFields`
     */
    private getValidTemplateDataSet;
    /**
     * @param rawQueryTemplate
     * @param templateData
     */
    private bindTemplate;
    /**
     * Replace `rawQueryTemplate` fields with `templateData` values.
     * - Detect fields in `rawQueryTemplate` with the format `{{ JSON-name : type [ : JSON-options ] }}`
     * - Replace the fields with corresponding `templateData[JSON-name]`
     *
     * e.g.:
     * - rawQueryTemplate = MATCH (n)-[e]->(n2) where id(n)={{"n":node:"Person"}}
     * - templateData = {n: 42}
     * => MATCH (n)-[e]->(n2) where id(n)=42
     *
     * @param rawQueryTemplate Templated GraphQuery content
     * @param templateData     Key/value pair to be filled in rawQueryTemplate
     * @param templateFields
     * @param quote
     * @throws {Error} If any field found in `rawQueryTemplate` does not match the format `JSON-name : type [ : JSON-options ]`
     */
    generateRawQueries(rawQueryTemplate: string, templateData: GenericObject<unknown>, templateFields: Template[], quote?: (data: TemplateDataValue, serializer: InputSerialization) => string): ModifiedQuery[] | E;
}
