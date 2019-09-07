'use strict';

var chai = require('chai');
var expect = chai.expect;
var fav = {}; fav.text = {}; fav.text.diff = require('../');
var diff = fav.text.diff;
var applyDiff = require('./tool/apply-diff');

describe('diff: characters', function() {

  describe('Compare same texts', function() {
    it('Should return an empty array when both texts are empty', function() {
      var text1 = '';
      var text2 = '';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array', function() {
      var text1 = 'abcdefg';
      var text2 = 'abcdefg';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array when texts are blanks', function() {
      var text1 = '    ';
      var text2 = '    ';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

   it('Should return an empty array when texts are repeated strings',
    function() {
      var text1 = 'abcabcabc';
      var text2 = 'abcabcabc';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Compare different texts so that diff type is ADD', function() {
    it('Should return diffs of which types are "a"', function() {
      var text1 = 'ac';
      var text2 = 'abc';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start: 1, end: 1 }, dest: { start: 1, end: 2 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return diffs of which types are "a" - multiple matches (1)',
    function() {
      var text1 = 'abcb';
      var text2 = 'abbdbcb';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start: 2, end: 2 }, dest: { start: 2, end: 5 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return diffs of which types are "a" - multiple matches (2)',
    function() {
      var text1 = 'abc';
      var text2 = 'abbdcdc';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start: 2, end: 2 }, dest: { start: 2, end: 4 } },
        { type: 'a', src: { start: 3, end: 3 }, dest: { start: 5, end: 7 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return diffs of which types are "a" - multiple matches (3)',
    function() {
      var text1 = 'abc';
      var text2 = 'acdbecb';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start: 1, end: 1 }, dest: { start: 1, end: 3 } },
        { type: 'a', src: { start: 2, end: 2 }, dest: { start: 4, end: 5 } },
        { type: 'a', src: { start: 3, end: 3 }, dest: { start: 6, end: 7 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Compare different texts so that diff type is DELETE', function() {
    it('Should return diffs of which types are "d"',
    function() {
      var text1 = 'abc';
      var text2 = 'ac';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start: 1, end: 2 }, dest: { start: 1, end: 1 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return diffs of which types are "d" - multiple matches (1)',
    function() {
      var text1 = 'abbdbcb';
      var text2 = 'abcb';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start: 2, end: 5 }, dest: { start: 2, end: 2 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return diffs of which types are "d" - multiple matches (2)',
    function() {
      var text1 = 'abbdcdc';
      var text2 = 'abc';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start: 2, end: 4 }, dest: { start: 2, end: 2 } },
        { type: 'd', src: { start: 5, end: 7 }, dest: { start: 3, end: 3 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return diffs of which types are "d" - multiple matches (3)',
    function() {
      var text1 = 'acdbecb';
      var text2 = 'abc';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start: 1, end: 3 }, dest: { start: 1, end: 1 } },
        { type: 'd', src: { start: 4, end: 5 }, dest: { start: 2, end: 2 } },
        { type: 'd', src: { start: 6, end: 7 }, dest: { start: 3, end: 3 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Compare different texts so that diff type is CHANGE', function() {
    it('Should return diffs of which types are "c"',
    function() {
      var text1 = 'abc';
      var text2 = 'aBc';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'c', src: { start: 1, end: 2 }, dest: { start: 1, end: 2 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return diffs of which types are "c" - multiple matches',
    function() {
      var text1 = 'abcacdbe';
      var text2 = 'aBcaDe';
      var diffs = diff(text1, text2);
      expect(diffs).to.deep.equal([
        { type: 'c', src: { start: 1, end: 2 }, dest: { start: 1, end: 2 } },
        { type: 'c', src: { start: 4, end: 7 }, dest: { start: 4, end: 5 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Options: ignoreCase', function() {
    it('Should compare texts with ignoring upper/lower case', function() {
      var opts = { ignoreCase: true };
      var text1 = 'abcde';
      var text2 = 'aBcEf';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start: 3, end: 4 }, dest: { start: 3, end: 3 } },
        { type: 'a', src: { start: 5, end: 5 }, dest: { start: 4, end: 5 } },
      ]);
      var result = applyDiff(diffs, text1, text2);
      expect(result.toUpperCase()).to.equal(text2.toUpperCase());
    });
  });
});

