// Mkoawebpack配置
var path = require("path");
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var _ = require('underscore');//辅助函数
var sConfig = require('../../Mkoa/config')(path.join(__dirname, '../../'));
var userConfig = require('../../config/config')(path.join(__dirname, '../../'));
_.extend(sConfig, userConfig);
var $C = sConfig;

module.exports = {
    'entry': getFiles(), //加载入口文件
    module: {
        loaders: [//各类文件处理器
            {test: /\.js$/, loader: "babel"},
            {test: /\.css$/, loader:ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.json$/,   loader: 'json'},
            {test: /\.html$/,   loader: 'html'},
            {test: /\.(jpg|png)$/, loader: "url?limit=8192"}
        ]
    },
    output: {
        path: $C.staticpath+$C.V,//打包输出的路径
        filename: '[name].js' //打包后的名字
    },
    externals: {//一些全局引用
        //"jquery": "jQuery"
    },
    resolveLoader: {
        modulesDirectories: [
            __dirname+'/node_modules'
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),//公共代码
        new ExtractTextPlugin("[name].css")//公共样式
    ],
    resolve: {
        root:  path.join(__dirname, 'lib')//公共库文件夹
    }
};


function getFiles(){
    //加载Mkoa各模块下webpack目录文件作为入口文件
    var libArr={};
    var apppath=$C.ROOT+ '/' +$C.application;
    function walk(apppath,callback){
        var dirList = fs.readdirSync(apppath);
        dirList.forEach(function(item){
            if(fs.statSync(apppath + '/' + item).isDirectory()){
                walk(apppath + '/' + item);
            }else{
                callback(apppath  + '/' + item,item);
            }});
    }
    var moudelList = fs.readdirSync(apppath);
    moudelList.forEach(function(item){
        if(fs.statSync(apppath + '/' + item).isDirectory()){
            var mdPath=apppath + '/' + item+ '/webpack/entry/' ;//加载入口文件
            if(fs.existsSync(mdPath)) walk(mdPath,function(filePath,fileName){
                var name=filePath.replace(apppath,'').replace('/webpack/entry/','').replace('.js','');
                libArr[name]=filePath;
            });
        }});
    return libArr;
}