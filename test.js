const test = require('ava');
const cllc = require('.');
const stdout = require('test-console').stdout;
const re = require('ansi-regex')();
const styles = require('ansi-styles');
const escapes = require('ansi-escapes');

const _badge = color => [
    styles.color.white.open,
    styles.modifier.bold.open,
    styles.bgColor[color].open,
    styles.bgColor[color].close,
    styles.modifier.bold.close,
    styles.color.white.close,
];

const _color = color => [
    styles.color[color].open,
    styles.color[color].close,
];

const _erase = [
    escapes.eraseLine,
    escapes.cursorUp(),
    escapes.eraseLine,
    escapes.cursorLeft,
];

test('empty', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log();
    t.is(inspect.output[0], '\n');
    inspect.restore();
});

test('simple log', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log('TEST');
    log('TEST1', 'TEST2');
    t.is(inspect.output[0].replace(re, ''), 'TEST\n');
    t.is(inspect.output[1].replace(re, ''), 'TEST1 TEST2\n');
    t.deepEqual(inspect.output[0].match(re), _color('gray'));
    t.deepEqual(inspect.output[1].match(re), _color('gray'));
    inspect.restore();
});

test('dateFormat', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, '%F');
    log();
    log.dateFormat('TEST');
    log();
    log.dateFormat(42);
    log();
    t.true(/^\[\d{4}-\d{2}-\d{2}]/.test(inspect.output[0].replace(re, '')));
    t.is(inspect.output[1].replace(re, ''), '[TEST]\n');
    t.is(inspect.output[2].replace(re, ''), '[TEST]\n');
    t.deepEqual(inspect.output[0].match(re), _color('white'));
    t.deepEqual(inspect.output[1].match(re), _color('white'));
    t.deepEqual(inspect.output[2].match(re), _color('white'));
    inspect.restore();
});

test('tags', t => {
    const inspect = stdout.inspect();
    const log = cllc('TEST', null);
    log();
    log.tag();
    log();
    log.tag(module);
    log();
    t.is(inspect.output[0].replace(re, ''), '(TEST)\n');
    t.deepEqual(inspect.output[0].match(re), _color('cyan'));
    t.false(re.test(inspect.output[1]));
    t.is(inspect.output[2].replace(re, ''), '(cllc/test)\n');
    t.deepEqual(inspect.output[2].match(re), _color('cyan'));
    inspect.restore();
});

test('levels', t => {
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
    t.is(inspect.output[0].replace(re, ''), '<TRACE>\n');
    t.deepEqual(inspect.output[0].match(re), _badge('bgBlack'));
    t.is(inspect.output[1].replace(re, ''), '<DEBUG>\n');
    t.deepEqual(inspect.output[1].match(re), _badge('bgGreen'));
    t.is(inspect.output[2].replace(re, ''), '<INFO>\n');
    t.deepEqual(inspect.output[2].match(re), _badge('bgBlue'));
    t.is(inspect.output[3].replace(re, ''), '<WARN>\n');
    t.deepEqual(inspect.output[3].match(re), _badge('bgYellow'));
    t.is(inspect.output[4].replace(re, ''), '<ERROR>\n');
    t.deepEqual(inspect.output[4].match(re), _badge('bgRed'));
    t.is(inspect.output[5].replace(re, ''), '<TRACE>\n');
    t.deepEqual(inspect.output[5].match(re), _badge('bgBlack'));
    t.is(inspect.output[6].replace(re, ''), '<DEBUG>\n');
    t.deepEqual(inspect.output[6].match(re), _badge('bgGreen'));
    t.is(inspect.output[7].replace(re, ''), '<INFO>\n');
    t.deepEqual(inspect.output[7].match(re), _badge('bgBlue'));
    t.is(inspect.output[8].replace(re, ''), '<WARN>\n');
    t.deepEqual(inspect.output[8].match(re), _badge('bgYellow'));
    t.is(inspect.output[9].replace(re, ''), '<ERROR>\n');
    t.deepEqual(inspect.output[9].match(re), _badge('bgRed'));
    t.is(inspect.output[10], '\n');
    t.is(inspect.output[11], '\n');
    inspect.restore();
});

test('pretty error', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log.e(new Error('test'));
    t.true(/<ERROR>[\S\s]*name[\S\s]*message[\S\s]*stack/.test(inspect.output[0]));
    inspect.restore();
});

test('full log', t => {
    const inspect = stdout.inspect();
    const log = cllc('TAG');
    log.i('TEST');
    t.true(/^\[\d\d:\d\d:\d\d] <INFO> \(TAG\) TEST/.test(inspect.output[0].replace(re, '').trim()));
    t.deepEqual(inspect.output[0].match(re), [
        ..._color('white'),
        ..._badge('bgBlue'),
        ..._color('cyan'),
        ..._color('gray'),
    ]);
    inspect.restore();
});

test('isTTY false log', t => {
    const inspect = stdout.inspect({isTTY: false});
    const log = cllc('TAG');
    log.i('TEST');
    t.false(re.test(inspect.output[0]));
    inspect.restore();
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
    log.start('#%s|%s|%s#', 42, 'bad');
    t.is(log.text(), '#%s|%s|%s#');
    t.deepEqual(log.counters(), [42, 0, 0]);
    log.stop();
    t.is(inspect.output[0].replace(re, ''), '#0|0#\n');
    t.deepEqual(inspect.output[0].match(re), [
        ..._color('white'),
        ..._color('white'),
    ]);
    t.is(inspect.output[1].replace(re, ''), '0\n');
    t.deepEqual(inspect.output[1].match(re), [
        ..._erase,
        ..._color('white'),
    ]);
    t.is(inspect.output[2].replace(re, ''), '#42|0|0#\n');
    t.deepEqual(inspect.output[2].match(re), [
        ..._erase,
        ..._color('white'),
        ..._color('white'),
        ..._color('white'),
    ]);
    inspect.restore();
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
    const codes = [
        ..._erase,
        ..._color('white'),
        ..._color('white'),
    ];
    t.deepEqual(inspect.output[1].match(re), codes);
    t.deepEqual(inspect.output[2].match(re), codes);
    t.deepEqual(inspect.output[3].match(re), codes);
    inspect.restore();
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
    log.step();
    log.finish();
    t.is(inspect.output[3].replace(re, ''), '1\n');
    t.is(inspect.output.length, 4);
    log.start();
    log.finish('#%s|%s|%s#', 42, 'bad');
    t.is(inspect.output[5].replace(re, ''), '#42|0|0#\n');
    t.is(inspect.output.length, 6);
    log.start();
    log.finish('#%s|%s|%s#');
    t.is(inspect.output[7].replace(re, ''), '#0|0|0#\n');
    t.is(inspect.output.length, 8);
    t.deepEqual(inspect.output[1].match(re), _erase);
    t.deepEqual(inspect.output[3].match(re), [
        ..._erase,
        ..._color('white'),
    ]);
    t.deepEqual(inspect.output[5].match(re), [
        ..._erase,
        ..._color('white'),
        ..._color('white'),
        ..._color('white'),
    ]);
    t.deepEqual(inspect.output[7].match(re), [
        ..._erase,
        ..._color('white'),
        ..._color('white'),
        ..._color('white'),
    ]);
    inspect.restore();
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
    t.deepEqual(inspect.output[2].match(re), [
        ..._erase,
        ..._color('gray'),
    ]);
    t.deepEqual(inspect.output[3].match(re), _color('white'));
    inspect.restore();
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
