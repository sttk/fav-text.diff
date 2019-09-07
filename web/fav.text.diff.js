(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.fav||(g.fav = {}));g=(g.text||(g.text = {}));g.diff = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var splitIntoBlocks = require('./lib/split-into-blocks');
var matchBlocks = require('./lib/match-blocks');
var findMostMatchingPath = require('./lib/find-most-matching-path');
var diffFromMatchingPath = require('./lib/diff-from-matching-path');
var convertLineDiff = require('./lib/lines/convert-line-diff');

function diff(text1, text2, opts) {
  opts = opts || {};

  var blocks1 = splitIntoBlocks(text1, opts);
  var blocks2 = splitIntoBlocks(text2, opts);

  var matchings = matchBlocks(blocks1, blocks2);

  var maxMatchingSize = Math.min(blocks1.length, blocks2.length);
  var matchingPath = findMostMatchingPath(matchings, maxMatchingSize);

  return diffFromMatchingPath(matchingPath, blocks1, blocks2);
}

Object.defineProperties(diff, {
  lines: {
    enumerable: true,
    value: function(text1, text2, opts) {
      opts = opts || {};
      opts.delimRe = /\n+/;
      var diffs = diff(text1, text2, opts);
      return convertLineDiff(diffs, text1, text2);
    },
  },
});

