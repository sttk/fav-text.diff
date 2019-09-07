'use strict';

var chai = require('chai');
var expect = chai.expect;
var splitIntoBlocks = require('../../lib/split-into-blocks');
var matchBlocks = require('../../lib/match-blocks');

describe('lib/match-blocks', function() {

  it('Should match same empty blocks', function() {
    var blocks1 = splitIntoBlocks('', {});
    var blocks2 = splitIntoBlocks('', {});
    expect(blocks1).to.deep.equals([
      { value: '', start: 0, end: 0, delims: '' },
    ]);
    expect(blocks2).to.deep.equals(blocks1);
    expect(matchBlocks(blocks1, blocks2)).to.deep.equals([
      [0],
    ]);;
  });

  it('Should match same two blocks', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('abc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '', start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals(blocks1);
    expect(matchBlocks(blocks1, blocks2)).to.deep.equals([
      [0],
      [1],
      [2],
      [3],
    ]);
  });

  it('Should match diffrent two blocks - added', function() {
    var blocks1 = splitIntoBlocks('ac', {});
    var blocks2 = splitIntoBlocks('abc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'c', start: 1, end: 2, delims: '' },
      { value: '', start: 2, end: 2, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '', start: 3, end: 3, delims: '' },
    ]);
    expect(matchBlocks(blocks1, blocks2)).to.deep.equals([
      [0],
      [2],
      [3],
    ]);
  });

  it('Should match diffrent two blocks - deleted', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('ac', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '', start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'c', start: 1, end: 2, delims: '' },
      { value: '' , start: 2, end: 2, delims: '' },
    ]);
    expect(matchBlocks(blocks1, blocks2)).to.deep.equals([
      [0],
      [],
      [1],
      [2],
    ]);;
  });

  it('Should match diffrent two blocks - changed', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('aBc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '', start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'B', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '', start: 3, end: 3, delims: '' },
    ]);
    expect(matchBlocks(blocks1, blocks2)).to.deep.equals([
      [0],
      [],
      [2],
      [3],
    ]);;
  });

  it('Should match diffrent two blocks - multiple matches (1)', function() {
    var blocks1 = splitIntoBlocks('abcb', {});
    var blocks2 = splitIntoBlocks('abbdbcb', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: 'b', start: 3, end: 4, delims: '' },
      { value: '', start: 4, end: 4, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'b', start: 2, end: 3, delims: '' },
      { value: 'd', start: 3, end: 4, delims: '' },
      { value: 'b', start: 4, end: 5, delims: '' },
      { value: 'c', start: 5, end: 6, delims: '' },
      { value: 'b', start: 6, end: 7, delims: '' },
      { value: '', start: 7, end: 7, delims: '' },
    ]);
    expect(matchBlocks(blocks1, blocks2)).to.deep.equals([
      [0],
      [1],
      [5],
      [2, 4, 6],
      [7],
    ]);;
  });

  it('Should match diffrent two blocks - multiple matches (2)', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('abbdcdc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '',  start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'b', start: 2, end: 3, delims: '' },
      { value: 'd', start: 3, end: 4, delims: '' },
      { value: 'c', start: 4, end: 5, delims: '' },
      { value: 'd', start: 5, end: 6, delims: '' },
      { value: 'c', start: 6, end: 7, delims: '' },
      { value: '',  start: 7, end: 7, delims: '' },
    ]);
    expect(matchBlocks(blocks1, blocks2)).to.deep.equals([
      [0],
      [1],
      [4, 6],
      [7],
    ]);;
  });
});
