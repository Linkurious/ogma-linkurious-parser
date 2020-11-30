/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-02-01.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { DatetimeTemplate } from '@linkurious/rest-client';
import { RawFieldChecker } from './RawFieldChecker';
import { InputSerialization, TemplateCheckerAttributes, TemplateDataValue } from './index';
export declare class DateTimeChecker<E> extends RawFieldChecker<E> {
    private readonly defaultFormat;
    constructor(check: Valcheck<E>);
    readonly attributes: TemplateCheckerAttributes;
    /**
     * Transform the parsed json-options necessary.
     */
    protected normalizeOptions(options: DatetimeTemplate['options']): DatetimeTemplate['options'];
    /**
     * Convert a locale date string to a UTC-0 date string.
     *
     * e.g: date: 1969-01-01T11:18:23 timezone: +05:30 ---> 1969-01-01T05:48:23.000Z
     */
    private localeToUTC0;
    /**
     * Convert a UTC-0 date string to a locale date string with a defined timezone.
     *
     * e.g: date: 1998-06-01T09:18:23.000Z timezone: +05:30 ---> 1998-06-01T14:48:23.000+05:30
     */
    private UTC0ToLocale;
    /**
     * Normalize input to be inserted in a graph query.
     */
    protected normalizeInput(input: string, options: DatetimeTemplate['options']): {
        value: TemplateDataValue;
        serializer: InputSerialization;
    };
    /**
     * TemplateField json-options valcheck field definition.
     */
    protected getOptionsFieldDefinition(): FieldDefinition<E>;
    /**
     * Template input value field definition. Copied from DateChecker.
     *
     * @param options
     */
    protected getInputFieldDefinition(options?: DatetimeTemplate['options']): FieldDefinition<E>;
}
