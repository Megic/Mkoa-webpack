module.exports = function(app){
    if($C.controllerCache) {//���webpack�Զ�����
        var process = require('child_process');
            //ֱ�ӵ�������
        process.exec('webpack -p --watch', {cwd: $C.ROOT + '/' + $C.application + '/webpack'});
    }
};
