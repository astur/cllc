const strftime = require('strftime');
const chalk = require('chalk');

const levels = {
    trace: chalk.white.bold.bgBlack('<TRACE>'),
    debug: chalk.white.bold.bgGreen('<DEBUG>'),
    info: chalk.white.bold.bgBlue('<INFO>'),
    warn: chalk.white.bold.bgYellow('<WARN>'),
    error: chalk.white.bold.bgRed('<ERROR>'),
};

let _i;
let _text;
let _visible = false;
let _counting = false;

function _countStr(){
    let t = _text;
    for(let i = 0; i < _i.length; i++){
        t = t.replace(/%s/, chalk.white(_i[i]));
    }
    return t;
}

function L(tag){
    let dateFormat = '%T';
    let level;

    const _show = function(){
        process.stdout.write(`${_countStr()}\r`);
        _visible = true;
    };

    const _hide = function(){
        process.stdout.write(`${''.repeat(_countStr().length)}\r`);
        _visible = false;
    };

    const _log = function(l){
        return function(...args){
            const a = [];
            if(dateFormat) a.push(chalk.white(`[${strftime(dateFormat)}]`));
            if(Object.keys(levels).indexOf(l) === -1 ? level : l) a.push(levels[l]);
            if(tag) a.push(chalk.cyan(`(${tag})`));
            a.push(...args.map(v => chalk.gray(v)));

            if(_visible){
                _hide();
                console.log.apply(null, a);
                _show();
            } else {
                console.log.apply(null, a);
            }
        };
    };

    const log = _log();

    log.t = log.trace = _log('trace');
    log.d = log.debug = _log('debug');
    log.i = log.info = _log('info');
    log.w = log.warn = _log('warn');
    log.e = log.error = _log('error');

    log.start = function(text = '%s', ...args){
        _counting = true;
        _i = args;
        _text = text;
        const tl = _text.split(/%s/).length - 1 || 1;
        if(tl > _i.length) _i = _i.concat(Array(tl).fill(0));
        _show();
    };

    log.step = function(...args){
        if(_counting){
            args = args.length ? args : [1];
            for(let i = 0; i < _i.length; i++){
                _i[i] += +args[i] || 0;
            }
            _show();
        }
    };

    log.stop = function(){
        _counting = false;
        _hide();
    };

    log.finish = function(text = _text, ...args){
        if(_counting){
            _counting = false;
            _hide();
            _text = text;
            for(let i = 0; i < _i.length; i++){
                if(typeof args[i] === 'number') _i[i] = args[i];
            }
            console.log(_countStr());
        }
    };

    log.level = function(l){
        level = Object.keys(levels).indexOf(l) === -1 ? undefined : l;
    };

    log.dateFormat = function(dF){
        dateFormat = typeof dF === 'string' || !dF ? dF : dateFormat;
    };

    log.tag = function(t){
        tag = t && t.id && t.exports && t.filename && t.paths ?
            t.filename.split(/[\\/]/).slice(-2).join('/').split('.')[0] :
            typeof t === 'string' ? t : undefined;
    };

    log.tag(tag);
    return log;
}

module.exports = L;
