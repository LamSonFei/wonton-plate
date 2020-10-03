const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 

module.exports = merge(common, {
  mode: 'production',
  output: {
      path: path.resolve(__dirname, 'dist')
  },
  plugins: [
      new CleanWebpackPlugin(),
      new webpack.EnvironmentPlugin({
        RUN_MODE: 'production'
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      })
  ]
});