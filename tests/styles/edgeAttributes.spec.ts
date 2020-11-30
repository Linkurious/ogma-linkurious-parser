/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-21.
 */


'use strict';

import {expect} from 'chai';
import 'mocha';
import {EdgeAttributes, StyleRules} from '../../src';
import Ogma from 'ogma';
import {LkEdgeData, LkNodeData, OgmaEdgeShape, SelectorType} from "@linkurious/rest-client";
import {Edge} from "../../src/ogma/models";

describe('EdgeAttributes', () => {
  let edge: Edge<LkEdgeData, LkNodeData>;

  beforeEach(() => {
    let ogma = new Ogma();
    ogma.addNodes([
      {id: 0, data: {categories: ['CITY'], properties: {name: 'Paris'}}},
      {id: 1, data: {categories: ['COMPANY, INVESTOR'], properties: {name: 'Linkurious', country: 'FR'}}}
    ]);
    ogma.addEdge({id: 0, source: 1, target: 0, data: { type: 'HAS_CITY', properties: {name: 'paris', inhabitants: '9000000000'} }});
    edge = ogma.getEdge(0) as Edge<LkEdgeData, LkNodeData>;
  });

  describe('EdgeAttributes.color', () => {
    it('should return an auto color for an edge', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [{index: 0, type: SelectorType.ANY, itemType: undefined, input: undefined, value: undefined, style: {color: {type: 'auto', input: ['type']}}}]
        ).edgeRules).color(edge.getData())
      ).to.equal('#aec7e8');
    });

    it('should return a color for an edge', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [{index: 0, type: SelectorType.ANY, itemType: undefined, input: undefined, value: undefined, style: {color: 'red'}}]
        ).edgeRules).color(edge.getData())
      ).to.equal('red');
    });

    it('should return the right color for an edge', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: undefined, input: undefined, value: undefined, style: {color: {type: 'auto', input: ['type']}}},
            {index: 1, type: SelectorType.IS, itemType: 'HAS_CITY', input: undefined, style: {color: 'green'}}
          ]
        ).edgeRules).color(edge.getData())
      ).to.equal('#aec7e8');
    });

    it('should return the right color for an edge', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: undefined, input: undefined, value: undefined, style: {color: {type: 'auto', input: ['type']}}},
            {index: 1, type: SelectorType.IS, itemType: 'HAS_CITY', input: undefined, style: {color: 'green'}},
            {index: 2, type: SelectorType.IS, itemType: 'HAS_CITY', input: ['properties', 'name'], value: 'paris', style: {color: 'pink'}}
          ]
        ).edgeRules).color(edge.getData())
      ).to.equal('pink');
    });

    it('should return the right color for an edge', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: undefined, input: undefined, value: undefined, style: {color: {type: 'auto', input: ['type']}}},
            {index: 1, type: SelectorType.IS, itemType: 'HAS_CITY', input: undefined, style: {color: 'green'}},
            {index: 2, type: SelectorType.IS, itemType: 'HAS_CITY', input: ['properties', 'nam'], value: 'paris', style: {color: 'pink'}}
          ]
        ).edgeRules).color(edge.getData())
      ).to.equal('#aec7e8');
    });
  });

  describe('EdgeAttributes.shape', () => {
    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: undefined, input: undefined, value: undefined, style: {shape: OgmaEdgeShape.ARROW}},
          ]
        ).edgeRules).shape(edge.getData())
      ).to.equal('arrow');
    });

    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: 'HAS_CITY', input: undefined, value: undefined, style: {shape: OgmaEdgeShape.LINE}},
          ]
        ).edgeRules).shape(edge.getData())
      ).to.equal('line');
    });

    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: 'HAS_CITY', input: undefined, value: undefined, style: {shape: OgmaEdgeShape.LINE}},
            {index: 0, type: SelectorType.IS, itemType: 'HAS_CITY', input: ['properties', 'name'], value: 'paris', style: {shape: OgmaEdgeShape.TAPERED}},
          ]
        ).edgeRules).shape(edge.getData())
      ).to.equal('tapered');
    });

    it('should return the right shape', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: 'HAS_CITY', input: undefined, value: undefined, style: {shape: OgmaEdgeShape.LINE}},
            {index: 0, type: SelectorType.IS, itemType: 'HAS_CITY', input: ['properties', 'nam'], value: 'paris', style: {shape: OgmaEdgeShape.TAPERED}},
          ]
        ).edgeRules).shape(edge.getData())
      ).to.equal('line');
    });
  });

  describe('EdgeAttributes.width', function() {
    it('should return the right width', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: undefined, input: undefined, value: undefined, style: {width: '100%'}},
          ]
        ).edgeRules).width(edge.getData())
      ).to.equal('100%');
    });

    it('should return the right width', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: 'HAS_CITY', input: undefined, value: undefined, style: {width: '200%'}},
          ]
        ).edgeRules).width(edge.getData())
      ).to.equal('200%');
    });

    it('should return the right width', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: 'HAS_CITY', input: undefined, value: undefined, style: {width: '100%'}},
            {index: 0, type: SelectorType.IS, itemType: 'HAS_CITY', input: ['properties', 'name'], value: 'paris', style: {width: '200%'}},
          ]
        ).edgeRules).width(edge.getData())
      ).to.equal('200%');
    });

    it('should return the right width', () => {
      expect(
        new EdgeAttributes(new StyleRules(
          [
            {index: 0, type: SelectorType.ANY, itemType: 'HAS_CITY', input: undefined, value: undefined, style: {width: '50%'}},
            {index: 0, type: SelectorType.IS, itemType: 'HAS_CITY', input: ['properties', 'nam'], value: 'paris', style: {width: '200%'}},
          ]
        ).edgeRules).width(edge.getData())
      ).to.equal('50%');
    });
  });

});
