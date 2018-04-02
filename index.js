const strftime = require('strftime');
const chalk = require('chalk');

chalk.enabled = !!process.stdout.isTTY;

const _levels = {
    trace: chalk.white.bold.bgBlack('<TRACE>'),
    debug: chalk.white.bold.bgGreen('<DEBUG>'),
    info: chalk.white.bold.bgBlue('<INFO>'),
    warn: chalk.white.bold.bgYellow('<WARN>'),
    error: chalk.white.bold.bgRed('<ERROR>'),
};

let _i = [];
let _text = '';
let _visible = false;

const _countStr = () => _text
    .split(/%s/)
    .map((v, i) => v + (_i[i] ? chalk.white(_i[i]) : ''))
    .join('');

module.exports = function(tag){
    let dateFormat = '%T';
    let level;

    const _show = () => {
        process.stdout.write(`${_countStr()}\r`);
        _visible = true;
    };

    const _hide = () => {
        process.stdout.write(`${' '.repeat(_countStr().length)}\r`);
        _visible = false;
    };

    const _log = l => (...args) => {
        const a = [];
        const ll = _levels[l] || _levels[level];

        if(dateFormat) a.push(chalk.white(`[${strftime(dateFormat)}]`));
        if(ll) a.push(ll);
        if(tag) a.push(chalk.cyan(`(${tag})`));
        a.push(...args.map(v => chalk.gray(v)));

        if(_visible){
            _hide();
            console.log(...a);
            _show();
        } else {
            console.log(...a);
        }
    };

    const log = _log();

    log.t = log.trace = _log('trace');
    log.d = log.debug = _log('debug');
    log.i = log.info = _log('info');
    log.w = log.warn = _log('warn');
    log.e = log.error = _log('error');

    log.level = l => {
        level = _levels[l] ? l : undefined;
    };

    log.dateFormat = dF => {
        dateFormat = typeof dF === 'string' || !dF ? dF : dateFormat;
    };

    log.tag = t => {
        tag = t && t.id && t.exports && t.filename && t.paths ?
            t.filename.split(/[\\/]/).slice(-2).join('/').split('.')[0] :
            typeof t === 'string' ? t : undefined;
    };

    log.tag(tag);

    log.start = (text = '%s', ...args) => {
        if(!process.stdout.isTTY || !text || typeof text !== 'string') return;
        _text = text;
        const tl = _text.split(/%s/).length - 1 || 1;
        args = args.length ? args.map(v => +v || 0) : [1];
        _i = Object.assign(Array(tl).fill(0), args.slice(0, tl));
        _show();
    };

    log.step = (...args) => {
        if(!_text) return;
        args = args.length ? args : [1];
        _i = _i.map((v, i) => v + (+args[i] || 0));
        _show();
    };

    log.stop = () => {
        if(!process.stdout.isTTY) return;
        _text = '';
        _hide();
    };

    log.finish = (text = _text, ...args) => {
        if(!_text) return;
        _hide();
        _text = text;
        args = args.length ? args.map(v => +v || 0) : [];
        _i = Object.assign(_i, args.slice(0, _i.length));
        console.log(_countStr());
        _text = '';
    };

    return log;
};
