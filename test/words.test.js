'use strict';

var chai = require('chai');
var expect = chai.expect;
var fav = {}; fav.text = {}; fav.text.diff = require('../');
var diff = fav.text.diff;
var applyDiff = require('./tool/apply-diff');

describe('diff: words', function() {

  describe('Compare same texts', function() {
    it('Should return an empty array when both texts are empty', function() {
      var opts = { delimRe: /\s+/ };
      var text1 = '';
      var text2 = '';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array', function() {
      var opts = { delimRe: /\s+/ };
      var text1 = 'abcdefg';
      var text2 = 'abcdefg';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array when texts are blanks', function() {
      var opts = { delimRe: /\s+/ };
      var text1 = '    ';
      var text2 = '    ';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array when texts are repeated strings',
    function() {
      var text1 = 'abc abc abc';
      var text2 = 'abc abc abc';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Compare diffrent texts so that diff type is ADD', function() {
    it('Should return added diff', function() {
      var opts = { delimRe: /\s+/ };
      var text1 = 'abc ghi ';
      var text2 = 'abc def ghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type:'a', src: { start:3, end:3 }, dest: { start:3, end:7 } },
        { type:'d', src: { start:7, end:8 }, dest: { start:11, end:11 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should compare texts of which elements are all whitespaces',
    function() {
      var opts = { delimRe: /\s+/ };
      var text1 = '    ';
      var text2 = '  \t  \t  ';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type:'a', src: { start:2, end:2 }, dest: { start:2, end:6 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Compare diffrent texts so that diff type is DELETE', function() {
    it('Should return deleted diff', function() {
      var opts = { delimRe: /\s+/ };
      var text1 = 'abc ghi ';
      var text2 = 'abc def ghi';
      var diffs = diff(text2, text1, opts);
      expect(diffs).to.deep.equal([
        { type:'d', src: { start:3, end:7 }, dest: { start:3, end:3 } },
        { type:'a', src: { start:11, end:11 }, dest: { start:7, end:8 } },
      ]);
      expect(applyDiff(diffs, text2, text1)).to.equal(text1);
    });

    it('Should compare texts of which elements are all whitespaces',
    function() {
      var opts = { delimRe: /\s+/ };
      var text1 = '\t  \t  ';
      var text2 = '\t ';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type:'d', src: { start:2, end:6 }, dest: { start:2, end:2 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Compare diffrent texts so that diff type is CHANGED', function() {
    it('Should return changed diff', function() {
      var opts = { delimRe: /\s+/ };
      var text1 = 'abc ddf ghi ';
      var text2 = 'abc def ghi j';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'c', src: { start: 4, end: 7 }, dest: { start: 4, end: 7 } },
        { type: 'c', src: { start:11, end:12 }, dest: { start:11, end:13 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return changed diff', function() {
      var opts = { delimRe: /\s+/ };
      var text1 = 'abc ddf ghi ';
      var text2 = 'abc def ghi j';
      var diffs = diff(text2, text1, opts);
      expect(diffs).to.deep.equal([
        { type: 'c', src: { start: 4, end: 7 }, dest: { start: 4, end: 7 } },
        { type: 'c', src: { start:11, end:13 }, dest: { start:11, end:12 } },
      ]);
      expect(applyDiff(diffs, text2, text1)).to.equal(text1);
    });

    it('Should compare texts of which elements are all whitespaces',
    function() {
      var opts = { delimRe: /\s+/ };
      var text1 = '  \t  \t  ';
      var text2 = ' \t\t ';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type:'c', src: { start:1, end:7 }, dest: { start:1, end:3 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Options: ignoreCase', function() {
    it('Should compare texts with ignoring upper/lower case', function() {
      var opts = { ignoreCase: true, delimRe: /\s+/ };
      var text1 = 'ABC DEF GHI';
      var text2 = 'abc def ghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      var result = applyDiff(diffs, text1, text2);
      expect(result.toUpperCase()).to.equal(text2.toUpperCase());
    });

    it('Should compare a source text and an added text', function() {
      var opts = { ignoreCase: true, delimRe: /\s+/ };
      var text1 = 'ABC DEF';
      var text2 = 'abc def ghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start: 7, end: 7 }, dest: { start: 7, end: 11 } },
      ]);
      var result = applyDiff(diffs, text1, text2);
      expect(result.toUpperCase()).to.equal(text2.toUpperCase());
    });

    it('Should compare a source text and a deleted text', function() {
      var opts = { ignoreCase: true, delimRe: /\s+/ };
      var text1 = 'ABC DEF GHI';
      var text2 = 'abc ghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start: 3, end: 7 }, dest: { start: 3, end: 3 } },
      ]);
      var result = applyDiff(diffs, text1, text2);
      expect(result.toUpperCase()).to.equal(text2.toUpperCase());
    });

    it('Should compare a source text and a changed text', function() {
      var opts = { ignoreCase: true, delimRe: /\s+/ };
      var text1 = 'ABC DEF GHI';
      var text2 = 'abc df ghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'c', src: { start: 4, end: 7 }, dest: { start: 4, end: 6 } },
      ]);
      var result = applyDiff(diffs, text1, text2);
      expect(result.toUpperCase()).to.equal(text2.toUpperCase());
    });
  });
});
