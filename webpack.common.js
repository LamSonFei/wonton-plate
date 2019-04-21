const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].bundle.[hash].js',
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new CopyWebpackPlugin([
            { from: 'src/assets', to: 'assets' },
            { from: 'robots.txt', to: 'robots.txt' }
        ]),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
        new WebpackPwaManifest({
            name: 'Wonton Plate',
            short_name: 'WontonPlate',
            description: 'Web Components based Application Template and Demo',
            background_color: '#ffffff',
            icons: [{
                src: path.resolve('src/assets/images/chinese-blue.png'),
                sizes: [96, 128, 192, 256, 384, 512, 1024]
            }]
        })
    ],
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(html)$/,
                use: [
                    'raw-loader'
                ]
            }
        ]
    }
};