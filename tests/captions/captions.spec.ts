'use strict';

import {expect} from 'chai';
import 'mocha';
import {Captions} from '../../src';

describe('Captions', () => {
  let captionConfiguration = {
    CITY: {active: true, displayName: false, properties: ['name', 'country']},
    COMPANY: {active: true, displayName: true, properties: ['name']},
    INVESTOR: {active: true, displayName: false, properties: ['title']},
    MARKET: {active: false, displayName: true, properties: ['name']},
    no_categories: {active: true, displayName: false, properties: ['label']}
  };

  describe('Captions.generateNodeCaption', () => {
    it('should return the right caption', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['CITY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {CITY: {active: true, displayName: false, properties: ['name']}}
      )).to.eql('paris');
    });
    it('should return the right caption', () => {
      expect(Captions.generateNodeCaption(
        {
          categories: ['CITY', 'TOWN'],
          properties: {name: 'paris', country: 'USA', region: 'ile de france'},
          geo: {},
          readAt: 0
        },
        {
          CITY: {active: true, displayName: false, properties: ['name', 'country']},
          TOWN: {active: true, displayName: false, properties: ['name', 'region']}
        }
      )).to.eql('paris - USA - ile de france');
    });
    it('should return the right caption', () => {
      expect(Captions.generateNodeCaption(
        {
          categories: ['CITY', 'TOWN'],
          properties: {name: 'paris', surname: 'paris', country: 'USA', region: 'ile de france'},
          geo: {},
          readAt: 0
        },
        {
          CITY: {active: true, displayName: false, properties: ['name', 'country', 'surname']},
          TOWN: {active: true, displayName: false, properties: ['name', 'region']}
        }
      )).to.eql('paris - USA - paris - ile de france');
    });
    it('should return the right caption with node type', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['CITY'], properties: {inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {CITY: {active: true, displayName: true, properties: ['name']}}
      )).to.eql('CITY');
    });
    it('should return an empty string if caption is not active', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['CITY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {CITY: {active: false, displayName: true, properties: ['name']}}
      )).to.eql('');
    });
    it('should return the right caption for on type', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['CITY', 'COMPANY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {CITY: {active: true, displayName: true, properties: ['name']}}
      )).to.eql('CITY - paris');
    });
    it('should return the right caption for on type', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['CITY', 'COMPANY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {
          CITY: {active: true, displayName: true, properties: ['name']},
          COMPANY: {active: false, displayName: true, properties: ['name']}
        }
      )).to.eql('CITY - paris');
    });
    it('should return the right caption for nodes with two types set in caption schema', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['CITY', 'COMPANY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {
          CITY: {active: true, displayName: true, properties: ['inhabitants']},
          COMPANY: {active: true, displayName: false, properties: ['name']}
        }
      )).to.eql('CITY - 9000000000 - paris');
    });
    it('should return the right caption for nodes with two types set in caption schema', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['COMPANY', 'CITY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {
          CITY: {active: true, displayName: true, properties: ['inhabitants']},
          COMPANY: {active: true, displayName: false, properties: ['name']}
        }
      )).to.eql('CITY - paris - 9000000000');
    });
    it('should return the right caption for nodes with two types set in caption schema', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['COMPANY', 'CITY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {
          CITY: {active: true, displayName: true, properties: ['inhabitants']},
          COMPANY: {active: true, displayName: true, properties: ['name']}
        }
      )).to.eql('COMPANY - CITY - paris - 9000000000');
    });
    it('should return the right caption for nodes with key not duplicated', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['COMPANY', 'CITY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {
          CITY: {active: true, displayName: true, properties: ['name']},
          COMPANY: {active: true, displayName: true, properties: ['name']}
        }
      )).to.eql('COMPANY - CITY - paris');
    });
    it('should return nothing if the caption has no configuration', () => {
      expect(Captions.generateNodeCaption(
        {categories: ['CITY'], properties: {name: 'paris', inhabitants: '9000000000'}, geo: {}, readAt: 0},
        {
          no_categories: {active: true, displayName: false, properties: ['name']},
          COMPANY: {active: true, displayName: true, properties: ['name']}
        }
      )).to.eql('');
    });
  });

  describe('Captions.generateEdgeCaption', () => {
    it('should return the right caption', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {name: 'paris', inhabitants: '9000000000'}, readAt: 0},
        {HAS_CITY: {active: true, displayName: false, properties: ['name']}}
      )).to.eql('paris');
    });
    it('should return the right caption with the edge type', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {name: 'paris', inhabitants: '9000000000'}, readAt: 0},
        {HAS_CITY: {active: true, displayName: true, properties: ['name']}}
      )).to.eql('HAS_CITY - paris');
    });
    it('should return an empty string if the caption is not active', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {name: 'paris', inhabitants: '9000000000'}, readAt: 0},
        {HAS_CITY: {active: false, displayName: true, properties: ['name']}}
      )).to.eql('');
    });
    it('should return an empty string if the caption is not active', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {name: 'paris', inhabitants: '9000000000'}, readAt: 0},
        {HAS_CITY: {active: false, displayName: true, properties: ['name']}}
      )).to.eql('');
    });
    it('should return an empty string if the caption has no configuration', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {name: 'paris', inhabitants: '9000000000'}, readAt: 0},
        {}
      )).to.eql('');
    });
    it('should return the right caption', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {}, readAt: 0},
        {HAS_CITY: {active: true, displayName: true, properties: ['name']}}
      )).to.eql('HAS_CITY');
    });
    it('should return the right caption', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {}, readAt: 0},
        {HAS_CITY: {active: true, displayName: true, properties: ['name']}}
      )).to.eql('HAS_CITY');
    });
    it('should return the right caption', () => {
      expect(Captions.generateEdgeCaption(
        {type: 'HAS_CITY', properties: {}, readAt: 0},
        {HAS_CITY: {active: true, displayName: false, properties: ['name']}}
      )).to.eql('');
    });
  });

  describe('Captions.captionExists', () => {
    it('should return true', () => {
      expect(Captions.captionExist(['CITY'], captionConfiguration)).to.be.true;
      expect(Captions.captionExist(['COMPANY'], captionConfiguration)).to.be.true;
      expect(Captions.captionExist(['CITY', 'MARKET'], captionConfiguration)).to.be.true;
      expect(Captions.captionExist(['CITY', 'TEST'], captionConfiguration)).to.be.true;
      expect(Captions.captionExist(['TEST', 'CITY'], captionConfiguration)).to.be.true;
      expect(Captions.captionExist(['no_categories'], captionConfiguration)).to.be.true;
    });

    it('should return false', () => {
      expect(Captions.captionExist(['TEST'], captionConfiguration)).to.be.false;
      expect(Captions.captionExist([], captionConfiguration)).to.be.false;
      expect(Captions.captionExist(['CITI', 'TEST'], captionConfiguration)).to.be.false;
    });
  });
});
