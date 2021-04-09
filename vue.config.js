const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const VConsolePlugin = require('vconsole-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin; // 打包分析
const bundleConfig = require('./bundle-config.json');

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = dir => path.join(__dirname, dir);
const Timestamp = new Date().getTime();
module.exports = {
    publicPath: process.env.VUE_APP_BASE_URL,
    outputDir: "dist",
    assetsDir: 'static',
    lintOnSave: true,
    productionSourceMap: false,
    css: {
        extract: process.env.NODE_ENV !== 'development' // 提取CSS在开发环境不开启，因为它和CSS热重载不兼容
    },
    configureWebpack(config) {
        let pluginsAll = [
            ...config.plugins,
            new webpack.DllReferencePlugin({
                context: __dirname, // 与Dllplugin里的context所指向的上下文保持一致
                manifest: require('./vendor-manifest.json')
            })
        ];
        let pluginsDev = [
            new VConsolePlugin({
                enable: !IS_PROD
            })
        ];
        // 禁用 console 输出
        config.optimization = {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            drop_debugger: true,
                            drop_console: true,
                            pure_funcs: ["console.log"],
                        },
                    },
                    sourceMap: false, // config.build.productionSourceMap
                    cache: true,  // 启用缓存
                    parallel: true, // 并行任务构建
                }),
            ]
        };
        // 防止缓存
        let output = {
            filename: `static/js/[name].${Timestamp}.js`,
            chunkFilename: `static/js/[name].${Timestamp}.js`
        }
        // let pluginsPro = [
        //     new BundleAnalyzerPlugin({
        //         openAnalyzer: true // 在默认浏览器中自动打开报告
        //     })
        // ];
        if (IS_PROD) {
            config.plugins = [...pluginsAll];
        } else {
            config.plugins = [...pluginsAll, ...pluginsDev];
        }
    },
    chainWebpack(config) {
        // 设置HtmlWebpackPlugin
        config.plugin('html').tap(args => {
            args[0].vendorJsName = bundleConfig.vendor.js;
            args[0].jsFilesPath = process.env.VUE_APP_BASE_URL;
            return args;
        });
        // 扩展 + 别名
        config.resolve.extensions
            .merge(['.js', '.vue', '.json'])
            .end()
            .alias.set('@', resolve('src'))
            .set('components', resolve('src/components'))
            .set('assets', resolve('src/assets'));
    },
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 8080,
        proxy: {
            '/api': {
                // target: 'http://10.152.36.31:8080', // 代理到的地址
                target: 'http://myfen-ts.gomeuat.com.cn/sale-api5',
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                pathRewrite: {
                    // 如果接口本身没有/api需要通过pathRewrite来重写了地址
                    '^/api': ''
                }
            },
            '/newapi':{
                target: 'http://myfen-ts.gomeuat.com.cn/smc-dev19',
                secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                pathRewrite: {
                    '^/newapi': ''
                }
            }
        }
    }
};