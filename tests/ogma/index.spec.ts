'use strict';

import {expect} from 'chai';
import 'mocha';
import Ogma, {NodeList} from '@linkurious/ogma';
import {LkEdgeData, LkNodeData} from '@linkurious/rest-client';

import {Tools} from '../../src/tools/tools';

describe('Tools.getHiddenNeighbors', () => {
  it('should return the number of hidden neighbors', () => {
    const ogma = new Ogma();
    ogma.addGraph({
      nodes: [
        {id: 0},
        {id: 1, data: {statistics: {degree: 10}}},
        {id: 2, data: {statistics: {degree: 10}}},
        {id: 3, data: {statistics: {degree: 10}}}
      ],
      edges: [
        {id: 0, source: 0, target: 1},
        {id: 1, source: 1, target: 0},
        {id: 2, source: 1, target: 3},
        {id: 3, source: 1, target: 2},
        {id: 4, source: 2, target: 3}
      ]
    });
    expect(Tools.getHiddenNeighbors(ogma.getNodes([0]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(
      0
    );
    expect(Tools.getHiddenNeighbors(ogma.getNodes([1]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(
      7
    );
    expect(Tools.getHiddenNeighbors(ogma.getNodes([2]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(
      8
    );
    expect(Tools.getHiddenNeighbors(ogma.getNodes([3]) as NodeList<LkNodeData, LkEdgeData>)).to.eql(
      8
    );
    expect(Tools.getHiddenNeighbors(ogma.getNodes() as NodeList<LkNodeData, LkEdgeData>)).to.eql(
      23
    );
    ogma.destroy();
  });
});
