# cllc

Simple logger and counter for console

[![NPM version][npm-image]][npm-url]

## Install

```bash
npm install cllc
```

## Usage

There is a logger and counter two-in-one. And log messages do not erase counter string. Perfect for work process indication in long-time scripts.

### Logger

Logger output to console log string that consists of timestamp, log level label, logger tag and log message. Only timestamp is not optional.

```js
var log = require('cllc')();

log('Sample message');
```

#### Timestamps

Timestamps are formatting by [strftime](https://github.com/samsonjs/strftime). By default format string is `'%T'`, but you can change it at any time. Like this:

```js
log.dateFormat('%F %T');
```

Any string are correct, even if it doesn't contain any formatting symbols at all. But if parameter of `log.dateFormat` is not a string - nothing will change.

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
var log = require('cllc')('TAG1');
log('log string with tag "TAG1"');
log.tag('Tag2');
log('log string with tag "Tag2"');
log.tag();
log('log string with no tag');
```

You can use `module` variable on `cllc` init or as parameter of `log.tag`. In that case module filename and dir will be in tag.

```js
var log = require('cllc')(module);
log('log string with something like "my-module/index" in tag');
```

#### Log messages

It's important, that log message is not required. `cllc` can output string with only timestamp (and label/tag if not empty). Also important, that `cllc` logger is not `console.log` so parameters is just concatenated (with `toString` and `join(' ')`). This logger is for easy and short messages.

```js
log('This is a log message string', 'This is another log message string');
log(); //log string without message
log({a:1,b:2}); //log message will be '[object Object]'. Use strings.
```

### Counter

Counter is a last string on console, where digital value in string are incrementing step by step. If counter are visible - log strings appears on second string from bottom.

```js
// Start counter
log.start();
// //or//
// log.start('%s tasks done.', 0);
// //or//
// log.start('%s foo, %s bar, %s baz', 0, 1, 2);

// Increment counter
log.step();
// //or//
// log.step(5);
// //or//
// log.step(0, 0, 1);

// Safe logger
log('TEST');

// Stop counter
log.stop(); // stop and clear
// //or//
// log.finish(); // stop and save last string
// //or//
// log.finish('Well done %s tasks!', 100); // stop with special string
// //or//
// log.finish('%s foo, %s bar, %s baz', 100, 200, 300); // stop with special string
```

## License

MIT

[npm-url]: https://npmjs.org/package/cllc
[npm-image]: https://badge.fury.io/js/cllc.svg