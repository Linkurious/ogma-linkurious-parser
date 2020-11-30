/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 2019-02-01.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { BooleanTemplate } from '@linkurious/rest-client';
import { RawFieldChecker } from './RawFieldChecker';
import { TemplateCheckerAttributes } from './index';
export declare class BooleanChecker<E> extends RawFieldChecker<E> {
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
    protected getInputFieldDefinition(options?: BooleanTemplate['options']): FieldDefinition<E>;
}
