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
