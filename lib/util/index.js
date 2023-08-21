"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.measureSvgText = exports.isNumber = exports.isCanEmit = exports.guid = exports.findNearIndex = void 0;
var _isNan = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/number/is-nan"));
var _differenceWith = _interopRequireDefault(require("lodash/differenceWith"));
exports.differenceWith = _differenceWith.default;
var _debounce = _interopRequireDefault(require("lodash/debounce"));
exports.debounce = _debounce.default;
var _noop = _interopRequireDefault(require("lodash/noop"));
exports.noop = _noop.default;
var _delay = _interopRequireDefault(require("lodash/delay"));
exports.delay = _delay.default;
var _uniqueId = _interopRequireDefault(require("lodash/uniqueId"));
// @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-07-01 14:36:41
 * @Description: ******
 */

var measureSvgText = function measureSvgText(text, fontSize) {
  var svgXmlns = 'http://www.w3.org/2000/svg';
  var svgDom = document.createElementNS(svgXmlns, 'svg');
  var svgText = document.createElementNS(svgXmlns, 'text');
  svgText.style.fontSize = fontSize;
  svgText.appendChild(document.createTextNode(text));
  svgDom.appendChild(svgText);
  document.body.appendChild(svgDom);
  var width = !svgDom.getBBox ? svgDom.clientWidth : svgDom.getBBox().width;
  document.body.removeChild(svgDom);
  return width;
};

// 查找给定值在数组中哪两个数据之间的索引值，数组已排序
exports.measureSvgText = measureSvgText;
var findNearIndex = function findNearIndex(val, arr, single) {
  var start = 0;
  var end = arr.length - 1;
  if (val < arr[start]) {
    return single ? start : [-1, start];
  }
  if (val > arr[end]) {
    return single ? end : [end, -1];
  }
  // 二分查找
  while (start <= end) {
    var middle = Math.ceil((end + start) / 2);
    if (val === arr[middle]) {
      return single ? middle : [middle, middle];
    }
    if (val < arr[middle]) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }
  if (single) {
    // 取最接近数值的索引
    return Math.abs(arr[end] - val) < Math.abs(arr[start] - val) ? end : start;
  }
  // 取夹在中间的两边数值的索引
  return [end, start];
};
exports.findNearIndex = findNearIndex;
var isNumber = function isNumber(v) {
  return typeof v === 'number' && !(0, _isNan.default)(v);
};
exports.isNumber = isNumber;
var isCanEmit = function isCanEmit(_ref, _ref2, l) {
  var x0 = _ref[0],
    y0 = _ref[1];
  var x1 = _ref2[0],
    y1 = _ref2[1];
  if (l === void 0) {
    l = 3;
  }
  return Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2) > Math.pow(l, 2);
};
exports.isCanEmit = isCanEmit;
var guid = function guid(prefix) {
  var n = new Date().getTime().toString(32);
  for (var i = 0; i < 5; i += 1) {
    n += Math.floor(Math.random() * 65535).toString(32);
  }
  n += (0, _uniqueId.default)(prefix).toString(32);
  return prefix ? prefix + "-" + n : n;
};
exports.guid = guid;