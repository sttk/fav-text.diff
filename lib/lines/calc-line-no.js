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
