/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-02-01.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { DateTemplate } from '@linkurious/rest-client';
import { RawFieldChecker } from './RawFieldChecker';
import { InputSerialization, TemplateCheckerAttributes, TemplateDataValue } from './index';
export declare class DateChecker<E> extends RawFieldChecker<E> {
    constructor(check: Valcheck<E>);
    readonly attributes: TemplateCheckerAttributes;
    protected readonly defaultFormat: {
        iso: string;
        rx: RegExp;
    };
    /**
     * Check is a date is between start and end.
     *
     * @param start
     * @param end
     */
    static between<E>(start?: string, end?: string): FieldDefinition<E>;
    /**
     * TemplateField json-options valcheck field definition.
     */
    protected getOptionsFieldDefinition(): FieldDefinition<E>;
    /**
     * Template input value field definition.
     *
     * @param options
     */
    protected getInputFieldDefinition(options?: DateTemplate['options']): FieldDefinition<E>;
    /**
     * Pad single digits with '0'.
     *
     * @param n
     */
    private static padDigit;
    static defaultFormatting(date: Date, format: string): string;
    /**
     * Format `date` to string
     *
     * @param date
     * @param format
     * @param defaultFormatISO
     */
    static formatDate(date: Date, format: string, defaultFormatISO: string): string;
    /**
     * Normalize input to be inserted in a graph query.
     */
    protected normalizeInput(input: string, options: DateTemplate['options']): {
        value: TemplateDataValue;
        serializer: InputSerialization;
    };
}
