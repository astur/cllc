const strftime = require('strftime');
const chalk = require('chalk');
const format = require('util').format;
const lU = require('log-update');
const errsome = require('errsome');
const ansiRegex = require('ansi-regex')();

const _levels = {
    trace: chalk.white.bold.bgBlack('<TRACE>'),
    debug: chalk.white.bold.bgGreen('<DEBUG>'),
    info: chalk.white.bold.bgBlue('<INFO>'),
    warn: chalk.white.bold.bgYellow('<WARN>'),
    error: chalk.white.bold.bgRed('<ERROR>'),
};

let _i = [];
let _text = '';

const _countStr = () => _text
    .split('%s')
    .map((v, i) => v + (i === _i.length ? '' : chalk.white(_i[i])))
    .join('');

lU.show = () => lU(_countStr());

module.exports = function(t, df = '%T'){
    let level = null;
    let tag = t;
    let dateFormat = df;

    const _log = l => (...args) => {
        const a = [];
        const ll = _levels[l] || _levels[level];

        if(dateFormat) a.push(chalk.white(`[${strftime(dateFormat)}]`));
        if(ll) a.push(ll);
        if(tag) a.push(chalk.cyan(`(${tag})`));
        if(args.length > 0){
            if(args.length === 1 && l === 'error' && args[0] instanceof Error){
                a.push(chalk.gray(format('\n', errsome(args[0]))));
            } else {
                a.push(chalk.gray(format(...args)));
            }
        }

        if(process.stdout.isTTY){
            lU(...a);
            lU.done();
            if(_text) lU.show();
        } else {
            console.log(a.map(s => s.replace(ansiRegex, '')).join(' '));
        }
    };

    const log = _log();

    log.t = log.trace = _log('trace');
    log.d = log.debug = _log('debug');
    log.i = log.info = _log('info');
    log.w = log.warn = _log('warn');
    log.e = log.error = _log('error');

    log.level = l => {
        level = _levels[l] ? l : null;
    };

    log.dateFormat = dF => {
        dateFormat = typeof dF === 'string' || !dF ? dF : dateFormat;
    };

    log.tag = t => {
        tag = t && t.id && t.exports && t.filename && t.paths ?
            t.filename.split(/[/\\]/).slice(-2).join('/').split('.')[0] :
            typeof t === 'string' ? t : undefined;
    };

    log.tag(tag);

    log.start = (text = '%s', ...args) => {
        if(!process.stdout.isTTY || !text || typeof text !== 'string') return;
        _text = text;
        const tl = _text.split('%s').length - 1;
        const zeros = Array(tl).fill(0);
        const steps = args.length > 0 ? args.map(v => +v || 0) : zeros;
        _i = Object.assign(zeros, steps.slice(0, tl));
        lU.show();
    };

    log.step = (...args) => {
        if(!process.stdout.isTTY || !_text) return;
        const steps = args.length > 0 ? args : [1];
        _i = _i.map((v, i) => v + (+steps[i] || 0));
        lU.show();
    };

    log.inc = n => {
        if(!process.stdout.isTTY || !_text) return;
        _i = _i.map((v, i) => v + (i === n - 1));
        lU.show();
    };

    log.stop = () => {
        if(!process.stdout.isTTY || !_text) return;
        _text = '';
        lU.clear();
    };

    log.finish = (text, ...args) => {
        if(!process.stdout.isTTY || !_text) return;
        if(text){
            _text = text;
            const tl = _text.split('%s').length - 1;
            _i = Object.assign(Array(tl).fill(0), args.slice(0, tl).map(v => +v || 0));
        }
        lU.show();
        _text = '';
        lU.done();
    };

    log.counters = () => [..._i];
    log.text = () => _text;

    return log;
};
