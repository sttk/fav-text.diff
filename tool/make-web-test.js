'use strict';

var listFiles = require('./lib/list-files');
var truncFile = require('./lib/trunc-file');
var concatFile = require('./lib/concat-file');

var path = require('path');
var srcdir = path.resolve(__dirname, '../test');
var tooldir = path.resolve(__dirname, '../test/tool');
var outdir = path.resolve(__dirname, '../test/web');
var outfile = path.resolve(outdir, 'browser-test.js');

truncFile(outfile);
listFiles(srcdir, '.test.js').forEach(bundleFile);
listFiles(tooldir, '.js').forEach(bundleFile);

function bundleFile (filepath) {
  return concatFile(filepath, outfile, function(data) {
    data = data.replace(/[^\r\n]*require *\([^\r\n]*/g, '');
    data = data.replace(/module.exports\s*=\s*([^\s]+)\s*;/,
      'window.$1 = $1;');
    data = '(function(){\n' + data + '\n})();\n';
    return data;
  });
}

