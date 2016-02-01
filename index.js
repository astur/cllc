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

    var _log = function(message, l){
        var a = [];
        l = Object.keys(levels).indexOf(l) === -1 ? level : l;

        a.push(chalk.white('[' + strftime(dateFormat) + ']'));
        l && a.push(levels[l]);
        tag && a.push(chalk.cyan('(' + tag + ')'));
        message && a.push(chalk.gray(message));

        console.log(a.join(' '));
    };

    var log = function(message){
        _log(message);
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
