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
    t.is(inspect.output[0].match(re)[0], styles.color.gray.open);
    t.is(inspect.output[0].match(re)[1], styles.color.gray.close);
    t.is(inspect.output[1].replace(re, ''), 'TEST1 TEST2\n');
    t.is(inspect.output[1].match(re)[0], styles.color.gray.open);
    t.is(inspect.output[1].match(re)[1], styles.color.gray.close);
});
