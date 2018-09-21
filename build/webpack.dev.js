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
                // target: "http://192.168.1.161:8080",
                target: 'http://localhost:8080',
                pathRewrite: {"^/api" : ""},
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({})
    ]
})