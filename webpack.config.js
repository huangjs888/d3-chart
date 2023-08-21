/*
 * @Author: Huangjs
 * @Date: 2021-10-21 16:11:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 14:39:09
 * @Description: ******
 */

const webpack = require('webpack');
const resolve = require('path').resolve;
// const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { NODE_ENV, MOD_ENV } = process.env;
const modname = MOD_ENV === 'cjs' ? 'commonjs' : MOD_ENV === 'esm' ? 'module' : 'umd';
const pathname = MOD_ENV === 'cjs' ? 'lib' : MOD_ENV === 'esm' ? 'es' : 'dist';

module.exports = {
  optimization: {
    minimize: NODE_ENV === 'production',
    /* minimizer: [
      new TerserPlugin({
        extractComments: false,// 禁止生成license文件
      }),
    ], */
  },
  devtool: 'source-map',
  entry: {
    'd3.chart': resolve(__dirname, 'src/index.js'),
  },
  output: {
    filename: `[name]${NODE_ENV === 'production' ? '.min' : ''}.js`,
    library: {
      name: modname === 'umd' ? 'D3Chart' : undefined,
      type: modname,
    },
    path: resolve(__dirname, pathname),
  },
  experiments: {
    outputModule: modname === 'module',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // d3|internmap|delaunator|robust-predicates使用了es6，需要转换成es5
        exclude:
          MOD_ENV === 'esm'
            ? /node_modules/
            : /node_modules(?!(\/|\\)((d3(-.+)?)|internmap|delaunator|robust-predicates))/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  target: ['web', 'es5'], // webpack构建时候添加的代码片段按照web平台的es5输出
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: false, // 是否生成stats.json文件
    }),
  ],
};
