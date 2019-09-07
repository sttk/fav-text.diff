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
