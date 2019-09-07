'use strict';

var chai = require('chai');
var expect = chai.expect;
var splitIntoBlocks = require('../../lib/split-into-blocks');

describe('lib/split-into-blocks', function() {

  describe('Split by no delimiter', function() {
    it('Should split an empty text', function() {
      expect(splitIntoBlocks('', {})).to.deep.equals([
        { value: '', start: 0, end: 0, delims: '' },
      ]);
    });

    it('Should split a non-space text', function() {
      expect(splitIntoBlocks('abcdefg', {})).deep.equals([
        { value: 'a', start: 0, end: 1, delims: '' },
        { value: 'b', start: 1, end: 2, delims: '' },
        { value: 'c', start: 2, end: 3, delims: '' },
        { value: 'd', start: 3, end: 4, delims: '' },
        { value: 'e', start: 4, end: 5, delims: '' },
        { value: 'f', start: 5, end: 6, delims: '' },
        { value: 'g', start: 6, end: 7, delims: '' },
        { value: '', start: 7, end: 7, delims: '' },
      ]);
    });
  });

  describe('Split by /\\s/', function() {
    it('Should split an empty text', function() {
      var opts = { delimRe: /\s/ };
      expect(splitIntoBlocks('', opts)).to.deep.equals([
        { value: '', start: 0, end: 0, delims: '' },
      ]);
    });

    it('Should split a text containing no delimiter', function() {
      var opts = { delimRe: /\s/ };
      expect(splitIntoBlocks('abcdefg', opts)).deep.equals([
        { value: 'abcdefg', start: 0, end: 7, delims: '' },
        { value: '', start: 7, end: 7, delims: '' },
      ]);
    });

    it('Should split a text including spaces', function() {
      var opts = { delimRe: /\s/ };
      expect(splitIntoBlocks(' ab cd  ef \t ghi  ', opts)).deep.equals([
        { value: 'ab', start: 1, end: 3, delims: ' ' },
        { value: 'cd', start: 4, end: 6, delims: ' ' },
        { value: 'ef', start: 8, end: 10, delims: '  ' },
        { value: 'ghi', start: 13, end: 16, delims: ' \t ' },
        { value: '', start: 18, end: 18, delims: '  ' },
      ]);
    });
  });

  describe('Split by LF', function() {
    it('Should split an empty text', function() {
      var opts = { delimRe: /\n/ };
      expect(splitIntoBlocks('', opts)).to.deep.equals([
        { value: '', start: 0, end: 0, delims: '' },
      ]);
    });

    it('Should split text into lines', function() {
      var opts = { delimRe: /\n/ };
      expect(splitIntoBlocks('' +
        'abcde\n' +
        '\n' +
        '\n' +
        '\n' +
        'ABCDE\n' +
      '', opts)).to.deep.equals([
        { value: 'abcde', start: 0, end: 5, delims: '' },
        { value: 'ABCDE', start: 9, end: 14, delims: '\n\n\n\n' },
        { value: '', start: 15, end: 15, delims: '\n' },
      ]);
    });
  });

  describe('Options', function() {
    it('Should normalize spaces', function() {
      var opts = { normalizeSpaces: true, delimRe: /[\n]+/ };
      expect(splitIntoBlocks('' +
        '\n' +
        'a b  c \t d     e\n' +
        '\n' +
        '\n' +
        '\n' +
        'AB   C D  E\n' +
      '', opts)).to.deep.equals([
        { value: 'a b c d e', start: 1, end: 17, delims: '\n' },
        { value: 'AB C D E', start: 21, end: 32, delims: '\n\n\n\n' },
        { value: '', start: 33, end: 33, delims: '\n' },
      ]);
    });

    it('Should ignore case when splitting with no delimiter', function() {
      var opts = { ignoreCase: true };
      expect(splitIntoBlocks('aBc', opts)).to.deep.equals([
        { value: 'A', start: 0, end: 1, delims: '' },
        { value: 'B', start: 1, end: 2, delims: '' },
        { value: 'C', start: 2, end: 3, delims: '' },
        { value: '', start: 3, end: 3, delims: '' },
      ]);
    });

    it('Should ignore case when splitting with delimiter', function() {
      var opts = { ignoreCase: true, delimRe: /\n/ };
      expect(splitIntoBlocks('' +
        '\n' +
        'a b  c \t d     e\n' +
        '\n' +
        '\n' +
        '\n' +
        'AB   C D  E\n' +
      '', opts)).to.deep.equals([
        { value: 'A B  C \t D     E', start: 1, end: 17, delims: '\n' },
        { value: 'AB   C D  E', start: 21, end: 32, delims: '\n\n\n\n' },
        { value: '', start: 33, end: 33, delims: '\n' },
      ]);
    });
  });
});
