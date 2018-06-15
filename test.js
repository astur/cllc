const test = require('ava');
const cllc = require('.');
const stdout = require('test-console').stdout;
const re = require('ansi-regex')();
const styles = require('ansi-styles');

test('empty', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log();
    inspect.restore();
    t.is(inspect.output[0], '\n');
});

test('log', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, null);
    log('TEST');
    log('TEST1', 'TEST2');
    inspect.restore();
    t.is(inspect.output[0].replace(re, ''), 'TEST\n');
    t.is(inspect.output[1].replace(re, ''), 'TEST1 TEST2\n');
    t.deepEqual(inspect.output[0].match(re), [styles.color.gray.open, styles.color.gray.close]);
    t.deepEqual(inspect.output[1].match(re), [styles.color.gray.open, styles.color.gray.close]);
});

test('dateFormat', t => {
    const inspect = stdout.inspect();
    const log = cllc(null, '%F');
    log();
    log.dateFormat('TEST');
    log();
    inspect.restore();
    t.true(/^\[\d\d\d\d-\d\d-\d\d\]/.test(inspect.output[0].replace(re, '')));
    t.is(inspect.output[1].replace(re, ''), '[TEST]\n');
    t.deepEqual(inspect.output[0].match(re), [styles.color.white.open, styles.color.white.close]);
    t.deepEqual(inspect.output[1].match(re), [styles.color.white.open, styles.color.white.close]);
});

test('tags', t => {
    const inspect = stdout.inspect();
    const log = cllc('TEST', null);
    log();
    log.tag();
    log();
    log.tag('test');
    log();
    inspect.restore();
    t.is(inspect.output[0].replace(re, ''), '(TEST)\n');
    t.deepEqual(inspect.output[0].match(re), [styles.color.cyan.open, styles.color.cyan.close]);
    t.false(re.test(inspect.output[1]));
    t.is(inspect.output[2].replace(re, ''), '(test)\n');
    t.deepEqual(inspect.output[2].match(re), [styles.color.cyan.open, styles.color.cyan.close]);
});
