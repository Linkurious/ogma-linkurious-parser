/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS
 *
 * - Created on 23/01/2019.
 */

import {describe, it} from 'mocha';
import {deepStrictEqual, fail, ok} from 'assert';
import {
  CustomActionElement,
  CustomActionParsingError,
  CustomActionParsingErrorKey,
  CustomActionType,
  CustomActionVariable,
  GraphSchema,
  LkEdge,
  LkNode,
  ParsedCustomAction
} from '@linkurious/rest-client';

import {CustomActionTemplate} from '../../src';
import {ContextData} from '../../src/customActions';
import {hasValue} from '@linkurious/rest-client/dist/src/utils';

interface CustomActionParsingErrors {
  errors: CustomActionParsingError[];
}

describe('Custom Action Template', () => {
  const parse = CustomActionTemplate.parse;
  const render = CustomActionTemplate.render;

  describe('Parser: resolving template type', () => {
    const assertTemplateType = (template: string, expectedType: CustomActionType) => {
      const parsedTemplate = parse(template) as ParsedCustomAction;
      deepStrictEqual(parsedTemplate.type, expectedType);
      return parsedTemplate;
    };

    it('Should be NON_GRAPH', () => {
      assertTemplateType('__{{visualization}}__', CustomActionType.NON_GRAPH);
      assertTemplateType('__{{sourceKey}}__', CustomActionType.NON_GRAPH);
      assertTemplateType('__{{baseUrl}}__', CustomActionType.NON_GRAPH);
      assertTemplateType('{{visualization}}__{{visualization}}', CustomActionType.NON_GRAPH);
      assertTemplateType('{{sourceKey}}__{{sourceKey}}__{{sourceKey}}', CustomActionType.NON_GRAPH);
      assertTemplateType(
        '{{baseUrl}}__{{baseUrl}}__{{baseUrl}}__{{baseUrl}}',
        CustomActionType.NON_GRAPH
      );
      assertTemplateType(
        '{{sourceKey}}__{{visualization}}__{{sourceKey}}__{{visualization}}',
        CustomActionType.NON_GRAPH
      );
      assertTemplateType(
        '{{sourceKey}}__{{baseUrl}}__{{sourceKey}}__{{baseUrl}}',
        CustomActionType.NON_GRAPH
      );
      assertTemplateType(
        '{{baseUrl}}__{{visualization}}__{{baseUrl}}__{{visualization}}',
        CustomActionType.NON_GRAPH
      );
      assertTemplateType(
        '{{sourceKey}}__{{visualization}}__{{baseUrl}}',
        CustomActionType.NON_GRAPH
      );
    });

    it('Should be NODE', () => {
      assertTemplateType('__{{node}}__', CustomActionType.NODE);
      assertTemplateType(
        '__{{node}}__{{visualization}}__{{sourceKey}}__{{baseURL}}',
        CustomActionType.NODE
      );
      assertTemplateType('__{{node}}__{{node}}__{{node}}', CustomActionType.NODE);
      assertTemplateType(
        '{{node}}__{{node}}__{{visualization}}__{{sourceKey}}__{{sourceKey}}__{{baseURL}}',
        CustomActionType.NODE
      );
    });

    it('Should be EDGE', () => {
      assertTemplateType('__{{edge}}__', CustomActionType.EDGE);
      assertTemplateType(
        '__{{edge}}__{{visualization}}__{{sourceKey}}__{{baseURL}}',
        CustomActionType.EDGE
      );
      assertTemplateType('__{{edge}}__{{edge}}__{{edge}}', CustomActionType.EDGE);
      assertTemplateType(
        '{{edge}}__{{edge}}__{{visualization}}__{{sourceKey}}__{{sourceKey}}__{{baseURL}}',
        CustomActionType.EDGE
      );
    });

    it('Should be NODESET', () => {
      assertTemplateType('__{{nodeset}}__', CustomActionType.NODESET);
      assertTemplateType(
        '__{{visualization}}__{{nodeset}}__{{sourceKey}}__{{baseURL}}',
        CustomActionType.NODESET
      );
    });

    it('Should be EDGESET', () => {
      assertTemplateType('__{{edgeset}}__', CustomActionType.EDGESET);
      assertTemplateType(
        '__{{visualization}}__{{EdgeSet}}__{{SourceKey}}__{{baseURL}}',
        CustomActionType.EDGESET
      );
    });
  });

  describe('Parser: detecting parsing errors', () => {
    const nodeSchema = {results: [{itemType: 'PERSON'}, {itemType: 'ANIMAL'}]} as GraphSchema;
    const edgeSchema = {results: [{itemType: 'OWNED_BY'}]} as GraphSchema;

    const assertParsingError = (
      template: string,
      errors: CustomActionParsingErrorKey[],
      schema?: {nodes: GraphSchema; edges: GraphSchema}
    ) => {
      if (!hasValue(schema)) {
        schema = {
          nodes: {results: []},
          edges: {results: []}
        };
      }

      const parsedTemplate = parse(
        template,
        schema.nodes,
        schema.edges
      ) as CustomActionParsingErrors;
      deepStrictEqual(
        (parsedTemplate.errors || []).map(e => e.key),
        errors
      );
      return parsedTemplate.errors || [];
    };

    it('Should detect UNCLOSED_EXPRESSION', () => {
      assertParsingError('__{{visualization', [CustomActionParsingErrorKey.UNCLOSED_EXPRESSION]);
    });

    it('Should detect UNCLOSED_EXPRESSIONS and EMPTY_EXPRESSION only', () => {
      const template = '__{{';
      const parsingResult = parse(template) as CustomActionParsingErrors;
      deepStrictEqual(
        parsingResult.errors.map(e => e.key),
        [
          CustomActionParsingErrorKey.EMPTY_EXPRESSION,
          CustomActionParsingErrorKey.UNCLOSED_EXPRESSION
        ]
      );
    });

    it('Should detect EMPTY_EXPRESSION', () => {
      assertParsingError('__{{}}', [CustomActionParsingErrorKey.EMPTY_EXPRESSION]);
    });

    it('Should detect INVALID_EXPRESSION_SYNTAX', () => {
      assertParsingError('__{{node:=PERSON}}', [
        CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX
      ]);
    });

    it('Should detect empty itemType as UNKNOWN_EDGE_TYPE', () => {
      const template = '__{{edgeset:}}';
      const parsingResult = parse(template) as CustomActionParsingErrors;
      deepStrictEqual(parsingResult.errors[0].key, CustomActionParsingErrorKey.UNKNOWN_EDGE_TYPE);
    });

    it('Should detect empty property as INVALID_EXPRESSION_SYNTAX', () => {
      const nodeSchema = {results: [{itemType: 'PERSON'}, {itemType: 'ANIMAL'}]} as GraphSchema;
      const edgeSchema = {results: [{itemType: 'OWNED_BY'}]} as GraphSchema;

      const template = '__{{(node:PERSON).}}';
      const parsingResult = parse(template, nodeSchema, edgeSchema) as CustomActionParsingErrors;
      deepStrictEqual(
        parsingResult.errors[0].key,
        CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX
      );
    });

    it('Should detect INVALID_VARIABLE', () => {
      assertParsingError('__{{ogma:BLOOM}}', [CustomActionParsingErrorKey.INVALID_VARIABLE]);
    });

    it('Should detect INVALID_VARIABLE and do not return NaN', () => {
      const template = '__{{something}}';
      const parsingResult = parse(template) as CustomActionParsingErrors;
      const {key, start, end} = parsingResult.errors[0];
      deepStrictEqual(key, CustomActionParsingErrorKey.INVALID_VARIABLE);
      deepStrictEqual(typeof start, 'number');
      deepStrictEqual(typeof end, 'number');
    });

    it('Should detect INVALID_SEMANTIC', () => {
      let parsingError;
      parsingError = assertParsingError('__{{visualization:BLOOM}}', [
        CustomActionParsingErrorKey.INVALID_SEMANTIC
      ]);
      deepStrictEqual(parsingError[0], {
        key: CustomActionParsingErrorKey.INVALID_SEMANTIC,
        start: 17,
        end: 23,
        variable: 'visualization',
        unsupportedRestriction: 'type'
      });

      parsingError = assertParsingError('__{{visualization:BLOOM', [
        CustomActionParsingErrorKey.INVALID_SEMANTIC,
        CustomActionParsingErrorKey.UNCLOSED_EXPRESSION
      ]);
      deepStrictEqual(parsingError[0], {
        key: CustomActionParsingErrorKey.INVALID_SEMANTIC,
        start: 17,
        end: 23,
        variable: 'visualization',
        unsupportedRestriction: 'type'
      });

      parsingError = assertParsingError('__{{visualization.prop}}', [
        CustomActionParsingErrorKey.INVALID_SEMANTIC
      ]);
      deepStrictEqual(parsingError[0], {
        key: CustomActionParsingErrorKey.INVALID_SEMANTIC,
        start: 17,
        end: 22,
        variable: 'visualization',
        unsupportedRestriction: 'property'
      });
      parsingError = assertParsingError('__{{visualization.prop', [
        CustomActionParsingErrorKey.INVALID_SEMANTIC,
        CustomActionParsingErrorKey.UNCLOSED_EXPRESSION
      ]);
      deepStrictEqual(parsingError[0], {
        key: CustomActionParsingErrorKey.INVALID_SEMANTIC,
        start: 17,
        end: 22,
        variable: 'visualization',
        unsupportedRestriction: 'property'
      });

      parsingError = assertParsingError('__{{nodeset.prop', [
        CustomActionParsingErrorKey.INVALID_SEMANTIC,
        CustomActionParsingErrorKey.UNCLOSED_EXPRESSION
      ]);
      deepStrictEqual(parsingError[0], {
        key: CustomActionParsingErrorKey.INVALID_SEMANTIC,
        start: 11,
        end: 16,
        variable: 'nodeset',
        unsupportedRestriction: 'property'
      });
    });

    it('Should detect NO_EXPRESSIONS', () => {
      assertParsingError('__', [CustomActionParsingErrorKey.NO_EXPRESSIONS]);
    });

    it('Should detect INVALID_TEMPLATE_COMBINATION', () => {
      const assertInvalidTemplateCombination = (
        template: string,
        ...variablesTuples: [string, string][]
      ) => {
        const {errors} = parse(template) as CustomActionParsingErrors;
        for (let i = 0; i < variablesTuples.length; i++) {
          const error = errors[i];
          if (hasValue(error)) {
            if (error.key === CustomActionParsingErrorKey.INVALID_TEMPLATE_COMBINATION) {
              deepStrictEqual(error.variables, variablesTuples[i]);
            } else {
              fail();
            }
          } else {
            fail();
          }
        }
      };

      assertInvalidTemplateCombination(
        '__{{visualization}}__{{node}}__{{sourceKey}}__{{edge}}__{{edgeset}}',
        ['node', 'edge'],
        ['node', 'edgeset']
      );
      assertInvalidTemplateCombination(
        '__{{visualization}}__{{node}}__{{sourceKey}}__{{nodeset}}__{{edgeset}}',
        ['node', 'nodeset'],
        ['node', 'edgeset']
      );
      assertInvalidTemplateCombination(
        '__{{visualization}}__{{node}}__{{nodeset}}____{{sourceKey}}',
        ['node', 'nodeset']
      );
      assertInvalidTemplateCombination('__{{node}}__{{sourceKey}}__{{edgeset}}__', [
        'node',
        'edgeset'
      ]);

      assertInvalidTemplateCombination(
        '__{{visualization}}__{{edge}}__{{sourceKey}}__{{node}}__{{edgeset}}',
        ['edge', 'node'],
        ['edge', 'edgeset']
      );
      assertInvalidTemplateCombination(
        '__{{visualization}}__{{edge}}__{{nodeset}}____{{sourceKey}}',
        ['edge', 'nodeset']
      );
      assertInvalidTemplateCombination('__{{edge}}__{{sourceKey}}__{{edgeset}}__', [
        'edge',
        'edgeset'
      ]);

      assertInvalidTemplateCombination(
        '__{{visualization}}__{{nodeset}}__{{sourceKey}}__{{node}}__{{edgeset}}',
        ['nodeset', 'node'],
        ['nodeset', 'edgeset']
      );
      assertInvalidTemplateCombination(
        '__{{visualization}}__{{nodeset}}__{{edge}}____{{sourceKey}}',
        ['nodeset', 'edge']
      );
      assertInvalidTemplateCombination('__{{nodeset}}__{{sourceKey}}__{{nodeset}}__', [
        'nodeset',
        'nodeset'
      ]);
      assertInvalidTemplateCombination('__{{nodeset}}__{{sourceKey}}__{{edgeset}}__', [
        'nodeset',
        'edgeset'
      ]);

      assertInvalidTemplateCombination(
        '__{{visualization}}__{{edgeset}}__{{sourceKey}}__{{node}}__{{edgeset}}',
        ['edgeset', 'node'],
        ['edgeset', 'edgeset']
      );
      assertInvalidTemplateCombination(
        '__{{visualization}}__{{edgeset}}__{{edge}}____{{sourceKey}}',
        ['edgeset', 'edge']
      );
      assertInvalidTemplateCombination('__{{edgeset}}__{{sourceKey}}__{{nodeset}}__', [
        'edgeset',
        'nodeset'
      ]);
      assertInvalidTemplateCombination('__{{edgeset}}__{{sourceKey}}__{{edgeset}}__', [
        'edgeset',
        'edgeset'
      ]);
    });

    it('Should detect UNKNOWN_NODE_CATEGORY', () => {
      assertParsingError(
        '__{{node:TRIANGLE}}__',
        [CustomActionParsingErrorKey.UNKNOWN_NODE_CATEGORY],
        {
          nodes: nodeSchema,
          edges: edgeSchema
        }
      );
    });

    it('Should UNKNOWN_NODE_CATEGORY highlight properly', () => {
      const template = 'sf{{node:a';
      const parsingResult = parse(template) as CustomActionParsingErrors;
      deepStrictEqual(parsingResult.errors[0], {
        end: 10,
        key: CustomActionParsingErrorKey.UNKNOWN_NODE_CATEGORY,
        start: 9
      });
    });

    it('Should detect UNKNOWN_EDGE_TYPE', () => {
      assertParsingError(
        '__{{edgeset:INVESTED_IN}}__',
        [CustomActionParsingErrorKey.UNKNOWN_EDGE_TYPE],
        {
          nodes: nodeSchema,
          edges: edgeSchema
        }
      );
    });

    it('Should detect INCOMPATIBLE_RESTRICTIONS', () => {
      assertParsingError(
        '__{{node:PERSON}}__{{node:ANIMAL}}',
        [CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS],
        {
          nodes: nodeSchema,
          edges: edgeSchema
        }
      );
      assertParsingError(
        '__{{node:PERSON}}__{{node:ANIMAL',
        [
          CustomActionParsingErrorKey.UNCLOSED_EXPRESSION,
          CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS
        ],
        {
          nodes: nodeSchema,
          edges: edgeSchema
        }
      );
      assertParsingError(
        '__{{node}}__{{node:ANIMAL}}__{{node:PERSON}}__{{node}}__',
        [
          CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS,
          CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS,
          CustomActionParsingErrorKey.INCOMPATIBLE_RESTRICTIONS
        ],
        {
          nodes: nodeSchema,
          edges: edgeSchema
        }
      );
    });
  });

  describe('Simulating a user writing a custom action', () => {
    const nodeSchema = {results: [{itemType: 'PERSON'}, {itemType: 'ANIMAL'}]} as GraphSchema;
    const edgeSchema = {results: [{itemType: 'OWNED_BY'}]} as GraphSchema;

    const assertParsing = (props: {
      template: string;
      errors?: CustomActionParsingError[];
      elements?: CustomActionElement[];
    }) => {
      const parsingResult = parse(props.template, nodeSchema, edgeSchema);
      if (props.errors) {
        deepStrictEqual((parsingResult as CustomActionParsingErrors).errors, props.errors);
      } else if (props.elements) {
        deepStrictEqual((parsingResult as ParsedCustomAction).elements, props.elements);
      }
    };
    it('Should highlight properly when custom action has VARIABLE only', () => {
      assertParsing({
        template: '__',
        errors: [{start: 0, end: 2, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{',
        errors: [{start: 0, end: 3, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{{',
        errors: [
          {start: 4, end: 4, key: CustomActionParsingErrorKey.EMPTY_EXPRESSION},
          {start: 4, end: 4, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{no',
        errors: [
          {start: 4, end: 6, key: CustomActionParsingErrorKey.INVALID_VARIABLE},
          {start: 4, end: 6, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{node',
        errors: [{start: 4, end: 8, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      // Should we throw invalid-expression-syntax? Ask Tania
      assertParsing({
        template: '__{{node}',
        errors: [
          {start: 8, end: 9, key: CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX},
          {start: 4, end: 9, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{node}}',
        elements: [
          {type: 'ca-literal', value: '__'},
          {type: 'ca-expression', value: 'node', variable: CustomActionVariable.NODE}
        ]
      });

      assertParsing({
        template: '__{{node}}}',
        errors: [{start: 8, end: 9, key: CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX}]
      });
    });

    it('Should highlight properly when custom action has VARIABLE and ITEMTYPE only', () => {
      assertParsing({
        template: '__',
        errors: [{start: 0, end: 2, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{',
        errors: [{start: 0, end: 3, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{{',
        errors: [
          {start: 4, end: 4, key: CustomActionParsingErrorKey.EMPTY_EXPRESSION},
          {start: 4, end: 4, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{no',
        errors: [
          {start: 4, end: 6, key: CustomActionParsingErrorKey.INVALID_VARIABLE},
          {start: 4, end: 6, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{node',
        errors: [{start: 4, end: 8, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      // Should we throw invalid-expression-syntax? Ask Tania
      assertParsing({
        template: '__{{node:',
        errors: [
          {start: 9, end: 9, key: CustomActionParsingErrorKey.UNKNOWN_NODE_CATEGORY},
          {start: 4, end: 9, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{node:PER',
        errors: [
          {start: 9, end: 12, key: CustomActionParsingErrorKey.UNKNOWN_NODE_CATEGORY},
          {start: 4, end: 12, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{node:PERSON',
        errors: [{start: 4, end: 15, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      assertParsing({
        template: '__{{node:PERSON}}',
        elements: [
          {type: 'ca-literal', value: '__'},
          {
            type: 'ca-expression',
            value: 'node:PERSON',
            variable: CustomActionVariable.NODE,
            itemType: 'PERSON'
          }
        ]
      });

      assertParsing({
        template: '__{{node:PERSON}}}',
        errors: [{start: 15, end: 16, key: CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX}]
      });
    });

    it('Should highlight properly when custom action has VARIABLE and PROPERTY only', () => {
      assertParsing({
        template: '__',
        errors: [{start: 0, end: 2, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{',
        errors: [{start: 0, end: 3, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{{',
        errors: [
          {start: 4, end: 4, key: CustomActionParsingErrorKey.EMPTY_EXPRESSION},
          {start: 4, end: 4, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(',
        errors: [
          {start: 5, end: 5, key: CustomActionParsingErrorKey.INVALID_VARIABLE},
          {start: 4, end: 5, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(ed',
        errors: [
          {start: 5, end: 7, key: CustomActionParsingErrorKey.INVALID_VARIABLE},
          {start: 4, end: 7, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{edge',
        errors: [{start: 4, end: 8, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      // Should we throw invalid-expression-syntax? Ask Tania
      assertParsing({
        template: '__{{edge.',
        errors: [
          {start: 9, end: 9, key: CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX},
          {start: 4, end: 9, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{edge.na',
        errors: [{start: 4, end: 11, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      assertParsing({
        template: '__{{edge.name',
        errors: [{start: 4, end: 13, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      assertParsing({
        template: '__{{edge.name}}',
        elements: [
          {type: 'ca-literal', value: '__'},
          {
            type: 'ca-expression',
            value: 'edge.name',
            variable: CustomActionVariable.EDGE,
            property: 'name'
          }
        ]
      });

      assertParsing({
        template: '__{{edge.name}}}',
        errors: [{start: 13, end: 14, key: CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX}]
      });
    });

    it('Should highlight properly when custom action has VARIABLE, ITEMTYPE and PROPERTY only', () => {
      assertParsing({
        template: '__',
        errors: [{start: 0, end: 2, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{',
        errors: [{start: 0, end: 3, key: CustomActionParsingErrorKey.NO_EXPRESSIONS}]
      });

      assertParsing({
        template: '__{{',
        errors: [
          {start: 4, end: 4, key: CustomActionParsingErrorKey.EMPTY_EXPRESSION},
          {start: 4, end: 4, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(',
        errors: [
          {start: 5, end: 5, key: CustomActionParsingErrorKey.INVALID_VARIABLE},
          {start: 4, end: 5, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(edge',
        errors: [{start: 4, end: 9, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      assertParsing({
        template: '__{{(edge:',
        errors: [
          {start: 10, end: 10, key: CustomActionParsingErrorKey.UNKNOWN_EDGE_TYPE},
          {start: 4, end: 10, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(edge:OWNE',
        errors: [
          {start: 10, end: 14, key: CustomActionParsingErrorKey.UNKNOWN_EDGE_TYPE},
          {start: 4, end: 14, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(edge:OWNED_BY',
        errors: [{start: 4, end: 18, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      assertParsing({
        template: '__{{(edge:OWNED_BY)',
        errors: [{start: 4, end: 19, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      assertParsing({
        template: '__{{(edge:OWNED_BY).',
        errors: [
          {start: 20, end: 20, key: CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX},
          {start: 4, end: 20, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(edge:OWNED_BY).name',
        errors: [{start: 4, end: 24, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}]
      });

      assertParsing({
        template: '__{{(edge:OWNED_BY).name}',
        errors: [
          {start: 24, end: 25, key: CustomActionParsingErrorKey.INVALID_EXPRESSION_SYNTAX},
          {start: 4, end: 25, key: CustomActionParsingErrorKey.UNCLOSED_EXPRESSION}
        ]
      });

      assertParsing({
        template: '__{{(edge:OWNED_BY).name}}',
        elements: [
          {
            type: 'ca-literal',
            value: '__'
          },
          {
            type: 'ca-expression',
            value: '(edge:OWNED_BY).name',
            variable: CustomActionVariable.EDGE,
            itemType: 'OWNED_BY',
            property: 'name'
          }
        ]
      });
    });
  });

  describe('Render function', () => {
    const nodeSchema = {
      results: [{itemType: 'PERSON'}, {itemType: 'COMPANY'}, {itemType: 'COUNTRY'}]
    } as GraphSchema;

    const edgeSchema = {
      results: [{itemType: 'BASED_IN'}, {itemType: 'MOVED_TO'}, {itemType: 'WORKS_IN'}]
    } as GraphSchema;

    const contextData: ContextData = {
      baseURL: 'https://tartaruga.br/record',
      sourceKey: 'asdf1234',
      vizId: 876,
      nodes: [
        {
          id: '44',
          data: {
            properties: {name: 'Amine', isHuman: false},
            categories: ['PERSON'],
            geo: {},
            readAt: 0
          }
        },
        {id: '1969', data: {properties: {name: 'Paper Mate'}, categories: ['COMPANY']}},
        {id: '1143', data: {properties: {name: 'Neverland'}, categories: ['COUNTRY']}},
        {id: '1108', data: {properties: {name: 'Cheick'}, categories: ['PERSON', 'COMPANY']}},
        {id: '987', data: {properties: {name: 'Alex'}, categories: ['COMPANY', 'COUNTRY']}},
        {id: '986', data: {properties: {}, categories: []}}
      ] as LkNode[], // geo and readAt properties are not used by custom action
      edges: [
        {id: '3605', data: {type: 'TEST_GHOST', properties: {A: 'asd'}}},
        {id: '91', data: {type: 'HAS_CITY', properties: {}}},
        {id: '166', data: {type: 'HAS_CITY', properties: {}}},
        {id: '388', data: {type: 'HAS_CITY', properties: {}}},
        {id: '462', data: {type: 'HAS_CITY', properties: {}}},
        {id: '1349', data: {type: 'HAS_MARKET', properties: {}}},
        {id: '605', data: {type: 'HAS_CITY', properties: {}}},
        {id: '611', data: {type: 'HAS_CITY', properties: {}}}
      ] as LkEdge[]
    };

    it('Should render a NON_GRAPH custom action', () => {
      const template = '{{baseURL}}?vizId={{visualization}}&dataSource={{sourceKey}}';

      const parsedTemplate: ParsedCustomAction = parse(
        template,
        nodeSchema,
        edgeSchema
      ) as ParsedCustomAction;
      ok(parsedTemplate.elements);

      const actualRendered = render(parsedTemplate, contextData);
      const expectedRendered = 'https://tartaruga.br/record?vizId=876&dataSource=asdf1234';
      deepStrictEqual(actualRendered, expectedRendered);
    });

    it('Should not render a NON_GRAPH custom action', () => {
      const contextData: ContextData = {
        baseURL: 'https://tartaruga.br/record',
        edges: [],
        nodes: [
          {
            data: {
              categories: ['city'],
              properties: {name: 'Falkenberg'},
              readAt: 1568884942895,
              statistics: {supernode: false, degree: 2},
              geo: {}
            },
            id: '1752'
          }
        ],
        sourceKey: '9faa47c1',
        vizId: 4
      };
      const nodeSchema = {results: [{itemType: 'city'}]} as GraphSchema;

      const edgeSchema = {results: []} as GraphSchema;

      const template = 'https://www.google.com/search?q={{(node:city).name}}';

      const parsedTemplate: ParsedCustomAction = parse(
        template,
        nodeSchema,
        edgeSchema
      ) as ParsedCustomAction;
      ok(parsedTemplate.elements);

      const actualRendered = render(parsedTemplate, contextData);
      const expectedRendered = 'https://www.google.com/search?q=Falkenberg';
      deepStrictEqual(actualRendered, expectedRendered);
    });
  });
});
