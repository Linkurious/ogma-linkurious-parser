/* eslint-disable @typescript-eslint/camelcase */
'use strict';

import {expect} from 'chai';
import 'mocha';
import Ogma, {Node} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData, SelectorType} from '@linkurious/rest-client';

import {NodeAttributes, StyleRule, StyleRules} from '../../src';

const widgetNode_1_category = {
  id: 2,
  data: {categories: ['CITY'], properties: {name: 'Paris'}, readAt: 0, geo: {}}
};
const widgetNode_2_category = {
  id: 1,
  data: {categories: ['CITY', 'TRANSACTION'], properties: {name: 'Lyon'}, readAt: 0, geo: {}}
};

let node_1_category: Node<LkNodeData, LkEdgeData>, node_2_category: Node<LkNodeData, LkEdgeData>;

describe('NodeAttributes', function () {
  let ogma: Ogma;
  beforeEach(() => {
    ogma = new Ogma();
    ogma.addNodes([
      {id: 2, data: {categories: ['CITY'], properties: {name: 'Paris'}}},
      {id: 1, data: {categories: ['CITY', 'TRANSACTION'], properties: {name: 'Lyon'}}}
    ]);
    node_1_category = ogma.getNode(2) as Node<LkNodeData, LkEdgeData>;
    node_2_category = ogma.getNode(1) as Node<LkNodeData, LkEdgeData>;
  });
  afterEach(() => {
    ogma.destroy();
  });
  describe('NodeAttributes.color', () => {
    it('should return an autocolor for 1 category', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {color: {type: 'auto', input: ['categories']}}
            }
          ])
        ).color(widgetNode_1_category.data)
      ).to.equal('#2ca02c');

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {color: {type: 'auto', input: ['categories']}}
            }
          ])
        ).color(node_1_category.getData())
      ).to.equal('#2ca02c');
    });

    it('should return 2 autocolor for 2 category', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {color: {type: 'auto', input: ['categories']}}
            }
          ])
        ).color(widgetNode_2_category.data)
      ).to.eql(['#2ca02c', '#17becf']);

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {color: {type: 'auto', input: ['categories']}}
            }
          ])
        ).color(node_2_category.getData())
      ).to.eql(['#2ca02c', '#17becf']);
    });

    it('should return an autocolor for a property', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {color: {type: 'auto', input: ['properties', 'name']}}
            }
          ])
        ).color(widgetNode_1_category.data)
      ).to.equal('#bcbd22');

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {color: {type: 'auto', input: ['properties', 'name']}}
            }
          ])
        ).color(node_1_category.getData())
      ).to.equal('#bcbd22');
    });

    it('should return a color', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'red'}
            }
          ])
        ).color(widgetNode_1_category.data)
      ).to.equal('red');

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'red'}
            }
          ])
        ).color(node_1_category.getData())
      ).to.equal('red');
    });

    it('should return a color for a property', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'CITY',
              input: ['properties', 'name'],
              value: 'Paris',
              style: {color: 'green'}
            }
          ])
        ).color(widgetNode_1_category.data)
      ).to.equal('green');

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'CITY',
              input: ['properties', 'name'],
              value: 'Paris',
              style: {color: 'green'}
            }
          ])
        ).color(node_1_category.getData())
      ).to.equal('green');
    });

    it('should return grey for a property', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'CITY',
              input: ['properties', 'name'],
              value: 'Paris',
              style: {color: 'green'}
            }
          ])
        ).color(widgetNode_2_category.data)
      ).to.equal('#7f7f7f');

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.IS,
              itemType: 'CITY',
              input: ['properties', 'name'],
              value: 'Paris',
              style: {color: 'green'}
            }
          ])
        ).color(node_2_category.getData())
      ).to.equal('#7f7f7f');
    });

    it('should return 2 colors', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'red'}
            },
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'TRANSACTION',
              input: undefined,
              style: {color: 'green'}
            }
          ])
        ).color(widgetNode_2_category.data)
      ).to.eql(['red', 'green']);

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'red'}
            },
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'TRANSACTION',
              input: undefined,
              style: {color: 'green'}
            }
          ])
        ).color(node_2_category.getData())
      ).to.eql(['red', 'green']);
    });

    it('should return the right color', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {
                // @ts-ignore
                color: {
                  type: 'auto',
                  input: ['categories']
                }
              }
            },
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'green'}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: undefined,
              input: ['properties', 'name'],
              value: 'Dijon',
              style: {color: 'red'}
            }
          ])
        ).color(widgetNode_1_category.data)
      ).to.equal('green');

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {
                color: {
                  type: 'auto',
                  input: ['categories']
                }
              }
            },
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'green'}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: undefined,
              input: ['properties', 'name'],
              value: 'Dijon',
              style: {color: 'red'}
            }
          ])
        ).color(widgetNode_2_category.data)
      ).to.eql(['green', '#17becf']);
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {
                // @ts-ignore
                color: {
                  type: 'auto',
                  input: ['categories']
                }
              }
            },
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'green'}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: undefined,
              input: ['properties', 'name'],
              value: 'Dijon',
              style: {color: 'red'}
            }
          ])
        ).color(node_1_category.getData())
      ).to.equal('green');

      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {
                // @ts-ignore
                color: {
                  type: 'auto',
                  input: ['categories']
                }
              }
            },
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {color: 'green'}
            },
            {
              index: 0,
              type: SelectorType.IS,
              itemType: undefined,
              input: ['properties', 'name'],
              value: 'Dijon',
              style: {color: 'red'}
            }
          ])
        ).color(node_2_category.getData())
      ).to.eql(['green', '#17becf']);
    });
  });

  describe('NodeAttributes.icon', () => {
    it('should return an icon for 1 category', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {icon: {content: 'L', font: 'arial'}}
            }
          ])
        ).icon(node_1_category.getData())
      ).to.eql({
        icon: {
          content: 'L',
          font: 'arial',
          scale: 0.5,
          color: '#FFFFFF'
        }
      });
    });

    it('should return an image for 1 category', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: undefined,
              input: undefined,
              style: {image: {url: 'http://mario.jpg', scale: 1, fit: false, tile: false}}
            }
          ])
        ).icon(node_1_category.getData())
      ).to.eql({
        image: {
          url: 'http://mario.jpg',
          scale: 1,
          fit: false,
          tile: false,
          minVisibleSize: 0
        }
      });
    });

    it('should return an image for 1 property', () => {
      expect(
        new NodeAttributes(
          new StyleRules([
            {
              index: 0,
              type: SelectorType.ANY,
              itemType: 'CITY',
              input: undefined,
              style: {icon: {content: 'L', font: 'arial'}}
            },
            {
              index: 1,
              type: SelectorType.IS,
              itemType: 'CITY',
              input: ['properties', 'name'],
              value: 'Paris',
              style: {image: {url: 'http://mario.jpg', scale: 1, fit: false, tile: false}}
            }
          ])
        ).icon(node_1_category.getData())
      ).to.eql({
        image: {
          url: 'http://mario.jpg',
          scale: 1,
          fit: false,
          tile: false,
          minVisibleSize: 0
        }
      });
    });
  });
  /*describe('Performances on styles attribution', () => {
    let rules = [
      {
        "type": "any",
        "style": {
          "color": {
            "type": "auto",
            "input": ["properties", "category"]
          }
        },
        "index": 0
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 2
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 3
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 4
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#82e8b0"
        },
        "index": 5
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 6
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 7
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 8
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 9
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 10
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 11
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 12
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 13
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 14
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 15
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 16
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 17
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#5FDAA2"
        },
        "index": 18
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 19
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 20
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 21
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 22
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 23
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 24
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 25
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 26
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 27
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 28
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 29
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 30
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 31
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 32
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 33
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 34
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 35
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Information Services|Enterprise 2.0|Social Bookmarking|Social Media|",
        "style": {
          "color": "#E39084"
        },
        "index": 36
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 37
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 38
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 39
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 40
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 41
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 42
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 43
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 44
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 45
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 46
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 47
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 48
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 49
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 50
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 51
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 52
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 53
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Internet|Finance|Venture Capital|",
        "style": {
          "color": "#816B9F"
        },
        "index": 54
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 55
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 56
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 57
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 58
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 59
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 60
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 61
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 62
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 63
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 64
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 65
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 66
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 67
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 68
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 69
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 70
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 71
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
        "style": {
          "color": "#DDB5D0"
        },
        "index": 72
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 73
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 74
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 75
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 76
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 77
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 78
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 79
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 80
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 81
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 82
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 83
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 84
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 85
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 86
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 87
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 88
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 89
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Virtual Worlds|Games|",
        "style": {
          "color": "#D95B4B"
        },
        "index": 90
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 91
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 92
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 93
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 94
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 95
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 96
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 97
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 98
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 99
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 100
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 101
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 102
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 103
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 104
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 105
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 106
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 107
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Venture Capital|Finance|Entrepreneur|Startups|Crowdsourcing|Crowdfunding|Enterprise Software|",
        "style": {
          "color": "#92E13E"
        },
        "index": 108
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 109
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 110
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 111
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 112
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 113
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 114
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 115
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 116
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 117
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 118
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 119
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 120
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 121
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 122
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 123
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 124
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 125
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Startups|Services|Curated Web|",
        "style": {
          "color": "#508A7A"
        },
        "index": 126
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 127
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 128
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 129
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 130
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 131
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 132
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 133
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 134
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 135
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 136
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 137
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 138
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 139
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 140
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 141
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 142
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 143
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Jewelry|E-Commerce|",
        "style": {
          "color": "#DEDA83"
        },
        "index": 144
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 145
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 146
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 147
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 148
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 149
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 150
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 151
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 152
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 153
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 154
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 155
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 156
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 157
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 158
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 159
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 160
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 161
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Social Media|",
        "style": {
          "color": "#8294E9"
        },
        "index": 162
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 163
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 164
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 165
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 166
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 167
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 168
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 169
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 170
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 171
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 172
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 173
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 174
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 175
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 176
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 177
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 178
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 179
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Collaboration|File Sharing|",
        "style": {
          "color": "#DE6FBC"
        },
        "index": 180
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 181
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 182
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 183
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 184
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 185
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 186
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 187
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 188
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 189
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 190
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 191
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 192
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 193
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 194
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 195
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 196
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 197
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Curated Web|",
        "style": {
          "color": "#4EA4D4"
        },
        "index": 198
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 199
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 200
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 201
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 202
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 203
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 204
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 205
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 206
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 207
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 208
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 209
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 210
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 211
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 212
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 213
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 214
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 215
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Credit Cards|SMS|Mobile|",
        "style": {
          "color": "#D4742C"
        },
        "index": 216
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 217
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 218
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 219
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 220
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 221
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 222
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 223
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 224
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 225
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 226
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 227
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 228
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 229
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 230
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 231
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 232
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 233
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Media|Fashion|Social Media|",
        "style": {
          "color": "#897121"
        },
        "index": 234
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 235
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 236
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 237
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 238
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 239
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 240
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 241
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 242
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 243
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 244
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 245
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 246
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 247
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 248
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 249
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 250
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 251
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Design|Health and Wellness|Hardware + Software|",
        "style": {
          "color": "#807757"
        },
        "index": 252
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 253
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 254
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 255
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 256
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 257
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 258
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 259
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 260
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 261
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 262
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 263
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 264
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 265
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 266
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 267
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 268
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 269
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Curated Web|News|",
        "style": {
          "color": "#DBE345"
        },
        "index": 270
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 271
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 272
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 273
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 274
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 275
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 276
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 277
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 278
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 279
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 280
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 281
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 282
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 283
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 284
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 285
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 286
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 287
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Digital Media|Services|Information Technology|",
        "style": {
          "color": "#C9DCD0"
        },
        "index": 288
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 289
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 290
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 291
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 292
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 293
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 294
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 295
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 296
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 297
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 298
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 299
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 300
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 301
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 302
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 303
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 304
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 305
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|E-Commerce|",
        "style": {
          "color": "#5BA943"
        },
        "index": 306
      }, {
        "type": "is",
        "itemType": "CITY",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 307
      }, {
        "type": "is",
        "itemType": "MARKET",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 308
      }, {
        "type": "is",
        "itemType": "ma",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 309
      }, {
        "type": "is",
        "itemType": "COMPANY",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 310
      }, {
        "type": "is",
        "itemType": "INVESTOR",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 311
      }, {
        "type": "is",
        "itemType": "COMPANY_DE_QUALITÉ_FRANCAISE",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 312
      }, {
        "type": "is",
        "itemType": "FRENCH_SPOKEN",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 313
      }, {
        "type": "is",
        "itemType": "test",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 314
      }, {
        "type": "is",
        "itemType": "fds",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 315
      }, {
        "type": "is",
        "itemType": "dsqdq",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 316
      }, {
        "type": "is",
        "itemType": "ds",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 317
      }, {
        "type": "is",
        "itemType": "sdqfghjk",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 318
      }, {
        "type": "is",
        "itemType": "dqd",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 319
      }, {
        "type": "is",
        "itemType": "dsqf",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 320
      }, {
        "type": "is",
        "itemType": "dsqdsqds",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 321
      }, {
        "type": "is",
        "itemType": "dsqdsqdsqd",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 322
      }, {
        "type": "is",
        "itemType": "TARGET",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 323
      }, {
        "type": "is",
        "itemType": "TEST",
        "input": ["properties", "category"],
        "value": "|Semantic Search|Search|",
        "style": {
          "color": "#D85573"
        },
        "index": 324
      }, {
        "type": "any",
        "itemType": "INVESTOR",
        "style": {
          "icon": {
            "font": "FontAwesome",
            "scale": 1,
            "color": "#fff",
            "content": ""
          }
        },
        "index": 325
      }, {
        "type": "any",
        "itemType": "CITY",
        "style": {
          "icon": {
            "font": "FontAwesome",
            "scale": 1,
            "color": "#fff",
            "content": ""
          },
          "color": "#E17C05"
        },
        "index": 326
      }, {
        "type": "any",
        "itemType": "COMPANY",
        "style": {
          "icon": {
            "font": "FontAwesome",
            "scale": 1,
            "color": "#fff",
            "content": ""
          }
        },
        "index": 327
      }, {
        "type": "any",
        "itemType": "MARKET",
        "style": {
          "icon": {
            "font": "FontAwesome",
            "scale": 1,
            "color": "#fff",
            "content": ""
          }
        },
        "index": 328
      }, {
        "index": 329,
        "itemType": "CITY",
        "type": "is",
        "input": ["properties", "category"],
        "value": "",
        "style": {
          "color": "#82e8b0"
        }
      }];
    let nodeAttribute = new NodeAttributes(new StyleRules(rules));

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "0",
        "data": {
          "nodelink": {
            "x": -83.28229522705078,
            "y": -40.7389030456543,
            "fixed": false
          },
          "geo": {
            "latitude": 48.866667,
            "longitude": 2.333333,
            "latitudeDiff": 0,
            "longitudeDiff": 0
          },
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
          "categories": ["CITY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 432
          },
          "readAt": 1530274504713
        }
      }, palettes);
      done();
    }).timeout(1.5);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "0",
        "data": {
          "nodelink": {
            "x": -83.28229522705078,
            "y": -40.7389030456543,
            "fixed": false
          },
          "geo": {
            "latitude": 48.866667,
            "longitude": 2.333333,
            "latitudeDiff": 0,
            "longitudeDiff": 0
          },
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
          "categories": ["CITY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 432
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "0",
        "data": {
          "nodelink": {
            "x": -83.28229522705078,
            "y": -40.7389030456543,
            "fixed": false
          },
          "geo": {
            "latitude": 48.866667,
            "longitude": 2.333333,
            "latitudeDiff": 0,
            "longitudeDiff": 0
          },
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
          "categories": ["CITY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 432
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "0",
        "data": {
          "nodelink": {
            "x": -83.28229522705078,
            "y": -40.7389030456543,
            "fixed": false
          },
          "geo": {
            "latitude": 48.866667,
            "longitude": 2.333333,
            "latitudeDiff": 0,
            "longitudeDiff": 0
          },
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
          "categories": ["CITY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 432
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "1195",
        "data": {
          "nodelink": {
            "x": 526.6683349609375,
            "y": -210.2328643798828,
            "fixed": false
          },
          "geo": {},
          "categories": [],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
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
          }
        },
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "1195",
        "data": {
          "nodelink": {
            "x": 526.6683349609375,
            "y": -210.2328643798828,
            "fixed": false
          },
          "geo": {},
          "categories": [],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
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
          }
        },
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "1195",
        "data": {
          "nodelink": {
            "x": 526.6683349609375,
            "y": -210.2328643798828,
            "fixed": false
          },
          "geo": {},
          "categories": [],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
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
          }
        },
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "1195",
        "data": {
          "nodelink": {
            "x": 526.6683349609375,
            "y": -210.2328643798828,
            "fixed": false
          },
          "geo": {},
          "categories": [],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
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
          }
        },
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "1156",

        "data": {
          "nodelink": {
            "x": 208.53456115722656,
            "y": -53.037357330322266,
            "fixed": false
          },
          "geo": {},
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
          "properties": {
            "funding_total": 8775600,
            "country": "FRA",
            "founded_month": "2005-01",
            "last_funding_at": "14/02/2008",
            "homepage_url": "http://www.wengo.fr",
            "url": "http://www.crunchbase.com/organization/wengo",
            "market": " Messaging ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "Wengo",
            "logo": "http://www.crunchbase.com/organization/wengo/primary-image/raw",
            "founded_at": "01/01/2005",
            "first_funding_at": "14/02/2008",
            "category": "|Messaging|",
            "region": "Paris",
            "permalink": "/organization/wengo",
            "status": "operating"
          }

        }
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "1156",

        "data": {
          "nodelink": {
            "x": 208.53456115722656,
            "y": -53.037357330322266,
            "fixed": false
          },
          "geo": {},
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
          "properties": {
            "funding_total": 8775600,
            "country": "FRA",
            "founded_month": "2005-01",
            "last_funding_at": "14/02/2008",
            "homepage_url": "http://www.wengo.fr",
            "url": "http://www.crunchbase.com/organization/wengo",
            "market": " Messaging ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "Wengo",
            "logo": "http://www.crunchbase.com/organization/wengo/primary-image/raw",
            "founded_at": "01/01/2005",
            "first_funding_at": "14/02/2008",
            "category": "|Messaging|",
            "region": "Paris",
            "permalink": "/organization/wengo",
            "status": "operating"
          }

        }
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "1156",

        "data": {
          "nodelink": {
            "x": 208.53456115722656,
            "y": -53.037357330322266,
            "fixed": false
          },
          "geo": {},
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
          "properties": {
            "funding_total": 8775600,
            "country": "FRA",
            "founded_month": "2005-01",
            "last_funding_at": "14/02/2008",
            "homepage_url": "http://www.wengo.fr",
            "url": "http://www.crunchbase.com/organization/wengo",
            "market": " Messaging ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "Wengo",
            "logo": "http://www.crunchbase.com/organization/wengo/primary-image/raw",
            "founded_at": "01/01/2005",
            "first_funding_at": "14/02/2008",
            "category": "|Messaging|",
            "region": "Paris",
            "permalink": "/organization/wengo",
            "status": "operating"
          }

        }
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "1156",

        "data": {
          "nodelink": {
            "x": 208.53456115722656,
            "y": -53.037357330322266,
            "fixed": false
          },
          "geo": {},
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713,
          "properties": {
            "funding_total": 8775600,
            "country": "FRA",
            "founded_month": "2005-01",
            "last_funding_at": "14/02/2008",
            "homepage_url": "http://www.wengo.fr",
            "url": "http://www.crunchbase.com/organization/wengo",
            "market": " Messaging ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "Wengo",
            "logo": "http://www.crunchbase.com/organization/wengo/primary-image/raw",
            "founded_at": "01/01/2005",
            "first_funding_at": "14/02/2008",
            "category": "|Messaging|",
            "region": "Paris",
            "permalink": "/organization/wengo",
            "status": "operating"
          }

        }
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "1113",
        "data": {
          "nodelink": {
            "x": 424.6107177734375,
            "y": -167.36251831054688,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "funding_total": 1750000,
            "country": "FRA",
            "last_funding_at": "15/05/2008",
            "homepage_url": "http://www.uniteam.fr",
            "url": "http://www.crunchbase.com/organization/uniteam-communication",
            "market": " Social Media ",
            "funding_rounds": 1,
            "name": "Uniteam Communication",
            "logo": "http://www.crunchbase.com/organization/uniteam-communication/primary-image/raw",
            "first_funding_at": "15/05/2008",
            "region": "Paris",
            "permalink": "/organization/uniteam-communication",
            "category": "|Social Media|",
            "status": "operating"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713
        }
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "1113",
        "data": {
          "nodelink": {
            "x": 424.6107177734375,
            "y": -167.36251831054688,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "funding_total": 1750000,
            "country": "FRA",
            "last_funding_at": "15/05/2008",
            "homepage_url": "http://www.uniteam.fr",
            "url": "http://www.crunchbase.com/organization/uniteam-communication",
            "market": " Social Media ",
            "funding_rounds": 1,
            "name": "Uniteam Communication",
            "logo": "http://www.crunchbase.com/organization/uniteam-communication/primary-image/raw",
            "first_funding_at": "15/05/2008",
            "region": "Paris",
            "permalink": "/organization/uniteam-communication",
            "category": "|Social Media|",
            "status": "operating"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "1113",
        "data": {
          "nodelink": {
            "x": 424.6107177734375,
            "y": -167.36251831054688,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "funding_total": 1750000,
            "country": "FRA",
            "last_funding_at": "15/05/2008",
            "homepage_url": "http://www.uniteam.fr",
            "url": "http://www.crunchbase.com/organization/uniteam-communication",
            "market": " Social Media ",
            "funding_rounds": 1,
            "name": "Uniteam Communication",
            "logo": "http://www.crunchbase.com/organization/uniteam-communication/primary-image/raw",
            "first_funding_at": "15/05/2008",
            "region": "Paris",
            "permalink": "/organization/uniteam-communication",
            "category": "|Social Media|",
            "status": "operating"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "1113",
        "data": {
          "nodelink": {
            "x": 424.6107177734375,
            "y": -167.36251831054688,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "funding_total": 1750000,
            "country": "FRA",
            "last_funding_at": "15/05/2008",
            "homepage_url": "http://www.uniteam.fr",
            "url": "http://www.crunchbase.com/organization/uniteam-communication",
            "market": " Social Media ",
            "funding_rounds": 1,
            "name": "Uniteam Communication",
            "logo": "http://www.crunchbase.com/organization/uniteam-communication/primary-image/raw",
            "first_funding_at": "15/05/2008",
            "region": "Paris",
            "permalink": "/organization/uniteam-communication",
            "category": "|Social Media|",
            "status": "operating"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 3
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "548",
        "data": {
          "nodelink": {
            "x": -479.5605163574219,
            "y": 28.442773818969727,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397189333/f576ab495473388b680a324c3042abcc.png",
            "funding_total": 3500000,
            "country": "FRA",
            "founded_month": "2005-03",
            "last_funding_at": "16/03/2011",
            "homepage_url": "http://www.entropysoft.net",
            "url": "http://www.crunchbase.com/organization/entropysoft",
            "market": " Synchronization ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "EntropySoft",
            "logo": "http://www.crunchbase.com/organization/entropysoft/primary-image/raw",
            "founded_at": "01/03/2005",
            "first_funding_at": "16/03/2011",
            "category": "|Web CMS|Enterprises|Cloud Computing|Synchronization|Data Integration|Software|",
            "region": "Paris",
            "permalink": "/organization/entropysoft",
            "status": "acquired"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 4
          },
          "readAt": 1530274504713
        },
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "548",
        "data": {
          "nodelink": {
            "x": -479.5605163574219,
            "y": 28.442773818969727,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397189333/f576ab495473388b680a324c3042abcc.png",
            "funding_total": 3500000,
            "country": "FRA",
            "founded_month": "2005-03",
            "last_funding_at": "16/03/2011",
            "homepage_url": "http://www.entropysoft.net",
            "url": "http://www.crunchbase.com/organization/entropysoft",
            "market": " Synchronization ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "EntropySoft",
            "logo": "http://www.crunchbase.com/organization/entropysoft/primary-image/raw",
            "founded_at": "01/03/2005",
            "first_funding_at": "16/03/2011",
            "category": "|Web CMS|Enterprises|Cloud Computing|Synchronization|Data Integration|Software|",
            "region": "Paris",
            "permalink": "/organization/entropysoft",
            "status": "acquired"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 4
          },
          "readAt": 1530274504713
        },
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "548",
        "data": {
          "nodelink": {
            "x": -479.5605163574219,
            "y": 28.442773818969727,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397189333/f576ab495473388b680a324c3042abcc.png",
            "funding_total": 3500000,
            "country": "FRA",
            "founded_month": "2005-03",
            "last_funding_at": "16/03/2011",
            "homepage_url": "http://www.entropysoft.net",
            "url": "http://www.crunchbase.com/organization/entropysoft",
            "market": " Synchronization ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "EntropySoft",
            "logo": "http://www.crunchbase.com/organization/entropysoft/primary-image/raw",
            "founded_at": "01/03/2005",
            "first_funding_at": "16/03/2011",
            "category": "|Web CMS|Enterprises|Cloud Computing|Synchronization|Data Integration|Software|",
            "region": "Paris",
            "permalink": "/organization/entropysoft",
            "status": "acquired"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 4
          },
          "readAt": 1530274504713
        },
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "548",
        "data": {
          "nodelink": {
            "x": -479.5605163574219,
            "y": 28.442773818969727,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397189333/f576ab495473388b680a324c3042abcc.png",
            "funding_total": 3500000,
            "country": "FRA",
            "founded_month": "2005-03",
            "last_funding_at": "16/03/2011",
            "homepage_url": "http://www.entropysoft.net",
            "url": "http://www.crunchbase.com/organization/entropysoft",
            "market": " Synchronization ",
            "funding_rounds": 1,
            "founded_quarter": "2005-Q1",
            "founded_year": 2005,
            "name": "EntropySoft",
            "logo": "http://www.crunchbase.com/organization/entropysoft/primary-image/raw",
            "founded_at": "01/03/2005",
            "first_funding_at": "16/03/2011",
            "category": "|Web CMS|Enterprises|Cloud Computing|Synchronization|Data Integration|Software|",
            "region": "Paris",
            "permalink": "/organization/entropysoft",
            "status": "acquired"
          },
          "categories": ["COMPANY"],
          "statistics": {
            "supernode": false,
            "degree": 4
          },
          "readAt": 1530274504713
        },
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "1669",
        "data": {
          "nodelink": {
            "x": -435.77752685546875,
            "y": 529.5459594726562,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": "Inventures SA",
            "country": "BEL",
            "region": "BEL - Other",
            "permalink": "/organization/inventures-sa",
            "city": "Bierges",
            "url": "http://www.crunchbase.com/organization/inventures-sa"
          },
          "categories": ["INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 1
          },
          "readAt": 1530274504713
        }
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "1669",
        "data": {
          "nodelink": {
            "x": -435.77752685546875,
            "y": 529.5459594726562,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": "Inventures SA",
            "country": "BEL",
            "region": "BEL - Other",
            "permalink": "/organization/inventures-sa",
            "city": "Bierges",
            "url": "http://www.crunchbase.com/organization/inventures-sa"
          },
          "categories": ["INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 1
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "1669",
        "data": {
          "nodelink": {
            "x": -435.77752685546875,
            "y": 529.5459594726562,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": "Inventures SA",
            "country": "BEL",
            "region": "BEL - Other",
            "permalink": "/organization/inventures-sa",
            "city": "Bierges",
            "url": "http://www.crunchbase.com/organization/inventures-sa"
          },
          "categories": ["INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 1
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "1669",
        "data": {
          "nodelink": {
            "x": -435.77752685546875,
            "y": 529.5459594726562,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": "Inventures SA",
            "country": "BEL",
            "region": "BEL - Other",
            "permalink": "/organization/inventures-sa",
            "city": "Bierges",
            "url": "http://www.crunchbase.com/organization/inventures-sa"
          },
          "categories": ["INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 1
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "810",
        "data": {
          "nodelink": {
            "x": 465.3912048339844,
            "y": 421.257568359375,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397182805/d8b34a1cbcc4392c5e152dee3558d375.png",
            "funding_total": 275000,
            "country": "FRA",
            "founded_month": "2012-03",
            "last_funding_at": "10/06/2013",
            "homepage_url": "http://www.modizy.com",
            "url": "http://www.crunchbase.com/organization/modizy-com",
            "market": " Fashion ",
            "funding_rounds": 1,
            "founded_quarter": "2012-Q1",
            "founded_year": 2012,
            "name": "MODIZY.COM",
            "logo": "http://www.crunchbase.com/organization/modizy-com/primary-image/raw",
            "founded_at": "13/03/2012",
            "first_funding_at": "10/06/2013",
            "category": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
            "region": "Paris",
            "permalink": "/organization/modizy-com",
            "status": "operating"
          },
          "categories": ["COMPANY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 6
          },
          "readAt": 1530274504713
        },
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "810",
        "data": {
          "nodelink": {
            "x": 465.3912048339844,
            "y": 421.257568359375,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397182805/d8b34a1cbcc4392c5e152dee3558d375.png",
            "funding_total": 275000,
            "country": "FRA",
            "founded_month": "2012-03",
            "last_funding_at": "10/06/2013",
            "homepage_url": "http://www.modizy.com",
            "url": "http://www.crunchbase.com/organization/modizy-com",
            "market": " Fashion ",
            "funding_rounds": 1,
            "founded_quarter": "2012-Q1",
            "founded_year": 2012,
            "name": "MODIZY.COM",
            "logo": "http://www.crunchbase.com/organization/modizy-com/primary-image/raw",
            "founded_at": "13/03/2012",
            "first_funding_at": "10/06/2013",
            "category": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
            "region": "Paris",
            "permalink": "/organization/modizy-com",
            "status": "operating"
          },
          "categories": ["COMPANY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 6
          },
          "readAt": 1530274504713
        },
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "810",
        "data": {
          "nodelink": {
            "x": 465.3912048339844,
            "y": 421.257568359375,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397182805/d8b34a1cbcc4392c5e152dee3558d375.png",
            "funding_total": 275000,
            "country": "FRA",
            "founded_month": "2012-03",
            "last_funding_at": "10/06/2013",
            "homepage_url": "http://www.modizy.com",
            "url": "http://www.crunchbase.com/organization/modizy-com",
            "market": " Fashion ",
            "funding_rounds": 1,
            "founded_quarter": "2012-Q1",
            "founded_year": 2012,
            "name": "MODIZY.COM",
            "logo": "http://www.crunchbase.com/organization/modizy-com/primary-image/raw",
            "founded_at": "13/03/2012",
            "first_funding_at": "10/06/2013",
            "category": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
            "region": "Paris",
            "permalink": "/organization/modizy-com",
            "status": "operating"
          },
          "categories": ["COMPANY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 6
          },
          "readAt": 1530274504713
        },
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "810",
        "data": {
          "nodelink": {
            "x": 465.3912048339844,
            "y": 421.257568359375,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "logofix": "http://res.cloudinary.com/crunchbase-production/image/upload/v1397182805/d8b34a1cbcc4392c5e152dee3558d375.png",
            "funding_total": 275000,
            "country": "FRA",
            "founded_month": "2012-03",
            "last_funding_at": "10/06/2013",
            "homepage_url": "http://www.modizy.com",
            "url": "http://www.crunchbase.com/organization/modizy-com",
            "market": " Fashion ",
            "funding_rounds": 1,
            "founded_quarter": "2012-Q1",
            "founded_year": 2012,
            "name": "MODIZY.COM",
            "logo": "http://www.crunchbase.com/organization/modizy-com/primary-image/raw",
            "founded_at": "13/03/2012",
            "first_funding_at": "10/06/2013",
            "category": "|Marketplaces|Social Buying|Curated Web|E-Commerce|Fashion|",
            "region": "Paris",
            "permalink": "/organization/modizy-com",
            "status": "operating"
          },
          "categories": ["COMPANY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 6
          },
          "readAt": 1530274504713
        },
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "1127",
        "data": {
          "nodelink": {
            "x": -52.25789260864258,
            "y": 563.1552734375,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "country": "FRA",
            "founded_month": "2001-01",
            "last_funding_at": "24/05/2007",
            "homepage_url": "http://vente-privee.com",
            "url": "http://www.crunchbase.com/organization/vente-privee-com",
            "market": " E-Commerce ",
            "funding_rounds": 1,
            "founded_quarter": "2001-Q1",
            "founded_year": 2001,
            "name": "Vente-privee.com",
            "logo": "http://www.crunchbase.com/organization/vente-privee-com/primary-image/raw",
            "founded_at": "01/01/2001",
            "first_funding_at": "24/05/2007",
            "category": "|E-Commerce|",
            "region": "Paris",
            "permalink": "/organization/vente-privee-com",
            "status": "operating"
          },
          "categories": ["COMPANY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 4
          },
          "readAt": 1530274504713
        }
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "1127",
        "data": {
          "nodelink": {
            "x": -52.25789260864258,
            "y": 563.1552734375,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "country": "FRA",
            "founded_month": "2001-01",
            "last_funding_at": "24/05/2007",
            "homepage_url": "http://vente-privee.com",
            "url": "http://www.crunchbase.com/organization/vente-privee-com",
            "market": " E-Commerce ",
            "funding_rounds": 1,
            "founded_quarter": "2001-Q1",
            "founded_year": 2001,
            "name": "Vente-privee.com",
            "logo": "http://www.crunchbase.com/organization/vente-privee-com/primary-image/raw",
            "founded_at": "01/01/2001",
            "first_funding_at": "24/05/2007",
            "category": "|E-Commerce|",
            "region": "Paris",
            "permalink": "/organization/vente-privee-com",
            "status": "operating"
          },
          "categories": ["COMPANY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 4
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "1127",
        "data": {
          "nodelink": {
            "x": -52.25789260864258,
            "y": 563.1552734375,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "country": "FRA",
            "founded_month": "2001-01",
            "last_funding_at": "24/05/2007",
            "homepage_url": "http://vente-privee.com",
            "url": "http://www.crunchbase.com/organization/vente-privee-com",
            "market": " E-Commerce ",
            "funding_rounds": 1,
            "founded_quarter": "2001-Q1",
            "founded_year": 2001,
            "name": "Vente-privee.com",
            "logo": "http://www.crunchbase.com/organization/vente-privee-com/primary-image/raw",
            "founded_at": "01/01/2001",
            "first_funding_at": "24/05/2007",
            "category": "|E-Commerce|",
            "region": "Paris",
            "permalink": "/organization/vente-privee-com",
            "status": "operating"
          },
          "categories": ["COMPANY", "INVESTOR"],
          "statistics": {
            "supernode": false,
            "degree": 4
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right color with 329 rules in less than 1ms', (done) => {
      nodeAttribute.color({
        "id": "168",
        "data": {
          "nodelink": {
            "x": 336.4065246582031,
            "y": -552.6184692382812,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": " Search "
          },
          "categories": ["MARKET"],
          "statistics": {
            "supernode": false,
            "degree": 10
          },
          "readAt": 1530274504713
        }
      }, palettes);
      done();
    }).timeout(1);

    it('should return the right icon with 329 rules in less than 1ms', (done) => {
      nodeAttribute.icon({
        "id": "168",
        "data": {
          "nodelink": {
            "x": 336.4065246582031,
            "y": -552.6184692382812,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": " Search "
          },
          "categories": ["MARKET"],
          "statistics": {
            "supernode": false,
            "degree": 10
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right size with 329 rules in less than 1ms', (done) => {
      nodeAttribute.size({
        "id": "168",
        "data": {
          "nodelink": {
            "x": 336.4065246582031,
            "y": -552.6184692382812,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": " Search "
          },
          "categories": ["MARKET"],
          "statistics": {
            "supernode": false,
            "degree": 10
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);

    it('should return the right shape with 329 rules in less than 1ms', (done) => {
      nodeAttribute.shape({
        "id": "168",
        "data": {
          "nodelink": {
            "x": 336.4065246582031,
            "y": -552.6184692382812,
            "fixed": false
          },
          "geo": {},
          "properties": {
            "name": " Search "
          },
          "categories": ["MARKET"],
          "statistics": {
            "supernode": false,
            "degree": 10
          },
          "readAt": 1530274504713
        }
      });
      done();
    }).timeout(1);
  });*/

  describe('NodeAttributes.getAutomaticRangeSize', function () {
    it('should return the right size', () => {
      expect(
        NodeAttributes.getAutomaticRangeSize(
          1995,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 10,
                max: 1995
              }
            }
          })
        )
      ).to.equal('500%');

      expect(
        NodeAttributes.getAutomaticRangeSize(
          554,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 10,
                max: 1995
              }
            }
          })
        )
      ).to.equal('173%');

      expect(
        NodeAttributes.getAutomaticRangeSize(
          454,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 10,
                max: 1995
              }
            }
          })
        )
      ).to.equal('150%');

      expect(
        NodeAttributes.getAutomaticRangeSize(
          200,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 10,
                max: 1995
              }
            }
          })
        )
      ).to.equal('93%');

      expect(
        NodeAttributes.getAutomaticRangeSize(
          200,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: 10,
                max: 1995,
                scale: 'logarithmic'
              }
            }
          }),
          true
        )
      ).to.equal('304%');

      expect(
        NodeAttributes.getAutomaticRangeSize(
          0.5,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: -10,
                max: 1995,
                scale: 'logarithmic'
              }
            }
          }),
          true
        )
      ).to.equal('194%');

      expect(
        NodeAttributes.getAutomaticRangeSize(
          -50,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: -110,
                max: -10,
                scale: 'logarithmic'
              }
            }
          }),
          true
        )
      ).to.equal('450%');

      expect(
        NodeAttributes.getAutomaticRangeSize(
          -30,
          new StyleRule({
            index: 0,
            type: SelectorType.NO_VALUE,
            itemType: undefined,
            input: undefined,
            value: undefined,
            style: {
              size: {
                type: 'autoRange',
                input: ['properties', 'age'],
                min: -30,
                max: 1995,
                scale: 'logarithmic'
              }
            }
          }),
          true
        )
      ).to.equal('50%');
    });
  });
});
