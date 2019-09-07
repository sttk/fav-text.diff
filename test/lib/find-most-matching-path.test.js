'use strict';

var chai = require('chai');
var expect = chai.expect;
var splitIntoBlocks = require('../../lib/split-into-blocks');
var matchBlocks = require('../../lib/match-blocks');
var findMostMatchingPath = require('../../lib/find-most-matching-path');

describe('lib/find-most-matching-path', function() {

  it('Should find matching path between emtpy texts', function() {
    var blocks1 = splitIntoBlocks('', {});
    var blocks2 = splitIntoBlocks('', {});
    expect(blocks1).to.deep.equals([
      { value: '', start: 0, end: 0, delims: '' },
    ]);
    expect(blocks2).to.deep.equals(blocks1);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0]
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    expect(findMostMatchingPath(matches, maxMatchingSize)).to.deep.equals([0]);
  });

  it('Should find matching path between same texts', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('abc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '' , start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals(blocks1);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0],
      [1],
      [2],
      [3],
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    expect(findMostMatchingPath(matches, maxMatchingSize)).to.deep.equals([
      0, 1, 2, 3
    ]);
  });

  it('Should match diffrent two blocks - single match', function() {
    var blocks1 = splitIntoBlocks('ac', {});
    var blocks2 = splitIntoBlocks('abc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'c', start: 1, end: 2, delims: '' },
      { value: '' , start: 2, end: 2, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '' , start: 3, end: 3, delims: '' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0],
      [2],
      [3],
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    expect(findMostMatchingPath(matches, maxMatchingSize)).to.deep.equals([
      0, 2, 3
    ]);
  });

  it('Should match diffrent two blocks - multiple matches', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('abbdcdc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '' , start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'b', start: 2, end: 3, delims: '' },
      { value: 'd', start: 3, end: 4, delims: '' },
      { value: 'c', start: 4, end: 5, delims: '' },
      { value: 'd', start: 5, end: 6, delims: '' },
      { value: 'c', start: 6, end: 7, delims: '' },
      { value: '' , start: 7, end: 7, delims: '' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0],
      [1],
      [4, 6],
      [7],
    ]);;
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    expect(findMostMatchingPath(matches, maxMatchingSize)).to.deep.equals([
      0, 1, 4, 7
    ]);
  });

  it('Should match diffrent two blocks - multiple paths (1)', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('acdbecb', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '' , start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'c', start: 1, end: 2, delims: '' },
      { value: 'd', start: 2, end: 3, delims: '' },
      { value: 'b', start: 3, end: 4, delims: '' },
      { value: 'e', start: 4, end: 5, delims: '' },
      { value: 'c', start: 5, end: 6, delims: '' },
      { value: 'b', start: 6, end: 7, delims: '' },
      { value: '' , start: 7, end: 7, delims: '' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0], [3, 6], [1, 5], [7],
    ]);;
    var maxMatchingSize = Math.min(blocks1.length, blocks2.lengt);
    expect(findMostMatchingPath(matches, maxMatchingSize)).to.deep.equals([
      0, 3, 5, 7
    ]);
  });

  it('Should match diffrent two blocks - multiple paths (2)', function() {
    var blocks1 = splitIntoBlocks('abc', {});
    var blocks2 = splitIntoBlocks('acdbecb', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '' , start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'c', start: 1, end: 2, delims: '' },
      { value: 'd', start: 2, end: 3, delims: '' },
      { value: 'b', start: 3, end: 4, delims: '' },
      { value: 'e', start: 4, end: 5, delims: '' },
      { value: 'c', start: 5, end: 6, delims: '' },
      { value: 'b', start: 6, end: 7, delims: '' },
      { value: '' , start: 7, end: 7, delims: '' },
    ]);
    var matches = matchBlocks(blocks2, blocks1);
    expect(matches).to.deep.equals([
      [0], [2], [], [1], [], [2], [1], [3],
    ]);;
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    expect(findMostMatchingPath(matches, maxMatchingSize)).to.deep.equals([
      0, undefined, undefined, 1, undefined, 2, undefined, 3,
    ]);
  });

  it('Should match diffrent two blocks - multiple paths (3)', function() {
    var opts = { delimRe: /\n/ };
    var blocks1 = splitIntoBlocks('' +
      '\n' +
      '\n' +
      'a\n' +
      '\n' +
      'b\n' +
      'c\n' +
      '\n' +
      'a\n' +
      '\n' +
      'b\n' +
      '\n' +
      'c\n' +
      '\n' +
    '', opts);
    var blocks2 = splitIntoBlocks('' +
      '\n' +
      'a\n' +
      'b\n' +
      '\n' +
      'b\n' +
      '\n' +
      'c\n' +
      '\n' +
    '', opts);
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 2,  end: 3,  delims: '\n\n' },
      { value: 'b', start: 5,  end: 6,  delims: '\n\n'   },
      { value: 'c', start: 7,  end: 8,  delims: '\n' },
      { value: 'a', start: 10, end: 11, delims: '\n\n' },
      { value: 'b', start: 13, end: 14, delims: '\n\n' },
      { value: 'c', start: 16, end: 17, delims: '\n\n' },
      { value: '' , start: 19, end: 19, delims: '\n\n' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 1, end: 2, delims: '\n' },
      { value: 'b', start: 3, end: 4, delims: '\n' },
      { value: 'b', start: 6, end: 7, delims: '\n\n' },
      { value: 'c', start: 9, end:10, delims: '\n\n' },
      { value: '' , start:12, end:12, delims: '\n\n' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0], [1], [3], [], [2], [3], [4],
    ]);;
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    expect(findMostMatchingPath(matches, maxMatchingSize)).to.deep.equals([
      0, 1, undefined, undefined, 2, 3, 4,
    ]);
  });

  it('Should match diffrent two blocks - multiple paths (4)', function() {
    var opts = { delimRe: /\n/ };
    var blocks1 = splitIntoBlocks('' +
      '\n' +
      '\n' +
      'a\n' +
      '\n' +
      'b\n' +
      'c\n' +
      '\n' +
      'a\n' +
      '\n' +
      'b\n' +
      '\n' +
      'c\n' +
      '\n' +
    '', opts);
    var blocks2 = splitIntoBlocks('' +
      '\n' +
      'a\n' +
      'b\n' +
      '\n' +
      'b\n' +
      '\n' +
      'c\n' +
      '\n' +
    '', opts);
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 2,  end: 3,  delims: '\n\n' },
      { value: 'b', start: 5,  end: 6,  delims: '\n\n'   },
      { value: 'c', start: 7,  end: 8,  delims: '\n' },
      { value: 'a', start: 10, end: 11, delims: '\n\n' },
      { value: 'b', start: 13, end: 14, delims: '\n\n' },
      { value: 'c', start: 16, end: 17, delims: '\n\n' },
      { value: '' , start: 19, end: 19, delims: '\n\n' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 1, end: 2, delims: '\n'   },
      { value: 'b', start: 3, end: 4, delims: '\n' },
      { value: 'b', start: 6, end: 7, delims: '\n\n' },
      { value: 'c', start: 9, end:10, delims: '\n\n' },
      { value: '' , start:12, end:12, delims: '\n\n'   },
    ]);
    var matches = matchBlocks(blocks2, blocks1);
    expect(matches).to.deep.equals([
      [0], [1], [4], [2, 5], [6]
    ]);;
    expect(findMostMatchingPath(matches)).to.deep.equals([
      0, 1, 4, 5, 6,
    ]);
  });

});
