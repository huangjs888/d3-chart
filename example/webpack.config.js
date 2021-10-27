/*
 * @Author: Huangjs
 * @Date: 2021-10-21 16:11:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-10-27 13:02:31
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
      path: resolve(__dirname, './build/'),
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
        // 该配置项允许配置从目录提供静态文件的选项
        directory: resolve(__dirname, './build'), // 静态文件目录
        watch: true, // 通过 static.directory 配置项告诉 dev-server 监听文件。文件更改将触发整个页面重新加载。
      }, */,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        }, // 将错误信息在浏览器中全屏覆盖
        progress: true, // 在浏览器中以百分比显示编译进度。
      },
      compress: true, // 启用 gzip compression
      port: 9090, // 端口
      // hot: true, // 热更新，配合HotModuleReplacementPlugin
      open: true, // 打开浏览器
      // proxy: {}, // 接口代理
      // host:'',// 地址
    },
  };
};
