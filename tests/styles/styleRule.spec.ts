'use strict';

import {expect} from 'chai';
import 'mocha';
import {StyleRule} from '../../src';
import {OgmaNodeShape, SelectorType, INodeStyle} from "@linkurious/rest-client";

describe('StyleRule', () => {
  describe('StyleRule.specificity', () => {
    it('should return 4', () => {
      expect(
        new StyleRule(
          {
            type: SelectorType.ANY,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'name',
            style: {color: 'red'},
            index: 0
          }
        ).specificity
      ).to.equal(4);
    });

    it('should return 3', () => {
      expect(
        new StyleRule(
          {
            type: SelectorType.ANY,
            itemType: undefined,
            input: ['properties', 'name'],
            value: 'name',
            style: {color: 'red'},
            index: 0
          }
        ).specificity
      ).to.equal(3);
    });

    it('should return 2', () => {
      expect(
        new StyleRule(
          {type: SelectorType.ANY, itemType: 'CITY', input: undefined, style: {color: 'red'}, index: 0}
        ).specificity
      ).to.equal(2);
    });

    it('should return 1', () => {
      expect(
        new StyleRule(
          {type: SelectorType.IS, itemType: undefined, input: undefined, style: {color: 'red'}, index: 0}
        ).specificity
      ).to.equal(1);
    });
  });

  describe('StyleRule.matchValues', () => {
    it('should return true', () => {
      expect(
        new StyleRule(
          {type: SelectorType.IS, itemType: undefined, input: undefined, style: {color: 'red'}, index: 0}
        ).matchValues('CITY', undefined, undefined)
      ).to.be.true;

      expect(
        new StyleRule(
          {type: SelectorType.IS, itemType: undefined, input: undefined, style: {color: 'red'}, index: 0}
        ).matchValues(undefined, undefined, undefined)
      ).to.be.true;

      expect(
        new StyleRule(
          {type: SelectorType.IS, itemType: null, input: undefined, style: {color: 'red'}, index: 0}
        ).matchValues(undefined, undefined, undefined)
      ).to.be.true;

      expect(
        new StyleRule(
          {type: SelectorType.IS, itemType: 'CITY', input: undefined, style: {color: 'red'}, index: 0}
        ).matchValues('CITY', undefined, undefined)
      ).to.be.true;

      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).matchValues('CITY', ['name'], 'Paris')
      ).to.be.true;
    });

    it('should return false', () => {
      expect(
        new StyleRule(
          {type: SelectorType.IS, itemType: 'CITY', input: undefined, style: {color: 'red'}, index: 0}
        ).matchValues(undefined, undefined, undefined)
      ).to.be.false;

      expect(
        new StyleRule(
          {type: SelectorType.IS, itemType: 'CITY', input: undefined, style: {color: 'red'}, index: 0}
        ).matchValues('COMPANY', undefined, undefined)
      ).to.be.false;

      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).matchValues('CITY', undefined, undefined)
      ).to.be.false;

      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).matchValues('CITY', ['name'], 'Dijon')
      ).to.be.false;

      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: null,
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).matchValues('CITY', ['name'], 'Dijon')
      ).to.be.false;

      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).matchValues('CITY', ['nom'], 'Paris')
      ).to.be.false;
    });
  });

  describe('StyleRule.canApplyTo', () => {
    it('should return true', () => {
      expect(
        new StyleRule(
          {
            type: SelectorType.ANY,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0}
        )
      ).to.be.true;

      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0}
        )
      ).to.be.true;

      expect(
        new StyleRule(
          {type: SelectorType.ANY, itemType: 'CITY', input: undefined, style: {color: 'red'}, index: 0}
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0}
        )
      ).to.be.true;

      expect(
        new StyleRule(
          {
            type: SelectorType.NO_VALUE,
            itemType: 'CITY',
            input: ['properties', 'name'],
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['CITY'], properties: {}, geo: {}, readAt: 0}
        )
      ).to.be.true;

      expect(
        new StyleRule(
          {
            type: SelectorType.NO_VALUE,
            itemType: 'CITY',
            input: ['properties', 'name'],
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: ''}, geo: {}, readAt: 0}
        )
      ).to.be.true;

      expect(
        new StyleRule(
          {
            type: SelectorType.NO_VALUE,
            itemType: 'CITY',
            input: ['properties', 'name'],
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: null}, geo: {}, readAt: 0}
        )
      ).to.be.true;

      expect(
        new StyleRule(
          {type: SelectorType.NAN, itemType: 'CITY', input: ['properties', 'name'], style: {color: 'red'}, index: 0}
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: 'Dijon'}, geo: {}, readAt: 0}
        )
      ).to.be.true;
    });

    it('should return false', () => {
      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: 'Dijon'}, geo: {}, readAt: 0}
        )
      ).to.be.false;

      expect(
        new StyleRule(
          {
            type: SelectorType.IS,
            itemType: 'CITY',
            input: ['properties', 'name'],
            value: 'Paris',
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['COMPANY'], properties: {name: 'Paris'}, geo: {}, readAt: 0}
        )
      ).to.be.false;

      expect(
        new StyleRule(
          {type: SelectorType.ANY, itemType: null, input: undefined, style: {color: 'red'}, index: 0}
        ).canApplyTo(
          {categories: ['COMPANY'], properties: {name: 'Paris'}, geo: {}, readAt: 0}
        )
      ).to.be.false;

      expect(
        new StyleRule(
          {
            type: SelectorType.NO_VALUE,
            itemType: 'CITY',
            input: ['properties', 'name'],
            style: {color: 'red'},
            index: 0
          }
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0}
        )
      ).to.be.false;

      expect(
        new StyleRule(
          {type: SelectorType.NAN, itemType: 'CITY', input: ['properties', 'name'], style: {color: 'red'}, index: 0}
        ).canApplyTo(
          {categories: ['CITY'], properties: {name: 14}, geo: {}, readAt: 0}
        )
      ).to.be.false;
    });
  });

  describe('StyleRule.checkAny', () => {
    it('should return true', () => {
      expect(
        StyleRule.checkAny(
          {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0},
          {color: {type: 'auto', input: ['categories'], ignoreCase: true}} as INodeStyle
        )
      ).to.be.true;

      expect(
        StyleRule.checkAny(
          {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0},
          {shape: OgmaNodeShape.SQUARE}
        )
      ).to.be.true;
    });

    it('should return false', () => {
      expect(
        StyleRule.checkAny(
          {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0},
          {color: {type: 'auto', input: ['properties', 'latitude'], ignoreCase: true}} as INodeStyle
        )
      ).to.be.false;
    });
  });

  describe('StyleRule.checkNoValue', () => {
    it('should return true', () => {
      expect(StyleRule.checkNoValue(
        {categories: ['CITY'], properties: {}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.true;

      expect(StyleRule.checkNoValue(
        {categories: ['CITY'], properties: {}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.true;

      expect(StyleRule.checkNoValue(
        {categories: ['CITY'], properties: {name: null}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.true;

      expect(StyleRule.checkNoValue(
        {categories: ['CITY'], properties: {name: undefined}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.true;

      expect(StyleRule.checkNoValue(
        {categories: ['CITY'], properties: {name: ''}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.true;
    });

    it('should return false', () => {
      expect(StyleRule.checkNoValue(
        {categories: ['CITY'], properties: {name: 0}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;

      expect(StyleRule.checkNoValue(
        {categories: ['CITY'], properties: {name: 'toto'}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;
    });
  });

  describe('StyleRule.checkNan', () => {
    it('should return true', () => {
      expect(StyleRule.checkNan(
        {categories: ['CITY'], properties: {name: 'toto'}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.true;
    });

    it('should return false', () => {
      expect(StyleRule.checkNan(
        {categories: ['CITY'], properties: {name: '2'}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;

      expect(StyleRule.checkNan(
        {categories: ['CITY'], properties: {name: '2.6'}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;

      expect(StyleRule.checkNan(
        {categories: ['CITY'], properties: {name: '2,6'}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;

      expect(StyleRule.checkNan(
        {categories: ['CITY'], properties: {name: 2}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;

      expect(StyleRule.checkNan(
        {categories: ['CITY'], properties: {name: 2.6}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;

      expect(StyleRule.checkNan(
        {categories: ['CITY'], properties: {name: 0}, geo: {}, readAt: 0},
        ['properties', 'name']
      )).to.be.false;
    });
  });

  describe('StyleRule.checkRange', () => {
    it('should return true', () => {
      expect(StyleRule.checkRange(
        0,
        {'<': 5}
      )).to.be.true;

      expect(StyleRule.checkRange(
        2,
        {'<=': 5}
      )).to.be.true;

      expect(StyleRule.checkRange(
        5,
        {'<=': 5}
      )).to.be.true;

      expect(StyleRule.checkRange(
        2,
        {'>': 0}
      )).to.be.true;

      expect(StyleRule.checkRange(
        0,
        {'>=': 0}
      )).to.be.true;

      expect(StyleRule.checkRange(
        2,
        {'>': 0, '<=': 5}
      )).to.be.true;

      expect(StyleRule.checkRange(
        5,
        {'>': 0, '<=': 5}
      )).to.be.true;

      expect(StyleRule.checkRange(
        2,
        {'>=': 0, '<': 5}
      )).to.be.true;

      expect(StyleRule.checkRange(
        0,
        {'>=': 0, '<': 5}
      )).to.be.true;
    });

    it('should return false', () => {
      expect(StyleRule.checkRange(
        5,
        {'<': 5}
      )).to.be.false;

      expect(StyleRule.checkRange(
        6,
        {'<': 5}
      )).to.be.false;

      expect(StyleRule.checkRange(
        10,
        {'<=': 5}
      )).to.be.false;

      expect(StyleRule.checkRange(
        0,
        {'>': 0}
      )).to.be.false;

      expect(StyleRule.checkRange(
        -1,
        {'>=': 0}
      )).to.be.false;

      expect(StyleRule.checkRange(
        10,
        {'>': 0, '<=': 5}
      )).to.be.false;

      expect(StyleRule.checkRange(
        10,
        {'>=': 0, '<': 5}
      )).to.be.false;

      expect(StyleRule.checkRange(
        10,
        {'>=': 0, '<': 5}
      )).to.be.false;
    });
  });

  describe('StyleRule.checkIs', () => {
    it('should return true', () => {
      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {name: 0}, geo: {}, readAt: 0},
        ['properties', 'name'],
        0
      )).to.be.true;

      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {name: 'Paris'}, geo: {}, readAt: 0},
        ['properties', 'name'],
        'Paris'
      )).to.be.true;

      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {name: null}, geo: {}, readAt: 0},
        ['properties', 'name'],
        null
      )).to.be.true;

      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {name: undefined}, geo: {}, readAt: 0},
        ['properties', 'name'],
        undefined
      )).to.be.true;

      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {name: ''}, geo: {}, readAt: 0},
        ['properties', 'name'],
        ''
      )).to.be.true;
    });

    it('should return false', () => {
      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {name: 0}, geo: {}, readAt: 0},
        ['properties', 'name'],
        'test'
      )).to.be.false;

      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {}, geo: {}, readAt: 0},
        ['properties', 'name'],
        'test'
      )).to.be.false;

      expect(StyleRule.checkIs(
        {categories: ['CITY'], properties: {name: 'Test'}, geo: {}, readAt: 0},
        ['properties', 'name'],
        'test'
      )).to.be.false;
    });
  });

  describe('StyleRule.checkItemType', () => {
    it('should return true', () => {
      expect(StyleRule.checkItemType(['CITY'], undefined)).to.be.true;
      expect(StyleRule.checkItemType(['CITY', 'CATEGORY'], 'CITY')).to.be.true;
      expect(StyleRule.checkItemType(null, undefined)).to.be.true;
      expect(StyleRule.checkItemType(undefined, undefined)).to.be.true;
    });

    it('should return false', () => {
      expect(StyleRule.checkItemType(['COMPANY'], 'CITY')).to.be.false;
      expect(StyleRule.checkItemType(['COMPANY'], null)).to.be.false;
    });
  });

  describe('StyleRule.matchCategory', () => {
    it('should return true', () => {
      expect(StyleRule.matchCategory(['CITY'], 'CITY')).to.be.true;
      expect(StyleRule.matchCategory(['CITY', 'CATEGORY'], 'CITY')).to.be.true;
    });

    it('should return false', () => {
      expect(StyleRule.matchCategory([], 'CITY')).to.be.false;
      expect(StyleRule.matchCategory(['COMPANY'], 'CITY')).to.be.false;
      expect(StyleRule.matchCategory(['City'], 'CITY')).to.be.false;
    });
  });

  describe('StyleRule.matchAny', () => {
    it('should return true', () => {
      expect(StyleRule.matchAny(undefined)).to.be.true;
    });

    it('should return false', () => {
      expect(StyleRule.matchAny('re')).to.be.false;
      expect(StyleRule.matchAny(0)).to.be.false;
      expect(StyleRule.matchAny(null)).to.be.false;
      expect(StyleRule.matchAny('')).to.be.false;
      expect(StyleRule.matchAny([])).to.be.false;
      expect(StyleRule.matchAny({})).to.be.false;
    });
  });

  describe('StyleRule.getTypeColor', () => {
    it('should return a color', () => {
      expect(new StyleRule({
        type: SelectorType.ANY,
        input: undefined,
        index: 0,
        itemType: 'CITY',
        value: undefined,
        style: {
          color: 'red'
        }
      }).getTypeColor('CITY')).to.be.equal('red');
      expect(new StyleRule({
        type: SelectorType.ANY,
        input: undefined,
        index: 0,
        itemType: undefined,
        value: undefined,
        style: {
          color: {
            type: 'auto',
            input: ['categories']
          }
        }
      }).getTypeColor('CITY')).to.be.equal('#2ca02c');
      expect(new StyleRule({
        type: SelectorType.ANY,
        input: undefined,
        index: 0,
        itemType: 'CITY',
        value: undefined,
        style: {
          color: {
            type: 'auto',
            input: ['categories']
          }
        }
      }).getTypeColor('CITY')).to.be.equal('#2ca02c');
    });

    it('should return undefined', () => {
      expect(new StyleRule({
        type: SelectorType.IS,
        input: undefined,
        index: 0,
        itemType: 'CITY',
        value: undefined,
        style: {
          color: 'red'
        }
      }).getTypeColor('CITY')).to.be.equal(undefined);

      expect(new StyleRule({
        type: SelectorType.ANY,
        input: ['properties', 'name'],
        index: 0,
        itemType: 'CITY',
        value: 'Paris',
        style: {
          color: 'red'
        }
      }).getTypeColor('CITY')).to.be.equal(undefined);

      expect(new StyleRule({
        type: SelectorType.ANY,
        input: undefined,
        index: 0,
        itemType: 'CITY',
        value: undefined,
        style: {
          size: '200%'
        }
      }).getTypeColor('CITY')).to.be.equal(undefined);

      expect(new StyleRule({
        type: SelectorType.ANY,
        input: undefined,
        index: 0,
        itemType: 'COMPANY',
        value: undefined,
        style: {
          color: 'yellow'
        }
      }).getTypeColor('CITY')).to.be.equal(undefined);
    });
  });
});
