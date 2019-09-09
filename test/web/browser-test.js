(function(){
'use strict';


var expect = chai.expect;

var diff = fav.text.diff;


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


})();
(function(){
'use strict';


var expect = chai.expect;

var diff = fav.text.diff;



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

})();
(function(){
'use strict';


var expect = chai.expect;

var diff = fav.text.diff;


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

})();
(function(){
'use strict';

function applyDiff(diffs, text1, text2) {
  for (var i = diffs.length - 1; i >= 0; i--) {
    var d = diffs[i];
    switch (d.type) {
      case 'a': {
        text1 = text1.slice(0, d.src.start) +
                text2.slice(d.dest.start, d.dest.end) +
                text1.slice(d.src.end);
        break;
      }
      case 'd': {
        text1 = text1.slice(0, d.src.start) +
                text1.slice(d.src.end);
        break;
      }
      case 'c': {
        text1 = text1.slice(0, d.src.start) +
                text2.slice(d.dest.start, d.dest.end) +
                text1.slice(d.src.end);
        break;
      }
    }
  }

  return text1;
}

window.applyDiff = applyDiff;

})();
(function(){
'use strict';

function formatLineDiff(diffs, text1, text2) {
  var str = '';
  for (var i = 0, n = diffs.length; i < n; i++) {
    var d = diffs[i];

    str += getRange(d.lines.src) + d.type + getRange(d.lines.dest) + '\n';

    switch (d.type) {
      case 'a': {
        str += getLineText('> ', text2, d.dest) + '\n';
        break;
      }
      case 'd': {
        str += getLineText('< ', text1, d.src) + '\n';
        break;
      }
      case 'c': {
        str += getLineText('< ', text1, d.src) + '\n' +
               '---\n' +
               getLineText('> ', text2, d.dest) + '\n';
        break;
      }
    }
  }
  return str;
}

function getRange(range) {
  if (range.start === range.end) { // minus line No
    return range.start;
  }

  var st = range.start + 1;  // start index to first line No (1 origin)
  var ed = range.end;        // end index to last line No
  if (st === ed) {
    return st;
  }
  return st + ',' + ed;
}

function getLineText(mark, text, range) {
  return mark + text.slice(range.start, range.end).replace(/\n/g, '\n' + mark);
}

window.formatLineDiff = formatLineDiff;

})();