module.exports = diff;

},{"./lib/diff-from-matching-path":2,"./lib/find-most-matching-path":3,"./lib/lines/convert-line-diff":5,"./lib/match-blocks":6,"./lib/split-into-blocks":7}],2:[function(require,module,exports){
'use strict';

function diffFromMatchingPath(matchingPath, blocks1, blocks2) {
  var diffs = [];
  var i1 = -1, i2 = -1;

  for (var i = 0; i < matchingPath.length; i++) {
    var m = matchingPath[i];
    if (m == null) {
      continue;
    }

    var type = getEditType(i - i1 - 1, m - i2 - 1);
    if (type) {
      registerDiff(diffs, type, blocks1, i1 + 1, i, blocks2, i2 + 1, m);
    }

    registerDelimDiff(diffs, blocks1, i, blocks2, m);

    i1 = i;
    i2 = m;
  }

  return diffs;
}

function getEditType(blockCount1, blockCount2) {
  if (blockCount1) {
    if (blockCount2) {
      return 'c';
    } else {
      return 'd';
    }
  } else if (blockCount2) {
    return 'a';
  }
}

function registerDiff(diffs, type, blocks1, st1, ed1, blocks2, st2, ed2) {
  var src = blockIndexesToTextIndexes(blocks1, st1, ed1);
  var dst = blockIndexesToTextIndexes(blocks2, st2, ed2);

  trimBothStartDelims(src, dst);

  diffs.push({
    type: type,
    src: { start: src.start, end: src.end },
    dest: { start: dst.start, end: dst.end },
  });
}

function blockIndexesToTextIndexes(blocks, blockStart, blockEnd) {
  var textStart, textEnd, delims;

  var block = blocks[blockStart];
  textStart = block.start - block.delims.length;

  if (blockStart < blockEnd) {
    block = blocks[blockEnd - 1];
    textEnd = block.end;
    delims = block.delims;
  } else {
    textEnd = textStart;
    delims = '';
  }

  return {
    start: textStart,
    end: textEnd,
    delims: delims,
  };
}

function registerDelimDiff(diffs, blocks1, index1, blocks2, index2) {
  var block1 = blocks1[index1];
  var block2 = blocks2[index2];

  var src = {
    start: block1.start - block1.delims.length,
    end: block1.start,
    delims: block1.delims,
  };
  var dst = {
    start: block2.start - block2.delims.length,
    end: block2.start,
    delims: block2.delims,
  };

  if (src.delims === dst.delims) {
    return;
  }

  if (mergeToPrevDiffIfPossible(diffs[diffs.length - 1], src, dst)) {
    return;
  }

  trimBothStartDelims(src, dst);
  trimBothEndDelims(src, dst);

  var type = getEditType(src.delims.length, dst.delims.length);
  diffs.push({
    type: type,
    src: { start: src.start, end: src.end },
    dest: { start: dst.start, end: dst.end },
  });
}

function mergeToPrevDiffIfPossible(prevDiff, src, dst) {
  if (prevDiff &&
      prevDiff.src.end === src.start &&
      prevDiff.dest.end === dst.start) {

    trimBothEndDelims(src, dst);

    var type = getEditType(src.delims.length, dst.delims.length);
    prevDiff.type = (prevDiff.type === type) ? type : 'c';
    prevDiff.src.end = src.end;
    prevDiff.dest.end = dst.end;
    return true;
  }
}

function trimBothStartDelims(src, dst) {
  var i = 0, n = Math.min(src.delims.length, dst.delims.length);
  for (; i < n; i++) {
    if (src.delims[i] !== dst.delims[i]) {
      break;
    }
  }

  src.start += i;
  dst.start += i;
  src.delims = src.delims.slice(i);
  dst.delims = dst.delims.slice(i);
}

function trimBothEndDelims(src, dst) {
  var n1 = src.delims.length, n2 = dst.delims.length;
  var i = 0, n = Math.min(n1, n2);
  for (; i < n; i++) {
    if (src.delims[n1 - 1 - i] !== dst.delims[n2 - 1 - i]) {
      break;
    }
  }

  src.end -= i;
  dst.end -= i;
  src.delims = src.delims.slice(0, n1 - i);
  dst.delims = dst.delims.slice(0, n2 - i);
}

module.exports = diffFromMatchingPath;

},{}],3:[function(require,module,exports){
'use strict';

function findMostMatchingPath(matches, maxMatchingSize) {
  var passedIndexes = new Array(matches.length);
  var mostMatching = { path: [], size: 0 };

  for (var i = 0, n = matches.length; i < n; i++) {
    if (passedIndexes[i]) {
      continue;
    }
    var matching = findMatchingPath(matches, i, passedIndexes);
    if (!matching) {
      continue;
    }
    if (matching.size >= maxMatchingSize) {
      mostMatching = matching;
      break;
    }
    if (matching.size > mostMatching.size) {
      mostMatching = matching;
    }
  }

  return mostMatching.path;
}

function findMatchingPath(matches, mustIndex, passedIndexes) {
  var mustMatch = matches[mustIndex];
  if (mustMatch.length === 0) {
    return null;
  }
  var mustMatchIndex = mustMatch[0];
  passedIndexes[mustIndex] = true;

  var matchingPath = [];
  matchingPath[mustIndex] = mustMatchIndex;
  var matchingSize = 1;

  var followingMatchIndex = mustMatchIndex;
  L1: for (var i1 = mustIndex - 1; i1 >= 0; i1--) {
    for (var j1 = matches[i1].length - 1; j1 >= 0; j1--) {
      if (matches[i1][j1] < followingMatchIndex) {
        followingMatchIndex = matchingPath[i1] = matches[i1][j1];
        matchingSize++;
        continue L1;
      }
    }
    matchingPath[i1] = undefined;
  }

  var previousMatchIndex = mustMatchIndex;
  L2: for (var i2 = mustIndex + 1, n2 = matches.length; i2 < n2; i2++) {
    for (var j2 = 0; j2 < matches[i2].length; j2++) {
      if (matches[i2][j2] > previousMatchIndex) {
        previousMatchIndex = matchingPath[i2] = matches[i2][j2];
        matchingSize++;
        if (j2 === 0) {
          passedIndexes[i2] = true;
        }
        continue L2;
      }
    }
    matchingPath[i2] = undefined;
  }

  return {
    path: matchingPath,
    size: matchingSize,
  };
}

module.exports = findMostMatchingPath;

},{}],4:[function(require,module,exports){
'use strict';

function plusStart(index, text) {
  if (text[index] === '\n') {
    if (index > 0 && text[index - 1] !== '\n') {
      index++;
    }
  }
  var lineNo = text.slice(0, index).replace(/[^\n]/g, '').length + 1;
  return {
    index: index,
    lineNo: lineNo,
  };
}

function plusEnd(index, text) {
  var lineNo = text.slice(0, index - 1).replace(/[^\n]/g, '').length + 1;
  if (index > 0 && text[index - 1] === '\n') {
    if (index > 1 && text[index - 2] !== '\n' && index === text.length) {
      lineNo++;
    } else {
      index--;
    }
  }
  return {
    index: index,
    lineNo: lineNo,
  };
}

function minusPos(index, text) {
  var lineNo = text.slice(0, index).replace(/[^\n]/g, '').length;
  if (index > 0 && text[index - 1] !== '\n') {
    lineNo++;
    if (text[index] === '\n') {
      index++;
    }
  }
  return {
    index: index,
    lineNo: lineNo,
  };
}

module.exports = {
  plusStart: plusStart,
  plusEnd: plusEnd,
  minusPos: minusPos,
};

},{}],5:[function(require,module,exports){
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

},{"./calc-line-no":4}],6:[function(require,module,exports){
'use strict';

function matchBlocks(blocks1, blocks2) {
  var matchings = new Array(blocks1.length);

  var i = 0;
  var n = Math.min(blocks1.length, blocks2.length);

  for (; i < n; i++) {
    if (blocks1[i].value !== blocks2[i].value) {
      break;
    }
    matchings[i] = [i];
  }

  for (var i1 = i, n1 = blocks1.length; i1 < n1; i1++) {
    matchings[i1] = [];
    for (var i2 = i, n2 = blocks2.length; i2 < n2; i2++) {
      if (blocks1[i1].value === blocks2[i2].value) {
        matchings[i1].push(i2);
      }
    }
  }

  return matchings;
}

module.exports = matchBlocks;

},{}],7:[function(require,module,exports){
'use strict';

function splitIntoBlocks(text, opts) {
  if (opts.delimRe instanceof RegExp) {
    return splitByDelimiter(text, opts);
  }
  return splitIntoChars(text, opts);
}

function splitIntoChars(text, opts) {
  if (opts.ignoreCase) {
    text = text.toUpperCase();
  }

  var n = text.length;
  var blocks = new Array(n + 1);

  for (var i = 0; i < n; i++) {
    blocks[i] = {
      value: text[i],  // Compared character
      start: i,        // Start index in original text
      end: i + 1,      // End index in original text
      delims: '',      // Precedent delimiters
    };
  }

  blocks[n] = {
    value: '',
    start: n,
    end: n,
    delims: '',
  };

  return blocks;
}

function splitByDelimiter(text, opts) {
  var blocks = [];
  var delims = '', start = 0;

  while (text) {
    var rs = opts.delimRe.exec(text);
    if (!rs) {
      var end = start + text.length;

      blocks.push({
        value: convertWithOpts(text, opts),
        start: start,
        end: end,
        delims: delims,
      });

      start = end;
      delims = '';
      break;
    }

    if (rs.index > 0) {
      blocks.push({
        value: convertWithOpts(text.slice(0, rs.index), opts),
        start: start,
        end: start + rs.index,
        delims: delims,
      });

      var blockLen = rs.index + rs[0].length;
      start += blockLen;
      delims = rs[0];
      text = text.slice(blockLen);
      continue;
    }

    start += rs[0].length;
    delims += rs[0];
    text = text.slice(rs[0].length);
  }

  blocks.push({
    value: '',
    start: start,
    end: start,
    delims: delims,
  });

  return blocks;
}

function convertWithOpts(text, opts) {
  if (opts.normalizeSpaces) {
    text = text.replace(/\s+/g, ' ');
  }
  if (opts.ignoreCase) {
    text = text.toUpperCase();
  }
  return text;
}

module.exports = splitIntoBlocks;

},{}]},{},[1])(1)
});
