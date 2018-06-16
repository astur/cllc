const test = require('ava');
const cllc = require('.');
const stdout = require('test-console').stdout;
const re = require('ansi-regex')();
const styles = require('ansi-styles');
const escapes = require('ansi-escapes');

test('empty', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log();
    inspect.restore();
    t.is(inspect.output[0], '\n');
});

test('simple log', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log('TEST');
    log('TEST1', 'TEST2');
    inspect.restore();
    t.is(inspect.output[0].replace(re, ''), 'TEST\n');
    t.is(inspect.output[1].replace(re, ''), 'TEST1 TEST2\n');
    t.deepEqual(inspect.output[0].match(re), [
        styles.color.gray.open,
        styles.color.gray.close,
    ]);
    t.deepEqual(inspect.output[1].match(re), [
        styles.color.gray.open,
        styles.color.gray.close,
    ]);
});

test('dateFormat', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, '%F');
    log();
    log.dateFormat('TEST');
    log();
    log.dateFormat(42);
    log();
    inspect.restore();
    t.true(/^\[\d\d\d\d-\d\d-\d\d\]/.test(inspect.output[0].replace(re, '')));
    t.is(inspect.output[1].replace(re, ''), '[TEST]\n');
    t.is(inspect.output[2].replace(re, ''), '[TEST]\n');
    t.deepEqual(inspect.output[0].match(re), [
        styles.color.white.open,
        styles.color.white.close,
    ]);
    t.deepEqual(inspect.output[1].match(re), [
        styles.color.white.open,
        styles.color.white.close,
    ]);
    t.deepEqual(inspect.output[2].match(re), [
        styles.color.white.open,
        styles.color.white.close,
    ]);
});

test('tags', t => {
    const inspect = stdout.inspect();
    const log = cllc('TEST', null);
    log();
    log.tag();
    log();
    log.tag(module);
    log();
    inspect.restore();
    t.is(inspect.output[0].replace(re, ''), '(TEST)\n');
    t.deepEqual(inspect.output[0].match(re), [
        styles.color.cyan.open,
        styles.color.cyan.close,
    ]);
    t.false(re.test(inspect.output[1]));
    t.is(inspect.output[2].replace(re, ''), '(cllc/test)\n');
    t.deepEqual(inspect.output[2].match(re), [
        styles.color.cyan.open,
        styles.color.cyan.close,
    ]);
});

test('levels', t => {
    const badge = color => [
        styles.color.white.open,
        styles.modifier.bold.open,
        styles.bgColor[color].open,
        styles.bgColor[color].close,
        styles.modifier.bold.close,
        styles.color.white.close,
    ];
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log.t();
    log.d();
    log.i();
    log.w();
    log.e();
    log.level('trace');
    log();
    log.level('debug');
    log();
    log.level('info');
    log();
    log.level('warn');
    log();
    log.level('error');
    log();
    log.level();
    log();
    log.level('bad level');
    log();
    inspect.restore();
    t.is(inspect.output[0].replace(re, ''), '<TRACE>\n');
    t.deepEqual(inspect.output[0].match(re), badge('bgBlack'));
    t.is(inspect.output[1].replace(re, ''), '<DEBUG>\n');
    t.deepEqual(inspect.output[1].match(re), badge('bgGreen'));
    t.is(inspect.output[2].replace(re, ''), '<INFO>\n');
    t.deepEqual(inspect.output[2].match(re), badge('bgBlue'));
    t.is(inspect.output[3].replace(re, ''), '<WARN>\n');
    t.deepEqual(inspect.output[3].match(re), badge('bgYellow'));
    t.is(inspect.output[4].replace(re, ''), '<ERROR>\n');
    t.deepEqual(inspect.output[4].match(re), badge('bgRed'));
    t.is(inspect.output[5].replace(re, ''), '<TRACE>\n');
    t.deepEqual(inspect.output[5].match(re), badge('bgBlack'));
    t.is(inspect.output[6].replace(re, ''), '<DEBUG>\n');
    t.deepEqual(inspect.output[6].match(re), badge('bgGreen'));
    t.is(inspect.output[7].replace(re, ''), '<INFO>\n');
    t.deepEqual(inspect.output[7].match(re), badge('bgBlue'));
    t.is(inspect.output[8].replace(re, ''), '<WARN>\n');
    t.deepEqual(inspect.output[8].match(re), badge('bgYellow'));
    t.is(inspect.output[9].replace(re, ''), '<ERROR>\n');
    t.deepEqual(inspect.output[9].match(re), badge('bgRed'));
    t.is(inspect.output[10], '\n');
    t.is(inspect.output[11], '\n');
});

