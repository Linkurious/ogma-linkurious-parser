/* eslint-disable @typescript-eslint/camelcase */
'use strict';

import {expect} from 'chai';
import 'mocha';
import Ogma, {Edge} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData, OgmaEdgeShape, SelectorType} from '@linkurious/rest-client';

import {EdgeAttributes, StyleRules, StyleRule} from '../../src';

describe('EdgeAttributes', () => {
  let edge: Edge<LkEdgeData, LkNodeData>;
  let ogma: Ogma;
  beforeEach(() => {
    ogma = new Ogma();
    ogma.addNodes([
      {id: 0, data: {categories: ['CITY'], properties: {name: 'Paris'}}},
      {
        id: 1,
        data: {categories: ['COMPANY, INVESTOR'], properties: {name: 'Linkurious', country: 'FR'}}
      }
    ]);
    ogma.addEdge({
      id: 0,
      source: 1,
      target: 0,
      data: {type: 'HAS_CITY', properties: {name: 'paris', inhabitants: '9000000000'}}
    });
    edge = ogma.getEdge(0) as Edge<LkEdgeData, LkNodeData>;
  });

  afterEach(() => {
    ogma.destroy();
  });

  describe('EdgeAttributes.color', () => {
    it('should return an auto color for an edge', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              value: undefined,
              style: {color: {type: 'auto', input: ['type']}}
            }
          ]).edgeRules
        ).color(edge.getData())
      ).to.equal('#aec7e8');
    });

    it('should return a color for an edge', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              value: undefined,
              style: {color: 'red'}
            }
          ]).edgeRules
        ).color(edge.getData())
      ).to.equal('red');
    });

    it('should return the right color for an edge', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              value: undefined,
              style: {color: {type: 'auto', input: ['type']}}
            },
            {
              index: 1,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: undefined,
              style: {color: 'green'}
            }
          ]).edgeRules
        ).color(edge.getData())
      ).to.equal('#aec7e8');
    });

    it('should return the right color for an edge', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              value: undefined,
              style: {color: {type: 'auto', input: ['type']}}
            },
            {
              index: 1,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: undefined,
              style: {color: 'green'}
            },
            {
              index: 2,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: ['properties', 'name'],
              value: 'paris',
              style: {color: 'pink'}
            }
          ]).edgeRules
        ).color(edge.getData())
      ).to.equal('pink');
    });

    it('should return the right color for an edge', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              value: undefined,
              style: {color: {type: 'auto', input: ['type']}}
            },
            {
              index: 1,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: undefined,
              style: {color: 'green'}
            },
            {
              index: 2,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: ['properties', 'nam'],
              value: 'paris',
              style: {color: 'pink'}
            }
          ]).edgeRules
        ).color(edge.getData())
      ).to.equal('#aec7e8');
    });
  });

  describe('EdgeAttributes.shape', () => {
    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              value: undefined,
              style: {shape: OgmaEdgeShape.ARROW}
            }
          ]).edgeRules
        ).shape(edge.getData())
      ).to.equal('arrow');
    });

    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'HAS_CITY',
              input: undefined,
              value: undefined,
              style: {shape: OgmaEdgeShape.LINE}
            }
          ]).edgeRules
        ).shape(edge.getData())
      ).to.equal('line');
    });

    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'HAS_CITY',
              input: undefined,
              value: undefined,
              style: {shape: OgmaEdgeShape.LINE}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: ['properties', 'name'],
              value: 'paris',
              style: {shape: OgmaEdgeShape.TAPERED}
            }
          ]).edgeRules
        ).shape(edge.getData())
      ).to.equal('tapered');
    });

    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'HAS_CITY',
              input: undefined,
              value: undefined,
              style: {shape: OgmaEdgeShape.LINE}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: ['properties', 'nam'],
              value: 'paris',
              style: {shape: OgmaEdgeShape.TAPERED}
            }
          ]).edgeRules
        ).shape(edge.getData())
      ).to.equal('line');
    });
  });

  describe('EdgeAttributes.width', function () {
    it('should return the right width', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              value: undefined,
              style: {width: '100%'}
            }
          ]).edgeRules
        ).width(edge.getData())
      ).to.equal('100%');
    });

    it('should return the right width', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'HAS_CITY',
              input: undefined,
              value: undefined,
              style: {width: '200%'}
            }
          ]).edgeRules
        ).width(edge.getData())
      ).to.equal('200%');
    });

    it('should return the right width', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'HAS_CITY',
              input: undefined,
              value: undefined,
              style: {width: '100%'}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: ['properties', 'name'],
              value: 'paris',
              style: {width: '200%'}
            }
          ]).edgeRules
        ).width(edge.getData())
      ).to.equal('200%');
    });

    it('should return the right width', () => {
      expect(
        new EdgeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'HAS_CITY',
              input: undefined,
              value: undefined,
              style: {width: '50%'}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'HAS_CITY',
              input: ['properties', 'nam'],
              value: 'paris',
              style: {width: '200%'}
            }
          ]).edgeRules
        ).width(edge.getData())
      ).to.equal('50%');
    });
  });

  describe('EdgeAttributes.getAutomaticRangeWidth', function () {
    it('should return the right width', () => {
      expect(
        EdgeAttributes.getAutomaticRangeWidth(
          8000,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              width: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 400,
                max: 8000
              }
            }
          })
        )
      ).to.equal('200%');

      expect(
        EdgeAttributes.getAutomaticRangeWidth(
          4000,
          new StyleRule({
            index: 0,
            type: SelectorType.ANY,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              width: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 400,
                max: 8000
              }
            }
          })
        )
      ).to.equal('121%');

      expect(
        EdgeAttributes.getAutomaticRangeWidth(
          2000,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              width: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 400,
                max: 8000
              }
            }
          })
        )
      ).to.equal('81%');

      expect(
        EdgeAttributes.getAutomaticRangeWidth(
          400,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              width: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 400,
                max: 8000
              }
            }
          })
        )
      ).to.equal('50%');

      expect(
        EdgeAttributes.getAutomaticRangeWidth(
          1000,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              width: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 400,
                max: 8000,
                scale: 'logarithmic'
              }
            }
          }),
          true
        )
      ).to.equal('95%');
    });
  });
});
