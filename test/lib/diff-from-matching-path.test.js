'use strict';

var chai = require('chai');
var expect = chai.expect;
var splitIntoBlocks = require('../../lib/split-into-blocks');
var matchBlocks = require('../../lib/match-blocks');
var findMostMatchingPath = require('../../lib/find-most-matching-path');
var diffFromMatchingPath = require('../../lib/diff-from-matching-path');

describe('lib/diff-from-matching-path', function() {

  it('Should get diff data between two texts (add)', function() {
    var text1 = 'abc';
    var text2 = 'abdc';
    var blocks1 = splitIntoBlocks(text1, {});
    var blocks2 = splitIntoBlocks(text2, {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '',  start: 3, end: 3, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'd', start: 2, end: 3, delims: '' },
      { value: 'c', start: 3, end: 4, delims: '' },
      { value: '',  start: 4, end: 4, delims: '' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0], [1], [3], [4],
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    var matchingPath = findMostMatchingPath(matches, maxMatchingSize);
    expect(matchingPath).to.deep.equals([
      0, 1, 3, 4
    ]);
    var diffs = diffFromMatchingPath(matchingPath, blocks1, blocks2);
    expect(diffs).to.deep.equal([
      { type: 'a', src: { start: 2, end: 2 }, dest: { start: 2, end: 3 } }
    ]);
  });

  it('Should get diff data between two texts (delete)', function() {
    var blocks1 = splitIntoBlocks('abdc', {});
    var blocks2 = splitIntoBlocks('abc', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'd', start: 2, end: 3, delims: '' },
      { value: 'c', start: 3, end: 4, delims: '' },
      { value: '',  start: 4, end: 4, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'c', start: 2, end: 3, delims: '' },
      { value: '',  start: 3, end: 3, delims: '' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0], [1], [], [2], [3],
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    var matchingPath = findMostMatchingPath(matches, maxMatchingSize);
    expect(matchingPath).to.deep.equals([
      0, 1, undefined, 2, 3
    ]);
    var diffs = diffFromMatchingPath(matchingPath, blocks1, blocks2);
    expect(diffs).to.deep.equal([
      { type: 'd', src: { start: 2, end: 3 }, dest: { start: 2, end: 2 } }
    ]);
  });

  it('Should get diff data between two texts (change)', function() {
    var blocks1 = splitIntoBlocks('abdc', {});
    var blocks2 = splitIntoBlocks('abec', {});
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'd', start: 2, end: 3, delims: '' },
      { value: 'c', start: 3, end: 4, delims: '' },
      { value: '',  start: 4, end: 4, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 0, end: 1, delims: '' },
      { value: 'b', start: 1, end: 2, delims: '' },
      { value: 'e', start: 2, end: 3, delims: '' },
      { value: 'c', start: 3, end: 4, delims: '' },
      { value: '',  start: 4, end: 4, delims: '' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0], [1], [], [3], [4]
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    var matchingPath = findMostMatchingPath(matches, maxMatchingSize);
    expect(matchingPath).to.deep.equals([
      0, 1, undefined, 3, 4
    ]);
    var diffs = diffFromMatchingPath(matchingPath, blocks1, blocks2);
    expect(diffs).to.deep.equal([
      { type: 'c', src: { start: 2, end: 3 }, dest: { start: 2, end: 3 } }
    ]);
  });

  it('Should get diff data between two texts (having consecutive delimiters)',
  function() {
    var opts = { delimRe: /\s/ };
    var blocks1 = splitIntoBlocks('   a  b d  c ', opts);
    var blocks2 = splitIntoBlocks(' a b   e   c   ', opts);
    expect(blocks1).to.deep.equals([
      { value: 'a', start: 3, end: 4, delims: '   ' },
      { value: 'b', start: 6, end: 7, delims: '  ' },
      { value: 'd', start: 8, end: 9, delims: ' ' },
      { value: 'c', start: 11, end: 12, delims: '  ' },
      { value: '',  start: 13, end: 13, delims: ' ' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'a', start: 1, end: 2, delims: ' ' },
      { value: 'b', start: 3, end: 4, delims: ' ' },
      { value: 'e', start: 7, end: 8, delims: '   ' },
      { value: 'c', start: 11, end: 12, delims: '   ' },
      { value: '',  start: 15, end: 15, delims: '   ' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [0], [1], [], [3], [4]
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    var matchingPath = findMostMatchingPath(matches, maxMatchingSize);
    expect(matchingPath).to.deep.equals([
      0, 1, undefined, 3, 4
    ]);
    var diffs = diffFromMatchingPath(matchingPath, blocks1, blocks2);
    expect(diffs).to.deep.equal([
      { type: 'd', src: { start: 1, end: 3 }, dest: { start: 1, end: 1 } },
      { type: 'd', src: { start: 5, end: 6 }, dest: { start: 3, end: 3 } },
      { type: 'c', src: { start: 8, end: 9 }, dest: { start: 5, end: 9 } },
      { type: 'a', src: { start: 13, end: 13 }, dest: { start: 13, end: 15 } },
    ]);
  });

  it('Should get diff data between two texts (trim leading delimiters)',
  function() {
    var opts = { delimRe: /\s/ };
    var blocks1 = splitIntoBlocks(' \tabc', opts);
    var blocks2 = splitIntoBlocks('   abd', opts);
    expect(blocks1).to.deep.equals([
      { value: 'abc', start: 2, end: 5, delims: ' \t' },
      { value: '',    start: 5, end: 5, delims: '' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'abd', start: 3, end: 6, delims: '   ' },
      { value: '',    start: 6, end: 6, delims: '' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [], [1],
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    var matchingPath = findMostMatchingPath(matches, maxMatchingSize);
    expect(matchingPath).to.deep.equals([
      undefined, 1,
    ]);
    var diffs = diffFromMatchingPath(matchingPath, blocks1, blocks2);
    expect(diffs).to.deep.equal([
      { type: 'c', src: { start: 1, end: 5 }, dest: { start: 1, end: 6 } },
    ]);
  });

  it('Should get diff data between two texts (trim following delimiters)',
  function() {
    var opts = { delimRe: /\s/ };
    var blocks1 = splitIntoBlocks('abc\t def \t ', opts);
    var blocks2 = splitIntoBlocks('abd  def  ', opts);
    expect(blocks1).to.deep.equals([
      { value: 'abc', start: 0, end: 3, delims: '' },
      { value: 'def', start: 5, end: 8, delims: '\t ' },
      { value: '',    start:11, end:11, delims: ' \t ' },
    ]);
    expect(blocks2).to.deep.equals([
      { value: 'abd', start: 0, end: 3, delims: '' },
      { value: 'def', start: 5, end: 8, delims: '  ' },
      { value: '',    start:10, end:10, delims: '  ' },
    ]);
    var matches = matchBlocks(blocks1, blocks2);
    expect(matches).to.deep.equals([
      [], [1], [2],
    ]);
    var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
    var matchingPath = findMostMatchingPath(matches, maxMatchingSize);
    expect(matchingPath).to.deep.equals([
      undefined, 1, 2
    ]);
    var diffs = diffFromMatchingPath(matchingPath, blocks1, blocks2);
    expect(diffs).to.deep.equal([
      { type: 'c', src: { start: 0, end: 4 }, dest: { start: 0, end: 4 } },
      { type: 'd', src: { start: 9, end:10 }, dest: { start: 9, end: 9 } },
    ]);
  });
});