test('full log', t => {
    const inspect = stdout.inspect();
    const log = cllc('TAG');
    log.i('TEST');
    inspect.restore();
    t.true(/^\[\d\d:\d\d:\d\d\] <INFO> \(TAG\) TEST/.test(inspect.output[0].replace(re, '').trim()));
    t.deepEqual(inspect.output[0].match(re), [
        styles.color.white.open,
        styles.color.white.close,
        styles.color.white.open,
        styles.modifier.bold.open,
        styles.bgColor.bgBlue.open,
        styles.bgColor.bgBlue.close,
        styles.modifier.bold.close,
        styles.color.white.close,
        styles.color.cyan.open,
        styles.color.cyan.close,
        styles.color.gray.open,
        styles.color.gray.close,
    ]);
});

test('isTTY false log', t => {
    const inspect = stdout.inspect({isTTY: false});
    const log = cllc('TAG');
    log.i('TEST');
    inspect.restore();
    t.false(re.test(inspect.output[0]));
});

test('counter start', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log.start('#%s|%s#');
    t.is(log.text(), '#%s|%s#');
    t.deepEqual(log.counters(), [0, 0]);
    log.start();
    t.is(log.text(), '%s');
    t.deepEqual(log.counters(), [0]);
    log.stop();
    inspect.restore();
    t.is(inspect.output[0].replace(re, ''), '#0|0#\n');
    t.deepEqual(inspect.output[0].match(re), [
        styles.color.white.open,
        styles.color.white.close,
        styles.color.white.open,
        styles.color.white.close,
    ]);
    t.is(inspect.output[1].replace(re, ''), '0\n');
    t.deepEqual(inspect.output[1].match(re), [
        escapes.eraseLine,
        escapes.cursorUp(),
        escapes.eraseLine,
        escapes.cursorLeft,
        styles.color.white.open,
        styles.color.white.close,
    ]);
});

test('counter steps', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log.step(1);
    log.inc(1);
    t.is(log.text(), '');
    t.is(inspect.output.length, 0);
    log.start('#%s|%s#');
    t.is(inspect.output.length, 1);
    log.step();
    log.step(0, 2);
    log.inc(1);
    t.is(inspect.output.length, 4);
    t.deepEqual(log.counters(), [2, 2]);
    t.is(inspect.output[3].replace(re, ''), '#2|2#\n');
    log.stop();
    inspect.restore();
    const codes = [
        escapes.eraseLine,
        escapes.cursorUp(),
        escapes.eraseLine,
        escapes.cursorLeft,
        styles.color.white.open,
        styles.color.white.close,
        styles.color.white.open,
        styles.color.white.close,
    ];
    t.deepEqual(inspect.output[1].match(re), codes);
    t.deepEqual(inspect.output[2].match(re), codes);
    t.deepEqual(inspect.output[3].match(re), codes);
});

test('counter finishing', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log.stop();
    log.finish('TEST=%s', 42);
    t.is(log.text(), '');
    t.is(inspect.output.length, 0);
    log.start();
    log.stop();
    t.is(inspect.output[1].replace(re, ''), '');
    t.is(inspect.output.length, 2);
    log.start();
    log.finish();
    t.is(inspect.output[3].replace(re, ''), '0\n');
    t.is(inspect.output.length, 4);
    log.start();
    log.finish('#%s#', 42);
    t.is(inspect.output[5].replace(re, ''), '#42#\n');
    t.is(inspect.output.length, 6);
    inspect.restore();
    const codes = [
        escapes.eraseLine,
        escapes.cursorUp(),
        escapes.eraseLine,
        escapes.cursorLeft,
    ];
    t.deepEqual(inspect.output[1].match(re), codes);
    t.deepEqual(inspect.output[3].match(re), [
        ...codes,
        styles.color.white.open,
        styles.color.white.close,
    ]);
    t.deepEqual(inspect.output[5].match(re), [
        ...codes,
        styles.color.white.open,
        styles.color.white.close,
    ]);
});

test('counter with logging', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log.start();
    log.step();
    log('TEST');
    log.step();
    log.stop();
    t.is(inspect.output.length, 6);
    t.is(inspect.output[2].replace(re, ''), 'TEST\n');
    inspect.restore();
    t.deepEqual(inspect.output[2].match(re), [
        escapes.eraseLine,
        escapes.cursorUp(),
        escapes.eraseLine,
        escapes.cursorLeft,
        styles.color.gray.open,
        styles.color.gray.close,
    ]);
    t.deepEqual(inspect.output[3].match(re), [
        styles.color.white.open,
        styles.color.white.close,
    ]);
});

test('isTTY false counter', t => {
    const inspect = stdout.inspect({isTTY: false});
    const log = cllc(null, null);
    log.start();
    log.step();
    log('TEST');
    log.step();
    log.stop();
    log.start();
    log.inc(1);
    log.finish();
    t.is(inspect.output.length, 1);
    t.is(inspect.output[0], 'TEST\n');
    inspect.restore();
});
