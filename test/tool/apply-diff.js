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

module.exports = applyDiff;
