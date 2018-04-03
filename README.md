# cllc

`C`ommand `L`ine `L`ogger and `C`ounter

There is a logger and counter two-in-one. And log messages do not erase counter text. Perfect for work process indication in long-time scripts.

[![NPM version][npm-image]][npm-url]

## Install

```bash
npm install cllc
```

## Usage

### Logger

Logger output to console log string that consists of timestamp, log level label, logger tag and log message. Only timestamp is not optional.

```js
const log = require('cllc')();

log('Sample message');
```

#### Timestamps

Timestamps are formatting by [strftime](https://github.com/samsonjs/strftime). By default format string is `'%T'`, but you can change it at any time. Like this:

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

#### Log level labels

Default log level label is empty (nothing printed) but you can set default label or specify it explicitly for every log string.

```js
log('log string with default log level label');
log.trace('log string with label <TRACE>'); //short form is log.t
log.debug('log string with label <DEBUG>'); //short form is log.d
log.info('log string with label <INFO>'); //short form is log.i
log.warn('log string with label <WARN>'); //short form is log.w
log.error('log string with label <ERROR>'); //short form is log.e

log.level('trace'); //set default log level label to <TRACE>
log.level('error'); //set default log level label to <ERROR>
log.level(); //set empty default log level label
```

Five log levels are possible: `trace`, `debug`, `info`, `warn` and `error`. Any other parameter in `log.level` sets empty default log level label.

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

#### Log messages

It's important, that log message is not required. `cllc` can output string with only timestamp/label/tag (if not empty). If any params sent to `log*` functions then log message will be created same way as in `util.format`.

```js
log('This is a log message string', 'This is another log message string');
log(); //log string without message
log({a: 1}, [1, 2], new Date(), null); // same way as in `util.format`
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

## License

MIT

[npm-url]: https://npmjs.org/package/cllc
[npm-image]: https://badge.fury.io/js/cllc.svg