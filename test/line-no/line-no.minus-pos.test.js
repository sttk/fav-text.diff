'use strict';

var assert = require('assert');
var calcLineNo = require('../../lib/lines/calc-line-no');

function checkMinusPos(text, index, correctedIndex, lineNo) {
  var result = calcLineNo.minusPos(index, text);
  log(result, text, result.index);
  assert.deepEqual(result, {
    index: correctedIndex,
    lineNo: lineNo,
  });
}

function log(result, text, start) {
  var s = text.slice(0, start) + '|' + text.slice(start);
  s = s.replace(/\n/g, '\\n');
  console.log(result.lineNo, result.index, s);
}

console.log('-- minus position');

checkMinusPos('', 0, 0, 0);
checkMinusPos('\n', 0, 0, 0);
checkMinusPos('\n', 1, 1, 1);
checkMinusPos('\n\n', 0, 0, 0);
checkMinusPos('\n\n', 1, 1, 1);
checkMinusPos('\n\n', 2, 2, 2);

checkMinusPos('aaa\nbbb\nccc\n', 0, 0, 0);
checkMinusPos('aaa\nbbb\nccc\n', 3, 4, 1);
checkMinusPos('aaa\nbbb\nccc\n', 4, 4, 1);
checkMinusPos('aaa\nbbb\nccc\n', 7, 8, 2);
checkMinusPos('aaa\nbbb\nccc\n', 8, 8, 2);
checkMinusPos('aaa\nbbb\nccc\n', 11, 12, 3);
checkMinusPos('aaa\nbbb\nccc\n', 12, 12, 3);

checkMinusPos('aaa\nbbb\nccc', 11, 11, 3);

checkMinusPos('\naaa\nbbb\nccc\n', 0, 0, 0);
checkMinusPos('\naaa\nbbb\nccc\n', 1, 1, 1);
checkMinusPos('\naaa\nbbb\nccc\n', 4, 5, 2);
checkMinusPos('\naaa\nbbb\nccc\n', 5, 5, 2);
checkMinusPos('\naaa\nbbb\nccc\n', 8, 9, 3);
checkMinusPos('\naaa\nbbb\nccc\n', 9, 9, 3);
checkMinusPos('\naaa\nbbb\nccc\n', 12, 13, 4);
checkMinusPos('\naaa\nbbb\nccc\n', 13, 13, 4);

checkMinusPos('\naaa\nbbb\nccc', 12, 12, 4);

checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 0, 0, 0);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 1, 1, 1);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 2, 2, 2);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 5, 6, 3);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 6, 6, 3);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 7, 7, 4);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 10, 11, 5);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 11, 11, 5);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 12, 12, 6);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 15, 16, 7);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 16, 16, 7);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n', 17, 17, 8);

checkMinusPos('\n\naaa\n\nbbb\n\nccc', 15, 15, 7);

checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n\n', 15, 16, 7);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n\n', 16, 16, 7);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n\n', 17, 17, 8);
checkMinusPos('\n\naaa\n\nbbb\n\nccc\n\n\n', 18, 18, 9);
