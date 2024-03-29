'use strict';

var assert = require('assert');
var calcLineNo = require('../../lib/lines/calc-line-no');

function checkPlusStart(text, index, correctedIndex, lineNo) {
  var result = calcLineNo.plusStart(index, text);
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

console.log('-- plus range start');
checkPlusStart('', 0, 0, 0);
checkPlusStart('\n', 0, 0, 0);
checkPlusStart('\n\n', 0, 0, 0);
checkPlusStart('\n\n', 1, 1, 1);

checkPlusStart('aaa\nbbb\nccc\n', 0, 0, 0);
checkPlusStart('aaa\nbbb\nccc\n', 3, 4, 1);
checkPlusStart('aaa\nbbb\nccc\n', 4, 4, 1);
checkPlusStart('aaa\nbbb\nccc\n', 7, 8, 2);
checkPlusStart('aaa\nbbb\nccc\n', 8, 8, 2);
checkPlusStart('aaa\nbbb\nccc\n', 11, 12, 3);

checkPlusStart('aaa\nbbb\nccc\nddd', 11, 12, 3);
checkPlusStart('aaa\nbbb\nccc\nddd', 12, 12, 3);

checkPlusStart('\naaa\nbbb\nccc\n', 0, 0, 0);
checkPlusStart('\naaa\nbbb\nccc\n', 1, 1, 1);
checkPlusStart('\naaa\nbbb\nccc\n', 4, 5, 2);
checkPlusStart('\naaa\nbbb\nccc\n', 5, 5, 2);
checkPlusStart('\naaa\nbbb\nccc\n', 8, 9, 3);
checkPlusStart('\naaa\nbbb\nccc\n', 9, 9, 3);

checkPlusStart('\naaa\nbbb\nccc\nddd', 12, 13, 4);
checkPlusStart('\naaa\nbbb\nccc\nddd', 13, 13, 4);

checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 0, 0, 0);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 1, 1, 1);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 2, 2, 2);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 5, 6, 3);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 6, 6, 3);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 7, 7, 4);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 7, 7, 4);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 10, 11, 5);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 11, 11, 5);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 12, 12, 6);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 15, 16, 7);
checkPlusStart('\n\naaa\n\nbbb\n\nccc\n\n', 16, 16, 7);
