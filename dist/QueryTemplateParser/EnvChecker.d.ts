/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2020
 *
 * - Created on 2020-08-18.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { EnvTemplate } from '@linkurious/rest-client';
import { RawFieldChecker } from './RawFieldChecker';
import { TemplateCheckerAttributes } from './index';
export declare class EnvChecker<E> extends RawFieldChecker<E> {
    private acceptedValues;
    constructor(check: Valcheck<E>);
    readonly attributes: TemplateCheckerAttributes;
    /**
     * TemplateField json-options valcheck field definition.
     *
     * @param nodeCategories
     */
    protected getOptionsFieldDefinition(): FieldDefinition<E>;
    /**
     * Template input value field definition.
     *
     * @param options
     */
    protected getInputFieldDefinition(options?: EnvTemplate['options']): FieldDefinition<E>;
}
