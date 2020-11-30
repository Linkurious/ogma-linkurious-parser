/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 21-01-2019.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { Template } from '@linkurious/rest-client';
import { InputSerialization, TemplateCheckerAttributes, TemplateDataValue } from './index';
export declare abstract class RawFieldChecker<E> {
    protected check: Valcheck<E>;
    protected constructor(check: Valcheck<E>);
    abstract readonly attributes: TemplateCheckerAttributes;
    needOptions(nodeCategories?: string[]): boolean;
    /**
     * TemplateField json-options valcheck field definition.
     *
     * @param nodeCategories
     */
    protected abstract getOptionsFieldDefinition(nodeCategories?: string[]): FieldDefinition<E>;
    /**
     * Template input value field definition.
     *
     * @param options
     */
    protected abstract getInputFieldDefinition(options?: Template['options']): FieldDefinition<E>;
    /**
     * Normalize input to be inserted in a graph query.
     *
     * @param input
     * @param options
     */
    protected normalizeInput(input: TemplateDataValue, options?: Template['options']): {
        value: TemplateDataValue;
        serializer: InputSerialization;
    };
    /**
     * Transform the parsed json-options necessary.
     */
    protected normalizeOptions(options: {}): Template['options'];
    /**
     * Parse template fields json-options.
     *
     * @param jsonOptions
     * @param nodeCategories
     */
    parseJsonOptions(jsonOptions: string, nodeCategories?: string[]): Template['options'] | undefined;
    /**
     * Validate a template data value.
     *
     * @param input
     * @param quote   Vendor specific methods to validate ids and serialize values
     * @param options
     * @throws {Error} If template data value is not valid
     */
    validateInput(input: {
        key: string;
        value: unknown;
    }, quote?: (data: TemplateDataValue, type: InputSerialization) => string, options?: Template['options']): string;
}
