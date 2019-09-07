'use strict';

function formatLineDiff(diffs, text1, text2) {
  var str = '';
  for (var i = 0, n = diffs.length; i < n; i++) {
    var d = diffs[i];

    str += getRange(d.lines.src) + d.type + getRange(d.lines.dest) + '\n';

    switch (d.type) {
      case 'a': {
        str += getLineText('> ', text2, d.dest) + '\n';
        break;
      }
      case 'd': {
        str += getLineText('< ', text1, d.src) + '\n';
        break;
      }
      case 'c': {
        str += getLineText('< ', text1, d.src) + '\n' +
               '---\n' +
               getLineText('> ', text2, d.dest) + '\n';
        break;
      }
    }
  }
  return str;
}

function getRange(range) {
  if (range.start === range.end) {
    return range.start;
  }
  return range.start + ',' + range.end;
}

function getLineText(mark, text, range) {
  return mark + text.slice(range.start, range.end).replace(/\n/g, '\n' + mark);
}

module.exports = formatLineDiff;
