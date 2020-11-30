/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS
 *
 * - Created on 23/01/2019.
 */

import {describe, it} from 'mocha';
import {assert} from 'chai';

import { AbstractTemplate } from '../../src';

describe('Abstract Template', () => {
    const tokenize = AbstractTemplate.tokenize;

    describe('Behavior of double braces', () => {

        it('Should handle the simplest case', () => {
            const rawTemplate = 'Aaaa{{xxxxx}}aaaaa';
            assert.equal('xxxxx', tokenize(rawTemplate)[1].value);
        });

        it('Should handle double opening brace followed by more opening braces', () => {
            const rawTemplate = 'Aaaa{{{{{{xxxxx}}aaaaa';
            assert.equal('xxxxx', tokenize(rawTemplate)[1].value);
        });

        it('Should handle double closing brace preceded by more closing braces', () => {
            const rawTemplate = 'Aaaa{{{{{xxxxx}}}}}}}aaaaa';
            assert.equal('xxxxx}}}}}', tokenize(rawTemplate)[1].value);
        });

        it('Should ignore closing braces after an expression', () => {
            const rawTemplate = 'Aaaa{{xxxxx}}} }}}}aaaaa';
            assert.equal('xxxxx}', tokenize(rawTemplate)[1].value);
        });

        it('Should ignore opening braces before an expression', () => {
            const rawTemplate = 'aaa{{ {{{xxxxx}}} }}}}aaaaa';
            assert.equal(' {{{xxxxx}', tokenize(rawTemplate)[1].value);
        });
    });

    describe('Tokenizing Query Templates', () => {

        it('Should tokenize multiple expressions', () => {
            const query = 'MATCH (blah) WHERE ' +
                // shorthand
                'blah.state = {{"state":enum:["alive", "dead"]}} ' +
                // json array
                'and blah.score = {{"score":enum:[' +
                '{"label": "F", "value": 10},' +
                '{"label": "D", "value": 50},' +
                '{"label": "A", "value": 100}]}} ' +
                // json object
                'and blah.level = {{"level":enum:{"default": "noob", "values": [' +
                '{"label": "N", "value": "noob"},' +
                '{"label": "E", "value": "expert"},' +
                '{"label": "L", "value": "legend"}]}}} ' +
                // shorthand (boolean and string)
                'and blah.connected = {{"connected":enum:[true, "zero"]}} ';

            const expectedTokens = ['MATCH (blah) WHERE ' +
                // shorthand
                'blah.state = ', '"state":enum:["alive", "dead"]', ' ' +
                // json array
                'and blah.score = ', '"score":enum:[' +
                '{"label": "F", "value": 10},' +
                '{"label": "D", "value": 50},' +
                '{"label": "A", "value": 100}]', ' ' +
                // json object
                'and blah.level = ', '"level":enum:{"default": "noob", "values": [' +
                '{"label": "N", "value": "noob"},' +
                '{"label": "E", "value": "expert"},' +
                '{"label": "L", "value": "legend"}]}', ' ' +
                // shorthand (boolean and string)
                'and blah.connected = ', '"connected":enum:[true, "zero"]', ' '
            ];
            const expectedExpressions = 4;

            const tokenizedTemplate = tokenize(query);
            const actualTokens = tokenizedTemplate.map(t=>t.value);
            const actualExpressions = tokenizedTemplate.filter(t=>t.type==='expression').length;

            assert.deepEqual(expectedTokens, actualTokens);
            assert.equal(expectedExpressions, actualExpressions);
        });

        it('Should tolerate "\\n" and a whitespaces', () => {
            const query = `MATCH (n:PERSON)-[e:CONNECTION]-(c:COMPANY)
                    WHERE ID(n) = {{"Employé":node:"PERSON"}}
                    AND c.size = {{"Taille d'entreprise":string:"small"}}
                    RETURN n, e, c;`;

            const expectedTokens = [
                "MATCH (n:PERSON)-[e:CONNECTION]-(c:COMPANY)\n                    WHERE ID(n) = ",
                "\"Employé\":node:\"PERSON\"",
                "\n                    AND c.size = ",
                "\"Taille d'entreprise\":string:\"small\"",
                "\n                    RETURN n, e, c;"
            ];
            const expectedExpressions = 2;

            const tokenizedTemplate = tokenize(query);
            const actualTokens = tokenizedTemplate.map(t=>t.value);
            const actualExpressions = tokenizedTemplate.filter(t=>t.type==='expression').length;

            assert.deepEqual(expectedTokens, actualTokens);
            assert.equal(expectedExpressions, actualExpressions);
        });

        it('Should tolerate special characters', () => {
            const query = 'MATCH (n) WHERE ID(n) = {{"My ç éèàùâêîôû_-;$@ \'* `":node}} RETURN n;';
            const expectedTokens = [
                'MATCH (n) WHERE ID(n) = ',
                '"My ç éèàùâêîôû_-;$@ \'* `":node',
                ' RETURN n;'
            ];
            const expectedExpressions = 1;

            const tokenizedTemplate = tokenize(query);
            const actualTokens = tokenizedTemplate.map(t=>t.value);
            const actualExpressions = tokenizedTemplate.filter(t=>t.type==='expression').length;

            assert.deepEqual(expectedTokens, actualTokens);
            assert.equal(expectedExpressions, actualExpressions);
        });

        it('Should tolerate JSON inside expression', () => {
            const query = 'MATCH (n) {{"aze":string:{"mux": 12}}} return (n);';
            const expectedTokens = [
                'MATCH (n) ',
                '"aze":string:{"mux": 12}',
                ' return (n);'
            ];
            const expectedExpressions = 1;

            const tokenizedTemplate = tokenize(query);
            const actualTokens = tokenizedTemplate.map(t=>t.value);
            const actualExpressions = tokenizedTemplate.filter(t=>t.type==='expression').length;

            assert.deepEqual(expectedTokens, actualTokens);
            assert.equal(expectedExpressions, actualExpressions);
        });


        it('Should tolerate other curly braces', () => {
            const query = 'select ?p ?q {{{"node":node}} ?p ?q}';
            const expectedTokens = [
                'select ?p ?q {',
                '"node":node',
                ' ?p ?q}'
            ];
            const expectedExpressions = 1;

            const tokenizedTemplate = tokenize(query);
            const actualTokens = tokenizedTemplate.map(t=>t.value);
            const actualExpressions = tokenizedTemplate.filter(t=>t.type==='expression').length;

            assert.deepEqual(expectedTokens, actualTokens);
            assert.equal(expectedExpressions, actualExpressions);
        });


    });


    describe('Tokenizing template with only 1 expression', () => {
        it('Should handle 2 literals on the sides', () => {
            const rawTemplate = 'literal{{expression}}literal';
            assert.equal('expression', tokenize(rawTemplate)[1].value);
        });

        it('Should handle 1 literal on the left', () => {
            const rawTemplate = 'literal{{expression}}';
            assert.equal('expression', tokenize(rawTemplate)[1].value);
        });

        it('Should handle 1 literal on the right', () => {
            const rawTemplate = '{{expression}}literal';
            assert.equal('expression', tokenize(rawTemplate)[0].value);
        });

        it('Should handle template without literals', () => {
            const rawTemplate = '{{expression}}';
            assert.equal('expression', tokenize(rawTemplate)[0].value);
        });

        it('Should handle empty expression and 2 literals on the sides', () => {
            const rawTemplate = 'literal{{}}literal';
            assert.equal('', tokenize(rawTemplate)[1].value);
        });

        it('Should handle empty expression a 1 literal on the left', () => {
            const rawTemplate = 'literal{{}}';
            assert.equal('', tokenize(rawTemplate)[1].value);
        });

        it('Should handle empty expression and 1 literal on the right', () => {
            const rawTemplate = '{{}}literal';
            assert.equal('', tokenize(rawTemplate)[0].value);
        });

        it('Should handle empty expression without literals', () => {
            const rawTemplate = '{{}}';
            assert.equal('', tokenize(rawTemplate)[0].value);
        });
    });

});
