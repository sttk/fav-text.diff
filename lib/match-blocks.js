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
