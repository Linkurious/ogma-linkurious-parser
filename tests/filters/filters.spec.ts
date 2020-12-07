'use strict';

import {expect} from 'chai';
import 'mocha';
import { Filters } from "../../src";
import Ogma from "ogma";
import {LkEdgeData, LkNodeData} from "@linkurious/rest-client";

describe('Filters', () => {
    const filterEmpty = {edge: [], node: []};

    const nodeCityParis = {
        id: 1,
        attributes: {},
        data: {
            categories: ['CITY'],
            properties: {"name": "Paris", 'invested_amount': 105519047},
            geo: {},
            statistics: {
                supernode: false
            },
            readAt: 0
        }
    };

    const nodeNoValueName = {
        id: 1,
        attributes: {},
        data: {
            categories: ['CITY'],
            properties: {'invested_amount': 105519047},
            geo: {},
            statistics: {supernode: false},
            readAt: 0
        }
    };

    const nodeCityBarcelona = {
        id: 2,
        attributes: {},
        data: {
            categories: ['CITY'],
            properties: {"name": "Barcelona", 'invested_amount': 155519047},
            geo: {},
            statistics: {supernode: false},
            readAt: 0
        }
    };

    const nodeInvalidCityBarcelona = {
        id: 2,
        attributes: {},
        data: {
            categories: ['CITY'],
            properties: {"name": 1233584, 'invested_amount': 155519047},
            geo: {},
            statistics: {supernode: false},
            readAt: 0
        }
    };

    const nodeCityLisbon = {
        id: 2,
        attributes: {},
        data: {
            categories: ['CITY'],
            properties: {"name": "Barcelona", 'invested_amount': 'aaa'},
            geo: {},
            statistics: {supernode: false},
            readAt: 0
        }
    };

    const nodeCompany = {
        id: 3,
        attributes: {},
        data: {
            categories: ['COMPANY'],
            properties: {"name": "EDP", 'invested_amount': 105519047},
            geo: {},
            statistics: {supernode: false},
            readAt: 0
        }
    };

    const nodeInvalidCompany = {
        id: 3,
        attributes: {},
        data: {
            categories: ['COMPANY'],
            properties: {"name": 123566, 'invested_amount': 105519047},
            geo: {},
            statistics: {supernode: false},
            readAt: 0
        }
    };

    const edgeNoValueCity = {
        id: 10,
        attributes: {},
        data: {
            type: 'HAS_CITY',
            properties: {'moved_in': 2000},
            readAt: 0
        },
        source: '1',
        target: '3'
    };

    const edgeHasCityParis = {
        id: 10,
        attributes: {},
        data: {
            type: 'HAS_CITY',
            properties: {"city": "Paris", 'moved_in': 2000},
            readAt: 0
        },
        source: '1',
        target: '3'
    };

    const edgeHasCityBarcelona = {
        id: 11,
        attributes: {},
        data: {
            type: 'HAS_CITY',
            properties: {"city": "Barcelona", 'moved_in': 2005},
            readAt: 0
        },
        source: '2',
        target: '3'
    };

    const edgeInvalidHasCityBarcelona = {
        id: 11,
        attributes: {},
        data: {
            type: 'HAS_CITY',
            properties: {"city": 12345667, 'moved_in': 2005},
            readAt: 0
        },
        source: '2',
        target: '3'
    };

    const edgeHasCityLisbon = {
        id: 11,
        attributes: {},
        data: {
            type: 'HAS_CITY',
            properties: {"city": "Barcelona", 'moved_in': undefined},
            readAt: 0
        },
        source: '2',
        target: '3'
    };

    const edgeHasInvestor = {
        id: 12,
        attributes: {},
        data: {
            type: 'HAS_INVESTOR',
            properties: {"investor": "EDP", 'moved_in': 2000},
            readAt: 0
        },
        source: '1',
        target: '3'
    };

    const edgeInvalidHasInvestor = {
        id: 12,
        attributes: {},
        data: {
            type: 'HAS_INVESTOR',
            properties: {"investor": 123456, 'moved_in': 2000},
            readAt: 0
        },
        source: '1',
        target: '3'
    };

    const ogmaFilteredNodes = [
        {
            id: 1,
            data: {
                categories: [],
                data: {},
                geo: {},
                statistics: {},
                readAt: 0
            }
        },
        {
            id: 19,
            data: {
                categories: ["CITY"],
                properties: {
                    name: "Paris",
                    long: 2.34575,
                    lat: 48.857334
                },
                geo: {},
                statistics: {},
                readAt: 0
            }
        },
        {
            id: 76529,
            data: {
                categories: ["INVESTOR"],
                properties: {
                    market: "Financial Services",
                    country: "FRA",
                    city: "Paris",
                    name: "Ader Finance",
                    category: "|Financial Services|",
                    permalink: "/organization/global-equities-corporate-finance",
                    region: "Paris",
                    url: "http://www.crunchbase.com/organization/global-equities-corporate-finance"
                },
                geo: {},
                statistics: {},
                readAt: 0
            }
        }
    ];

    const ogmaFilteredEdge = {
        id: 120463,
        data: {
            type: "HAS_CITY",
            properties: {
                city: "Paris",
            },
            readAt: 0
        },
        source: 76529,
        target: 19
    };

    const ogma = new Ogma();
    ogma.addNodes(ogmaFilteredNodes);
    ogma.addEdge(ogmaFilteredEdge);



    describe('MATCH ANY', () => {
        const filterFilledAny = Tools.clone(filterEmpty);
        filterFilledAny.node = [{type: 'any', itemType: 'CITY', input: undefined, value: undefined}];
        filterFilledAny.edge = [{type: 'any', itemType: 'HAS_CITY', input: undefined, value: undefined}];

        // todo: removed support for nodes without a category
        // const nodeWithoutCategory = {
        //   id: 0,
        //   attributes: {},
        //   data: {
        //     categories: [],
        //     properties: {}
        //   }
        // };
        // it('should return false if the node category without category dont have any filtered undefined itemType', () => {
        //   expect(Filters.isFiltered(
        //     filterFilledAny.node,
        //     nodeWithoutCategory
        //   )).to.eq(false);
        // });

        it('should return false if the node categories do not match', () => {
            expect(Filters.isFiltered(
                filterFilledAny.node,
                nodeCompany.data
            )).to.eq(false);
        });

        it('should return false if the edge type does not match', () => {
            expect(Filters.isFiltered(
                filterFilledAny.edge,
                edgeHasInvestor.data
            )).to.eq(false);
        });

        // todo: removed support for nodes without a category
        // it('should return true if the node without category have the filtered undefined itemType', () => {
        //   const filterFilledAnyWithoutCat = Tools.clone(filterEmpty);
        //   filterFilledAnyWithoutCat.node = [{type: 'any', itemType: undefined, input: undefined, value: undefined}];
        //   filterFilledAnyWithoutCat.edge = [{type: 'any', itemType: 'HAS_CITY', input: undefined, value: undefined}];

        //   expect(Filters.isFiltered(
        //     filterFilledAnyWithoutCat.node,
        //     nodeWithoutCategory
        //   )).to.eq(true);
        // });

        it('should return true if the node categories match', () => {
            expect(Filters.isFiltered(
                filterFilledAny.node,
                nodeCityParis.data
            )).to.eq(true);
        });

        it('should return true if the edge has the filtered itemType', () => {
            expect(Filters.isFiltered(
                filterFilledAny.edge,
                edgeHasCityParis.data
            )).to.eq(true);
        });

        it('should return true when a node from ogma match with one filter', () => {
            const node = ogma.getNode(19).getData() as LkNodeData;
            expect(Filters.isFiltered(filterFilledAny.node, node)).to.eq(true);
        });

        it('should return true when a edge from ogma match with one filter', () => {
            expect(Filters.isFiltered(filterFilledAny.edge, ogma.getEdge(120463).getData() as LkEdgeData)).to.eq(true);
        });

    });

    describe('MATCH NOVALUE', () => {
        const filterFilledNoValue = Tools.clone(filterEmpty);
        filterFilledNoValue.node = [{type: 'novalue', itemType: 'CITY', input: ['properties', 'name']}];
        filterFilledNoValue.edge = [{type: 'novalue', itemType: 'HAS_CITY', input: ['properties', 'city']}];

        it('should return false if the node categories do not match', () => {
            expect(Filters.isFiltered(
                filterFilledNoValue.node,
                nodeCompany.data
            )).to.eq(false);
        });

        it('should return false if the node has a property value', () => {
            expect(Filters.isFiltered(
                filterFilledNoValue.node,
                nodeCityBarcelona.data
            )).to.eq(false);
        });

        it('should return false if the edge does not have the filtered itemType', () => {
            expect(Filters.isFiltered(
                filterFilledNoValue.edge,
                edgeHasInvestor.data
            )).to.eq(false);
        });

        it('should return false if the edge has a property value', () => {
            expect(Filters.isFiltered(
                filterFilledNoValue.edge,
                edgeHasCityBarcelona.data
            )).to.eq(false);
        });
        it('should return true if the node has at least one of the filtered itemTypes ' +
            'and dont have property value', () => {
            expect(Filters.isFiltered(
                filterFilledNoValue.node,
                nodeNoValueName.data
            )).to.eq(true);
        });
        it('should return true if the edge has the filtered itemType ' +
            'and dont have property value', () => {
            expect(Filters.isFiltered(
                filterFilledNoValue.edge,
                edgeNoValueCity.data
            )).to.eq(true);
        });
    });

    describe('MATCH NAN', () => {
        const filterFilledNAN = Tools.clone(filterEmpty);
        filterFilledNAN.node = [
            {type: 'nan', itemType: 'CITY', input: ['properties', 'name'], value: 'Paris'}
        ];
        filterFilledNAN.edge = [
            {type: 'nan', itemType: 'HAS_CITY', input: ['properties', 'city'], value: 'Paris'}
        ];

        it('should return false if the node categories do not match', () => {
            expect(Filters.isFiltered(
                filterFilledNAN.node,
                nodeInvalidCompany.data
            )).to.eq(false);
        });

        it('should return false if the node property is a number', () => {
            expect(Filters.isFiltered(
                filterFilledNAN.node,
                nodeInvalidCityBarcelona.data
            )).to.eq(false);
        });

        it('should return false if the edge type does not match', () => {
            expect(Filters.isFiltered(
                filterFilledNAN.edge,
                edgeInvalidHasInvestor.data
            )).to.eq(false);
        });

        it('should return false if the edge property is a number', () => {
            expect(Filters.isFiltered(
                filterFilledNAN.edge,
                edgeInvalidHasCityBarcelona.data
            )).to.eq(false);
        });

        it('should return true if the node categories match and the property is not a number', () => {
            expect(Filters.isFiltered(
                filterFilledNAN.node,
                nodeCityBarcelona.data
            )).to.eq(true);
        });

        it('should return true if the edge type matches and the property is not a number', () => {
            expect(Filters.isFiltered(
                filterFilledNAN.edge,
                edgeHasCityBarcelona.data
            )).to.eq(true);
        });
    });

    describe('MATCH IS', () => {
        const filterFilledIs = Tools.clone(filterEmpty);
        filterFilledIs.node = [{type: 'is', itemType: 'CITY', input: ['properties', 'name'], value: 'Paris'}];
        filterFilledIs.edge = [{type: 'is', itemType: 'HAS_CITY', input: ['properties', 'city'], value: 'Paris'}];

        it('should return false if the node category does not match', () => {
            expect(Filters.isFiltered(
                filterFilledIs.node,
                nodeCompany.data
            )).to.eq(false);
        });

        it('should return false if the node property does not match', () => {
            expect(Filters.isFiltered(
                filterFilledIs.node,
                nodeCityBarcelona.data
            )).to.eq(false);
        });

        it('should return false if the edge type does not match', () => {
            expect(Filters.isFiltered(
                filterFilledIs.edge,
                edgeHasInvestor.data
            )).to.eq(false);
        });

        it('should return false if the edge property does not match', () => {
            expect(Filters.isFiltered(
                filterFilledIs.edge,
                edgeHasCityBarcelona.data
            )).to.eq(false);
        });

        it('should return true if the node categories match and property matches', () => {
            expect(Filters.isFiltered(
                filterFilledIs.node,
                nodeCityParis.data
            )).to.eq(true);
        });

        it('should return true if the edges type matches and property matches', () => {
            expect(Filters.isFiltered(
                filterFilledIs.edge,
                edgeHasCityParis.data
            )).to.eq(true);
        });
    });

    describe('MATCH RANGE', () => {

        const filterRules = Tools.clone(filterEmpty);
        filterRules.node = [{
            type: 'range',
            itemType: 'CITY',
            input: ['properties', 'invested_amount'],
            value: {'<': 115519047.61904761, '>': 2425700000}
        }];
        filterRules.edge = [{
            type: 'range',
            itemType: 'HAS_CITY',
            input: ['properties', 'moved_in'],
            value: {'<': 2001, '>': 2010}
        }];

        it('should return false if the node categories do not match', () => {
            expect(Filters.isFiltered(
                filterRules.node,
                nodeCompany.data
            )).to.eq(false);
        });

        it('should return false if the node property does not match the range', () => {
            expect(Filters.isFiltered(
                filterRules.node,
                nodeCityBarcelona.data
            )).to.eq(false);

        });

        it('should return false if the node property is not a number', () => {
            expect(Filters.isFiltered(
                filterRules.node,
                nodeCityLisbon.data
            )).to.eq(false);
        });

        it('should return false if the edge type does not match', () => {
            expect(Filters.isFiltered(
                filterRules.edge,
                edgeHasInvestor.data
            )).to.eq(false);
        });

        it('should return false if the edge property does not match the range', () => {
            // rules: filter/hide edges when "moved_in" < 2001 OR "moved_in" > 2010
            // here, edge."moved_in" is 2005 => the edge should *not* be hidden/filtered.
            expect(Filters.isFiltered(
                filterRules.edge,
                edgeHasCityBarcelona.data
            )).to.eq(false);
        });

        it('should return false if the edge property is not a number', () => {
            expect(Filters.isFiltered(
                filterRules.edge,
                edgeHasCityLisbon.data
            )).to.eq(false);
        });

        it('should return true if the node categories match and the property matches the range', () => {
            expect(Filters.isFiltered(
                filterRules.node,
                nodeCityParis.data
            )).to.eq(true);
        });

        it('should return true if the edge type matches and the property matches the range', () => {
            // rules: filter/hide edges when "moved_in" < 2001 OR "moved_in" > 2010
            // here, edge."moved_in" is 2000 => the edge should be hidden/filtered.
            expect(Filters.isFiltered(
                filterRules.edge,
                edgeHasCityParis.data
            )).to.eq(true);
        });
    });

    describe('EMPTY FILTER', () => {

        it('should return false if there are not node filters', () => {
            expect(Filters.isFiltered(
                filterEmpty.node,
                nodeCityParis.data
            )).to.eq(false);
        });

        it('should return false if there are not edge filters', () => {
            expect(Filters.isFiltered(
                filterEmpty.edge,
                edgeHasCityParis.data
            )).to.eq(false);
        });

        it('should return false when a node from ogma dont match with any filter', () => {
            expect(Filters.isFiltered(
                filterEmpty.node,
                ogma.getNode(ogmaFilteredNodes[1].id).getData() as LkNodeData
            )).to.eq(false);
        });

        it('should return false when a edge from ogma dont match with any filter', () => {
            expect(Filters.isFiltered(
                filterEmpty.edge,
                ogma.getEdge(ogmaFilteredEdge.id).getData() as LkEdgeData
            )).to.eq(false);
        });
    });
});
