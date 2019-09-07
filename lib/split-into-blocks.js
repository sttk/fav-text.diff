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
