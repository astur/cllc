var strftime = require('strftime');
var chalk = require('chalk');
function L(tag){
    var dateFormat = '%T';

    var _log = function(message, l){
        var a = [];

        a.push(chalk.white('[' + strftime(dateFormat) + ']'));
        tag && a.push(chalk.cyan('(' + tag + ')'));
        message && a.push(chalk.gray(message));

        console.log(a.join(' '));
    };

    var log = function(message){
        _log(message);
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
