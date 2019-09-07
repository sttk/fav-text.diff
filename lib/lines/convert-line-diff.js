'use strict';

var calcLineNo = require('./calc-line-no');

function convertLineDiff(diffs, text1, text2) {
  for (var i = 0, n = diffs.length; i < n; i++) {
    var aDiff = diffs[i];
    switch (aDiff.type) {
      case 'a': {
        convertAddDiff(aDiff, text1, text2);
        break;
      }
      case 'd': {
        convertDeleteDiff(aDiff, text1, text2);
        break;
      }
      case 'c': {
        convertChangeDiff(aDiff, text1, text2);
        break;
      }
    }
  }
  return diffs;
}

function convertAddDiff(aDiff, text1, text2) {
  var st1 = calcLineNo.minusPos(aDiff.src.start, text1);
  var st2 = calcLineNo.plusStart(aDiff.dest.start, text2);
  var ed2 = calcLineNo.plusEnd(aDiff.dest.end, text2);
  setDiff(aDiff, st1, st1, st2, ed2);
}

function convertDeleteDiff(aDiff, text1, text2) {
  var st1 = calcLineNo.plusStart(aDiff.src.start, text1);
  var ed1 = calcLineNo.plusEnd(aDiff.src.end, text1);
  var st2 = calcLineNo.minusPos(aDiff.dest.start, text2);
  setDiff(aDiff, st1, ed1, st2, st2);
}

function convertChangeDiff(aDiff, text1, text2) {
  var st1 = calcLineNo.plusStart(aDiff.src.start, text1);
  var ed1 = calcLineNo.plusEnd(aDiff.src.end, text1);
  var st2 = calcLineNo.plusStart(aDiff.dest.start, text2);
  var ed2 = calcLineNo.plusEnd(aDiff.dest.end, text2);
  setDiff(aDiff, st1, ed1, st2, ed2);
}

function setDiff(aDiff, st1, ed1, st2, ed2) {
  aDiff.src = { start: st1.index, end: ed1.index },
  aDiff.dest = { start: st2.index, end: ed2.index },
  aDiff.lines = {
    src: { start: st1.lineNo, end: ed1.lineNo },
    dest: { start: st2.lineNo, end: ed2.lineNo },
  };
}

module.exports = convertLineDiff;
