/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS
 *
 * - Created on 25/07/18.
 */

// external libs
import 'mocha';
import {deepStrictEqual, ok} from 'assert';
// locals
import {Highlighter} from '../../src';
import {HighlighterOptions} from '../../src/search/highlighter';
import {EntityType, LkProperties, PropertyTypeName, SearchQuery} from '@linkurious/rest-client';

const {tokenize, highlight, fuzzyMatch, buildSearchQueryFromString} = Highlighter;

describe('Highlighter library', () => {
  const TEST_STRING = 'hello\nworld';
  const TEST_STRING_2 = 'hello\nworld this is my miao';

  it('Highlighter.tokenize', () => {
    const expectedResult = new Map();
    expectedResult.set('hell', [[0, 5]]);
    expectedResult.set('worl', [
      [7, 5],
      [14, 5]
    ]);
    expectedResult.set('miao', [[24, 12]]);
    const actualResult = tokenize('hello! WoRlD& WoRlD&(/"£miao5world4r', 2, 4);
    deepStrictEqual(actualResult, expectedResult);
  });

  it('Highlighter.fuzzyMatch', () => {
    // test if a prefix is a match
    ok(fuzzyMatch('ciao', 'ciaone', 0, true) > 0);
    ok(fuzzyMatch('ciaone', 'ciao', 0, true) === 0);

    // test by edit distance
    ok(fuzzyMatch('ciao', 'ciao', 0, false) > 0);
    ok(fuzzyMatch('ciaone', 'ciao', 2, false) > 0); // on 6 chars, 0.7 -> edit distance 2
    ok(fuzzyMatch('ciaone', 'ciao', 1, false) === 0); // 0.8 -> edit distance 1
    ok(fuzzyMatch('ciao', 'cio', 1, false) > 0);
    ok(fuzzyMatch('ciao', 'co', 1, false) === 0);
    ok(fuzzyMatch('ciao', 'co', 2, false) > 0); // on 4 chars, 0.6 -> edit distance 2
    ok(fuzzyMatch('ciao', 'cibo', 1, false) > 0); // 0.7 -> edit distance 1
    ok(fuzzyMatch('ciao', 'cybo', 1, false) === 0);
    ok(fuzzyMatch('ciao', 'cybo', 2, false) > 0);
  });

  it('Highlighter.highlight', () => {
    // Same used inside highlight()
    const defaultParams: Required<HighlighterOptions> = {
      maxValueLength: 80,
      minTokenLength: 2,
      maxTokenLength: 7,
      maxMatchResults: 5,
      localFuzziness: 0.3
    };

    /**
     * Single document fields tests
     */
    deepStrictEqual(highlight('world', {a: TEST_STRING}, '[match]', '[/match]'), [
      {field: 'a', value: 'hello\n[match]world[/match]'}
    ]);
    deepStrictEqual(highlight('woorld', {a: TEST_STRING}, '[match]', '[/match]'), [
      {field: 'a', value: 'hello\n[match]world[/match]'}
    ]);
    deepStrictEqual(highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]'), [
      {field: 'a', value: 'hello\n[match]world[/match] this is my [match]miao[/match]'}
    ]);

    const searchQuery = buildSearchQueryFromString('woorld miao', {
      ...defaultParams,
      localFuzziness: 0
    });
    deepStrictEqual(highlight(searchQuery, {a: TEST_STRING_2}, '[match]', '[/match]'), [
      {field: 'a', value: 'hello\nworld this is my [match]miao[/match]'}
    ]);

    deepStrictEqual(
      highlight('world miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 4}),
      [{field: 'a', value: '... [match]miao[/match]'}]
    );
    deepStrictEqual(
      highlight('world miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 5}),
      [{field: 'a', value: '... [match]world[/match] ...'}]
    );
    deepStrictEqual(
      highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 5}),
      [{field: 'a', value: '... [match]miao[/match]'}]
    );
    deepStrictEqual(
      highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 6}),
      [{field: 'a', value: '... [match]miao[/match]'}]
    );
    deepStrictEqual(
      highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 7}),
      [{field: 'a', value: '... my [match]miao[/match]'}]
    );
    deepStrictEqual(
      highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 8}),
      [{field: 'a', value: '... my [match]miao[/match]'}]
    );
    deepStrictEqual(
      highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 9}),
      [{field: 'a', value: '... my [match]miao[/match]'}]
    );
    deepStrictEqual(
      highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 10}),
      [{field: 'a', value: '... is my [match]miao[/match]'}]
    );
    deepStrictEqual(
      highlight('world miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 7}),
      [{field: 'a', value: '... [match]world[/match] ...'}]
    );
    deepStrictEqual(
      highlight('world miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 9}),
      [{field: 'a', value: '... [match]world[/match] ...'}]
    );
    deepStrictEqual(
      highlight('world miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 10}),
      [{field: 'a', value: '... [match]world[/match] this ...'}]
    );
    deepStrictEqual(
      highlight('world miao', {a: TEST_STRING_2}, '[match]', '[/match]', {maxValueLength: 11}),
      [{field: 'a', value: 'hello [match]world[/match] ...'}]
    );
    deepStrictEqual(
      highlight('woorld miao', {a: TEST_STRING_2}, '[match]', '[/match]', {
        minTokenLength: 1,
        maxTokenLength: 1
      }),
      [
        {
          field: 'a',
          value: 'hello\n[match]world[/match] this is [match]my[/match] [match]miao[/match]'
        }
      ]
    );

    deepStrictEqual(
      highlight(
        'quebce',
        {
          founded: '2008-Q1',
          state: 'qc',
          name: 'Caisse de depot et de placement du quebec'
        },
        '[match]',
        '[/match]',
        {minTokenLength: 1}
      ),
      [
        {
          field: 'name',
          value: 'Caisse de depot et de placement du [match]quebec[/match]'
        }
      ]
    );

    /**
     * Multi document fields tests
     */
    deepStrictEqual(
      highlight(
        'Pris',
        {
          name: 'Linkurious',
          description: 'Linkurious is a company based in Paris',
          city: 'Paris',
          country: 'France'
        },
        '[match]',
        '[/match]'
      ),
      [
        {
          field: 'city',
          value: '[match]Paris[/match]'
        },
        {
          field: 'description',
          value: 'Linkurious is a company based in [match]Paris[/match]'
        }
      ]
    );

    deepStrictEqual(
      highlight(
        buildSearchQueryFromString('Paris', {...defaultParams, localFuzziness: 0}),
        {
          name: 'Linkurious',
          description: 'Linkurious is a company based in Pris',
          city: 'Paris',
          country: 'France'
        },
        '[match]',
        '[/match]'
      ),
      [
        {
          field: 'city',
          value: '[match]Paris[/match]'
        }
      ]
    );

    deepStrictEqual(
      highlight(
        'Pris',
        {
          name: 'Linkurious',
          description: 'Linkurious is a company based in Paris',
          city: 'Paris',
          country: 'France'
        },
        '[match]',
        '[/match]',
        {maxMatchResults: 1}
      ),
      [
        {
          field: 'city',
          value: '[match]Paris[/match]'
        }
      ]
    );

    deepStrictEqual(
      highlight(
        'Par',
        {
          country: 'FRA',
          city: 'Paris',
          name: 'Resources Capital Partners',
          permalink: '/organization/resources-capital-partners',
          url: 'http://www.crunchbase.com/organization/resources-capital-partners'
        },
        '[match]',
        '[/match]'
      ),
      [
        {
          field: 'city',
          value: '[match]Paris[/match]'
        },
        {
          field: 'name',
          value: 'Resources Capital [match]Partners[/match]'
        },
        {
          field: 'permalink',
          value: '/organization/resources-capital-[match]partners[/match]'
        },
        {
          field: 'url',
          value: 'http://www.crunchbase.com/organization/resources-capital-[match]partners[/match]'
        }
      ]
    );

    deepStrictEqual(
      highlight(
        'george about pa',
        {
          browserUsed: 'Firefox',
          content: 'About George Orwell, ratic socialism. Considered perhaps thAbout Luciano Pa',
          creationDate: 1329940892953,
          id: 1649272646336,
          length: 75,
          locationIP: '213.154.67.134'
        },
        '[match]',
        '[/match]',
        {
          minTokenLength: 1,
          maxValueLength: 20,
          maxMatchResults: 3
        }
      ),
      [
        {
          field: 'content',
          value: '[match]About[/match] [match]George[/match] Orwell, ...'
        }
      ]
    );

    // Highlight date properties
    deepStrictEqual(
        highlight(
            {"entityType":EntityType.NODE,"fuzziness":0.1,"propertiesPerTypes":{"TRANSACTION":{"text":["name","cute"],"number":["timestamp","amount","P"],"date":["ISOdate"]}},"terms":[{"type":"date","key":"ISOdate","term":"2020-02-01","prefix":true}],"phrases":[],"filters":[]},
            {
              ISOdate: {type: "date", value: "2020-02-01T00:00:00.000+07:00", timezone: "+07:00"}
            },
            '[match]',
            '[/match]',
            {
              minTokenLength: 1,
              maxValueLength: 80,
              maxMatchResults: 3
            }
        ),
        [
          {
            field: 'ISOdate',
            value: '[match]2020-02-01T00:00:00.000+07:00[/match]'
          }
        ]
    );
  });

  it('Phrase highlighting', () => {
    // 1) I create 3 nodes with category PERSON and name:
    //    - "DaViD RaPiN"
    //    - "David Rapin"
    //    - "  David          Rapin"
    //    - `David%$@# .   . . . Rapin^%#:$"{}`
    //    - `This is a David Rapin's project`
    // 2) I search on atlas => name:"  David  Rapin"

    // 3) The search returns the following searchQuery:
    const searchQuery = (prefix: boolean): SearchQuery => ({
      entityType: EntityType.NODE,
      fuzziness: 0.6,
      propertiesPerTypes: {
        CITY: {text: ['name'], number: [], date: []},
        MARKET: {text: ['name'], number: [], date: []},
        COMPANY: {text: ['name'], number: [], date: []},
        INVESTOR: {text: ['name'], number: [], date: []},
        PERSON: {text: ['name'], number: [], date: []}
      },
      terms: [],
      phrases: [{key: 'name', phrase: '  David 123 Rapin', prefix: prefix}],
      filters: []
    });

    // 3) The search also returns the following documents:

    // 3.1) With spaces in between and in the beginning
    let document: LkProperties = {
      name: '  David  123        Rapin',
      age: {type: PropertyTypeName.NUMBER, status: 'missing', mandatory: false}
    };

    let highlightedResult = highlight(searchQuery(false), document, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 1);
    deepStrictEqual(highlightedResult, [
      {
        field: 'name',
        value: '  [match]David  123        Rapin[/match]'
      }
    ]);

    // 3.2) With non-letters
    document = {
      name: 'David%$@# . 123  . . . Rapin^%#:$"{}',
      age: {type: PropertyTypeName.NUMBER, status: 'missing', mandatory: false}
    };

    highlightedResult = highlight(searchQuery(false), document, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 1);
    deepStrictEqual(highlightedResult, [
      {
        field: 'name',
        value: '[match]David%$@# . 123  . . . Rapin[/match]^%#:$"{}'
      }
    ]);

    // 3.3) Simplest case
    document = {
      name: 'David 123 Rapin',
      age: {type: PropertyTypeName.NUMBER, status: 'missing', mandatory: false}
    };

    highlightedResult = highlight(searchQuery(false), document, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 1);
    deepStrictEqual(highlightedResult, [
      {
        field: 'name',
        value: '[match]David 123 Rapin[/match]'
      }
    ]);

    // 3.4) Uppercase
    document = {
      name: 'DaViD 123 RaPiN',
      age: {type: PropertyTypeName.NUMBER, status: 'missing', mandatory: false}
    };

    highlightedResult = highlight(searchQuery(false), document, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 1);
    deepStrictEqual(highlightedResult, [
      {
        field: 'name',
        value: '[match]DaViD 123 RaPiN[/match]'
      }
    ]);

    // 3.5) Prefix
    document = {
      name: 'DaViD 123 RaPiNaa',
      age: {type: PropertyTypeName.NUMBER, status: 'missing', mandatory: false}
    };

    highlightedResult = highlight(searchQuery(true), document, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 1);
    deepStrictEqual(highlightedResult, [
      {
        field: 'name',
        value: '[match]DaViD 123 RaPiNaa[/match]'
      }
    ]);

    // 3.6) Non Prefix
    document = {
      name: 'DaViD 123 RaPiNaa',
      age: {type: PropertyTypeName.NUMBER, status: 'missing', mandatory: false}
    };

    highlightedResult = highlight(searchQuery(false), document, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 0);
    deepStrictEqual(highlightedResult, []);

    // 3.7) Natural sentence
    document = {
      name: "This is a David 123 Rapin's project",
      age: {type: PropertyTypeName.NUMBER, status: 'missing', mandatory: false}
    };

    highlightedResult = highlight(searchQuery(false), document, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 1);
    deepStrictEqual(highlightedResult, [
      {
        field: 'name',
        value: "This is a [match]David 123 Rapin[/match]'s project"
      }
    ]);
  });

  it('Should get matching results with uppercase term', () => {
    // 3) The search returns the following searchQuery:
    const searchQuery: SearchQuery = {
      entityType: EntityType.NODE,
      fuzziness: 0.1,
      propertiesPerTypes: {
        COMPANY: {
          text: ['name'],
          number: [],
          date: []
        },
        INVESTOR: {
          text: ['name', 'permalink', 'pkar_INVESTOR_1', 'pkar_INVESTOR_3', 'pkar_INVESTOR_4'],
          number: [],
          date: [],
        },
        MARKET: {
          text: ['name', 'pkar_MARKET_1', 'pkar_MARKET_2'],
          number: [],
          date: [],
        },
        AF_TEST: {
          text: ['"way to break_the_system"'],
          number: [],
          date: [],
        },
        TRANSACTION: {
          text: ['name', 'cute'],
          number: ['timestamp', 'amount', 'P'],
          date: ['ISOdate']
        },
        CITY: {
          text: ['name', 'pkar_CITY_1', 'pkar_CITY_2'],
          number: [],
          date: []
        }
      },
      terms: [{type: 'text', term: 'Avon', prefix: true}],
      phrases: [],
      filters: []
    };

    // 3) The search also returns the following documents:

    // 3.1) With spaces in between and in the beginning
    let document = {
      name: 'Avon',
      lat: {type: "number", status: "missing", mandatory: false},
      pkar_CITY_1: {type: "string", status: "missing", mandatory: false},
      pkar_CITY_2: {type: "string", status: "missing", mandatory: false}
    };


    let highlightedResult = highlight(searchQuery, document as LkProperties, '[match]', '[/match]');
    deepStrictEqual(highlightedResult.length, 1);
    deepStrictEqual(highlightedResult, [
      {
        field: 'name',
        value: '[match]Avon[/match]'
      }
    ]);
  });
});
