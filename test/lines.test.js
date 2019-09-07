'use strict';

var chai = require('chai');
var expect = chai.expect;
var fav = {}; fav.text = {}; fav.text.diff = require('../');
var diff = fav.text.diff;
var applyDiff = require('./tool/apply-diff');
var formatLineDiff = require('./tool/format-line-diff');

describe('diff: lines', function() {

  describe('Compare same lines', function() {
    it('Should return an empty array when both texts are empty', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '';
      var text2 = '';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '\nabc\ndef\nghi\n';
      var text2 = '\nabc\ndef\nghi\n';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array when texts are blanks', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '    ';
      var text2 = '    ';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array when texts are only delimiters',
    function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '\n\n\n\n';
      var text2 = '\n\n\n\n';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });

    it('Should return an empty array when texts are repeated strings',
    function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '\nabc\nabc\nabc\n';
      var text2 = '\nabc\nabc\nabc\n';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
    });
  });

  describe('Compare different texts so that diff type is ADD', function() {
    it('Should compare a text and a text added last', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = 'abc\ndef\nghi';
      var text2 = 'abc\ndef\nghi\njkl';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start:11, end:11 }, dest: { start:11, end:15 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '3a4\n' +
        '> jkl\n' +
      '');
    });

    it('Should compare a text and a text added first', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = 'abc\ndef\nghi';
      var text2 = '\njkl\n\nabc\ndef\nghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start:0, end:0 }, dest: { start:0, end:6 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '0a1,3\n' +
        '> \n' +
        '> jkl\n' +
        '> \n' +
      '');
    });

    it('Should compare a text and a text added in the middle', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = 'abc\ndef\nghi';
      var text2 = 'abc\n\njkl\n\n\ndef\nghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start:3, end:3 }, dest: { start:3, end:10 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '1a2,4\n' +
        '> \n' +
        '> jkl\n' +
        '> \n' +
      '');
    });

    it('Should compare a text and an added text', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '' +
        '\n' +
        'a\n' +
        'b\n' +
        '\n' +
        'b\n' +
        '\n' +
        'c\n' +
        '\n' +
      '';
      var text2 = '' +
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
      '';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start:1, end:1 }, dest: { start:1, end:2 } },
        { type: 'a', src: { start:3, end:3 }, dest: { start:4, end:5 } },
        { type: 'a', src: { start:4, end:4 }, dest: { start:6, end:11 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '1a2\n' +
        '> \n' +
        '2a4\n' +
        '> \n' +
        '3a6,8\n'  +
        '> c\n' +
        '> \n' +
        '> a\n' +
      '');
    });

    it('Should compare a text and an added text', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '';
      var text2 = 'abc\ndef\nghi\n';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start:0, end:0 }, dest: { start:0, end:12 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '0a1,4\n' +
        '> abc\n' +
        '> def\n' +
        '> ghi\n' +
        '> \n' +
      '');
    });
  });

  describe('Compare different texts so that diff type is DELETE', function() {
    it('Should compare a text and a text deleted last', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = 'abc\ndef\nghi\njkl';
      var text2 = 'abc\ndef\nghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start:11, end:15 }, dest: { start:11, end:11 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '4d3\n' +
        '< jkl\n' +
      '');
    });

    it('Should compare a text and a text added first', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = '\njkl\n\nabc\ndef\nghi';
      var text2 = 'abc\ndef\nghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start:0, end:6 }, dest: { start:0, end:0 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '1,3d0\n' +
        '< \n' +
        '< jkl\n' +
        '< \n' +
      '');
    });

    it('Should compare a text and a text added in the middle', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = 'abc\n\njkl\n\n\ndef\nghi';
      var text2 = 'abc\ndef\nghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start:3, end:10 }, dest: { start:3, end:3 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '2,4d1\n' +
        '< \n' +
        '< jkl\n' +
        '< \n' +
      '');
    });
  });

  describe('Compare different texts so that diff type is CHANGE', function() {
    it('Should compare a text and a text changed last', function() {
      var opts = { delimRe: /\n+/ };
      var text1 = 'abc\ndef\nghj\n';
      var text2 = 'abc\ndef\nghi';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'c', src: { start:8, end:12 }, dest: { start:8, end:11 } },
      ]);
      expect(applyDiff(diffs, text1, text2)).to.equal(text2);
      var lineDiffs = diff.lines(text1, text2);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '3,4c3\n' +
        '< ghj\n' +
        '< \n' +
        '---\n' +
        '> ghi\n' +
      '');
    });
  });

  describe('Options: normalizeSpaces', function() {
    it('Should compare texts with treating multiple blanks as single space',
    function() {
      var opts = { normalizeSpaces: true, delimRe: /\n+/ };
      var text1 = '' +
        '\n' +
        'a b  c \t d     e\n' +
        '\n' +
        '\n' +
        '\n' +
        'AB   C D  E\n' +
        'fgh' +
      '';
      var text2 = '' +
        '\n' +
        'a b c d e\n' +
        '\n' +
        'AB C D E\n' +
        'fgi' +
      '';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'd', src: { start:19, end:21 }, dest: { start:12, end:12 } },
        { type: 'c', src: { start:33, end:36 }, dest: { start:21, end:24 } },
      ]);
      expect(applyDiff(diffs, text1, text2).replace(/\s+/g, ' '))
        .to.equal(text2.replace(/\s+/g, ' '));
      var lineDiffs = diff.lines(text1, text2, opts);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '4,5d3\n' +
        '< \n' +
        '< \n' +
        '7c5\n' +
        '< fgh\n' +
        '---\n' +
        '> fgi\n' +
      '');
    });
  });

  describe('Options: ignoreCase', function() {
    it('Should compare texts with ignoring upper/lower case', function() {
      var opts = { ignoreCase: true, delimRe: /\n+/ };
      var text1 = '' +
        '\n' +
        'a b  c \t d     e\n' +
        '\n' +
        'AB   C D  E\n' +
        'fgh\n' +
      '';
      var text2 = '' +
        '\n' +
        'a B  c \t D     e\n' +
        '\n' +
        '\n' +
        '\n' +
        'ab   c d  e\n' +
        'fgi\n' +
      '';
      var diffs = diff(text1, text2, opts);
      expect(diffs).to.deep.equal([
        { type: 'a', src: { start:19, end:19 }, dest: { start:19, end:21 } },
        { type: 'c', src: { start:31, end:34 }, dest: { start:33, end:36 } },
      ]);
      var lineDiffs = diff.lines(text1, text2, opts);
      expect(formatLineDiff(lineDiffs, text1, text2)).to.equal('' +
        '3a4,5\n' +
        '> \n' +
        '> \n' +
        '5c7\n' +
        '< fgh\n' +
        '---\n' +
        '> fgi\n' +
      '');
    });
  });
});
