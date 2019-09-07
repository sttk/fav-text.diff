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
