"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.HeatMapLine = void 0;
var _BaseChart = _interopRequireDefault(require("./BaseChart"));
exports.BaseChart = _BaseChart.default;
var _LineGraph = _interopRequireDefault(require("./LineGraph"));
exports.LineGraph = _LineGraph.default;
var _HeatMap = _interopRequireDefault(require("./HeatMap"));
exports.HeatMap = _HeatMap.default;
var _generate = _interopRequireDefault(require("./HeatMap/generate"));
/*
 * @Author: Huangjs
 * @Date: 2021-10-11 11:41:02
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 12:38:43
 * @Description: ******
 */

var HeatMapLine = (0, _generate.default)('LineGraph');
exports.HeatMapLine = HeatMapLine;