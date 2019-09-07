'use strict';

const BenchmarkTester = require('benchmark-tester');
const assert = require('assert');

const chars1 = 'beep boop';
const chars2 = 'beep boob blah';

const lines1 = 'beep\n\nboop\n';
const lines2 = 'beep\nboob\n\nblah';

new BenchmarkTester()

   // Characters

  .addTest('@fav/text.diff', function(diff, data) {
    return diff(data[0], data[1]);
  })
  .verifyTest('@fav/text.diff', function(testFn, diff) {
    assert.deepEqual(testFn(diff, [chars1, chars2]), [
      { type: 'c', src: { start: 8, end: 9 }, dest: { start: 8, end: 14 } },
    ]);
  })
  .addTest('diff', function(diff, data) {
    return diff.diffChars(data[0], data[1]);
  })
  .verifyTest('diff', function(testFn, diff) {
    assert.deepEqual(testFn(diff, [chars1, chars2]), [
      { count: 8, value: 'beep boo' },
      { count: 1, added: undefined, removed: true, value: 'p' },
      { count: 6, added: true, removed: undefined, value: 'b blah' },
    ]);
  })
  .addTest('fast-diff', function(diff, data) {
    return diff(data[0], data[1]);
  })
  .verifyTest('fast-diff', function(testFn, diff) {
    assert.deepEqual(testFn(diff, [chars1, chars2]), [
      [0, 'beep boo'],
      [-1, 'p'],
      [1, 'b blah'],
    ]);
  })
  .runTest('diff chars', [chars1, chars2])

  // Words

  .addTest('@fav/text.diff', function(diff, data) {
    return diff(data[0], data[1], { delimRe: /\s+/ });
  })
  .verifyTest('@fav/text.diff', function(testFn, diff) {
    assert.deepEqual(testFn(diff, [chars1, chars2]), [
      { type: 'c', src: { start: 5, end: 9 }, dest: { start: 5, end: 14 } },
    ]);
  })
  .addTest('diff', function(diff, data) {
    return diff.diffWords(data[0], data[1]);
  })
  .verifyTest('diff', function(testFn, diff) {
    assert.deepEqual(testFn(diff, [chars1, chars2]), [
      { count: 2, value: 'beep ' },
      { count: 1, added: undefined, removed: true, value: 'boop' },
      { count: 3, added: true, removed: undefined, value: 'boob blah' },
    ]);
  })
  .addTest('fast-diff', function() {
    throw new Error();
  })
  .runTest('diff words', [chars1, chars2])

  // Lines

  .addTest('@fav/text.diff', function(diff, data) {
    return diff(data[0], data[1], { delimRe: /\n+/ });
  })
  .verifyTest('@fav/text.diff', function(testFn, diff) {
    assert.deepEqual(testFn(diff, [lines1, lines2]), [
      { type: 'c', src: { start:6, end:11 }, dest: { start: 6, end:15 } },
    ]);
  })
  .addTest('diff', function(diff, data) {
    return diff.diffLines(data[0], data[1]);
  })
  .verifyTest('diff', function(testFn, diff) {
    assert.deepEqual(testFn(diff, [lines1, lines2]), [
      { count: 1, value: 'beep\n' },
      { count: 1, added: true, removed: undefined, value: 'boob\n' },
      { count: 1, value: '\n' },
      { count: 1, added: undefined, removed: true, value: 'boop\n' },
      { count: 1, added: true, removed: undefined, value: 'blah' },
    ]);
  })
  .addTest('fast-diff', function() {
    throw new Error();
  })
  .runTest('diff lines', [lines1, lines2])
  .print();
