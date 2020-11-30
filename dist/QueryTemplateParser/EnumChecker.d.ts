/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-02-01.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { EnumTemplate, EnumValue } from '@linkurious/rest-client';
import { RawFieldChecker } from './RawFieldChecker';
import { InputSerialization, TemplateCheckerAttributes, TemplateDataValue } from './index';
export declare class EnumChecker<E> extends RawFieldChecker<E> {
    constructor(check: Valcheck<E>);
    readonly attributes: TemplateCheckerAttributes;
    /**
     * TemplateField json-options valcheck field definition.
     */
    protected getOptionsFieldDefinition(): FieldDefinition<E>;
    protected normalizeOptions(options: {
        values: string[] | Array<{
            label: string;
            value: EnumValue;
        }>;
    }): EnumTemplate['options'];
    /**
     * Template input value field definition.
     *
     * @param options
     */
    protected getInputFieldDefinition(options?: EnumTemplate['options']): FieldDefinition<E>;
    /**
     * Normalize input to be inserted in a graph query.
     *
     * @param input
     * @param options
     */
    protected normalizeInput(input: TemplateDataValue, options?: EnumTemplate['options']): {
        value: TemplateDataValue;
        serializer: InputSerialization;
    };
}
