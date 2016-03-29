var strftime = require('strftime');
var chalk = require('chalk');

var levels = {
    trace: chalk.white.bold.bgBlack('<TRACE>'),
    debug: chalk.white.bold.bgGreen('<DEBUG>'),
    info: chalk.white.bold.bgBlue('<INFO>'),
    warn: chalk.white.bold.bgYellow('<WARN>'),
    error: chalk.white.bold.bgRed('<ERROR>')
};

    var _i = 0;
    var _text = '%s';
    var _visible = false;
    var _counting = false;

function L(tag){
    var dateFormat = '%T';
    var level;

    var _show = function(){
        process.stdout.write(_text.replace(/%s/, chalk.white(_i)) + '\r');
        _visible = true;
    };

    var _hide = function(){
        process.stdout.write(Array(_text.replace(/%s/, _i).length + 1).join(' ') + '\r');
        _visible = false;
    };

    var _log = function(l){
        return function(){
            var a = [chalk.white('[' + strftime(dateFormat) + ']')];
            (Object.keys(levels).indexOf(l) === -1 ? level : l) && a.push(levels[l]);
            tag && a.push(chalk.cyan('(' + tag + ')'));
            [].slice.call(arguments, 1).forEach(function(v){a.push(chalk.gray(v))});

            _visible && _hide();
            console.log.apply(null, a);
            _visible && _show();
        }
    };

    var log = _log();

    log.t = log.trace = _log('trace');
    log.d = log.debug = _log('debug');
    log.i = log.info = _log('info');
    log.w = log.warn = _log('warn');
    log.e = log.error = _log('error');

    log.start = function(text, i){
        _counting = true;
        _text = text || _text;
        _i = i || _i;
        _show();
    };

    log.step = function(i){
        if (_counting) {
            i = i || 1;
            _i = _i + i;
            _show();
        }
    };

    log.stop = function(){
        _counting = false;
        _hide();
        _i = 0;
        _text = '%s';
    };

    log.finish = function(text, i){
        if (_counting) {
            _counting = false;
            _hide();
            _text = text || _text;
            _i = i || _i;
            console.log(_text.replace(/%s/, chalk.white(_i)));
            _i = 0;
            _text = '%s';
        }
    };

    log.level = function (l){
        level = (Object.keys(levels).indexOf(l) === -1) ? undefined : l;
    };

    log.dateFormat = function (dF){
        dateFormat = (typeof dF === 'string') ? dF : dateFormat;
    };

    log.tag = function (t){
        tag = (t && t.id && t.exports && t.filename && t.paths)
            ? t.filename.split('/').slice(-2).join('/').split('.')[0]
            : (typeof t === 'string' ? t : undefined);
    };

    log.tag(tag);
    return log;
}

module.exports = L;
