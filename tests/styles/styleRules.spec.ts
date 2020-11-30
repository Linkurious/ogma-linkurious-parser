/**
 * LINKURIOUS CONFIDENTIAL
 * Copyright Linkurious SAS 2012 - 2018
 *
 * Created by maximeallex on 2018-05-22.
 */


'use strict';

import {expect} from 'chai';
import 'mocha';
import {StyleRules, StyleType} from '../../src';
import {OgmaNodeShape, SelectorType, StyleColor} from "@linkurious/rest-client";

describe('StyleRules', () => {

  describe('getLegendForStyle()', () => {
    it('should return `red` for node:CITY', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'color' as StyleType,
        styles.color,
        [{categories: ['CITY'], properties:{}, geo: {}, readAt: 0 }]
      )).to.eql([{label: 'CITY', value: 'red'}]);
    });

    it('should return the right legend', () => {
      let styles = new StyleRules([
        {
          "index": 0,
          itemType: undefined,
          "type": SelectorType.ANY,
          "style": {
            "color": {
              "type": "auto",
              "input": ["categories"]
            } as StyleColor
          }
      }, {
        "type": SelectorType.ANY,
        "itemType": "Movie",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 1
      }, {
        "type": SelectorType.ANY,
        "itemType": "Person",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 2
      }, {
        "type": SelectorType.ANY,
        "itemType": "TheMatrix",
        "style": {
          "color": "#D4742C"
        },
        "index": 3
      }, {
        "type": SelectorType.ANY,
        "itemType": "TheMatrixReloaded",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 4
      }, {
        "type": SelectorType.ANY,
        "itemType": "TheMatrixRevolutions",
        "style": {
          "color": "#DBE345"
        },
        "index": 5
      }]);
      expect(styles.generateLegend([
        {
          "properties": {
            "title": "The Matrix",
            "released": 1999,
            "tagline": "Welcome to the Real World",
            "nodeNoIndexProp": "foo"
          },
          geo: {}, readAt: 0,
          "categories": ["Movie", "TheMatrix"]
      }, {
        "properties": {
            "born": 1964,
            "name": "Keanu Reeves"
          },
          geo: {}, readAt: 0,
          "categories": ["Person"]
      }])).to.eql({
        color: [{
          label: 'Movie', value: '#5FDAA2'
        }, {
          label: 'TheMatrix', value: '#D4742C'
        }, {
          label: 'Person', value: '#DE6FBC'
        }],
        icon: [],
        image: [],
        shape: [],
        size: []
      });
    });

    it('should return the right legend', () => {
      let styles = new StyleRules([
        {
          "index": 0,
          itemType: undefined,
          "type": SelectorType.ANY,
          "style": {
            "color": {
              "type": "auto",
              "input": ["categories"]
            } as StyleColor
          }
        }, {
          "index": 1,
          "itemType": "CITY",
          "type": SelectorType.IS,
          "input": ["properties", "aze{aze}"],
          "value": "treizz",
          "style": {
            "color": "#96b6fa"
          }
        }, {
          "index": 2,
          "itemType": "COMPANY",
          "type": SelectorType.ANY,
          "style": {
            "icon": {
              "font": "FontAwesome",
              "content": ""
            }
          }
        }, {
          "index": 3,
          "itemType": "CITY",
          "type": SelectorType.ANY,
          "style": {
            "size": "300%"
          }
        }]);
      expect(styles.generateLegend([
        {
        "geo": {},
        "properties": {
          "funding_total": "",
          "country": "france",
          "founded_month": "",
          "last_funding_at": "",
          "homepage_url": "",
          "long": 2.333333,
          "sddsq": "fdsfdsfd",
          "founded_year": "",
          "logo": "",
          "state": "",
          "first_funding_at": "",
          "lat": 48.866667,
          "logofix": "",
          "glagla": "chaud",
          "test": "52",
          "gris": "true",
          "url": "",
          "market": "",
          "funding_rounds": "",
          "fds": "fdsfdsf",
          "founded_quarter": "",
          "aze{aze}": "treizz",
          "name": "Paris",
          "founded_at": "",
          "category": "",
          "region": "",
          "permalink": "",
          "status": "",
          "trezz": "dsfdf"
        },
        "categories": ["CITY"],
        "statistics": {
          "supernode": false,
          "degree": 432
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 3384225,
          "country": "FRA",
          "founded_month": "2005-01",
          "last_funding_at": "01/04/2012",
          "homepage_url": "http://www.zyken.com",
          "url": "http://www.crunchbase.com/organization/zyken-nightcove",
          "market": " Hardware + Software ",
          "funding_rounds": 4,
          "founded_quarter": "2005-Q1",
          "founded_year": 2005,
          "name": "Zyken - NightCove",
          "logo": "http://www.crunchbase.com/organization/zyken-nightcove/primary-image/raw",
          "founded_at": "01/01/2005",
          "first_funding_at": "01/01/2005",
          "category": "|Design|Health and Wellness|Hardware + Software|",
          "region": "Paris",
          "permalink": "/organization/zyken-nightcove",
          "status": "acquired"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 4
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 2150110,
          "country": "FRANCE",
          "last_funding_at": "01/06/2008",
          "homepage_url": "http://www.zoomorama.com",
          "url": "http://www.crunchbase.com/organization/zoomorama",
          "market": " Curated Web ",
          "funding_rounds": 2,
          "name": "Zoomorama",
          "logo": "http://www.crunchbase.com/organization/zoomorama/primary-image/raw",
          "first_funding_at": "01/04/2007",
          "region": "Paris",
          "permalink": "/organization/zoomorama",
          "category": "|Curated Web|",
          "status": "closed"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 3
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "country": "FRA",
          "founded_month": "2013-03",
          "last_funding_at": "15/12/2012",
          "homepage_url": "http://www.zoemajeste.com",
          "url": "http://www.crunchbase.com/organization/zoe-majeste",
          "market": " E-Commerce ",
          "funding_rounds": 2,
          "founded_quarter": "2013-Q1",
          "founded_year": 2013,
          "name": "Zoe Majeste",
          "logo": "http://www.crunchbase.com/organization/zoe-majeste/primary-image/raw",
          "founded_at": "05/03/2013",
          "first_funding_at": "13/12/2012",
          "category": "|Jewelry|E-Commerce|",
          "region": "Paris",
          "permalink": "/organization/zoe-majeste",
          "status": "operating"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 4
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 4000000,
          "country": "FRA",
          "founded_month": "2005-11",
          "last_funding_at": "01/07/2007",
          "homepage_url": "http://zlio.com",
          "url": "http://www.crunchbase.com/organization/zlio",
          "market": " E-Commerce ",
          "funding_rounds": 1,
          "founded_quarter": "2005-Q4",
          "founded_year": 2005,
          "name": "Zlio",
          "logo": "http://www.crunchbase.com/organization/zlio/primary-image/raw",
          "founded_at": "01/11/2005",
          "first_funding_at": "01/07/2007",
          "category": "|E-Commerce|",
          "region": "Paris",
          "permalink": "/organization/zlio",
          "status": "closed"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 3
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 429564,
          "country": "FRA",
          "founded_month": "2012-01",
          "last_funding_at": "01/09/2013",
          "homepage_url": "http://www.zensoon.com",
          "url": "http://www.crunchbase.com/organization/zensoon",
          "funding_rounds": 1,
          "founded_quarter": "2012-Q1",
          "founded_year": 2012,
          "name": "ZenSoon",
          "logo": "http://www.crunchbase.com/organization/zensoon/primary-image/raw",
          "founded_at": "01/01/2012",
          "first_funding_at": "01/09/2013",
          "region": "Paris",
          "permalink": "/organization/zensoon",
          "status": "operating"
        },
        "categories": [],
        "statistics": {
          "supernode": false,
          "degree": 4
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 1000000,
          "country": "FRA",
          "founded_month": "2008-01",
          "last_funding_at": "01/01/2008",
          "homepage_url": "http://www.zefanclub.com",
          "url": "http://www.crunchbase.com/organization/zefanclub",
          "market": " Social Media ",
          "funding_rounds": 1,
          "founded_quarter": "2008-Q1",
          "founded_year": 2008,
          "name": "Zefanclub",
          "logo": "http://www.crunchbase.com/organization/zefanclub/primary-image/raw",
          "founded_at": "01/01/2008",
          "first_funding_at": "01/01/2008",
          "category": "|Social Media|",
          "region": "Paris",
          "permalink": "/organization/zefanclub",
          "status": "closed"
        },
        "categories": [],
        "statistics": {
          "supernode": false,
          "degree": 3
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 360000,
          "country": "FRA",
          "founded_month": "2010-02",
          "last_funding_at": "27/02/2013",
          "homepage_url": "http://zeenshare.com/index",
          "url": "http://www.crunchbase.com/organization/zeenshare",
          "market": " File Sharing ",
          "funding_rounds": 1,
          "founded_quarter": "2010-Q1",
          "founded_year": 2010,
          "name": "Zeenshare",
          "logo": "http://www.crunchbase.com/organization/zeenshare/primary-image/raw",
          "founded_at": "11/02/2010",
          "first_funding_at": "27/02/2013",
          "category": "|Collaboration|File Sharing|",
          "region": "Paris",
          "permalink": "/organization/zeenshare",
          "status": "operating"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 2
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 2592330,
          "country": "USA",
          "last_funding_at": "27/11/2012",
          "homepage_url": "http://youscribe.com",
          "url": "http://www.crunchbase.com/organization/youscribe",
          "market": " E-Commerce ",
          "funding_rounds": 1,
          "name": "YouScribe",
          "logo": "http://www.crunchbase.com/organization/youscribe/primary-image/raw",
          "first_funding_at": "27/11/2012",
          "region": "Paris",
          "permalink": "/organization/youscribe",
          "category": "|E-Commerce|",
          "status": "operating"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 6
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 410000,
          "country": "FRA",
          "founded_month": "2012-09",
          "last_funding_at": "01/01/2014",
          "homepage_url": "http://youmiam.com",
          "url": "http://www.crunchbase.com/organization/youmiam",
          "aze{zae}": "ezae",
          "market": " Social Media ",
          "funding_rounds": 1,
          "founded_quarter": "2012-Q3",
          "founded_year": 2012,
          "name": "Youmiam",
          "logo": "http://www.crunchbase.com/organization/youmiam/primary-image/raw",
          "founded_at": "03/09/2012",
          "first_funding_at": "01/01/2014",
          "category": "|Social Media|",
          "region": "Paris",
          "permalink": "/organization/youmiam",
          "status": "operating"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 6
        },
        "readAt": 1528894980291
      }, {
        "geo": {},
        "properties": {
          "funding_total": 1000000,
          "country": "FRA",
          "founded_month": "2011-03",
          "last_funding_at": "01/03/2011",
          "homepage_url": "http://www.youmag.com",
          "url": "http://www.crunchbase.com/organization/youmag",
          "market": " Curated Web ",
          "funding_rounds": 1,
          "founded_quarter": "2011-Q1",
          "founded_year": 2011,
          "name": "youmag",
          "logo": "http://www.crunchbase.com/organization/youmag/primary-image/raw",
          "founded_at": "03/03/2011",
          "first_funding_at": "01/03/2011",
          "category": "|Curated Web|News|",
          "region": "Paris",
          "permalink": "/organization/youmag",
          "status": "operating"
        },
        "categories": ["COMPANY"],
        "statistics": {
          "supernode": false,
          "degree": 3
        },
        "readAt": 1528894980291
      }])).to.eql({
        color: [{
          label: 'CITY', value: '#2ca02c'
        }, {
          label: 'COMPANY', value: '#2ca02c'
        }, {
          label: 'CITY.aze{aze} = treizz', value: '#96b6fa'
        }],
        icon: [{
          label: 'COMPANY',
          value: {
            content: '',
            font: 'FontAwesome'
          }
        }],
        image: [],
        shape: [],
        size: [{
          label: 'CITY',
          value: '300%'
        }]
      });
    });

    it('should return nothing', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'color' as StyleType,
        styles.color,
        [],
      )).to.eql([]);

      expect(StyleRules.getLegendForStyle(
        'color' as StyleType,
        styles.color,
        [{categories: ['COMPANY'], properties: {}, geo: {}, readAt: 0 }],
      )).to.eql([]);
    });

    it('should return `200%` for node:CITY', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {size: '200%'}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'size' as StyleType,
        styles.size,
        [{categories: ['CITY'], properties: {}, geo: {}, readAt: 0 }],
      )).to.eql([{label: 'CITY', value: '200%'}]);
    });

    it('should return nothing', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {size: '200%'}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'size' as StyleType,
        styles.size,
        [],
      )).to.eql([]);

      expect(StyleRules.getLegendForStyle(
        'size' as StyleType,
        styles.size,
        [{categories: ['COMPANY'], properties: {}, geo: {}, readAt: 0 }],
      )).to.eql([]);
    });

    it('should return the icon content for node:CITY', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {icon: {content: 'titi', font: 'arial'}}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'icon' as StyleType,
        styles.icon,
        [{categories: ['CITY'], properties: {}, geo: {}, readAt: 0 }],
      )).to.eql([{label: 'CITY', value: {content: 'titi', font: 'arial'}}]);
    });

    it('should return nothing', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {icon: {content: 'titi', font: 'arial'}}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'icon' as StyleType,
        styles.icon,
        [],
      )).to.eql([]);

      expect(StyleRules.getLegendForStyle(
        'icon' as StyleType,
        styles.icon,
        [{categories: ['COMPANY'], properties: {}, geo: {}, readAt: 0}],
      )).to.eql([]);
    });

    it('should return nothing for node:CITY color', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {size: '200%'}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'color' as StyleType.COLOR,
        styles.color,
        [{categories: ['CITY'], properties: {}, geo: {}, readAt: 0 }],
      )).to.eql([]);
    });

    it('should return nothing for node:CITY size', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'size' as StyleType.SIZE,
        styles.size,
        [{ categories: ['CITY'], properties: {}, geo : {}, readAt : 0 }],
      )).to.eql([]);
    });

    it('should return nothing for node:CITY icon', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'icon' as StyleType.ICON,
        styles.icon,
        [{categories: ['CITY'], properties: {}, geo: {}, readAt: 0 }],
      )).to.eql([]);
    });

    it('should return the right color of the palette for node:CITY', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: {
        input: ['categories'],
        ignoreCase: true,
        type: 'auto'
      }}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'color' as StyleType,
        styles.color,
        [{categories: ['CITY'], geo: {}, readAt: 0, properties: {} }],
      )).to.eql([{label: 'CITY', value: '#aec7e8'}]);
    });

    it('should return nothing', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: {
            input: ['categories'],
            ignoreCase: true,
            type: 'auto'
          }}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'color' as StyleType,
        styles.color,
        [],
      )).to.eql([]);
    });

    it('should return the right color of the palette for node:CITY with name `Paris`', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: {
        input: ['properties', 'name'],
        ignoreCase: true,
        type: 'auto'
      }}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'color' as StyleType,
        styles.color,
        [{categories: ['CITY'], properties: {name: 'Paris'}, readAt: 0, geo: {} }],
      )).to.eql([{label: 'CITY.name = Paris', value: '#c49c94'}]);
    });

    it('should return nothing', () => {
      let styles = new StyleRules([{type: SelectorType.ANY, itemType: 'CITY', style: {color: {
            input: ['properties', 'name'],
            ignoreCase: true,
            type: 'auto'
          }}, index: 0}]);
      expect(StyleRules.getLegendForStyle(
        'color' as StyleType,
        styles.color,
        [],
      )).to.eql([]);

      expect(StyleRules.getLegendForStyle(
          'color' as StyleType,
        styles.color,
        [{categories: ['COMPANY'], properties: {name: 'Paris'}, geo: {}, readAt: 0 }],
      )).to.eql([]);
    });
  });

  describe('getTypeLabel()', () => {
    it('should return `All`', () => {
      expect(StyleRules.getTypeLabel(undefined)).to.equal('All');
    });

    it('should return `Others`', () => {
      expect(StyleRules.getTypeLabel(null)).to.equal('Others');
    });

    it('should return the type', () => {
      expect(StyleRules.getTypeLabel('test')).to.equal('test');
    });
  });

  describe('updateLegend()', () => {
    it('should add an item to legend', () => {
      let legend = [];
      StyleRules.updateLegend(legend, {label: 'top', value: 'test'});
      expect(legend).to.eql([{label: 'top', value: 'test'}]);
      StyleRules.updateLegend(legend, {label: 'tip', value: 'gnarf'});
      expect(legend).to.eql([{label: 'top', value: 'test'}, {label: 'tip', value: 'gnarf'}]);
    });

    it('should update an item to legend', () => {
      let legend = [{label: 'top', value: 'tip'}];
      StyleRules.updateLegend(legend, {label: 'top', value: 'test'});
      expect(legend).to.eql([{label: 'top', value: 'test'}]);
    });
  });

  describe('getBy()', () => {
    it('should return an array of color rules', () => {
      expect(StyleRules.getBy(
        'color' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}, {type: SelectorType.ANY, itemType: 'CITY', style: {size: '100%'}, index: 1}]
      ).length).to.equal(1);
      expect(StyleRules.getBy(
          'color' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}, {type: SelectorType.ANY, itemType: 'CITY', style: {size: '100%'}, index: 1}]
      )[0].index).to.equal(0);
      expect(StyleRules.getBy(
          'color' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {size: '100%'}, index: 1}]
      ).length).to.equal(0);
    });

    it('should return an array of size rules', () => {
      expect(StyleRules.getBy(
          'size' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}, {type: SelectorType.ANY, itemType: 'CITY', style: {size: '100%'}, index: 1}]
      ).length).to.equal(1);
      expect(StyleRules.getBy(
          'size' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}, {type: SelectorType.ANY, itemType: 'CITY', style: {size: '100%'}, index: 1}]
      )[0].index).to.equal(1);
      expect(StyleRules.getBy(
          'size' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 1}]
      ).length).to.equal(0);
    });

    it('should return an array of icon rules', () => {
      expect(StyleRules.getBy(
          'icon' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}, {type: SelectorType.ANY, itemType: 'CITY', style: {icon: {content: 'titi', font: 'arial'}}, index: 1}]
      ).length).to.equal(1);
      expect(StyleRules.getBy(
          'icon' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 0}, {type: SelectorType.ANY, itemType: 'CITY', style: {icon: {content: 'titi', font: 'arial'}}, index: 1}]
      )[0].index).to.equal(1);
      expect(StyleRules.getBy(
          'icon' as StyleType,
        [{type: SelectorType.ANY, itemType: 'CITY', style: {color: 'red'}, index: 1}]
      ).length).to.equal(0);
    });
  });

  describe('getRule()', () => {
    it('should return a color rule', () => {
      expect(StyleRules.getRule({
        type: SelectorType.ANY,
        itemType: 'CITY',
        style: {
          color: 'red',
          icon: {
            content: 'titi',
            font: 'arial'
          },
          size: '200%',
          shape: OgmaNodeShape.SQUARE
        },
        index: 0
      }, 'color' as StyleType).style).to.eql({color: 'red'});
    });

    it('should return a icon rule', () => {
      expect(StyleRules.getRule({
        type: SelectorType.ANY,
        itemType: 'CITY',
        style: {
          color: 'red',
          icon: {
            content: 'titi',
            font: 'arial'
          },
          size: '200%',
          shape: OgmaNodeShape.SQUARE
        },
        index: 0
      }, 'icon' as StyleType).style).to.eql({icon: {content: 'titi', font: 'arial'}});
    });

    it('should return a size rule', () => {
      expect(StyleRules.getRule({
        type: SelectorType.ANY,
        itemType: 'CITY',
        style: {
          color: 'red',
          icon: {
            content: 'titi',
            font: 'arial'
          },
          size: '200%',
          shape: OgmaNodeShape.SQUARE
        },
        index: 0
      }, 'size' as StyleType).style).to.eql({size: '200%'});
    });

    it('should return a shape rule', () => {
      expect(StyleRules.getRule({
        type: SelectorType.ANY,
        itemType: 'CITY',
        style: {
          color: 'red',
          icon: {
            content: 'titi',
            font: 'arial'
          },
          size: '200%',
          shape: OgmaNodeShape.SQUARE
        },
        index: 0
      }, 'shape' as StyleType).style).to.eql({shape: 'square'});
    });
  });

  describe('sanitizeValue', () => {
    it('should return "= undefined"', () => {
      expect(StyleRules.sanitizeValue(SelectorType.NO_VALUE, undefined)).to.equal('is undefined');
      expect(StyleRules.sanitizeValue(SelectorType.NO_VALUE, null)).to.equal('is undefined');
      expect(StyleRules.sanitizeValue(SelectorType.NO_VALUE, 0)).to.equal('is undefined');
      expect(StyleRules.sanitizeValue(SelectorType.NO_VALUE, 'trololo')).to.equal('is undefined');
    });

    it('should return "= not an number"', () => {
      expect(StyleRules.sanitizeValue(SelectorType.NAN, undefined)).to.equal('is not an number');
      expect(StyleRules.sanitizeValue(SelectorType.NAN, null)).to.equal('is not an number');
      expect(StyleRules.sanitizeValue(SelectorType.NAN, 0)).to.equal('is not an number');
      expect(StyleRules.sanitizeValue(SelectorType.NAN, 'trololo')).to.equal('is not an number');
    });

    it('should return "= {{value}}"', () => {
      expect(StyleRules.sanitizeValue(SelectorType.IS, undefined)).to.equal('= undefined');
      expect(StyleRules.sanitizeValue(SelectorType.IS, null)).to.equal('= null');
      expect(StyleRules.sanitizeValue(SelectorType.IS, [1, 2])).to.equal('= [1,2]');
      expect(StyleRules.sanitizeValue(SelectorType.IS, {tro: 'tra'})).to.equal('= {"tro":"tra"}');
      expect(StyleRules.sanitizeValue(SelectorType.IS, 'tretr')).to.equal('= tretr');
      expect(StyleRules.sanitizeValue(SelectorType.IS, 45)).to.equal('= 45');
      expect(StyleRules.sanitizeValue(SelectorType.ANY, undefined)).to.equal('= undefined');
      expect(StyleRules.sanitizeValue(SelectorType.ANY, null)).to.equal('= null');
      expect(StyleRules.sanitizeValue(SelectorType.ANY, [1, 2])).to.equal('= [1,2]');
      expect(StyleRules.sanitizeValue(SelectorType.ANY, {tro: 'tra'})).to.equal('= {"tro":"tra"}');
      expect(StyleRules.sanitizeValue(SelectorType.ANY, 'tretr')).to.equal('= tretr');
      expect(StyleRules.sanitizeValue(SelectorType.ANY, 45)).to.equal('= 45');
    });

    it('should return "= {{range}}"', () => {
      expect(StyleRules.sanitizeValue(SelectorType.RANGE, {'<': 5})).to.equal('< 5');
      expect(StyleRules.sanitizeValue(SelectorType.RANGE, {'<': 5, '>': 57})).to.equal('< 5 and > 57');
    });
  })
});
