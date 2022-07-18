"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "debounce", {
  enumerable: true,
  get: function get() {
    return _debounce.default;
  }
});
Object.defineProperty(exports, "delay", {
  enumerable: true,
  get: function get() {
    return _delay.default;
  }
});
Object.defineProperty(exports, "differenceWith", {
  enumerable: true,
  get: function get() {
    return _differenceWith.default;
  }
});
exports.measureSvgText = exports.isNumber = exports.isCanEmit = exports.guid = exports.findNearIndex = void 0;
Object.defineProperty(exports, "noop", {
  enumerable: true,
  get: function get() {
    return _noop.default;
  }
});

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _differenceWith = _interopRequireDefault(require("lodash/differenceWith"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _noop = _interopRequireDefault(require("lodash/noop"));

var _delay = _interopRequireDefault(require("lodash/delay"));

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
}; // 查找给定值在数组中哪两个数据之间的索引值，数组已排序


exports.measureSvgText = measureSvgText;

var findNearIndex = function findNearIndex(val, arr, single) {
  var start = 0;
  var end = arr.length - 1;

  if (val < arr[start]) {
    return single ? start : [-1, start];
  }

  if (val > arr[end]) {
    return single ? end : [end, -1];
  } // 二分查找


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
  } // 取夹在中间的两边数值的索引


  return [end, start];
};

exports.findNearIndex = findNearIndex;

var isNumber = function isNumber(v) {
  return typeof v === 'number' && !Number.isNaN(v);
};

exports.isNumber = isNumber;

var isCanEmit = function isCanEmit(_ref, _ref2) {
  var _ref3 = (0, _slicedToArray2.default)(_ref, 2),
      x0 = _ref3[0],
      y0 = _ref3[1];

  var _ref4 = (0, _slicedToArray2.default)(_ref2, 2),
      x1 = _ref4[0],
      y1 = _ref4[1];

  var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
  return Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2) > Math.pow(l, 2);
};

exports.isCanEmit = isCanEmit;

var guid = function guid(prefix) {
  var n = new Date().getTime().toString(32);

  for (var i = 0; i < 5; i += 1) {
    n += Math.floor(Math.random() * 65535).toString(32);
  }

  n += (0, _uniqueId.default)(prefix).toString(32);
  return prefix ? "".concat(prefix, "-").concat(n) : n;
};

exports.guid = guid;
//# sourceMappingURL=index.js.map