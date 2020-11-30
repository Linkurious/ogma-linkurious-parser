/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS
 *
 * - Created on 23/01/2019.
 */
// external libs
import {describe, it} from 'mocha';
import {assert} from 'chai';
// locals
import QueryTemplateParser from '../../src/QueryTemplateParser/index';
import { Template, ErrorHighlight, DateTemplateFormat, DatetimeTemplateFormat, TemplateFieldType } from '@linkurious/rest-client'

describe('Query Template Parser', () => {
  let templateParser: QueryTemplateParser<null>;
  let errorMessage: string;
  let highlight: ErrorHighlight | undefined;
  before('Initialise template parser', () => {
    templateParser = new QueryTemplateParser((message, position) => {
      errorMessage = message;
      highlight = position;
      return null;
    });
  });

  beforeEach('Reset error and highlight', () => {
    errorMessage = '';
    highlight = undefined;
  });

  it('Should parse 1-node query [no-schema]', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should parse 1-node query [valid-schema]', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const categories = ['PERSON', 'COMPANY', 'MARKET'];
    const parsedTemplateFields = templateParser.parse(query, categories);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should fail to parse 1-node query [invalid-schema]', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}';
    const categories = ['COMPANY', 'MARKET'];
    const parsedTemplateFields = templateParser.parse(query, categories);
    assert.equal(parsedTemplateFields, null);
    assert.equal(errorMessage, '"options.categories" must be one of: "COMPANY", "MARKET".');
    assert.deepEqual(highlight, {offset: 47, length: 8});
  });

  it('Should inject template data with a quote method', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const categories = ['PERSON', 'COMPANY', 'MARKET'];
    const parsedTemplateFields = templateParser.parse(query, categories);
    assert.deepEqual(parsedTemplateFields, templateFields);
    const templateData = {['Employé']: 'lol'};
    const expectedQuery = ['MATCH (blah) WHERE ID(blah) = "lol is quoted"'];
    const quote = (data: unknown) => `"${data} is quoted"`;
    const queries = templateParser.generateRawQueries(query, templateData, templateFields, quote);
    assert.notEqual(queries, null, errorMessage);
    assert.deepEqual(queries!.map(q => q.query), expectedQuery);
  });

  it('Should parse 1-node query with 2 template fields with the same key', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}' +
      ' or blah.id = {{"Employé":node}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const categories = ['PERSON', 'COMPANY', 'MARKET'];
    const parsedTemplateFields = templateParser.parse(query, categories);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {['Employé']: 'lol'};
    const expectedQuery = 'MATCH (blah) WHERE ID(blah) = lol or blah.id = lol';
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    assert.notEqual(queries, null, errorMessage);
    assert.equal(queries![0].query, expectedQuery);
  });

  it('Should parse 2-node query', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}' +
      ' or blah.id = {{"Employé2":node}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE, key: 'Employé', options: {categories: ['PERSON']}},
      {type: TemplateFieldType.NODE, key: 'Employé2'}
      ];
    const categories = ['PERSON', 'COMPANY', 'MARKET'];
    const parsedTemplateFields = templateParser.parse(query, categories);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {['Employé']: 'lol', ['Employé2']: 'blah'};
    const expectedQuery = 'MATCH (blah) WHERE ID(blah) = lol or blah.id = blah';
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    assert.notEqual(queries, null, errorMessage);
    assert.equal(queries![0].query, expectedQuery);
  });

  it('Should fail parse a 3-node query', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}' +
      ' or blah.id = {{"Employé1":node}} or blah.id = {{"Employé2":node}}';
    const categories = ['PERSON', 'COMPANY', 'MARKET'];
    const parsedTemplateFields = templateParser.parse(query, categories);
    assert.equal(parsedTemplateFields, null);
    assert.equal(errorMessage, 'Templates accept at most 2 "node" input.');
    assert.deepEqual(highlight, {offset: 104, length: 19});
  });

  it('Should generate multiple queries for 1-node input with multiple ids', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"Employé":node:"PERSON"}}' +
      ' or blah.id = {{"Employé":node}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const categories = ['PERSON', 'COMPANY', 'MARKET'];
    const parsedTemplateFields = templateParser.parse(query, categories);
    assert.deepEqual(parsedTemplateFields, templateFields);
    const templateData = {['Employé']: ['lol', 'blah', 'this', 'works']};
    const expectedQueries = [
      'MATCH (blah) WHERE ID(blah) = lol or blah.id = lol',
      'MATCH (blah) WHERE ID(blah) = blah or blah.id = blah',
      'MATCH (blah) WHERE ID(blah) = this or blah.id = this',
      'MATCH (blah) WHERE ID(blah) = works or blah.id = works'
    ];
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    assert.notEqual(queries, null, errorMessage);
    assert.deepEqual(queries!.map(q => q.query), expectedQueries);
  });

  it('Should parse a nodeset query', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"Employé":nodeset:"PERSON"}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE_SET, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should fail to parse a query with more that 1 nodeset input', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"Employé":nodeset:"PERSON"}} ' +
      'or blah.id IN {{"Employé":nodeset:"PERSON"}}' +
      'or {{"them":  nodeset  :"PERSON"}} ';
    const parsedTemplateFields = templateParser.parse(query);
    assert.equal(parsedTemplateFields, null);
    assert.equal(errorMessage, 'Templates accept at most 1 "nodeset" input.');
    assert.deepEqual(highlight, {offset: 108, length: 31});
  });

  it('Should fail to parse a query with a mix of node and nodeset inputs', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"Employé":nodeset:"PERSON"}} ' +
      'or {{"them":node:"PERSON"}} ';
    const parsedTemplateFields = templateParser.parse(query);
    assert.equal(parsedTemplateFields, null);
    assert.equal(errorMessage, 'Templates do not accept a mix of nodes and nodeset inputs.');
    assert.deepEqual({offset: 64, length: 24}, highlight);
  });

  it('Should fail to parse a query with only one env input', () => {
    const query =
        'MATCH (blah) WHERE ID(blah) = {{"Employé":env:"email"}} ';
    const parsedTemplateFields = templateParser.parse(query);
    assert.equal(parsedTemplateFields, null);
    assert.equal(errorMessage, 'Templates do not accept an "env" input without a "node" or "nodeset" input.');
    assert.deepEqual({offset: 30, length: 25}, highlight);
  });

  it('Should parse a query with a mix of string and nodeset inputs', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"Employé":nodeset:"PERSON"}} ' +
      'or {{"them":string:"PERSON"}} ';
    const expectedTemplateFields: Template[] = [
      {
        key: 'Employé',
        type: TemplateFieldType.NODE_SET,
        options: {
          categories: ['PERSON']
        }
      },
      {
        key: 'them',
        type: TemplateFieldType.STRING,
        options: {
          default: 'PERSON'
        }
      }
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, expectedTemplateFields);
  });

  it('Should order template fields with nodeset always first', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"them":string:"PERSON"}} ' +
      'or {{"Employé":nodeset:"PERSON"}} or {{"them":string:"PERSON"}} ';
    const expectedTemplateFields: Template[] = [
      {
        key: 'Employé',
        type: TemplateFieldType.NODE_SET,
        options: {
          categories: ['PERSON']
        }
      },
      {
        key: 'them',
        type: TemplateFieldType.STRING,
        options: {
          default: 'PERSON'
        }
      }
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, expectedTemplateFields);
  });

  it('Should order template fields with node always first', () => {
    const query =
      'MATCH (blah) WHERE ID(blah) = {{"them":string:"PERSON"}} ' +
      'or {{"them":string:"PERSON"}} or {{"Employé":node:"PERSON"}} ';
    const expectedTemplateFields: Template[] = [
      {
        key: 'Employé',
        type: TemplateFieldType.NODE,
        options: {
          categories: ['PERSON']
        }
      },
      {
        key: 'them',
        type: TemplateFieldType.STRING,
        options: {
          default: 'PERSON'
        }
      }
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, expectedTemplateFields);
  });

  it('Should generate a nodeset query with an array input', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"Employé":nodeset:"PERSON"}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE_SET, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {['Employé']: ['lol', 'blah', 'this', 'works']};
    const quote = (data: unknown) => `[${data}]`;
    const expectedQueries = ['MATCH (blah) WHERE ID(blah) = [lol,blah,this,works]'];
    const queries = templateParser.generateRawQueries(query, templateData, templateFields, quote);
    assert.deepEqual(queries!.map(q => q.query), expectedQueries);
  });

  it('Should fail to generate a nodeset query with a non array input', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"Employé":nodeset:"PERSON"}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NODE_SET, key: 'Employé', options: {categories: ['PERSON']}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {['Employé']: 'my id'};
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"Employé" must be an array.');
  });

  it('Should parse a number template field', () => {
    const query = 'MATCH (blah) WHERE ' +
      'ID(blah) = {{"id":number}} ' +
      'and blah.age = {{"age":number:{"min": 18}}} ' +
      'and blah.experience = {{"exp":number:0}} ' +
      'and blah.retiredAt = {{"ret":number:{"max":70, "placeholder": "some hint"}}}' +
      'and blah.reliability = {{"rel":number:{"max": 100, "min": 0, "default": 50}}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NUMBER, key: 'id'},
      {type: TemplateFieldType.NUMBER, key: 'age', options: {min: 18}},
      {type: TemplateFieldType.NUMBER, key: 'exp', options: {default: 0}},
      {type: TemplateFieldType.NUMBER, key: 'ret', options: {max: 70, placeholder: 'some hint'}},
      {type: TemplateFieldType.NUMBER, key: 'rel', options: {default: 50, min: 0, max: 100}},
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should fail to parse a number template field', () => {
    // min > max
    let query = 'MATCH (blah) WHERE blah.age = {{"age":number:{"min": 18, "max": 6}}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, '"options.max" must be at least 18.');
    // default < min < max
    query = 'MATCH (blah) WHERE blah.age = ' +
      '{{"age":number:{"min": 6, "max": 18, "default": 4}}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, '"options.default" must be between 6 and 18.');
    // default > max > min
    query = 'MATCH (blah) WHERE blah.age = ' +
      '{{"age":number:{"min": 6, "max": 18, "default": 20}}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, '"options.default" must be between 6 and 18.')
  });

  it('Should generate a raw query with a number input', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"id":number}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NUMBER, key: 'id'}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {id: 72};
    const [{query: rawQuery}] = templateParser
      .generateRawQueries(query, templateData, templateFields);
    assert.equal(rawQuery, 'MATCH (blah) WHERE ID(blah) = 72', errorMessage);
  });

  it('Should fail to generate a raw query with a number input', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = ' +
      '{{"id":number:{"min": 6, "max": 18, "default": 10}}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.NUMBER, key: 'id', options: {min: 6, max: 18, default: 10}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    // input out of range
    let rawQuery = templateParser
      .generateRawQueries(query, {id: 72.8951}, templateFields);
    assert.equal(rawQuery, null, errorMessage);
    assert.equal(errorMessage, '"id" must be between 6 and 18.');
    // input not a number
    rawQuery = templateParser
      .generateRawQueries(query, {id: 'blah'}, templateFields);
    assert.equal(rawQuery, null, errorMessage);
    assert.equal(errorMessage, '"id" must be a number.');
  });


  it('Should parse a boolean template field', () => {
    const query = 'MATCH (blah) WHERE ' +
      'blah.alive = {{"alive":boolean}} ' +
      'and blah.dead = {{"dead":boolean:{"default": false}}} ' +
      'and blah.connected = {{"connected":boolean:true}} ';
    const templateFields: Template[] = [
      {type: TemplateFieldType.BOOLEAN, key: 'alive'},
      {type: TemplateFieldType.BOOLEAN, key: 'dead', options: {default: false}},
      {type: TemplateFieldType.BOOLEAN, key: 'connected', options: {default: true}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should fail parse a boolean template field', () => {
    let query = 'MATCH (blah) WHERE blah.alive = {{"alive":boolean:"hello"}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, '"options.default" must be a boolean.');
  });

  it('Should generate a raw query with a boolean input', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"alive":boolean}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.BOOLEAN, key: 'alive'}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {alive: true};
    const [{query: rawQuery}] = templateParser
      .generateRawQueries(query, templateData, templateFields);
    assert.equal(rawQuery, 'MATCH (blah) WHERE ID(blah) = true', errorMessage);
  });

  it('Should fail to generate a raw query with a boolean input', () => {
    const query = 'MATCH (blah) WHERE ID(blah) = {{"alive":boolean}}';
    const templateFields: Template[] = [
      {type: TemplateFieldType.BOOLEAN, key: 'alive'}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {alive: 'false'};
    const rawQuery = templateParser
      .generateRawQueries(query, templateData, templateFields);
    assert.equal(rawQuery, null, errorMessage);
    assert.equal(errorMessage, '"alive" must be a boolean.');
  });


  it('Should parse a enum template field', () => {
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
    const templateFields: unknown = [
      {type: TemplateFieldType.ENUM, key: 'state', options: {values: [
        {label: 'alive', value: 'alive'}, {label: 'dead', value: 'dead'}]}},
      {type: TemplateFieldType.ENUM, key: 'score', options: {
        values: [
          {label: 'F', value: 10},
          {label: 'D', value: 50},
          {label: 'A', value: 100}
          ]
        }
      },
      {type: TemplateFieldType.ENUM, key: 'level', options: {
          default: 'noob',
          values: [
            {label: 'N', value: 'noob'},
            {label: 'E', value: 'expert'},
            {label: 'L', value: 'legend'}
          ]
        }
      },
      {type: TemplateFieldType.ENUM, key: 'connected', options: {values: [
        {label: 'true', value: true}, {label: 'zero', value: 'zero'}]}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it ('Should allow omitting options of a repeated enum template field', () => {
    let query = 'MATCH (blah) WHERE ' +
      // options given in the first template
      'blah.stateBefore = {{"state":enum:["alive", "dead"]}} ' +
      // options not given in the second template
      'and blah.stateAfter = {{"state":enum}}';

    let templateFields: unknown = [
      {type: TemplateFieldType.ENUM, key: 'state', options: {values: [
            {label: 'alive', value: 'alive'}, {label: 'dead', value: 'dead'}]}}];

    let parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);

    query = 'MATCH (blah) WHERE ' +
      // options not given in the first template
      'blah.stateBefore = {{"state":enum}} ' +
      // options given in the second template
      'and blah.stateAfter = {{"state":enum:["alive", "dead"]}}';

    parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should fail parse a enum template field', () => {
    // enum value should be unique
    let query = 'MATCH (blah) WHERE blah.state = {{"state":enum:["alive", "dead", "alive"]}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, 'Enum values must be unique.');

    // default must be one of the values.
    query = 'MATCH (blah) WHERE and blah.level = {{"level":enum:{"default": "king", "values": [' +
      '{"label": "N", "value": "noob"},' +
      '{"label": "E", "value": "expert"},' +
      '{"label": "L", "value": "legend"}]}}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, '"options.default" must be one of: "noob", "expert", "legend".');

    // enum should have at least 2 values
    query = 'MATCH (blah) WHERE and blah.level = {{"level":enum:{"values": [' +
      '{"label": "N", "value": "noob"}]}}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, '"options.values" length must be at least 2.');

    // enum values are mandatory
    query = 'MATCH (blah) WHERE and blah.level = {{"level":enum}}';
    assert.deepEqual(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, '"options" must not be undefined.');
  });

  it('Should generate a raw query with enum inputs', () => {
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
    const templateFields: unknown = [
      {type: TemplateFieldType.ENUM, key: 'state', options: {values: [
            {label: 'alive', value: 'alive'}, {label: 'dead', value: 'dead'}]}},
      {type: TemplateFieldType.ENUM, key: 'score', options: {
          values: [
            {label: 'F', value: 10},
            {label: 'D', value: 50},
            {label: 'A', value: 100}
          ]
        }
      },
      {type: TemplateFieldType.ENUM, key: 'level', options: {
          default: 'noob',
          values: [
            {label: 'N', value: 'noob'},
            {label: 'E', value: 'expert'},
            {label: 'L', value: 'legend'}
          ]
        }
      },
      {type: TemplateFieldType.ENUM, key: 'connected', options: {values: [
            {label: 'true', value: true}, {label: 'zero', value: 'zero'}]}}
    ];
    const parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
    const templateData = {
      state: 'dead',
      score: 50,
      level: 'noob',
      connected: true
    };
    const expectedQuery = 'MATCH (blah) WHERE ' +
      'blah.state = dead ' +
      'and blah.score = 50 '+
      'and blah.level = noob ' +
      'and blah.connected = true ';

    const queries = templateParser
      .generateRawQueries(query, templateData, parsedTemplateFields);

    assert.notEqual(queries, null, errorMessage);
    assert.equal(queries[0].query, expectedQuery);
  });

  it('Should fail to generate a raw query with enum inputs', () => {
    // value mismatch
    let query = 'MATCH (blah) WHERE blah.state = {{"state":enum:["alive", "dead"]}} ';
    let templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    let queries = templateParser.generateRawQueries(query, {state: 'gone'}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"state" must be one of: "alive", "dead".');

    // type mismatch
    query = 'MATCH (blah) WHERE blah.state = {{"state":enum:[true, 1]}} ';
    templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    queries = templateParser.generateRawQueries(query, {state: '1'}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"state" must be one of: true, 1.');
    queries = templateParser.generateRawQueries(query, {state: {0: true}}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"state" must be one of: true, 1.');
  });

  it('Should parse a date template field', () => {
    const query = 'MATCH (blah) WHERE blah.dob = ' +
      '{{"birthday":date:"native"}} ' +
      'and blah.doi {{"incarceration":date:{"format": "timestamp", "min": "1969-01-01"}}}' +
      'and blah.doe {{"electrocution":date:"timestamp-ms"}}' +
      'and blah.dod {{"death day":date:' +
      '{"format": "iso", "default": "2004-01-01", "max": "2005-01-01", "min": "2003-12-01"}}}' +
      'and blah.dof {{"funerals":date:"yyyy-mm-dd"}}' +
      'and blah.doc {{"cremation":date:"mm/dd/yyyy"}}' +
      'and blah.dop {{"death party":date:"dd/mm/yyyy"}}';
    const templateFields = templateParser.parse(query);
    const expectedTemplateFields: Template[] = [
      {key: 'birthday', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.NATIVE}},
      {key: 'incarceration', type: TemplateFieldType.DATE, options:{
        format: DateTemplateFormat.TIMESTAMP,
        min: '1969-01-01'}
      },
      {key: 'electrocution', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.TIMESTAMP_MS}},
      {key: 'death day', type: TemplateFieldType.DATE, options: {
        format: DateTemplateFormat.ISO,
        default: '2004-01-01',
        max: '2005-01-01',
        min: '2003-12-01'}
      },
      {key: 'funerals', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.ISO_YYYY_MM_DD}},
      {key: 'cremation', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.MM_DD_YYYY}},
      {key: 'death party', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.DD_MM_YYYY}}
    ];
    assert.notEqual(templateFields, null, errorMessage);
    assert.deepEqual(templateFields, expectedTemplateFields, errorMessage)
  });

  it ('Should allow omitting options of a repeated date template field', () => {
    let query = 'MATCH (blah) WHERE ' +
      // options given in the first template
      'blah.born = {{"birthday":date:"native"}} ' +
      // options not given in the second template
      'and blah.died = {{"birthday":date}}';

    let templateFields: unknown = [
      {key: 'birthday', type: TemplateFieldType.DATE, options: {format: 'native'}}
    ];
    let parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);

    query = 'MATCH (blah) WHERE ' +
      // options not given in the first template
      'blah.born = {{"birthday":date}} ' +
      // options given in the second template
      'and blah.died = {{"birthday":date:"native"}}';

    parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should fail to parse a date template field', () => {
    // unknown format
    let query = 'MATCH (blah) WHERE blah.d = {{"day":date:"time"}} ';
    let templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.format" must be one of: "timestamp", ' +
      '"timestamp-ms", "iso", "yyyy-mm-dd", "dd/mm/yyyy", "mm/dd/yyyy", "native".');
    // no options
    query = 'MATCH (blah) WHERE blah.d = {{"day":date}} ';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options" must not be undefined.');
    // no format
    query = 'MATCH (blah) WHERE blah.d = {{"day":date:{"min": "2003-12-01"}}}} ';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.format" must not be undefined.');
    // invalid date format default
    query = 'MATCH (blah) WHERE blah.d = {{"day":date:{"format": "iso", "default": "today"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.default" must match pattern yyyy-MM-dd.');
    // invalid date default
    query = 'MATCH (blah) WHERE blah.d = {{"day":date:{"format": "iso", "default": "9658-15-15"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.default" must be a valid date.');
    // invalid date format min
    query = 'MATCH (blah) WHERE blah.d = {{"day":date:{"format": "iso", "min": "today"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.min" must match pattern yyyy-MM-dd.');
    // invalid date min
    query = 'MATCH (blah) WHERE blah.d = {{"day":date:{"format": "iso", "min": "9658-15-15"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.min" must be a valid date.');
    // invalid date format max
    query = 'MATCH (blah) WHERE blah.d = {{"day":date:{"format": "iso", "max": "today"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.max" must match pattern yyyy-MM-dd.');
    // invalid date max
    query = 'MATCH (blah) WHERE blah.d = {{"day":date:{"format": "iso", "max": "9658-15-15"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.max" must be a valid date.');

  });

  it('Should generate a raw query with date input fields', () => {
    const query = 'MATCH (blah) WHERE blah.dob = ' +
      '{{"birthday":date:"native"}} ' +
      'and blah.doi {{"incarceration":date:{"format": "timestamp", "min": "1969-01-01"}}}' +
      'and blah.doe {{"electrocution":date:"timestamp-ms"}}' +
      'and blah.dod {{"death day":date:' +
      '{"format": "iso", "default": "1969-01-01", "min": "1968-01-01", "max": "1998-12-01"}}}' +
      'and blah.dof {{"funerals":date:"yyyy-mm-dd"}}' +
      'and blah.doc {{"cremation":date:"mm/dd/yyyy"}}' +
      'and blah.dop {{"death party":date:"dd/mm/yyyy"}}';
    const templateFields = templateParser.parse(query);
    const expectedTemplateFields: Template[] = [
      {key: 'birthday', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.NATIVE}},
      {key: 'incarceration', type: TemplateFieldType.DATE, options:{
          format: DateTemplateFormat.TIMESTAMP,
          min: '1969-01-01'}
      },
      {key: 'electrocution', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.TIMESTAMP_MS}},
      {key: 'death day', type: TemplateFieldType.DATE, options: {
          format: DateTemplateFormat.ISO,
          default: '1969-01-01',
          min: '1968-01-01',
          max: '1998-12-01'}
      },
      {key: 'funerals', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.ISO_YYYY_MM_DD}},
      {key: 'cremation', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.MM_DD_YYYY}},
      {key: 'death party', type: TemplateFieldType.DATE, options: {format: DateTemplateFormat.DD_MM_YYYY}}
    ];
    assert.notEqual(templateFields, null, errorMessage);
    assert.deepEqual(templateFields, expectedTemplateFields, errorMessage);
    const formattedDate = '1998-06-01';
    const date = new Date(formattedDate);
    const isoUTC0 = date.toISOString();
    const templateData = {
      birthday: isoUTC0,
      incarceration: isoUTC0,
      electrocution: isoUTC0,
      'death day': isoUTC0,
      funerals: isoUTC0,
      cremation: isoUTC0,
      'death party': isoUTC0
    };
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    const expectedQuery = `MATCH (blah) WHERE blah.dob = ${formattedDate} ` +
      `and blah.doi ${date.getTime() / 1000}` +
      `and blah.doe ${date.getTime()}` +
      `and blah.dod ${formattedDate}` +
      `and blah.dof ${formattedDate}` +
      'and blah.doc 06/01/1998' +
      'and blah.dop 01/06/1998';
    assert.notEqual(queries, null, errorMessage);
    assert.deepEqual(queries[0].query, expectedQuery, errorMessage);
  });

  it('Should fail to generate a raw query with date input fields', () => {
    let query = 'Match (blah) WHERE blah.d = {{"d":date:"native"}}';
    let templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    // not an iso date string
    let queries = templateParser.generateRawQueries(query, {d: new Date()}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be a string.');
    // random string
    queries = templateParser.generateRawQueries(query, {d: 'hello'}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be a valid date.');
    // invalid format
    queries = templateParser.generateRawQueries(query, {d: '1999-06-01'}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be a valid ISO date string.');
    // not within range
    query = 'Match (blah) WHERE blah.d = ' +
      '{{"d":date:{"format": "iso", "min": "1999-06-01", "max": "2000-06-01"}}}';
    const isoAfter = new Date('2000-06-02').toISOString();
    const isoBefore = new Date('1998-06-02').toISOString();
    templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    queries = templateParser.generateRawQueries(query, {d: isoAfter}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be before 2000-06-01.');
    queries = templateParser.generateRawQueries(query, {d: isoBefore}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be after 1999-06-01.');
  });

  it('Should parse a datetime template field', () => {
    const query = 'MATCH (blah) WHERE blah.dob = ' +
      '{{"birthday":datetime:"native"}} ' +
      'and blah.doi ' +
      '{{"incarceration":datetime:{"format": "timestamp", "min": "1969-01-01T11:18:23",' +
      '"timezone": "+05:30"}}}' +
      'and blah.doe {{"electrocution":datetime:"timestamp-ms"}}' +
      'and blah.dod {{"death day":datetime:' +
      '{"format": "iso", "default": "2004-01-01T11:18:23",' +
      '"max": "2005-01-01T11:18:23", "min": "2003-12-01T11:18:23", "timezone": "Z"}}}' +
      'and blah.dof {{"funerals":datetime:"YYYY-MM-DDThh:mm:ss"}}' +
      'and blah.doc {{"cremation":datetime:"YYYY-MM-DDThh:mm:ss"}}' +
      'and blah.dop {{"death party":datetime:"YYYY-MM-DDThh:mm:ss"}}';
    const templateFields = templateParser.parse(query);
    const expectedTemplateFields: Template[] = [
      {key: 'birthday', type: TemplateFieldType.DATE_TIME, options: {format: DatetimeTemplateFormat.NATIVE}},
      {key: 'incarceration', type: TemplateFieldType.DATE_TIME, options:{
          format: DatetimeTemplateFormat.TIMESTAMP,
          min: '1969-01-01T05:48:23.000Z',
          timezone: '+05:30'}
      },
      {key: 'electrocution', type: TemplateFieldType.DATE_TIME, options: {format: DatetimeTemplateFormat.TIMESTAMP_MS}},
      {key: 'death day', type: TemplateFieldType.DATE_TIME, options: {
          format: DatetimeTemplateFormat.ISO,
          default: '2004-01-01T11:18:23.000Z',
          max: '2005-01-01T11:18:23.000Z',
          min: '2003-12-01T11:18:23.000Z',
          timezone: 'Z'}
      },
      {
        key: 'funerals',
        type: TemplateFieldType.DATE_TIME,
        options: {format: DatetimeTemplateFormat.YYYY_MM_DD_T}
      },
      {
        key: 'cremation',
        type: TemplateFieldType.DATE_TIME,
        options: {format: DatetimeTemplateFormat.YYYY_MM_DD_T}
      },
      {
        key: 'death party',
        type: TemplateFieldType.DATE_TIME,
        options: {format: DatetimeTemplateFormat.YYYY_MM_DD_T}
      }
    ];
    assert.notEqual(templateFields, null, errorMessage);
    assert.deepEqual(templateFields, expectedTemplateFields, errorMessage)
  });

  it ('Should allow omitting options of a repeated datetime template field', () => {
    let query = 'MATCH (blah) WHERE ' +
      // options given in the first template
      'blah.born = {{"birthday":datetime:"native"}} ' +
      // options not given in the second template
      'and blah.died = {{"birthday":datetime}}';

    let templateFields: unknown = [
      {key: 'birthday', type: TemplateFieldType.DATE_TIME, options: {format: 'native'}}
    ];
    let parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);

    query = 'MATCH (blah) WHERE ' +
      // options not given in the first template
      'blah.born = {{"birthday":datetime}} ' +
      // options given in the second template
      'and blah.died = {{"birthday":datetime:"native"}}';

    parsedTemplateFields = templateParser.parse(query);
    assert.deepEqual(parsedTemplateFields, templateFields, errorMessage);
  });

  it('Should fail to parse a datetime template field', () => {
    // unknown format
    let query = 'MATCH (blah) WHERE blah.d = {{"day":datetime:"time"}} ';
    let templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.format" must be one of: "timestamp", ' +
      '"timestamp-ms", "iso", "YYYY-MM-DDThh:mm:ss", "native".');
    // no options
    query = 'MATCH (blah) WHERE blah.d = {{"day":datetime}} ';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options" must not be undefined.');
    // no format
    query = 'MATCH (blah) WHERE blah.d = {{"day":datetime:{"min": "2003-12-01T11:18:23"}}}} ';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.format" must not be undefined.');
    // invalid date format default
    query = 'MATCH (blah) WHERE blah.d = {{"day":datetime:{"format": "iso", "default": "today"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.default" must match pattern YYYY-MM-DDThh:mm:ss.');
    // invalid date default
    query = 'MATCH (blah) WHERE blah.d = ' +
      '{{"day":datetime:{"format": "iso", "default": "9658-15-15T11:18:23"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.default" must be a valid date.');
    // invalid date format min
    query = 'MATCH (blah) WHERE blah.d = {{"day":datetime:{"format": "iso", "min": "today"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.min" must match pattern YYYY-MM-DDThh:mm:ss.');
    // invalid date min
    query = 'MATCH (blah) WHERE blah.d = ' +
      '{{"day":datetime:{"format": "iso", "min": "9658-15-15T11:18:23"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.min" must be a valid date.');
    // invalid date format max
    query = 'MATCH (blah) WHERE blah.d = {{"day":datetime:{"format": "iso", "max": "today"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.max" must match pattern YYYY-MM-DDThh:mm:ss.');
    // invalid date max
    query = 'MATCH (blah) WHERE blah.d = ' +
      '{{"day":datetime:{"format": "iso", "max": "9658-15-15T11:18:23"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.max" must be a valid date.');
    // invalid timezone (pattern)
    query = 'MATCH (blah) WHERE blah.d = ' +
      '{{"day":datetime:{"format": "iso", "timezone": "X"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.timezone" must match pattern [+-]HH:MM | Z.');
    // invalid timezone (minutes)
    query = 'MATCH (blah) WHERE blah.d = ' +
      '{{"day":datetime:{"format": "iso", "timezone": "+10:75"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.timezone" must be a valid timezone.');
    // invalid timezone (hours)
    query = 'MATCH (blah) WHERE blah.d = ' +
      '{{"day":datetime:{"format": "iso", "timezone": "+25:35"}}}}';
    templateFields = templateParser.parse(query);
    assert.equal(templateFields, null, errorMessage);
    assert.equal(errorMessage, '"options.timezone" must be a valid timezone.');
  });

  it('Should generate a raw query with datetime input fields', () => {
    const query = 'MATCH (blah) WHERE blah.dob = ' +
      '{{"birthday":datetime:"native"}} ' +
      'and blah.doi {{"incarceration":datetime:{"format": "timestamp", ' +
      '"min": "1969-01-01T11:18:23"}}}' +
      'and blah.doe {{"electrocution":datetime:"timestamp-ms"}}' +
      'and blah.dod {{"death day":datetime:' +
      '{"format": "iso", "default": "1969-01-01T11:18:23", "min": "1968-01-01T11:18:23", ' +
      '"max": "1998-12-01T11:18:23"}}}' +
      'and blah.dof {{"funerals":datetime:"YYYY-MM-DDThh:mm:ss"}}' +
      'and blah.doc {{"cremation":datetime:{"format": "native", "timezone": "+05:30"}}}' +
      'and blah.dop {{"death party":datetime:{"format": "native", "timezone": "Z"}}}';
    const templateFields = templateParser.parse(query);
    const expectedTemplateFields: Template[] = [
      {key: 'birthday', type: TemplateFieldType.DATE_TIME, options: {format: DatetimeTemplateFormat.NATIVE}},
      {key: 'incarceration', type: TemplateFieldType.DATE_TIME, options:{
          format: DatetimeTemplateFormat.TIMESTAMP,
          min: '1969-01-01T11:18:23.000Z'}
      },
      {key: 'electrocution', type: TemplateFieldType.DATE_TIME, options: {format: DatetimeTemplateFormat.TIMESTAMP_MS}},
      {key: 'death day', type: TemplateFieldType.DATE_TIME, options: {
          format: DatetimeTemplateFormat.ISO,
          default: '1969-01-01T11:18:23.000Z',
          min: '1968-01-01T11:18:23.000Z',
          max: '1998-12-01T11:18:23.000Z'}
      },
      {
        key: 'funerals',
        type: TemplateFieldType.DATE_TIME,
        options: {format: DatetimeTemplateFormat.YYYY_MM_DD_T}
        },
      {
        key: 'cremation',
        type: TemplateFieldType.DATE_TIME,
        options: {
          format: DatetimeTemplateFormat.NATIVE,
          timezone: '+05:30'
        }
      },
      {
        key: 'death party',
        type: TemplateFieldType.DATE_TIME,
        options: {
          format: DatetimeTemplateFormat.NATIVE,
          timezone: 'Z'
        }
      }
    ];
    assert.notEqual(templateFields, null, errorMessage);
    assert.deepEqual(templateFields, expectedTemplateFields, errorMessage);
    const formattedDate = '1998-06-01T11:18:23';
    const formattedDateWithTimezone = '1998-06-01T16:48:23.000+05:30';
    const date = new Date(formattedDate + 'Z');
    const isoUTC0 = date.toISOString();
    const templateData = {
      birthday: isoUTC0,
      incarceration: isoUTC0,
      electrocution: isoUTC0,
      'death day': isoUTC0,
      funerals: isoUTC0,
      cremation: isoUTC0,
      'death party': isoUTC0
    };
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    const expectedQuery = `MATCH (blah) WHERE blah.dob = ${isoUTC0.slice(0, -1)} ` +
      `and blah.doi ${date.getTime() / 1000}` +
      `and blah.doe ${date.getTime()}` +
      `and blah.dod ${formattedDate}` +
      `and blah.dof ${formattedDate}` +
      `and blah.doc ${formattedDateWithTimezone}` +
      `and blah.dop ${isoUTC0}`;
    assert.notEqual(queries, null, errorMessage);
    assert.deepEqual(queries[0].query, expectedQuery, errorMessage);
  });

  it('Should fail to generate a raw query with datetime input fields', () => {
    let query = 'Match (blah) WHERE blah.d = {{"d":datetime:"native"}}';
    let templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    // not an iso date string
    let queries = templateParser.generateRawQueries(query, {d: new Date()}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be a string.');
    // random string
    queries = templateParser.generateRawQueries(query, {d: 'hello'}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be a valid date.');
    // invalid format
    queries = templateParser.generateRawQueries(query, {d: '1999-06-01'}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be a valid ISO date string.');
    // not within range
    query = 'Match (blah) WHERE blah.d = ' +
      '{{"d":datetime:{"format": "iso", "min": "1999-06-01T11:18:23", "max": "2000-06-01T11:18:23"}}}';
    const isoAfter = new Date('2000-06-02').toISOString();
    const isoBefore = new Date('1998-06-02').toISOString();
    templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    queries = templateParser.generateRawQueries(query, {d: isoAfter}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be before 2000-06-01T11:18:23.000Z.');
    queries = templateParser.generateRawQueries(query, {d: isoBefore}, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, '"d" must be after 1999-06-01T11:18:23.000Z.');
  });


  it('Should generate raw query with data', () => {
    const test = {
      query: `MATCH (n:PERSON)-[e:CONNECTION]-(c:COMPANY)
                WHERE ID(n) = {{"Employé":node:"PERSON"}}
                AND c.size = {{"Taille d'entreprise":string:"small"}}
                RETURN n, e, c;`,
      data: {'Employé': '42', 'Work relation': 6, 'Taille d\'entreprise': 'big'}
    };

    const templateFields = templateParser.parse(test.query);
    assert.notEqual(templateFields, null, errorMessage);
    const queries = templateParser.generateRawQueries(test.query, test.data, templateFields!);
    assert.notEqual(queries, null, errorMessage);
    const expectedParsedQuery = `MATCH (n:PERSON)-[e:CONNECTION]-(c:COMPANY)
                WHERE ID(n) = 42
                AND c.size = big
                RETURN n, e, c;`;
    assert.equal(queries![0].query, expectedParsedQuery);
  });

  it('Should generate raw query with data from templateFields with json options', () => {
    const test = {
      query: `MATCH (n:PERSON)-[e:CONNECTION]-(c:COMPANY)
                WHERE ID(n) = {{"Employé":node:"PERSON"}}
                AND c.size = {{"Taille d'entreprise":string:{"default": "small"}}}
                RETURN n, e, c;`,
      data: {'Employé': '42', 'Work relation': 6, 'Taille d\'entreprise': 'big'}
    };

    const templateFields = templateParser.parse(test.query);
    assert.notEqual(templateFields, null, errorMessage);
    const queries = templateParser.generateRawQueries(test.query, test.data, templateFields!);
    assert.notEqual(queries, null, errorMessage);
    const expectedParsedQuery = `MATCH (n:PERSON)-[e:CONNECTION]-(c:COMPANY)
                WHERE ID(n) = 42
                AND c.size = big
                RETURN n, e, c;`;
    assert.equal(queries![0].query, expectedParsedQuery);
  });


  it('Should match template data fields with special characters', () => {
    const test = {
      query: 'MATCH (n) WHERE ID(n) = {{"My ç éèàùâêîôû_-;$@ \'* `":node}} RETURN n;',
      templateFields: [
        {
          key: 'My ç éèàùâêîôû_-;$@ \'* `',
          type: 'node'
        }
      ]
    };

    const templateFields = templateParser.parse(test.query);
    assert.deepEqual(templateFields, test.templateFields);
  });

  it('Should tolerate spaces around fields', () => {
    const test: {query: string, templateFields: Template[]} = {
      query: `MATCH (n:PERSON)-[e:CONNECTION]-(c:COMPANY)
                WHERE ID(n) = {{  "Employé "  :  node  :  "PERSON"  }}
                AND n.miao =  {{ "miaow" : string : { "placeholder": "lol" } }}
                AND c.size = {{" Taille d'entreprise ":string :"small" }}
                RETURN n, e, c;`,
      templateFields: [
        {
          key: 'Employé ',
          type: TemplateFieldType.NODE,
          options: {categories: ['PERSON']}
        },
        {
          key: 'miaow',
          type: TemplateFieldType.STRING,
          options: {placeholder: 'lol'}
        },
        {
          key: ' Taille d\'entreprise ',
          type: TemplateFieldType.STRING,
          options: {default: 'small'}
        }
      ]
    };

    const templateFields = templateParser.parse(test.query);
    const expectedTemplateFields = test.templateFields;
    assert.deepEqual(templateFields, expectedTemplateFields, errorMessage);
  });

  it('Should tolerate other curly braces', () => {
    const test = {
      query: 'select ?p ?q {{{"node":node}} ?p ?q}',
      templateFields: [{key: 'node', type: 'node'}]
    };

    const templateFields = templateParser.parse(test.query);
    const expectedTemplateFields = test.templateFields;
    assert.deepEqual(templateFields, expectedTemplateFields);
  });

  // Error Messages
  it('Should fail if no template is detected', () => {
    const query = 'MATCH (n) return (n);';

    templateParser.parse(query, undefined, true);
    assert.equal(errorMessage, 'This query must contain at least one template.');
  });

  it('Should fail if a template is not closed', () => {
    let query = 'MATCH (n) {{"aze"}}  {{"bla":string}} {{"fine" return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Template must end with "}}", e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 38, length: 20});

    query = 'MATCH (n) {{"aze"  {{"bla":string}} {{"fine"}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Template must end with "}}", e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 10, length: 9});

    query = 'MATCH (n) {{"aze"}}  {{"bla":string} {{"fine"}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Template must end with "}}", e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 21, length: 16});

    query = 'MATCH (n) {{aze  {{"bla":string}} {{"fine"}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Template must end with "}}", e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 10, length: 7});

    query = 'MATCH (n) {{aze}  {{"bla":string}} {{"fine"}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Template must end with "}}", e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 10, length: 8});
  });

  it('Should fail if a template name is not given', () => {
    // *{{}}*
    let query = 'MATCH (n) {{}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name cannot be empty, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 10, length: 4});

    // *{{}}*
    query = 'MATCH (n) {{"hello":string}} {{}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name cannot be empty, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 29, length: 4});

    // {{*""*}}
    query = 'MATCH (n) {{"hello":string}} {{"":string}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name cannot be empty, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 31, length: 9});

    // {{*""*}}
    query = 'MATCH (n) {{"  "}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name cannot be empty, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 12, length: 4});
  });

  it('Should fail if a template name is not surrounded by quotes', () => {
    // {{*a*}}
    let query = 'MATCH (n) {{a}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name of template should be surrounded by quotes, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 12, length: 1});

    // {{*a*}}
    query = 'MATCH (n) {{"hello":string}} {{a}} {{"hello":string}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name of template should be surrounded by quotes, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 31, length: 1});

    query = 'MATCH (n) {{:a}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name of template should be surrounded by quotes, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 12, length: 2});

    // {*"az*}}
    query = 'MATCH (n) {{"az:a}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name of template should be surrounded by quotes, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 12, length: 5});
  });

  it('Should fail is name is not followed by a type', function () {
    // {{"aze"*e*}}
    let query = 'MATCH (n) {{"aze"e}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name should be followed by ":" and type, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 12, length: 6});

    // {{"aze"*e*}}
    query = 'MATCH (n) {{"aze" whatever}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name should be followed by ":" and type, e.g. {{"field1":string}}.');
    assert.deepEqual(highlight, {offset: 12, length: 14});

    // *{{"aze"}}*
    query = 'MATCH (n) {{"aze"}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name should be followed by ":" and type, e.g. {{"field1":string}}.');

    assert.deepEqual(highlight, {offset: 12, length: 5});

    // *{{"aze":}}*
    query = 'MATCH (n) {{"aze":}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name should be followed by ":" and type, e.g. {{"field1":string}}.');

    assert.deepEqual(highlight, {offset: 12, length: 6});

    query = 'MATCH (n) {{"aze\n":}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name should be followed by ":" and type, e.g. {{"field1":string}}.');

    assert.deepEqual(highlight, {offset: 12, length: 7});

    // *{{"aze":}}*
    query = 'MATCH (n) {{"aze":  }} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Name should be followed by ":" and type, e.g. {{"field1":string}}.');

    assert.deepEqual(highlight, {offset: 12, length: 8});
  });

  it('Should fail if json-options is empty', () => {
    // *{{"aze":string:}}*
    let query = 'MATCH (n) {{"aze":string:}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Type "string" accepts options "default", "placeholder".');

    assert.deepEqual(highlight, {offset: 10, length: 17});

    // *{{"aze":string:}}*
    query = 'MATCH (n) {{"aze":string:  }} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Type "string" accepts options "default", "placeholder".');

    assert.deepEqual(highlight, {offset: 25, length: 2});

    // {{"aze":string:*{*}}
    query = 'MATCH (n) {{"aze":string:{ }} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Type "string" accepts options "default", "placeholder".');
    // TODO highlight only the options
    assert.deepEqual(highlight, {offset: 25, length: 2});

    // {{"aze":string:*a*}}
    query = 'MATCH (n) {{"aze":string:a }} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Type "string" accepts options "default", "placeholder".');
    // TODO highlight only the options
    assert.deepEqual(highlight, {offset: 25, length: 2});

    // {{"aze":string:*{m}*}}
    query = 'MATCH (n) {{"aze":string:{m}}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Type "string" accepts options "default", "placeholder".');
    // TODO highlight only the options
    assert.deepEqual(highlight, {offset: 25, length: 3});

    // {{"aze":string:*{m}*}}
    query = 'MATCH (n) {{"aze":string:{}}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, 'Type "string" accepts options "default", "placeholder".');
    // TODO highlight only the options
    assert.deepEqual(highlight, {offset: 25, length: 2});

    // {{"aze":string:*{"mux":12}*}}
    query = 'MATCH (n) {{"aze":string:{"mux": 12}}} return (n);';
    assert.equal(templateParser.parse(query), null);
    assert.equal(errorMessage, '"options" has unexpected properties ("mux").');
    // TODO highlight only the options
    assert.deepEqual(highlight, {offset: 25, length: 11});
  });

  it('Should fail if a given block does not match the required format', () => {
    const query =
      'MATCH (n:PERSON)-[e:WORKS_FOR]-(c:COMPANY)-[e2:SPONSOR]-(n2:PERSON)\n' +
      ' WHERE n.name = {{Nom de l\'employé:string:"PERSON"}}\n' +
      ' AND n2.name = {{"Nom de l\'employé":string:"NGO"}} RETURN n;';

    templateParser.parse(query);
    assert.equal(errorMessage, 'Name of template should be surrounded by quotes, e.g. {{"field1":string}}.');
    assert.deepEqual({offset: 86, length: 32}, highlight);
  });

  it('Should fail if an unknown type is given', () => {
    const query = 'MATCH (n) WHERE ID(n) = {{"My string":vertex:hello}} RETURN n;';

    templateParser.parse(query);
    assert.equal(
      errorMessage, '"type" must be one of: ' +
      '"number", "string", "enum", "node", "nodeset", "date", "datetime", "boolean", "env".'
    );
    assert.deepEqual({offset: 38, length: 6}, highlight);
  });

  it('Should fail if json options are not in the right format', () => {
    // should fail because expecting values instead of categories
    const query =
      'MATCH (n) WHERE ID(n) = {{"My string":string:{"categories":["COMPANY"]}}} RETURN n;';

    templateParser.parse(query);
    assert.equal(errorMessage, '"options" has unexpected properties ("categories").');
    assert.deepEqual({offset: 45, length: 26}, highlight);
  });

  it('Should fail if json name reused with different types', () => {
    const query = `MATCH (n:PERSON)-[e:WORKS_FOR]-(c:COMPANY)-[e2:SPONSOR]-(n2:PERSON)
             WHERE n.name = {{"Nom de l'employé":node:"PERSON"}}
             AND n2.name = {{"Nom de l'employé":string:"NGO"}} RETURN n;`;

    templateParser.parse(query);
    assert.equal(errorMessage,
      '"Nom de l\'employé" cannot be both of type "node" and of type "string".');
  });

  it('Should fail if json name reused with different options', () => {
    const query = `MATCH (n:PERSON)-[e:WORKS_FOR]-(c:COMPANY)-[e2:SPONSOR]-(n2:PERSON)
             WHERE n.name = {{"Nom de l'employé":string:"PERSON"}}
             AND n2.name = {{"Nom de l'employé":string:"NGO"}} RETURN n;`;

    templateParser.parse(query);
    assert.equal(
      errorMessage,
      '"Nom de l\'employé" cannot have both options "{"default":"PERSON"}" and "{"default":"NGO"}".'
    );
  });

  it('Should fail to parse non array string options', () => {
    const query = 'MATCH (n:CAT) where n.name = {{"lol":string:{"placeholder":["miaow"]}}} ';

    templateParser.parse(query);
    assert.equal(errorMessage, '"options.placeholder" must be a string.');
  });

  it('Should fail to generate queries with incomplete template data', () => {
    const query = 'MATCH (n:CAT) where {{"id":node}} n.name = {{"lol":string:{"default":"lol"}}}';

    const templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    const templateData = {
      id: '42'
    };
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    assert.equal(queries, null, errorMessage);
    assert.equal(errorMessage, 'Template data must contain the string "lol".');
  });

  it('Should generate an offset correction table', () => {
    const query = 'MATCH (n:CAT) where {{"id":node}} n.name = {{"lol":string:{"default":"lol"}}}';

    const templateFields = templateParser.parse(query);
    assert.notEqual(templateFields, null, errorMessage);
    const templateData = {
      id: '42',
      lol: 'lol'
    };

    const expected =   {
      correctionTable: [
        {
          displacement: 11, // original token length - replacement token length
          offset: 22 // offset is the original position + length of the string replaced
        },
        {
          displacement: 31,
          offset: 46
        }
      ],
      query: 'MATCH (n:CAT) where 42 n.name = lol'
    };
    const queries = templateParser.generateRawQueries(query, templateData, templateFields);
    assert.deepEqual(queries[0], expected, errorMessage);
  });

  it('Should parse a multi-line template field', () => {
    const query = `MATCH (n:CAT) where {{"id":node}} n.name = {{"lol"
    :string
       :
          {
             "default":"lol"
          }
    }}`;

    const templateFields = templateParser.parse(query);
    const expectedTemplateFields: Template[] = [
      {key: 'id', type: TemplateFieldType.NODE},
      {key: 'lol', type: TemplateFieldType.STRING, options: {default: 'lol'}}
    ];
    assert.deepEqual(templateFields, expectedTemplateFields, errorMessage);
  });

  it('Should fail to parse a multi-line name', () => {
    const query = `MATCH (n:CAT) where {{"id":node}} n.name = {{"
    
    lol
    
    "
    :string
       :
          {
             "default":"lol"
          }
    }}`;

    assert.equal(templateParser.parse(query), null, errorMessage);
    assert.equal(errorMessage, 'Name must not contain line breaks.');
    assert.deepEqual(highlight, {offset: 45, length: 30});
  });
});
