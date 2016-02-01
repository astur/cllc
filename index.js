var strftime = require('strftime');
var chalk = require('chalk');

var levels = {
    trace: chalk.white.bold.bgBlack('<TRACE>'),
    debug: chalk.white.bold.bgGreen('<DEBUG>'),
    info: chalk.white.bold.bgBlue('<INFO>'),
    warn: chalk.white.bold.bgYellow('<WARN>'),
    error: chalk.white.bold.bgRed('<ERROR>')
};

function L(tag){
    var dateFormat = '%T';
    var level;

    var _i = 0;
    var _text = '%s';
    var _visible = false;

    var _show = function(){
        process.stdout.write(_text.replace(/%s/, chalk.white(_i)) + '\r');
        _visible = true;
    };

    var _hide = function(){
        process.stdout.write(Array(_text.replace(/%s/, _i).length + 1).join(' ') + '\r');
        _visible = false;
    };

    var _log = function(message, l){
        var a = [];
        l = Object.keys(levels).indexOf(l) === -1 ? level : l;

        a.push(chalk.white('[' + strftime(dateFormat) + ']'));
        l && a.push(levels[l]);
        tag && a.push(chalk.cyan('(' + tag + ')'));
        message && a.push(chalk.gray(message));

        if (_visible) {
            _hide();
            console.log(a.join(' '));
            _show();
        } else {
            console.log(a.join(' '));
        }
    };

    var log = function(message){
        _log(message);
    };

    log.t = log.trace = function(message){
        _log(message, 'trace');
    };

    log.d = log.debug = function(message){
        _log(message, 'debug');
    };

    log.i = log.info = function(message){
        _log(message, 'info');
    };

    log.w = log.warn = function(message){
        _log(message, 'warn');
    };

    log.e = log.error = function(message){
        _log(message, 'error');
    };

    log.start = function(text, i){
        _text = text || _text;
        _i = i || _i;
        _show();
    };

    log.step = function(i){
        i = i || 1;
        _i = _i + i;
        _show();
    };

    log.stop = function(){
        _hide();
        _i = 0;
        _text = '%s';
    };

    log.finish = function(text, i){
        _hide();
        _text = text || _text;
        _i = i || _i;
        console.log(_text.replace(/%s/, chalk.white(_i)));
        _i = 0;
        _text = '%s';
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
