'use strict';

var assert = require('assert');
var calcLineNo = require('../../lib/lines/calc-line-no');

function checkPlusEnd(text, index, correctedIndex, lineNo) {
  var result = calcLineNo.plusEnd(index, text);
  log(result, text, result.index);
  assert.deepEqual(result, {
    index: correctedIndex,
    lineNo: lineNo,
  });
}

function log(result, text, end) {
  var s = text.slice(0, end) + '|' + text.slice(end);
  s = s.replace(/\n/g, '\\n');
  console.log(result.lineNo, result.index, s);
}

console.log('-- plus range end');

checkPlusEnd('a', 1, 1, 1);
checkPlusEnd('aaa', 3, 3, 1);
checkPlusEnd('aaa\n', 3, 3, 1);
checkPlusEnd('aaa\n', 4, 4, 2);
checkPlusEnd('aaa\nbbb', 3, 3, 1);
checkPlusEnd('aaa\nbbb', 4, 3, 1);
checkPlusEnd('aaa\nbbb', 7, 7, 2);
checkPlusEnd('aaa\nbbb\n', 7, 7, 2);
checkPlusEnd('aaa\nbbb\n', 8, 8, 3);

checkPlusEnd('\na', 1, 0, 1);
checkPlusEnd('\na', 2, 2, 2);
checkPlusEnd('\naaa', 1, 0, 1);
checkPlusEnd('\naaa', 4, 4, 2);
checkPlusEnd('\naaa\n', 4, 4, 2);
checkPlusEnd('\naaa\n', 5, 5, 3);
checkPlusEnd('\naaa\nbbb', 4, 4, 2);
checkPlusEnd('\naaa\nbbb', 5, 4, 2);
checkPlusEnd('\naaa\nbbb', 8, 8, 3);
checkPlusEnd('\naaa\nbbb\n', 8, 8, 3);
checkPlusEnd('\naaa\nbbb\n', 9, 9, 4);
checkPlusEnd('\naaa\nbbb\nccc', 8, 8, 3);
checkPlusEnd('\naaa\nbbb\nccc', 9, 8, 3);
checkPlusEnd('\naaa\nbbb\nccc', 12, 12, 4);

checkPlusEnd('\n\naaa\n\nbbb\n\n', 1, 0, 1);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 2, 1, 2);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 5, 5, 3);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 6, 5, 3);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 7, 6, 4);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 10, 10, 5);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 11, 10, 5);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 12, 11, 6);
checkPlusEnd('\n\naaa\n\nbbb\n\n', 13, 13, 7);

checkPlusEnd('\n', 1, 0, 1);
checkPlusEnd('\n\n', 1, 0, 1);
checkPlusEnd('\n\n', 2, 1, 2);
checkPlusEnd('\n\n\n', 1, 0, 1);
checkPlusEnd('\n\n\n', 2, 1, 2);
checkPlusEnd('\n\n\n', 3, 2, 3);

checkPlusEnd('\naaa\n\nbbb\nccc\n', 1, 0, 1);
checkPlusEnd('\naaa\n\nbbb\nccc\n', 4, 4, 2);
checkPlusEnd('\naaa\n\nbbb\nccc\n', 5, 4, 2);
checkPlusEnd('\naaa\n\nbbb\nccc\n', 6, 5, 3);
