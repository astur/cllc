var strftime = require('strftime');
var chalk = require('chalk');

var levels = {
    trace: chalk.white.bold.bgBlack('<TRACE>'),
    debug: chalk.white.bold.bgGreen('<DEBUG>'),
    info: chalk.white.bold.bgBlue('<INFO>'),
    warn: chalk.white.bold.bgYellow('<WARN>'),
    error: chalk.white.bold.bgRed('<ERROR>')
};

var _i;
var _text;
var _visible = false;
var _counting = false;

function _countStr(){
    var t = _text;
    for (var i = 0; i < _i.length; i++) {
        t = t.replace(/%s/, chalk.white(_i[i]));
    };
    return t;
}

function L(tag){
    var dateFormat = '%T';
    var level;

    var _show = function(){
        process.stdout.write(_countStr() + '\r');
        _visible = true;
    };

    var _hide = function(){
        process.stdout.write(Array(_countStr().length + 1).join(' ') + '\r');
        _visible = false;
    };

    var _log = function(l){
        return function(){
            var a = [chalk.white('[' + strftime(dateFormat) + ']')];
            (Object.keys(levels).indexOf(l) === -1 ? level : l) && a.push(levels[l]);
            tag && a.push(chalk.cyan('(' + tag + ')'));
            [].slice.call(arguments, 0).forEach(function(v){a.push(chalk.gray(v))});

            if (_visible) {
                _hide();
                console.log.apply(null, a);
                _show();
            } else {
                console.log.apply(null, a);
            }
        }
    };

    var log = _log();

    log.t = log.trace = _log('trace');
    log.d = log.debug = _log('debug');
    log.i = log.info = _log('info');
    log.w = log.warn = _log('warn');
    log.e = log.error = _log('error');

    log.start = function(){
        _counting = true;
        _i = [].slice.call(arguments);
        _text = _i.shift() || '%s';
        var tl = _text.split(/%s/).length - 1 || 1;
        tl > _i.length && (_i = _i.concat(Array(tl).fill(0)));
        _show();
    };

    log.step = function(){
        if (_counting) {
            arguments[0] = arguments.length ? arguments[0] : 1;
            for (var i = 0; i < _i.length; i++) {
                _i[i] += +arguments[i] || 0;
            }
            _show();
        }
    };

    log.stop = function(){
        _counting = false;
        _hide();
    };

    log.finish = function(){
        if (_counting) {
            _counting = false;
            _hide();
            var args = [].slice.call(arguments);
            _text = args.shift() || _text;
            for (var i = 0; i < _i.length; i++) {
                typeof args[i] === 'number' && (_i[i] = args[i]);
            };
            console.log(_countStr());
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
