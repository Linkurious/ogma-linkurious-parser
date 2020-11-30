/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 21-01-2019.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { StringTemplate } from '@linkurious/rest-client';
import { RawFieldChecker } from './RawFieldChecker';
import { TemplateCheckerAttributes } from './index';
export declare class StringChecker<E> extends RawFieldChecker<E> {
    constructor(check: Valcheck<E>);
    readonly attributes: TemplateCheckerAttributes;
    /**
     * TemplateField json-options valcheck field definition.
     */
    protected getOptionsFieldDefinition(): FieldDefinition<E>;
    /**
     * Template input value field definition.
     *
     * @param options
     */
    protected getInputFieldDefinition(options?: StringTemplate['options']): FieldDefinition<E>;
}
