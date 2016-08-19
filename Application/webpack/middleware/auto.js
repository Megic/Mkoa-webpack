module.exports = function(app){
    if($C.controllerCache) {//监控webpack自动编译
        var process = require('child_process');
            //直接调用命令
        process.exec('webpack -p --watch', {cwd: $C.ROOT + '/' + $C.application + '/webpack'});
    }
};
