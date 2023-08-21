"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js/weak-map");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose"));
var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/concat"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/filter"));
var d3 = _interopRequireWildcard(require("d3"));
var util = _interopRequireWildcard(require("../util"));
var _excluded = ["transform", "sourceEvent"],
  _excluded2 = ["transform", "sourceEvent"],
  _excluded3 = ["transform", "sourceEvent"]; // @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-05-12 14:11:32
 * @Description: 基础图表构造器
 */
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var iconSize = 18;
var downloadPath = 'M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z';
var resetPath = 'M483.031 380.989v-61.004l-162.969 92.891 162.969 99.24v-64.04c128.025 0.122 157.093 64.052 157.093 94.107 0 33.863-29.068 97.771-157.093 97.771l-98.957 0.011v63.919l98.957-0.011c157.093 0.011 221.105-63.907 221.105-159.017 0.001-96.647-64.012-163.856-221.105-163.867 M511.372 64.548c-247.628 0-448.369 200.319-448.369 447.426S263.744 959.4 511.372 959.4s448.369-200.32 448.369-447.426S758.999 64.548 511.372 64.548z m-0.203 823.564c-207.318 0-375.382-167.71-375.382-374.592s168.064-374.592 375.382-374.592 375.382 167.71 375.382 374.592-168.064 374.592-375.382 374.592z';
var lockPath = 'M650 432.6v-99.4c0-76.3-61.8-138.1-138.1-138.1S373.8 258 373.8 334.3v99.4H650z m-382.9 1.1l-0.1-3.1V322.5c0-59.9 23.8-117.4 66.2-159.8C375.6 120.3 433 96.5 493 96.5h37.9c124.8 0 225.9 101.2 225.9 225.9v111.3c58.2 8.1 101.5 57.9 101.5 116.7v258.3c0 65.1-52.7 117.8-117.8 117.8H283.3c-65.1 0-117.8-52.7-117.8-117.8V550.5c0-58.8 43.3-108.6 101.6-116.8z m217.6 266v77c0 15 12.2 27.2 27.2 27.2s27.2-12.2 27.2-27.2v-77c33.5-13.1 53-48.2 46.3-83.5-6.7-35.4-37.5-61-73.5-61s-66.9 25.6-73.5 61c-6.7 35.3 12.8 70.4 46.3 83.5z';
var unlockPath = 'M650 432.6v-99.4c0-76.3-61.8-138.1-138.1-138.1S373.8 258 373.8 334.3v99.4H650z m-382.9 1.1l-0.1-3.1V322.5c0-59.9 23.8-117.4 66.2-159.8C375.6 120.3 433 96.5 493 96.5h37.9c124.8 0 225.9 101.2 225.9 225.9v111.3c58.2 8.1 101.5 57.9 101.5 116.7v258.3c0 65.1-52.7 117.8-117.8 117.8H283.3c-65.1 0-117.8-52.7-117.8-117.8V550.5c0-58.8 43.3-108.6 101.6-116.8z m217.6 266v77c0 15 12.2 27.2 27.2 27.2s27.2-12.2 27.2-27.2v-77c33.5-13.1 53-48.2 46.3-83.5-6.7-35.4-37.5-61-73.5-61s-66.9 25.6-73.5 61c-6.7 35.3 12.8 70.4 46.3 83.5zm272 -369h-106.5v103h106.5z';
var actionButtons = {
  download: {
    title: '下载视图',
    path: downloadPath,
    className: 'download'
  },
  reset: {
    title: '重置视图',
    path: resetPath,
    className: 'reset'
  },
  xlock: {
    title: 'X轴缩放开关',
    path: unlockPath,
    className: 'xlock'
  },
  ylock: {
    title: 'Y轴缩放开关',
    path: unlockPath,
    className: 'ylock'
  }
};
var axisType = ['x', 'x2', 'y', 'y2'];
var scaleType = {
  cat: function cat() {
    return d3.scaleBand();
  },
  timeCat: function timeCat() {
    return d3.scaleBand();
  },
  time: function time() {
    return d3.scaleTime();
  },
  linear: function linear() {
    return d3.scaleLinear();
  },
  log: function log() {
    return d3.scaleLog();
  },
  sqrt: function sqrt() {
    return d3.scaleSqrt();
  },
  pow: function pow() {
    return d3.scalePow();
  },
  // sequential: () => d3.scaleSequential(),
  quantize: function quantize() {
    return d3.scaleQuantize();
  },
  quantile: function quantile() {
    return d3.scaleQuantile();
  },
  identity: function identity() {
    return d3.scaleIdentity();
  }
};
var timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');
var formatMillisecond = d3.timeFormat('.%L');
var formatSecond = d3.timeFormat(':%S');
var formatMinute = d3.timeFormat('%H:%M');
var formatHour = d3.timeFormat('%H:00');
var formatDay = d3.timeFormat('%m-%d');
var formatMonth = d3.timeFormat('%m月');
var formatYear = d3.timeFormat('%Y年');
var prefixSIFormat = d3.format('.4~s');
var exponentFormat = d3.format('.4~g');
var roundFormat = d3.format('.4~r');
var getDefaultFormat = function getDefaultFormat(type) {
  if (type === 'time') {
    return function (date, ax) {
      if (!ax) {
        return timeFormat(date);
      }
      if (d3.timeSecond(date) < date) {
        return formatMillisecond(date);
      }
      if (d3.timeMinute(date) < date) {
        return formatSecond(date);
      }
      if (d3.timeHour(date) < date) {
        return formatMinute(date);
      }
      if (d3.timeDay(date) < date) {
        return formatHour(date);
      }
      if (d3.timeMonth(date) < date) {
        return formatDay(date);
      }
      if (d3.timeYear(date) < date) {
        return formatMonth(date);
      }
      return formatYear(date);
    };
  }
  if (type === 'log') {
    return exponentFormat;
  }
  if (type === 'sqrt') {
    return roundFormat;
  }
  if (type === 'linear' || type === 'pow') {
    return prefixSIFormat;
  }
  return function (v) {
    return v;
  };
};
var computeSize = function computeSize(element, _ref) {
  var width = _ref.width,
    height = _ref.height,
    padding = _ref.padding,
    rWidth = _ref.rWidth,
    rHeight = _ref.rHeight;
  var w = width;
  var h = height;
  var style = getComputedStyle(element);
  if (!(util.isNumber(width) && width > 1)) {
    w = (element.clientWidth || parseInt(style.width, 10)) - parseInt(style.paddingLeft, 10) - parseInt(style.paddingRight, 10);
  }
  if (!(util.isNumber(height) && height > 1)) {
    h = (element.clientHeight || parseInt(style.height, 10)) - parseInt(style.paddingTop, 10) - parseInt(style.paddingBottom, 10);
  }
  var _ref2 = [],
    top = _ref2[0],
    right = _ref2[1],
    bottom = _ref2[2],
    left = _ref2[3];
  var pad = Array.isArray(padding) ? padding : [];
  var pad0 = pad[0],
    pad1 = pad[1],
    pad2 = pad[2],
    pad3 = pad[3];
  pad0 = !util.isNumber(pad0) || pad0 < 0 ? 0 : pad0;
  pad1 = !util.isNumber(pad1) || pad1 < 0 ? 0 : pad1;
  pad2 = !util.isNumber(pad2) || pad2 < 0 ? 0 : pad2;
  pad3 = !util.isNumber(pad3) || pad3 < 0 ? 0 : pad3;
  if (!pad.length) {
    top = 0;
    right = top;
    bottom = top;
    left = top;
  } else if (pad.length === 1) {
    top = pad0;
    right = top;
    bottom = top;
    left = top;
  } else if (pad.length === 2) {
    top = pad0;
    right = pad1;
    bottom = top;
    left = right;
  } else if (pad.length === 3) {
    top = pad0;
    right = pad1;
    bottom = pad2;
    left = right;
  } else {
    top = pad0;
    right = pad1;
    bottom = pad2;
    left = pad3;
  }
  return {
    width: Math.max(util.isNumber(w) ? w : 1, 1),
    height: Math.max(util.isNumber(h) ? h : 1, 1),
    padding: [top, right, bottom, left],
    rWidth: util.isNumber(rWidth) ? rWidth : 0,
    rHeight: util.isNumber(rHeight) ? rHeight : 0
  };
};
var scaleLable = function scaleLable(labelSel, _ref3) {
  var scale = _ref3[0],
    domain = _ref3[1];
  var type = scale.type,
    format = scale.format,
    label = scale.label,
    unit = scale.unit;
  type = type || 'linear';
  label = label || '';
  unit = !label || !unit ? '' : " ( " + unit + " )";
  format = format || getDefaultFormat(type);
  var min = domain[0],
    max = domain[1];
  min = min || 0;
  max = max || 0;
  labelSel.select('text').selectAll('tspan').data([0, 1]).join('tspan').attr('dx', function (_, i) {
    if (!label) return 0;
    return i === 0 ? -12 : 12;
  }).text(function (_, i) {
    return i === 0 ? "" + label + unit : format(min) + " - " + format(max);
  });
};
function getScaleAxis() {
  var _this = this;
  var _this$zoomSelection$$ = this.zoomSelection$.datum(),
    xTransform = _this$zoomSelection$$[0],
    yTransform = _this$zoomSelection$$[1];
  var scaleAxis = {};
  axisType.forEach(function (key) {
    if (_this.scale[key]) {
      var _this$rescale$ = _this.rescale$(key === 'x' || key === 'x2' ? xTransform : yTransform, key),
        scale = _this$rescale$.scale,
        axis = _this$rescale$.axis;
      scaleAxis[key] = {
        axis: axis,
        scale: scale
      };
    }
  });
  return scaleAxis;
}
function updateScale() {
  var _this2 = this;
  axisType.forEach(function (key) {
    if (_this2.axisScale$[key]) {
      var _ref4 = _this2.scale[key].domain || _this2.dataDomains$[key] || [0, 1],
        minDomain = _ref4[0],
        maxDomain = _ref4[1];
      _this2.axisScale$[key].scale.range(key === 'x' || key === 'x2' ? [0, _this2.width$] : [_this2.height$, 0]).domain([minDomain || 0, maxDomain || 1]);
      if (_this2.scale[key].nice) {
        _this2.axisScale$[key].scale.nice();
        var niceDomain = _this2.axisScale$[key].scale.domain();
        if (_this2.scale[key].domain) {
          _this2.scale[key].domain = niceDomain;
        }
        if (_this2.dataDomains$[key]) {
          _this2.dataDomains$[key] = niceDomain;
        }
      }
    }
  });
}
function createScale() {
  var _this3 = this;
  var axisScale = {};
  axisType.forEach(function (key) {
    if (_this3.scale[key]) {
      var _this3$scale$key = _this3.scale[key],
        _this3$scale$key$type = _this3$scale$key.type,
        type = _this3$scale$key$type === void 0 ? 'linear' : _this3$scale$key$type,
        _this3$scale$key$tick = _this3$scale$key.ticks,
        ticks = _this3$scale$key$tick === void 0 ? 5 : _this3$scale$key$tick,
        tickSize = _this3$scale$key.tickSize,
        format = _this3$scale$key.format;
      var scale = scaleType[type]();
      var axis = null;
      if (key === 'x2') {
        axis = d3.axisTop(scale);
      } else if (key === 'y') {
        axis = d3.axisLeft(scale);
      } else if (key === 'y2') {
        axis = d3.axisRight(scale);
      } else {
        axis = d3.axisBottom(scale);
      }
      if (ticks) {
        axis = axis.ticks(ticks);
      }
      if (tickSize) {
        axis = axis.tickSize(tickSize);
      }
      var defaultFormat = getDefaultFormat(type);
      if (!format) {
        _this3.scale[key].format = defaultFormat;
      }
      axis = axis.tickFormat(format || function (val) {
        return defaultFormat(val, true);
      });
      axisScale[key] = {
        scale: scale,
        axis: axis
      };
    }
  });
  this.axisScale$ = axisScale;
  updateScale.call(this);
  this.rescale$ = function (transform, key) {
    var as = _this3.axisScale$[key];
    if (as) {
      var scale = as.scale,
        axis = as.axis;
      var recale = key === 'x' || key === 'x2' ? transform.rescaleX(scale) : transform.rescaleY(scale);
      return {
        scale: recale,
        axis: axis.scale(recale)
      };
    }
    return as;
  };
}
function updateZoom() {
  var _this4 = this;
  var viewExtent = [[0, 0], [this.width$, this.height$]];
  var scaleExtent = [[1, 1], [1, 1]];
  var translateExtent = [[0, 0], [0, 0]];
  var _this$zoom = this.zoom,
    xzoom = _this$zoom.x,
    yzoom = _this$zoom.y;
  if (xzoom || yzoom) {
    var _context;
    var _map = (0, _map2.default)(_context = [xzoom, yzoom]).call(_context, function (zoom, i) {
        var key = zoom.domain || (i === 0 ? 'x' : 'y');
        var domain = [0, 1];
        if (_this4.scale[key]) {
          domain = _this4.scale[key].domain || _this4.dataDomains$[key] || [0, 1];
        }
        return domain;
      }),
      xdomain = _map[0],
      ydomain = _map[1];
    var xMinDomain = xdomain[0],
      xMaxDomain = xdomain[1];
    var yMinDomain = ydomain[0],
      yMaxDomain = ydomain[1];
    var xDomainEx = (xMaxDomain || 1) - (xMinDomain || 0);
    var yDomainEx = (yMaxDomain || 1) - (yMinDomain || 0);
    var _ref5 = xzoom.translate || [-Infinity, Infinity],
      _ref5$ = _ref5[0],
      xMinTranslate = _ref5$ === void 0 ? 0 : _ref5$,
      _ref5$2 = _ref5[1],
      xMaxTranslate = _ref5$2 === void 0 ? 0 : _ref5$2;
    var _ref6 = yzoom.translate || [-Infinity, Infinity],
      _ref6$ = _ref6[0],
      yMinTranslate = _ref6$ === void 0 ? 0 : _ref6$,
      _ref6$2 = _ref6[1],
      yMaxTranslate = _ref6$2 === void 0 ? 0 : _ref6$2;
    var _ref7 = xzoom.precision || [xDomainEx / 10, xDomainEx * 10],
      _ref7$ = _ref7[0],
      xMinPrecision = _ref7$ === void 0 ? xDomainEx / 10 : _ref7$,
      _ref7$2 = _ref7[1],
      xMaxPrecision = _ref7$2 === void 0 ? xDomainEx * 10 : _ref7$2;
    var _ref8 = yzoom.precision || [yDomainEx / 10, yDomainEx * 10],
      _ref8$ = _ref8[0],
      yMinPrecision = _ref8$ === void 0 ? yDomainEx / 10 : _ref8$,
      _ref8$2 = _ref8[1],
      yMaxPrecision = _ref8$2 === void 0 ? yDomainEx * 10 : _ref8$2;
    var xRate = this.width$ / xDomainEx;
    var yRate = this.height$ / yDomainEx;
    scaleExtent = [[xDomainEx / xMaxPrecision || 1, yDomainEx / yMaxPrecision || 1], [xDomainEx / xMinPrecision || 1, yDomainEx / yMinPrecision || 1]];
    translateExtent = [[(xMinTranslate - (xMinDomain || 0)) * xRate || xMinDomain || 0, ((yMaxDomain || 1) - yMaxTranslate) * yRate || yMinDomain || 0], [(xMaxTranslate - (xMinDomain || 0)) * xRate || xMaxDomain || 1, ((yMaxDomain || 1) - yMinTranslate) * yRate || yMaxDomain || 1]];
  }
  this.zoomer$.extent(viewExtent).scaleExtent([Math.pow(scaleExtent[0][0] * scaleExtent[0][1], 2), Math.pow(scaleExtent[1][0] * scaleExtent[1][1], 2)]).translateExtent(translateExtent);
  this.zoomExtent$ = {
    viewExtent: viewExtent,
    scaleExtent: scaleExtent,
    translateExtent: translateExtent
  };
}
function createZoom() {
  var _this5 = this;
  this.zoomExtent$ = null;
  updateZoom.call(this);
  this.transform$ = function (axis, tf, t, p, l) {
    var transform = tf;
    if (_this5.zoomExtent$) {
      var _this5$zoomExtent$ = _this5.zoomExtent$,
        viewExtent = _this5$zoomExtent$.viewExtent,
        translateExtent = _this5$zoomExtent$.translateExtent,
        scaleExtent = _this5$zoomExtent$.scaleExtent;
      var tk = Math.max(axis === 'x' ? scaleExtent[0][0] : scaleExtent[0][1], Math.min(axis === 'x' ? scaleExtent[1][0] : scaleExtent[1][1], transform.k * t));
      var tx = p[0] - tk * l[0];
      var ty = p[1] - tk * l[1];
      if (tk !== transform.k || tx !== transform.x || ty !== transform.y) {
        transform = _this5.zoomer$.constrain()(d3.zoomIdentity.translate(tx, ty).scale(tk), viewExtent, translateExtent);
      }
    }
    return transform;
  };
}
function updateElement(size) {
  var _this6 = this;
  var _computeSize = computeSize(this.rootSelection$.node(), size),
    width = _computeSize.width,
    height = _computeSize.height,
    padding = _computeSize.padding,
    rWidth = _computeSize.rWidth,
    rHeight = _computeSize.rHeight;
  var zw = width - rWidth - padding[3] - padding[1];
  var zh = height - rHeight - padding[0] - padding[2];
  if (zw < 1) zw = 1;
  if (zh < 1) zh = 1;
  var group = this.rootSelection$.select('svg').attr('width', width).attr('height', height).select('g.group').attr('transform', "translate(" + padding[3] + "," + padding[0] + ")");
  this.rootSelection$.select('clipPath').select('rect').attr('width', zw).attr('height', zh);
  var baselineDelt = this.fontSize + 2;
  if (this.scale.x) {
    group.select('.xAxis').attr('transform', "translate(0," + zh + ")");
    if (this.scale.x.showRange || typeof this.scale.x.showRange === 'undefined') {
      group.select('.xLabel').attr('transform', "translate(" + zw / 2 + " " + (zh + padding[2] - iconSize + baselineDelt) + ") rotate(0)");
    }
  }
  if (this.scale.x2 && (this.scale.x2.showRange || typeof this.scale.x2.showRange === 'undefined')) {
    group.select('.x2Label').attr('transform', "translate(" + zw / 2 + " " + (baselineDelt - padding[0]) + ") rotate(0)");
  }
  if (this.scale.y && (this.scale.y.showRange || typeof this.scale.y.showRange === 'undefined')) {
    group.select('.yLabel').attr('transform', "translate(" + (baselineDelt - padding[3]) + " " + zh / 2 + ") rotate(-90)");
  }
  if (this.scale.y2) {
    group.select('.y2Axis').attr('transform', "translate(" + zw + ",0)");
    if (this.scale.y2.showRange || typeof this.scale.y2.showRange === 'undefined') {
      group.select('.y2Label').attr('transform', "translate(" + (zw + padding[1] - iconSize + baselineDelt) + " " + zh / 2 + ") rotate(-90)");
    }
  }
  var svgDiv = this.rootSelection$.select('div.actions').style('width', zw + "px").style('height', zh + "px").style('top', padding[0] + "px").style('left', padding[3] + "px");
  if (this.zoom.x) {
    svgDiv.select('.xlock').style('top', (this.scale.x ? zh + padding[2] - iconSize : -padding[0]) + "px").style('left', (this.scale.y ? zw - iconSize / 2 : -iconSize / 2) + "px");
  }
  if (this.zoom.y) {
    svgDiv.select('.ylock').style('top', (this.scale.x ? -iconSize / 2 : zh - iconSize / 2) + "px").style('left', (this.scale.y ? -padding[3] : zw + padding[1] - iconSize) + "px");
  }
  var offset = 5;
  if (this.zoom.x || this.zoom.y) {
    svgDiv.select('.reset').style('top', (this.scale.x ? -padding[0] : zh + padding[2] - iconSize) + "px").style('left', (this.scale.y ? zw - offset - iconSize : offset) + "px");
    offset += 23;
  }
  if (this.download) {
    svgDiv.select('.download').style('top', (this.scale.x ? -padding[0] : zh + padding[2] - iconSize) + "px").style('left', (this.scale.y ? zw - offset - iconSize : offset) + "px");
    offset += 23;
  }
  this.actions.forEach(function (a, i) {
    if (!a) return;
    svgDiv.select(".action-" + i).style('top', (_this6.scale.x ? -padding[0] : zh + padding[2] - iconSize) + "px").style('left', (_this6.scale.y ? zw - offset - iconSize : offset) + "px");
    offset += 23;
  });
  group.select('.zLabel').attr('transform', "translate(" + (this.scale.y ? zw - offset : offset) + " " + ((this.scale.x ? -padding[0] : zh + padding[2] - iconSize) + baselineDelt) + ")");
  this.width = width;
  this.height = height;
  this.padding = padding;
  this.width$ = zw;
  this.height$ = zh;
}
function createElement(container, size) {
  var _this7 = this,
    _context2;
  var svgXmlns = 'http://www.w3.org/2000/svg';
  var rootSelection = d3.select(container || document.createElement('div')).append('div').attr('class', 'd3chart').style('position', 'relative')
  // .style('overflow', 'hidden')
  .style('width', '100%').style('height', '100%');
  var svgSelection = rootSelection.append('svg').attr('xmlns', svgXmlns).attr('width', 1) // 清除默认宽高
  .attr('height', 1) // 清除默认宽高
  .attr('fill', 'none').attr('text-anchor', 'middle').attr('font-size', this.fontSize).attr('stroke', 'none').attr('stroke-width', 1).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').style('position', 'absolute');
  var pathClipId = util.guid('clip');
  svgSelection.append('defs').append('svg:clipPath').attr('id', pathClipId).append('rect');
  var groupSelection = svgSelection.append('g').attr('class', 'group');
  axisType.forEach(function (key) {
    if (_this7.scale[key]) {
      groupSelection.append('g').attr('class', key + "Axis");
      if (_this7.scale[key].showRange || typeof _this7.scale[key].showRange === 'undefined') {
        groupSelection.append('g').attr('class', key + "Label").attr('fill', 'currentColor').append('text');
      }
    }
  });
  groupSelection.append('g').attr('class', 'zAxis').attr('clip-path', "url(#" + pathClipId + ")");
  groupSelection.append('g').attr('class', 'zLabel').attr('fill', 'currentColor');
  var divSelection = rootSelection.append('div').attr('class', 'actions').style('position', 'absolute').style('top', 0).style('left', 0);
  var zoomSelection = divSelection.append('div').attr('class', 'xyzoom').style('position', 'absolute')
  // .style('overflow', 'hidden')
  .style('background', 'rgba(0,0,0,0)') // IE9,10的层级（z-index）不起作用，需要加个背景使鼠标事件生效
  .style('width', '100%').style('height', '100%').style('top', 0).style('left', 0);
  var actions = [];
  if (this.zoom) {
    if (this.zoom.x) {
      actions.push(actionButtons.xlock);
    }
    if (this.zoom.y) {
      actions.push(actionButtons.ylock);
    }
    if (this.zoom.x || this.zoom.y) {
      actions.push(actionButtons.reset);
    }
  }
  if (this.download) {
    actions.push(actionButtons.download);
  }
  (0, _concat.default)(_context2 = []).call(_context2, actions, this.actions).forEach(function (action, i) {
    var index = i - actions.length;
    if (!action) return;
    var className = action.className,
      title = action.title,
      path = action.path,
      text = action.text,
      src = action.src,
      menus = action.menus;
    var actionSelection = divSelection.append('div').attr('class', index < 0 ? className : "action-" + index).style('position', 'absolute').attr('title', title || '').style('display', 'inline-flex').style('font-size', (path ? iconSize : 12) + "px");
    if (path) {
      actionSelection.append('svg').attr('xmlns', svgXmlns).attr('fill', 'currentColor').attr('viewBox', '0 0 1024 1024').attr('width', '1em').attr('height', '1em').append('path').attr('d', path);
    } else if (text) {
      actionSelection.append('span').text(text);
    } else if (src) {
      actionSelection.append('img').attr('src', src).attr('width', iconSize).attr('height', iconSize);
    }
    if (Array.isArray(menus)) {
      var menusSelection = actionSelection.append('div').attr('class', "action-menu action-" + index + "-menu").style('position', 'absolute').style('top', '24px').style('font-size', '12px').style('padding', '6px 0px');
      var maxWidth = 0;
      menus.forEach(function (menu, j) {
        if (!menu) return;
        var text = menu.text;
        maxWidth = Math.max(maxWidth, util.measureSvgText(text, 12));
        menusSelection.append('div').attr('class', "action-" + index + "-menu-" + j).style('padding', '6px 12px').text(text);
      });
      menusSelection.style('width', maxWidth + 24 + "px").style('left', -(maxWidth + 24) / 2 + "px").style('display', 'none');
    }
  });
  if (this.tooltip) {
    var cross = this.tooltip.cross;
    zoomSelection.append('div').attr('class', 'tooltip').style('display', 'none').style('z-index', '999').style('border-radius', '8px').style('transition', 'none').style('padding', '10px 14px').style('font-size', this.fontSize + "px").style('line-height', '22px').style('position', 'absolute').style('top', 0).style('left', 0);
    cross.split('').forEach(function (key) {
      if (key) {
        zoomSelection.append('div').attr('class', key + "-cross").style('display', 'none').style('position', 'absolute').style('transition', 'none').style('width', key === 'x' ? '1px' : '100%').style('height', key === 'x' ? '100%' : '1px').style('top', 0).style('left', 0);
      }
    });
  }
  this.rootSelection$ = rootSelection;
  this.zoomSelection$ = zoomSelection;
  updateElement.call(this, size);
  if (!(util.isNumber(size.width) && size.width > 1 && util.isNumber(size.height) && size.height > 1)) {
    var resize = util.debounce(function (e) {
      var _context3;
      if (_this7.destroyed) return;
      updateElement.call(_this7, size);
      updateScale.call(_this7);
      updateZoom.call(_this7);
      if (_this7.rendered) {
        _this7.reset();
      }
      _this7.resize$.call(null, {
        sourceEvent: e || null,
        target: _this7.rootSelection$,
        transform: (0, _concat.default)(_context3 = [d3.zoomTransform(_this7.zoomSelection$.node())]).call(_context3, _this7.zoomSelection$.datum()),
        scaleAxis: getScaleAxis.call(_this7),
        type: 'resize'
      }, {
        width: _this7.width$,
        height: _this7.height$,
        padding: _this7.padding
      });
    }, 250, {
      leading: false,
      trailing: true
    });
    window.addEventListener('resize', resize);
    this.unBindResize$ = function () {
      window.removeEventListener('resize', resize);
    };
  }
}
function bindEvents() {
  var _this8 = this;
  var point = null;
  var transform0 = null;
  var longPress = 0;
  var showTooltip = function showTooltip(point) {
    if (_this8.tooltip) {
      var _this8$tooltip = _this8.tooltip,
        cross = _this8$tooltip.cross,
        compute = _this8$tooltip.compute;
      var crossX = cross.indexOf('x') !== -1;
      var crossY = cross.indexOf('y') !== -1;
      if (crossX || crossY) {
        var x0 = point[0],
          y0 = point[1];
        var _compute = compute([x0, y0], getScaleAxis.call(_this8)),
          x00 = _compute.x0,
          y00 = _compute.y0,
          result = _compute.result;
        x00 = x00 || x00 === 0 ? x00 : x0;
        y00 = y00 || y00 === 0 ? y00 : y0;
        var display = 'none';
        if (typeof result !== 'function') {
          result = util.noop;
        } else {
          display = 'block';
        }
        if (crossX) {
          selection.select('.x-cross').style('left', x00 + "px").style('display', display);
        }
        if (crossY) {
          selection.select('.y-cross').style('top', y00 + "px").style('display', display);
        }
        var tooltip = selection.select('.tooltip');
        tooltip.style('display', display).call(result);
        if (display !== 'none') {
          var width = tooltip.node().clientWidth;
          var height = tooltip.node().clientHeight;
          var left = x0 + 10;
          var top = y0 - height - 10;
          if (_this8.width$ - left < width) {
            left = x0 - 10 - width;
          }
          left = left <= -60 ? -60 : left;
          top = top <= -20 ? -20 : top;
          tooltip.style('left', left + "px").style('top', top + "px");
        }
      }
    }
  };
  var hideTooltip = function hideTooltip(target) {
    if (_this8.tooltip) {
      var cross = _this8.tooltip.cross;
      var zNode = element;
      if (!target || target !== zNode && target.parentNode !== zNode) {
        if (cross.indexOf('x') !== -1) {
          selection.select('.x-cross').style('display', 'none');
        }
        if (cross.indexOf('y') !== -1) {
          selection.select('.y-cross').style('display', 'none');
        }
        selection.select('.tooltip').style('display', 'none');
      }
    }
  };
  var selection = this.zoomSelection$;
  var element = selection.call(this.zoomer$.on('start', function (_ref9, _ref10) {
    var transform = _ref9.transform,
      sourceEvent = _ref9.sourceEvent,
      restEvent = (0, _objectWithoutPropertiesLoose2.default)(_ref9, _excluded);
    var xTransform = _ref10[0],
      yTransform = _ref10[1];
    if (_this8.destroyed || !_this8.rendered) return;
    var type = sourceEvent.type;
    // 移动端双击放大的时候，因为是模拟的双击，所以event实际传过来的是touchend的事件对象
    var touches = type === 'touchend' ? sourceEvent.changedTouches : sourceEvent.touches;
    if (type !== 'call' && (_this8.xCanZoom$ || _this8.yCanZoom$)) {
      var p = null;
      if (touches) {
        // 表示移动端触摸事件
        point = [];
        for (var i = 0, len = touches.length; i < len; i += 1) {
          var touch = touches.item(i);
          p = d3.pointer(touch, element);
          p = [p, [xTransform.invert(p), yTransform.invert(p)], touch.identifier];
          if (!point[0]) point[0] = p;else if (!point[1] && point[0][2] !== p[2]) point[1] = p;
        }
      } else {
        p = d3.pointer(sourceEvent, element);
        p = [p, [xTransform.invert(p), yTransform.invert(p)]];
        point = p;
      }
      transform0 = transform;
    }
    if (touches) {
      longPress = setTimeout(function () {
        showTooltip(d3.pointer(touches.item(0), element));
        longPress = 0;
      }, 500);
    }
    _this8.zoomstart$.call(null, (0, _extends2.default)({}, restEvent, {
      sourceEvent: sourceEvent,
      scaleAxis: getScaleAxis.call(_this8),
      transform: [transform, xTransform, yTransform]
    }));
  }).on('zoom', function (_ref11, _ref12) {
    var transform = _ref11.transform,
      sourceEvent = _ref11.sourceEvent,
      restEvent = (0, _objectWithoutPropertiesLoose2.default)(_ref11, _excluded2);
    var xTransform = _ref12[0],
      yTransform = _ref12[1];
    if (_this8.destroyed || !_this8.rendered) return;
    var newXTransform = xTransform,
      newYTransform = yTransform;
    var type = sourceEvent.type,
      touches = sourceEvent.changedTouches,
      eventTransform = sourceEvent.transform;
    // 表示事用户主动触发，如滚轮和移动，触摸缩放
    if (type !== 'call') {
      if (_this8.xCanZoom$ || _this8.yCanZoom$) {
        var t = transform.k / transform0.k;
        var p = null;
        var lx = null;
        var ly = null;
        if (touches) {
          // 表示移动端触摸事件
          var np = null;
          var np1 = null;
          for (var i = 0, len = touches.length; i < len; i += 1) {
            var touch = touches.item(i);
            var pt = d3.pointer(touch, element);
            if (point[0] && point[0][2] === touch.identifier) np = pt;else if (point[1] && point[1][2] === touch.identifier) np1 = pt;
          }
          if (point[0]) {
            p = np || point[0][0];
            lx = _this8.xCanZoom$ && point[0][1][0];
            ly = _this8.yCanZoom$ && point[0][1][1];
            if (point[1]) {
              var p1 = np1 || point[1][0];
              var _point$1$ = point[1][1],
                lx1 = _point$1$[0],
                ly1 = _point$1$[1];
              p = [(p[0] + p1[0]) / 2, (p[1] + p1[1]) / 2];
              lx = _this8.xCanZoom$ && [(lx[0] + lx1[0]) / 2, (lx[1] + lx1[1]) / 2];
              ly = _this8.yCanZoom$ && [(ly[0] + ly1[0]) / 2, (ly[1] + ly1[1]) / 2];
            }
          }
        } else {
          p = d3.pointer(sourceEvent, element);
          var changed = p[0] !== point[0][0] || p[1] !== point[0][1]; // zoom的时候点（鼠标）是否移动过
          var wheel = type === 'wheel'; // 是否是滚轮
          if (wheel && !changed) p = point[0];
          lx = _this8.xCanZoom$ && (wheel && changed ? xTransform.invert(p) : point[1][0]);
          ly = _this8.yCanZoom$ && (wheel && changed ? yTransform.invert(p) : point[1][1]);
        }
        if (p) {
          if (lx) {
            newXTransform = _this8.transform$('x', xTransform, t, p, lx);
          }
          if (ly) {
            newYTransform = _this8.transform$('y', yTransform, t, p, ly);
          }
        }
        transform0 = transform;
      }
    } else if (eventTransform) {
      // 如果存在xy缩放，则会有补间调用，万一补间一半，触发了滚轮或移动，则补间会停止，造成无法到达指定缩放位置，所以xy锁定的时候应该忽略补间
      // transform和eventTransform原本是一样的，但是动画补间的每一次调用时transform会变化，直到最后一次才会和eventTransform一样
      // eventTransform是不变的，是最终的指定的变换结果
      var xtf = transform;
      var ytf = transform;
      if (Array.isArray(eventTransform)) {
        xtf = eventTransform[1];
        ytf = eventTransform[2];
      } else {
        if (!_this8.xCanZoom$) xtf = eventTransform;
        if (!_this8.yCanZoom$) ytf = eventTransform;
      }
      if (sourceEvent.zoomX) {
        newXTransform = xtf;
      }
      if (sourceEvent.zoomY) {
        newYTransform = ytf;
      }
    }
    selection.datum([newXTransform, newYTransform]);
    var scaleAxis = getScaleAxis.call(_this8);
    (0, _keys.default)(scaleAxis).forEach(function (key) {
      var _scaleAxis$key = scaleAxis[key],
        axis = _scaleAxis$key.axis,
        scale = _scaleAxis$key.scale;
      _this8.rootSelection$.select("." + key + "Axis").call(axis);
      _this8.rootSelection$.select("." + key + "Label").call(scaleLable, [_this8.scale[key], scale.domain()]);
    });
    if (touches) {
      if (longPress != 0) {
        clearTimeout(longPress);
        longPress = 0;
      }
      hideTooltip();
    }
    _this8.zooming$.call(null, (0, _extends2.default)({}, restEvent, {
      sourceEvent: sourceEvent,
      transform: [transform, newXTransform, newYTransform],
      scaleAxis: scaleAxis
    }));
  }).on('end', function (_ref13, _ref14) {
    var transform = _ref13.transform,
      sourceEvent = _ref13.sourceEvent,
      restEvent = (0, _objectWithoutPropertiesLoose2.default)(_ref13, _excluded3);
    var xTransform = _ref14[0],
      yTransform = _ref14[1];
    if (_this8.destroyed || !_this8.rendered) return;
    if (sourceEvent.type !== 'call' && (_this8.xCanZoom$ || _this8.yCanZoom$)) {
      point = null;
      transform0 = null;
    }
    if (sourceEvent.changedTouches) {
      if (longPress != 0) {
        clearTimeout(longPress);
        longPress = 0;
        hideTooltip();
      }
    }
    _this8.zoomend$.call(null, (0, _extends2.default)({}, restEvent, {
      sourceEvent: sourceEvent,
      transform: [transform, xTransform, yTransform],
      scaleAxis: getScaleAxis.call(_this8)
    }));
  })).on('click', function (e) {
    var _context4;
    if (_this8.destroyed) return;
    _this8.click$.call(null, {
      sourceEvent: e,
      target: selection,
      transform: (0, _concat.default)(_context4 = [d3.zoomTransform(element)]).call(_context4, selection.datum()),
      scaleAxis: getScaleAxis.call(_this8),
      type: 'click'
    });
  }).on('dblclick', function (e) {
    var _context5;
    if (_this8.destroyed) return;
    _this8.dblclick$.call(null, {
      sourceEvent: e,
      target: selection,
      transform: (0, _concat.default)(_context5 = [d3.zoomTransform(element)]).call(_context5, selection.datum()),
      scaleAxis: getScaleAxis.call(_this8),
      type: 'dblclick'
    });
  }).on('contextmenu', function (e) {
    var _context6;
    if (_this8.destroyed) return;
    _this8.contextmenu$.call(null, {
      sourceEvent: e,
      target: selection,
      transform: (0, _concat.default)(_context6 = [d3.zoomTransform(element)]).call(_context6, selection.datum()),
      scaleAxis: getScaleAxis.call(_this8),
      type: 'contextmenu'
    });
    e.preventDefault();
  }).datum([d3.zoomIdentity, d3.zoomIdentity]).node();
  selection.on('mouseout', function (e) {
    if (_this8.destroyed || !_this8.rendered) return;
    hideTooltip(e.relatedTarget);
  }).on('mousemove', function (e) {
    if (_this8.destroyed || !_this8.rendered) return;
    showTooltip(d3.pointer(e));
  });
  if (!this.zoom.doubleZoom) {
    // 取消双击放大
    selection.on('dblclick.zoom', null);
  }
  if (this.zoom.x) {
    var xlock = this.rootSelection$.select('.xlock');
    xlock.on('click', function () {
      if (_this8.destroyed) return;
      _this8.setCanZoom('x', !_this8.xCanZoom$);
      _this8.canZoom$('x', _this8.xCanZoom$);
    });
  }
  if (this.zoom.y) {
    var ylock = this.rootSelection$.select('.ylock');
    ylock.on('click', function () {
      if (_this8.destroyed) return;
      _this8.setCanZoom('y', !_this8.yCanZoom$);
      _this8.canZoom$('y', _this8.yCanZoom$);
    });
  }
  if (this.zoom.x || this.zoom.y) {
    this.rootSelection$.select('.reset').on('click', function () {
      if (_this8.destroyed) return;
      _this8.reset();
      _this8.reset$();
    });
  }
  if (this.download) {
    this.rootSelection$.select('.download').on('click', function () {
      if (_this8.destroyed) return;
      if (_this8.download.action) {
        _this8.download.action(function () {
          _this8.downloadImage();
        }, _this8.rootSelection$);
      } else {
        _this8.downloadImage();
      }
    });
  }
  this.actions.forEach(function (a, i) {
    if (!a) return;
    var action = a.action,
      menus = a.menus;
    var am = _this8.rootSelection$.select(".action-" + i + "-menu");
    var at = _this8.rootSelection$.select(".action-" + i);
    at.on('click', function (e) {
      e.stopPropagation();
      if (e.currentTarget === at.node()) {
        if (_this8.destroyed) return;
        if (action) {
          action(_this8.rootSelection$, function () {});
        }
        var display = am.style('display');
        am.style('display', display === 'none' ? 'block' : 'none');
      }
    });
    if (Array.isArray(menus)) {
      menus.forEach(function (menu, j) {
        if (!menu) return;
        _this8.rootSelection$.select(".action-" + i + "-menu-" + j).on('click', function (e) {
          e.stopPropagation();
          if (_this8.destroyed) return;
          if (menu.action) {
            menu.action(_this8.rootSelection$, function () {});
          }
          am.style('display', 'none');
        });
      });
    }
  });
  if (this.actions.length) {
    d3.select('body').on('click', function () {
      _this8.rootSelection$.selectAll('.action-menu').style('display', 'none');
    });
  }
}
var BaseChart = /*#__PURE__*/function () {
  function BaseChart() {
    var _this9 = this;
    var _ref15 = (arguments.length <= 0 ? undefined : arguments[0]) || {},
      container = _ref15.container,
      width = _ref15.width,
      height = _ref15.height,
      _ref15$padding = _ref15.padding,
      padding = _ref15$padding === void 0 ? [0, 0, 0, 0] : _ref15$padding,
      rWidth = _ref15.rWidth,
      rHeight = _ref15.rHeight,
      _ref15$fontSize = _ref15.fontSize,
      fontSize = _ref15$fontSize === void 0 ? 12 : _ref15$fontSize,
      download = _ref15.download,
      actions = _ref15.actions,
      tooltip = _ref15.tooltip,
      zoom = _ref15.zoom,
      scale = _ref15.scale,
      data = _ref15.data;
    this.destroyed = false;
    this.rendered = false;
    if (typeof download === 'function') {
      this.download = {
        action: download
      };
    } else if (typeof download === 'string') {
      this.download = {
        ext: download
      };
    } else {
      this.download = download || false;
    }
    this.tooltip = !tooltip ? false : (0, _extends2.default)({
      cross: ''
    }, tooltip, {
      compute: function compute() {
        var result = {};
        if (typeof tooltip.compute === 'function') {
          var _tooltip$compute, _context7;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          result = (_tooltip$compute = tooltip.compute).call.apply(_tooltip$compute, (0, _concat.default)(_context7 = [_this9, result]).call(_context7, args));
        }
        return result;
      }
    });
    this.zoom = (0, _extends2.default)({
      /* x: {
      // 一旦domain设置了x或x2的某一类型，则translate和precision都要按照这一类型数据设置
      domain: 'x', // 坐标缩放为1，位移为0时的坐标范围（会默认取scale的x或x2的domain)
      translate: [-Infinity, Infinity], // 坐标标尺可以拖动的范围值
      precision: [(1 - 0) / 10, (1 - 0) * 10], // 坐标标尺缩到最小和最大的跨度值
      }, */
      x: null,
      y: null,
      doubleZoom: false
    }, zoom);
    this.scale = (0, _extends2.default)({
      /* x: {
      type: 'linear', // 坐标类型
      ticks: 5, // 坐标刻度数目
      format: (v) => v, // 坐标值格式化函数
      domain: [0, 1], // 横坐标缩放为1，位移为0时的坐标范围
      label: '', // 坐标名称
      unit: '', // 坐标值单位
      }, */
      x: null,
      x2: null,
      y: null,
      y2: null
    }, scale);
    this.actions = Array.isArray(actions) ? actions : [];
    this.fontSize = fontSize;
    this.data = data || {};
    this.dataDomains$ = {};
    this.zoomer$ = d3.zoom();
    this.xCanZoom$ = !!this.zoom.x;
    this.yCanZoom$ = !!this.zoom.y;
    createElement.call(this, container, {
      width: width,
      height: height,
      padding: padding,
      rWidth: rWidth,
      rHeight: rHeight
    });
    createScale.call(this);
    createZoom.call(this);
    bindEvents.call(this);
    this.click$ = util.noop;
    this.dblclick$ = util.noop;
    this.contextmenu$ = util.noop;
    this.zoomstart$ = util.noop;
    this.zooming$ = util.noop;
    this.zoomend$ = util.noop;
    this.resize$ = util.noop;
    this.reset$ = util.noop;
    this.canZoom$ = util.noop;
  }
  var _proto = BaseChart.prototype;
  _proto.reset = function reset(ta) {
    this.render(d3.zoomIdentity, 'xy', ta);
    return this;
  };
  _proto.render = function render(tf, ax, ta) {
    if (ax === void 0) {
      ax = 'xy';
    }
    if (ta === void 0) {
      ta = true;
    }
    this.rendered = true;
    var transform = (Array.isArray(tf) ? tf[0] : tf) || d3.zoomTransform(this.zoomSelection$.node());
    // 对this.zoomSelection$调用this.zoomer$.transform函数变换到指定的transform
    // 变换过程中用240ms及ease函数进行transition
    (!ta ? this.zoomSelection$ : this.zoomSelection$.transition().duration(240).ease(d3.easeLinear)).call(this.zoomer$.transform, transform, null, {
      type: 'call',
      transform: tf,
      zoomX: ax.indexOf('x') !== -1,
      zoomY: ax.indexOf('y') !== -1
    });
    return this;
  };
  _proto.getCanZoom = function getCanZoom() {
    return [this.xCanZoom$, this.yCanZoom$];
  };
  _proto.getTransform = function getTransform() {
    var _context8;
    return (0, _concat.default)(_context8 = [d3.zoomTransform(this.zoomSelection$.node())]).call(_context8, this.zoomSelection$.datum());
  };
  _proto.setCanZoom = function setCanZoom(ax, canZoom) {
    if (ax === void 0) {
      ax = 'xy';
    }
    if (canZoom === void 0) {
      canZoom = true;
    }
    var xCanZoom = canZoom;
    var yCanZoom = canZoom;
    if (Array.isArray(canZoom)) {
      var _canZoom = canZoom;
      var _canZoom$ = _canZoom[0];
      xCanZoom = _canZoom$ === void 0 ? true : _canZoom$;
      var _canZoom$2 = _canZoom[1];
      yCanZoom = _canZoom$2 === void 0 ? true : _canZoom$2;
    }
    if (ax.indexOf('x') !== -1) {
      this.xCanZoom$ = xCanZoom;
      this.rootSelection$.select('.xlock').select('path').attr('d', xCanZoom ? unlockPath : lockPath);
    }
    if (ax.indexOf('y') !== -1) {
      this.yCanZoom$ = yCanZoom;
      this.rootSelection$.select('.ylock').select('path').attr('d', yCanZoom ? unlockPath : lockPath);
    }
    return this;
  };
  _proto.setEvent = function setEvent(type, handler) {
    if (typeof handler === 'function') {
      var oldHandler = this[type + "$"];
      this[type + "$"] = function () {
        var _context9, _context10;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        handler.call.apply(handler, (0, _concat.default)(_context9 = [null]).call(_context9, args, [oldHandler.call.apply(oldHandler, (0, _concat.default)(_context10 = [null]).call(_context10, args))]));
      };
    }
  };
  _proto.runEvent = function runEvent(type, data) {
    var _context11;
    if (data === void 0) {
      data = {};
    }
    if (this.destroyed) return;
    var _data = data,
      sourceEvent = _data.sourceEvent,
      transform = _data.transform,
      scaleAxis = _data.scaleAxis,
      target = _data.target;
    this[type + "$"].call(null, {
      type: type,
      sourceEvent: sourceEvent || null,
      target: target || this.zoomSelection$,
      transform: transform || (0, _concat.default)(_context11 = [d3.zoomTransform(this.zoomSelection$.node())]).call(_context11, this.zoomSelection$.datum()),
      scaleAxis: scaleAxis || getScaleAxis.call(this)
    });
  };
  _proto.getData = function getData() {
    return this.data;
  };
  _proto.setData = function setData(data, render, computeDomain) {
    var _this10 = this;
    if (computeDomain === void 0) {
      computeDomain = util.noop;
    }
    if (!data) return this;
    this.rendered = false;
    this.data = data;
    // 根据data计算domain
    var needCompute = (0, _filter.default)(axisType).call(axisType, function (key) {
      return _this10.scale[key] && !_this10.scale[key].domain;
    });
    if (needCompute.length > 0) {
      this.dataDomains$ = computeDomain(this.data, needCompute) || {};
      updateScale.call(this);
      updateZoom.call(this);
    }
    if (render) {
      this.render();
    }
    return this;
  };
  _proto.setDomain = function setDomain(domain, render) {
    var _this11 = this;
    if (!domain) return this;
    var isScale = false;
    axisType.forEach(function (key) {
      if (_this11.scale[key] && domain[key]) {
        _this11.scale[key].domain = domain[key];
        isScale = true;
      }
    });
    if (isScale) {
      this.rendered = false;
      updateScale.call(this);
      var isZoom = false;
      ['x', 'y'].forEach(function (key) {
        isZoom = _this11.zoom[key] && (_this11.scale[key] && domain[key] || _this11.scale[key + "2"] && domain[key + "2"]);
      });
      if (isZoom) {
        updateZoom.call(this);
      }
      if (render) {
        this.render();
      }
    }
    return this;
  };
  _proto.setTranslate = function setTranslate(translate, render) {
    var _this12 = this;
    if (!translate) return this;
    var isZoom = false;
    ['x', 'y'].forEach(function (key) {
      if (_this12.zoom[key]) {
        _this12.zoom[key].translate = translate[key];
        isZoom = true;
      }
    });
    if (isZoom) {
      this.rendered = false;
      updateZoom.call(this);
      if (render) {
        this.render();
      }
    }
    return this;
  };
  _proto.setPrecision = function setPrecision(precision, render) {
    var _this13 = this;
    if (!precision) return this;
    var isZoom = false;
    ['x', 'y'].forEach(function (key) {
      if (_this13.zoom[key]) {
        _this13.zoom[key].precision = precision[key];
        isZoom = true;
      }
    });
    if (isZoom) {
      this.rendered = false;
      updateZoom.call(this);
      if (render) {
        this.render();
      }
    }
    return this;
  };
  _proto.setLabel = function setLabel(label, render) {
    var _this14 = this;
    if (!label) return this;
    var isScale = false;
    axisType.forEach(function (key) {
      if (_this14.scale[key] && label[key]) {
        _this14.scale[key].label = label[key].label;
        _this14.scale[key].unit = label[key].unit;
        isScale = true;
      }
    });
    if (isScale) {
      this.rendered = false;
      if (render) {
        this.render();
      }
    }
    return this;
  };
  _proto.destroy = function destroy() {
    var _this15 = this;
    this.destroyed = true;
    this.rendered = false;
    this.data = null;
    if (this.zoomer$) {
      this.zoomer$.on('start', null).on('zoom', null).on('end', null);
      this.zoomer$ = null;
    }
    if (this.zoomSelection$) {
      this.zoomSelection$.on('click', null).on('dblclick', null).on('contextmenu', null).on('mouseout', null).on('mousemove', null);
      this.zoomSelection$ = null;
    }
    if (this.rootSelection$) {
      this.rootSelection$.select('.xlock').on('click', null);
      this.rootSelection$.select('.ylock').on('click', null);
      this.rootSelection$.select('.reset').on('click', null);
      if (this.actions && this.actions.length) {
        this.actions.forEach(function (a, i) {
          if (!a) return;
          var menus = a.menus;
          _this15.rootSelection$.select(".action-" + i).on('click', null);
          if (Array.isArray(menus)) {
            menus.forEach(function (menu, j) {
              if (!menu) return;
              _this15.rootSelection$.select(".action-" + i + "-menu-" + j).on('click', null);
            });
          }
        });
        d3.select('body').on('click', null);
      }
      this.rootSelection$.remove();
      this.rootSelection$ = null;
    }
    if (this.unBindResize$) {
      this.unBindResize$();
      this.unBindResize$ = null;
    }
    this.click$ = null;
    this.dblclick$ = null;
    this.contextmenu$ = null;
    this.zoomstart$ = null;
    this.zooming$ = null;
    this.zoomend$ = null;
    this.resize$ = null;
    this.reset$ = null;
    this.canZoom$ = null;
  };
  _proto.resize = function resize() {
    if (document.createEvent) {
      var event = document.createEvent('Event');
      event.initEvent('resize', true, true);
      window.dispatchEvent(event);
    } else if (document.createEventObject) {
      var _event = document.createEventObject();
      _event.type = 'onresize';
      window.fireEvent('onresize', _event);
    }
    return this;
  };
  _proto.downloadImage = function downloadImage(name, content) {
    var _this$download = this.download,
      ext = _this$download.ext,
      color = _this$download.color,
      background = _this$download.background;
    var svgSel = this.rootSelection$.select('svg');
    var width = +svgSel.attr('width');
    var height = +svgSel.attr('height');
    var svgNode = svgSel.node();
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    var tempCxt = tempCanvas.getContext('2d');
    tempCxt.clearRect(0, 0, width, height);
    if (background && background !== 'transparent') {
      tempCxt.fillStyle = background;
      tempCxt.fillRect(0, 0, width, height);
    }
    var tmpColor = svgNode.style.color;
    if (color) {
      svgNode.style.color = color;
    }
    var tempImage = new Image();
    tempImage.src = "data:image/svg+xml;base64," + window.btoa(window.unescape(window.encodeURIComponent("<?xml version=\"1.0\" standalone=\"no\"?>\n          " + new XMLSerializer().serializeToString(svgNode))));
    svgNode.style.color = tmpColor;
    tempImage.onload = function () {
      tempCxt.drawImage(tempImage, 0, 0);
      if (content) {
        tempCxt.drawImage(content.image, content.x, content.y);
      }
      var a = document.createElement('a');
      a.download = (name || 'basechart') + "." + (ext || 'png');
      a.href = tempCanvas.toDataURL("image/" + (ext || 'png'));
      a.click();
    };
  };
  return BaseChart;
}();
var _default = BaseChart;
exports.default = _default;