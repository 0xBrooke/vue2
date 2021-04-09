const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const packages = require('./package.json');

module.exports = {
    mode: process.argv[2],
    entry: {
        vendor: Object.keys(packages.dependencies) || [] // 填写需要提取出来的依赖包, 如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
    },
    output: {
        path: path.join(__dirname, './public'), // 输出的文件都放到 public 目录下
        filename: 'dll.[name].[hash:8].js', // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
        library: '[name]_[hash:8]' // 存放动态链接库的全局变量名称，其他模块会从此变量上获取里面模块
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, './', '[name]-manifest.json'), // 描述动态链接库的 manifest.json 文件输出时的文件名称
            name: '[name]_[hash:8]', // dll的全局变量名,动态链接库的全局变量名称，需要和 output.library 中保持一致
            context: __dirname // manifest 文件中请求的上下文, 与DllReferencePlugin.context保持一致
        }),

        // outputs a json file with the paths of the generated assets so you can find them from somewhere else.
        new AssetsPlugin({
            filename: 'bundle-config.json', // Name for the created json file.
            path: __dirname // Path where to save the created JSON file
        })
    ]
};
