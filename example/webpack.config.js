/*
 * @Author: Huangjs
 * @Date: 2021-10-21 16:11:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-06-23 11:25:47
 * @Description: ******
 */

// const webpack = require('webpack');
const resolve = require('path').resolve;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  return {
    mode: argv.mode,
    optimization: {
      minimize: !devMode,
      splitChunks: {
        cacheGroups: {
          lib: {
            name: 'lib',
            chunks: 'initial',
            test: /[\\/]src[\\/]/,
          },
          data: {
            name: 'data',
            chunks: 'initial',
            test: /[\\/]data/,
          },
        },
      },
    },
    devtool: 'source-map',
    context: resolve(__dirname, './'),
    entry: {
      index: resolve(__dirname, './index.js'),
    },
    output: {
      filename: devMode ? '[name].js' : '[name].[contenthash:8].js',
      path: resolve(__dirname, '../docs/'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(c|le)ss$/,
          use: [
            {
              loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'less-loader',
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash:8].css',
      }),
      new HtmlWebpackPlugin({
        inject: 'body',
        chunks: ['lib', 'data', 'index'],
        filename: 'index.html',
        template: resolve(__dirname, './index.html'),
      }),
      // new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      static: false /* {
        // ????????????????????????????????????????????????????????????
        directory: resolve(__dirname, './build'), // ??????????????????
        watch: true, // ?????? static.directory ??????????????? dev-server ???????????????????????????????????????????????????????????????
      }, */,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        }, // ??????????????????????????????????????????
        progress: true, // ????????????????????????????????????????????????
      },
      compress: true, // ?????? gzip compression
      port: 9090, // ??????
      // hot: true, // ??????????????????HotModuleReplacementPlugin
      open: true, // ???????????????
      // proxy: {}, // ????????????
      // host:'',// ??????
    },
  };
};
