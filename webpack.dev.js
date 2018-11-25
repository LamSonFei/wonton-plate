const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dev')
    },
    devServer: {
        contentBase: './dev',
        hot: true
    },
    plugins: [
        new CleanWebpackPlugin(['dev']),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({
            RUN_MODE: 'development'
        })
    ]
});