const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); 
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'rsuite'
        ],
        app: './src/index.tsx'
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "postcss-loader" // add css prefix
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }, {
            test: /\.less$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            },{
                loader: "less-loader",
                options: {
                    javascriptEnabled: true
                }
            }]
        }, {
            test: /\.css$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }]
        }, {
            test: /\.md$/,
            use: 'ignore-loader'
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)($|\?)/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 1,
                  size: 16,
                  hash: 'sha512',
                  digest: 'hex',
                  name: '[hash].[ext]',
                  publicPath: '/'
                }
              }
            ]
          }]
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, '../dist')], {
            verbose:  true,
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: 'index.html',
            inject: true
        })
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({
            configFile: path.resolve(__dirname, '../tsconfig.json')
        })],
    },
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, '../dist')
    }
};