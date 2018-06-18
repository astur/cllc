# cllc

`C`ommand `L`ine `L`ogger and `C`ounter for console.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

![](screencast.gif)

## Features

* nice colored log messages with configurable timestamps, tags and log level labels.
* console indicator with easy incrementable counters
* logger and counter works together without erasing or rewriting each other.
* automatic 'file mode' (no colors, no counters) if output piped to file or other shell stream.

## Why?

Because some scripts works for a long time and need pretty good console indicators for monitoring how they are. But some of them are too easy for [blessed-contrib](https://github.com/yaronn/blessed-contrib) or even for [winston](https://github.com/winstonjs/winston). For example, long queues of http requests or database queries. I developed this module for scraping scripts, but it can be used a lot wherever else.

## Contributing

No any specific rules for now. Just open issue or create PR if you want.

## Install

```bash
npm install cllc
```

## Usage

### Logger

```js
const log = require('cllc')();

// //or//
// const log = require('cllc')('TAG', '%F %T');
// default tag and date format (see below)

log('Sample message');
```

#### Log messages

It's important, that log message is not required. `cllc` can output string with only timestamp/label/tag (if not empty). If any params sent to `log` then log message will be created same way as in `util.format`.

```js
log('This is a log message string', 'This is another log message string');
log(); //log string without message
log({a: 1}, [1, 2], new Date(), null); // same way as in `util.format`
```

#### Log level labels

Default log level label is empty (nothing printed) but you can set default label or specify it explicitly for every log string.

```js
log('log string with empty log level label (default)');
log.trace('log string with label <TRACE>'); //short form is log.t
log.debug('log string with label <DEBUG>'); //short form is log.d
log.info('log string with label <INFO>');   //short form is log.i
log.warn('log string with label <WARN>');   //short form is log.w
log.error('log string with label <ERROR>'); //short form is log.e

log.level('trace'); //set default log level label to <TRACE>
log.level('error'); //set default log level label to <ERROR>
log.level();        //set empty default log level label
```

Five log levels are possible: `trace`, `debug`, `info`, `warn` and `error`. Any other parameter in `log.level` sets empty default log level label.

#### Timestamps

Timestamps are formatted by [strftime](https://github.com/samsonjs/strftime). By default format string is `'%T'`, but you can change it at any time. Like this:

```js
const log = require('cllc')(null, '%F %T');
log('log string with date format "%F %T"');
log.dateFormat('%F');
log('log string with date format "%F"');
log.dateFormat();
log('log string with no date displayed');
```

```js
log.dateFormat('%F %T');
```

Any string are correct, even if it doesn't contain any formatting symbols at all.

If you want to disable timestamps just use any falsy value.  Like this:

```js
log.dateFormat('');
// //or//
log.dateFormat();
```
Any parameter of `log.dateFormat` that is not a string or falsy  will be ignored.

#### Logger tags

Usually tags used if you want to identify several loggers from different modules or functions. Tag is just a short string. By default tag is empty, but you can specify it any time. Like this:

```js
const log = require('cllc')('TAG1');
log('log string with tag "TAG1"');
log.tag('Tag2');
log('log string with tag "Tag2"');
log.tag();
log('log string with no tag');
```

You can use `module` variable on `cllc` init or as parameter of `log.tag`. In that case module filename and dir will be in tag.

```js
const log = require('cllc')(module);
log('log string with something like "my-module/index" in tag');
```

### Counter

Counter is a text in the end of console, contains digital value(s) that are incrementing step by step.

#### Start counter

```js
log.start(); //same as log.start('%s');
// //or//
// log.start('%s tasks done.', 0);
// //or//
// log.start('%s foo, %s bar, %s baz', 0, 1, 2);
```

#### Increment counter

```js
log.step(); // same as step(1);
// //or//
// log.step(5);
// //or//
// log.step(0, 0, 1);
```

Or another way:

```js
log.inc(1); // same as step(1);
// //or//
// log.inc(3); // same as step(0, 0, 1)
```

#### Stop counter

```js
log.stop(); // stop and clear
// //or//
// log.finish(); // stop and save counter text
// //or//
// log.finish('Well done %s tasks!', 100); // stop with special text
// //or//
// log.finish('%s foo, %s bar, %s baz', 100, 200, 300); // stop with special text
```

#### Restart/change counter

Calling `log.start` starting new counter with new text and new values. If another counter was active on that moment it will be destroyed silently (if you want save it - call `log.finish` before start next counter).

Current counter text and values are availiable via `log.text` and `log.counters` functions.

```js
log.start('First counter [%s][%s]', 1, 5);
// do something like `log.step` here
// then:
log start(doSomething(log.text()), ...doSomethingElse(log.counters()));
```

#### Safe logger

If counter are visible - log strings appear on string above counter text and will not be erased by counter. So use `log` from `cllc` instead `console.log` when counter active.

```js
log.start('[%s]');
log.step();
log('TEST');
log.finish();

// result output
// TEST
// [0]
```

### 'file mode'

If you want pipe log to file - just do it. It is not necessary to code changes or configs. `cllc` can detect that script runs not in TTY and suppress colors and counters automaticly. You can test it this way:

```bash
node your-script.js | cat
```

## License

MIT

[npm-url]: https://npmjs.org/package/cllc
[npm-image]: https://badge.fury.io/js/cllc.svg
[travis-url]: https://travis-ci.org/astur/cllc
[travis-image]: https://travis-ci.org/astur/cllc.svg?branch=master