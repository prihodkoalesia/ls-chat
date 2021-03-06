const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const rules = require('./webpack.config.rules')();
const path = require('path');
const fs = require("fs");

const proxy = {};
const settingsPath = './settings.json';

if (fs.existsSync(settingsPath)) {
    const settings = require(settingsPath);
    Object.assign(proxy, settings.proxy);
}

rules.push({
    test:/\.(s*)css$/,
    use: [
        miniCss.loader,
        'css-loader',
        'sass-loader',
    ]
});

module.exports = {
    entry: {
        index: './src/index.js',
    },
    devServer: {
        proxy,
    },
    output: {
        filename: 'js/[name].[fullhash].js',
        path: path.resolve('docs')
    },
    devtool: 'source-map',
    module: { rules },
    optimization: {
        // minimizer: [
        //   // we specify a custom UglifyJsPlugin here to get source maps in production
        //   new UglifyJsPlugin({
        //     cache: true,
        //     parallel: true,
        //     uglifyOptions: {
        //       compress: false,
        //       ecma: 6,
        //       mangle: true
        //     },
        //     // sourceMap: true
        //   })
        // ]
    },
    plugins: [
        new miniCss({
            filename: 'css/[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
          }),
        new HtmlPlugin({
            title: 'GeoFeedback',
            template: 'index.html'
        }),
        new CleanWebpackPlugin(['docs'])
    ]
};
