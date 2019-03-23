const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'inline-source-map',
    entry: {
        app: './test/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'test-dist'),
        filename: 'main.js'
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'test'), 'node_modules']
    },
    module: {
        rules: [
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['test-dist'])
    ]
};