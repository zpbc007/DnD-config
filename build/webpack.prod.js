const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    mode: "production",
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, '../dist')], {
            verbose:  true,
            root: path.resolve(__dirname, '../')
        }),
    ]
})