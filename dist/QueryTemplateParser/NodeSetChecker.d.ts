/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2019
 *
 * - Created on 21-01-2019.
 */
import { FieldDefinition, Valcheck } from 'valcheck/lib/valcheck/Valcheck';
import { NodesetTemplate } from '@linkurious/rest-client';
import { NodeChecker } from './NodeChecker';
import { TemplateCheckerAttributes } from './index';
export declare class NodeSetChecker<E> extends NodeChecker<E> {
    constructor(check: Valcheck<E>);
    readonly attributes: TemplateCheckerAttributes;
    /**
     * Template input value field definition.
     *
     * @param options
     */
    protected getInputFieldDefinition(options?: NodesetTemplate['options']): FieldDefinition<E>;
}
