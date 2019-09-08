# [@fav/text.diff][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage status][coverage-img]][coverage-url]

Get diff between two texts.

> "fav" is an abbreviation of "favorite" and also the acronym of "for all versions".
> This package is intended to support all Node.js versions and many browsers as possible.
> At least, this package supports Node.js >= v0.10 and major Web browsers: Chrome, Firefox, IE11, Edge, Vivaldi and Safari.


## Install

To install from npm:

```sh
$ npm install --save @fav/text.diff
```

***NOTE:*** *npm < 2.7.0 does not support scoped package, but even old version Node.js supports it. So when you use such older npm, you should download this package from [github.com][repo-url], and move it in `node_modules/@fav/text.diff/` directory manually.*


## Usage

For Node.js:

```js
var diff = require('@fav/text.diff');
diff('AB', 'ABC')
// => [{ type: 'a', src: { start: 2, end: 2 }, dest: { start: 2, end: 3 } }]
diff('ABC', 'BC')
// => [{ type: 'd', src: { start: 0, end: 1 }, dest: { start: 0, end: 0 } }]
diff('abc', 'adc')
// => [{ type: 'c', src: { start: 1, end: 2 }, dest: { start: 1, end: 2 } }]
```

For Web browsers:

```html
<script src="fav.text.diff.min.js"></script>
<script>
var diff = fav.text.diff;
diff('AB', 'ABC')
// => [{ type: 'a', src: { start: 2, end: 2 }, dest: { start: 2, end: 3 } }]
diff('ABC', 'BC')
// => [{ type: 'd', src: { start: 0, end: 1 }, dest: { start: 0, end: 0 } }]
diff('abc', 'adc')
// => [{ type: 'c', src: { start: 1, end: 2 }, dest: { start: 1, end: 2 } }]
</script>
```


## API

### <u>diff(srcText, destText [, opts]) => Array</u>

Get differenece of two texts.
The result is an array of edit infos from *srcText* to *destText*.

#### Parameter:

| Parameter  |  Type  |  Description                            |
|:-----------|:------:|:----------------------------------------|
| *srcText*  | string | A text before editing.                  |
| *destText* | string | A text after editing.                   |
| *opts*     | object | comparing options.                      |

The comparing options are as follows:

| Option       |  Type  | Description                               |
|:-------------|:------:|:------------------------------------------|
| `delimRe`    | RegExp | A regular expression to split text blocks. If this option is not specified, this function splits and compares by characters. |
| `ignoreCase` | boolean| If true, this function compares text blocks with ignoring upper/lower case. |
| `normalizeSpaces` | boolean | If true, this function compares text blocks with replacing continuous whitespaces included them to one whitespace. |

#### Return:

The array of edit informations.
The edit info is an object of which properties is as follows:

| Property | Description                                        |
|:---------|:---------------------------------------------------|
| `type`   | The edit type. This property can have following values: `'a'` (Adding), `'d'` (Deleting), and `'c'` (Changing). |
| `src`    | The range of indexies in *srcText* to be editted. This is an object which has two indexes: `start` and `end`.  |
| `dest`   | The range of indexies in *destText* to be editted. This is an object which has two indexes: `start` and `end`.  |

### <u>diff.lines(srcText, destText [, opts]) => Array</u>

Get difference of two texts by line. The result is an array of edit infos from *srcText* to *destText*.

| Parameter  |  Type  |  Description                            |
|:-----------|:------:|:----------------------------------------|
| *srcText*  | string | A text before editing.                  |
| *destText* | string | A text after editing.                   |
| *opts*     | object | comparing options.                      |

The comparing options are as follows:

| Option       |  Type  | Description                               |
|:-------------|:------:|:------------------------------------------|
| `ignoreCase` | boolean| If true, this function compares text blocks with ignoring upper/lower case. |
| `normalizeSpaces` | boolean | If true, this function compares text blocks with replacing continuous whitespaces included them to one whitespace. |

#### Return:

The array of edit informations.
The edit info is an object of which properties is as follows:

| Property | Description                                        |
|:---------|:---------------------------------------------------|
| `type`   | The edit type. This property can have following values: `'a'` (Adding), `'d'` (Deleting), and `'c'` (Changing). |
| `src`    | The range of indexies in *srcText* to be editted. This is an object which has two indexes: `start` and `end`.  |
| `dest`   | The range of indexies in *destText* to be editted. This is an object which has two indexes: `start` and `end`.  |
| `lines.src`    | The range of line numbers in *srcText* to be editted. This is an object which has two line numbers: `start` and `end`.  |
| `lines.dest`   | The range of line numbers in *destText* to be editted. This is an object which has two line numbers: `start` and `end`.  |

## Checked                                                                      

### Node.js (4〜12)

| Platform  |   11   |   12   |
|:---------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|

| Platform  |   4    |   5    |   6    |   7    |   8    |   9    |   10   |
|:---------:|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### io.js (1〜3)

| Platform  |   1    |   2    |   3    |
|:---------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|

### Node.js (〜0.12)

| Platform  |  0.8   |  0.9   |  0.10  |  0.11  |  0.12  |
|:---------:|:------:|:------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Windows10 |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|&#x25ef;|

### Web browsers

| Platform  | Chrome | Firefox | Vivaldi | Safari |  Edge  | IE11   |
|:---------:|:------:|:-------:|:-------:|:------:|:------:|:------:|
| macOS     |&#x25ef;|&#x25ef; |&#x25ef; |&#x25ef;|   --   |   --   |
| Windows10 |&#x25ef;|&#x25ef; |&#x25ef; |   --   |&#x25ef;|&#x25ef;|
| Linux     |&#x25ef;|&#x25ef; |&#x25ef; |   --   |   --   |   --   |

## License

Copyright (C) 2019 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.

[repo-url]: https://github.com/sttk/fav-text.diff/
[npm-img]: https://img.shields.io/badge/npm-v0.1.0-blue.svg
[npm-url]: https://www.npmjs.com/package/@fav/text.diff
[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses/MIT
[travis-img]: https://travis-ci.org/sttk/fav-text.diff.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/fav-text.diff
[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/fav-text.diff?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/fav-text-diff
[coverage-img]: https://coveralls.io/repos/github/sttk/fav-text.diff/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/fav-text.diff?branch=master
