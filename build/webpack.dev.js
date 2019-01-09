const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        port: 8090,
        hot: true,
        contentBase: '../dist',
        host: '0.0.0.0',
        proxy: {
            "/api": {
                target: 'http://localhost:3000',
                // target: 'http://api.zpblog.xyz/mock/32',
                pathRewrite: {"^/api" : ""},
            }
        },
        historyApiFallback: true, // 404页面返回index.html
        contentBase: '../',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({})
    ]
})