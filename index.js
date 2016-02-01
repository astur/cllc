var chalk = require('chalk');
function L(tag){
    var _log = function(message, l){
        var a = [];

        tag && a.push(chalk.cyan('(' + tag + ')'));
        message && a.push(chalk.gray(message));

        console.log(a.join(' '));
    };

    var log = function(message){
        _log(message);
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
