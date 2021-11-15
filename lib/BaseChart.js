"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var d3 = _interopRequireWildcard(require("d3"));

var util = _interopRequireWildcard(require("./util"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var downloadPath = 'M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z';
var resetPath = 'M483.031 380.989v-61.004l-162.969 92.891 162.969 99.24v-64.04c128.025 0.122 157.093 64.052 157.093 94.107 0 33.863-29.068 97.771-157.093 97.771l-98.957 0.011v63.919l98.957-0.011c157.093 0.011 221.105-63.907 221.105-159.017 0.001-96.647-64.012-163.856-221.105-163.867 M511.372 64.548c-247.628 0-448.369 200.319-448.369 447.426S263.744 959.4 511.372 959.4s448.369-200.32 448.369-447.426S758.999 64.548 511.372 64.548z m-0.203 823.564c-207.318 0-375.382-167.71-375.382-374.592s168.064-374.592 375.382-374.592 375.382 167.71 375.382 374.592-168.064 374.592-375.382 374.592z';
var lockPath = 'M508.3 66.3c-128 0-232.7 104.7-232.7 232.7v188.5h94.5V333.3c0-98.7 62-179.5 137.8-179.5 75.8 0 137.8 80.8 137.8 179.5v154.2H741V299c0-128-104.7-232.7-232.7-232.7zM792.3 485.5H223.6c-31.3 0-56.6 25.3-56.6 56.6v408.1c0 31.3 25.3 56.6 56.6 56.6h568.7c31.3 0 56.6-25.3 56.6-56.6V542.1c0-31.3-25.4-56.6-56.6-56.6zM537.8 758.4v98h-59.4v-98.2c-23.6-11.2-40-35.2-40-63.1 0-38.6 31.3-69.9 69.9-69.9 38.6 0 69.9 31.3 69.9 69.9-0.1 28.1-16.6 52.2-40.4 63.3z';
var unlockPath = 'M508.3 66.3c-128 0-232.7 104.7-232.7 232.7v188.5h94.5V333.3c0-98.7 62-179.5 137.8-179.5 75.8 0 137.8 80.8 137.8 179.5v0H741V299c0-128-104.7-232.7-232.7-232.7zM792.3 485.5H223.6c-31.3 0-56.6 25.3-56.6 56.6v408.1c0 31.3 25.3 56.6 56.6 56.6h568.7c31.3 0 56.6-25.3 56.6-56.6V542.1c0-31.3-25.4-56.6-56.6-56.6zM537.8 758.4v98h-59.4v-98.2c-23.6-11.2-40-35.2-40-63.1 0-38.6 31.3-69.9 69.9-69.9 38.6 0 69.9 31.3 69.9 69.9-0.1 28.1-16.6 52.2-40.4 63.3z';
var actionButtons = {
  download: {
    label: '下载视图',
    path: downloadPath,
    className: 'download'
  },
  reset: {
    label: '重置视图',
    path: resetPath,
    className: 'reset'
  },
  xlock: {
    label: 'X轴缩放开关',
    path: unlockPath,
    className: 'xlock'
  },
  ylock: {
    label: 'Y轴缩放开关',
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
      padding = _ref.padding;
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

  var _pad = (0, _slicedToArray2.default)(pad, 4),
      pad0 = _pad[0],
      pad1 = _pad[1],
      pad2 = _pad[2],
      pad3 = _pad[3];

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
    padding: [top, right, bottom, left]
  };
};

var scaleLable = function scaleLable(labelSel, _ref3) {
  var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
      scale = _ref4[0],
      domain = _ref4[1];

  var type = scale.type,
      format = scale.format,
      label = scale.label,
      unit = scale.unit;
  type = type || 'linear';
  label = label || '';
  unit = !label || !unit ? '' : " ( ".concat(unit, " )");
  format = format || getDefaultFormat(type);

  var _domain = (0, _slicedToArray2.default)(domain, 2),
      min = _domain[0],
      max = _domain[1];

  min = min || 0;
  max = max || 0;
  labelSel.select('text').selectAll('tspan').data([0, 1]).join('tspan').attr('dx', function (_, i) {
    if (!label) return 0;
    return i === 0 ? -12 : 12;
  }).text(function (_, i) {
    return i === 0 ? "".concat(label).concat(unit) : "".concat(format(min), " - ").concat(format(max));
  });
};

function getScaleAxis() {
  var _this = this;

  var _this$zoomSelection$$ = this.zoomSelection$.datum(),
      _this$zoomSelection$$2 = (0, _slicedToArray2.default)(_this$zoomSelection$$, 2),
      xTransform = _this$zoomSelection$$2[0],
      yTransform = _this$zoomSelection$$2[1];

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
      var _ref5 = _this2.scale[key].domain || _this2.dataDomains$[key] || [0, 1],
          _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
          minDomain = _ref6[0],
          maxDomain = _ref6[1];

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
    var _map = [xzoom, yzoom].map(function (zoom, i) {
      var key = zoom.domain || (i === 0 ? 'x' : 'y');
      var domain = [0, 1];

      if (_this4.scale[key]) {
        domain = _this4.scale[key].domain || _this4.dataDomains$[key] || [0, 1];
      }

      return domain;
    }),
        _map2 = (0, _slicedToArray2.default)(_map, 2),
        xdomain = _map2[0],
        ydomain = _map2[1];

    var _xdomain = (0, _slicedToArray2.default)(xdomain, 2),
        xMinDomain = _xdomain[0],
        xMaxDomain = _xdomain[1];

    var _ydomain = (0, _slicedToArray2.default)(ydomain, 2),
        yMinDomain = _ydomain[0],
        yMaxDomain = _ydomain[1];

    var xDomainEx = (xMaxDomain || 1) - (xMinDomain || 0);
    var yDomainEx = (yMaxDomain || 1) - (yMinDomain || 0);

    var _ref7 = xzoom.translate || [-Infinity, Infinity],
        _ref8 = (0, _slicedToArray2.default)(_ref7, 2),
        _ref8$ = _ref8[0],
        xMinTranslate = _ref8$ === void 0 ? 0 : _ref8$,
        _ref8$2 = _ref8[1],
        xMaxTranslate = _ref8$2 === void 0 ? 0 : _ref8$2;

    var _ref9 = yzoom.translate || [-Infinity, Infinity],
        _ref10 = (0, _slicedToArray2.default)(_ref9, 2),
        _ref10$ = _ref10[0],
        yMinTranslate = _ref10$ === void 0 ? 0 : _ref10$,
        _ref10$2 = _ref10[1],
        yMaxTranslate = _ref10$2 === void 0 ? 0 : _ref10$2;

    var _ref11 = xzoom.precision || [xDomainEx / 10, xDomainEx * 10],
        _ref12 = (0, _slicedToArray2.default)(_ref11, 2),
        _ref12$ = _ref12[0],
        xMinPrecision = _ref12$ === void 0 ? xDomainEx / 10 : _ref12$,
        _ref12$2 = _ref12[1],
        xMaxPrecision = _ref12$2 === void 0 ? xDomainEx * 10 : _ref12$2;

    var _ref13 = yzoom.precision || [yDomainEx / 10, yDomainEx * 10],
        _ref14 = (0, _slicedToArray2.default)(_ref13, 2),
        _ref14$ = _ref14[0],
        yMinPrecision = _ref14$ === void 0 ? yDomainEx / 10 : _ref14$,
        _ref14$2 = _ref14[1],
        yMaxPrecision = _ref14$2 === void 0 ? yDomainEx * 10 : _ref14$2;

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

  this.transform$ = function (axis, tf, deltK, point, point0) {
    var transform = tf;

    if (_this5.zoomExtent$) {
      var _this5$zoomExtent$ = _this5.zoomExtent$,
          viewExtent = _this5$zoomExtent$.viewExtent,
          translateExtent = _this5$zoomExtent$.translateExtent,
          scaleExtent = _this5$zoomExtent$.scaleExtent;
      var tk = Math.max(axis === 'x' ? scaleExtent[0][0] : scaleExtent[0][1], Math.min(axis === 'x' ? scaleExtent[1][0] : scaleExtent[1][1], transform.k * deltK));
      var tx = point[0] - tk * point0[0];
      var ty = point[1] - tk * point0[1];

      if (tk !== transform.k || tx !== transform.x || ty !== transform.y) {
        transform = d3.zoomIdentity.translate(tx, ty).scale(tk);
        var dx0 = transform.invertX(viewExtent[0][0]) - translateExtent[0][0];
        var dx1 = transform.invertX(viewExtent[1][0]) - translateExtent[1][0];
        var dy0 = transform.invertY(viewExtent[0][1]) - translateExtent[0][1];
        var dy1 = transform.invertY(viewExtent[1][1]) - translateExtent[1][1];
        transform = transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
      }
    }

    return transform;
  };
}

function updateElement(size) {
  var _computeSize = computeSize(this.rootSelection$.node(), size),
      width = _computeSize.width,
      height = _computeSize.height,
      padding = _computeSize.padding;

  var zw = width - padding[3] - padding[1];
  var zh = height - padding[0] - padding[2];
  if (zw < 1) zw = 1;
  if (zh < 1) zh = 1;
  var group = this.rootSelection$.select('svg').attr('width', width).attr('height', height).select('g.group').attr('transform', "translate(".concat(padding[3], ",").concat(padding[0], ")"));
  this.rootSelection$.select('clipPath').selectChild().attr('x', 1).attr('y', 0).attr('width', zw).attr('height', zh);

  if (this.scale.x) {
    group.select('.xAxis').attr('transform', "translate(0,".concat(zh, ")"));
    group.select('.xLabel').attr('transform', "translate(".concat(zw / 2, " ").concat(zh + padding[2] - 14, ") rotate(0)"));
  }

  if (this.scale.x2) {
    group.select('.x2Label').attr('transform', "translate(".concat(zw / 2, " ").concat(-padding[0], ") rotate(0)"));
  }

  if (this.scale.y) {
    group.select('.yLabel').attr('transform', "translate(".concat(-padding[3], " ").concat(zh / 2, ") rotate(-90)"));
  }

  if (this.scale.y2) {
    group.select('.y2Axis').attr('transform', "translate(".concat(zw, ",0)"));
    group.select('.y2Label').attr('transform', "translate(".concat(zw + padding[1] - 14, " ").concat(zh / 2, ") rotate(-90)"));
  }

  var svgDiv = this.rootSelection$.select('div.actions').style('width', "".concat(zw, "px")).style('height', "".concat(zh, "px")).style('top', "".concat(padding[0], "px")).style('left', "".concat(padding[3] + 1, "px"));

  if (this.zoom.x) {
    svgDiv.select('.xlock').style('top', "".concat(zh + padding[2] - 21, "px")).style('left', "".concat(zw - 12, "px"));
  }

  if (this.zoom.y) {
    svgDiv.select('.ylock').style('top', '-20px').style('left', "".concat(-padding[3], "px"));
  }

  var offset = 5;

  if (this.zoom.x || this.zoom.y) {
    svgDiv.select('.reset').style('top', "".concat(-padding[0] - 3, "px")).style('left', "".concat(this.scale.y ? zw - offset - 18 : offset, "px"));
    offset += 23;
  }

  if (this.download) {
    svgDiv.select('.download').style('top', "".concat(-padding[0] - 3, "px")).style('left', "".concat(this.scale.y ? zw - offset - 18 : offset, "px"));
    offset += 23;
  }

  group.select('.zLabel').attr('transform', "translate(".concat(this.scale.y ? zw - offset : offset, " ").concat(this.scale.x2 ? 0 : -padding[0], ")"));
  this.width = width;
  this.height = height;
  this.padding = padding;
  this.width$ = zw;
  this.height$ = zh;
}

function createElement(container, size) {
  var _this6 = this;

  var svgXmlns = 'http://www.w3.org/2000/svg';
  var rootSelection = d3.select(container || document.createElement('div')).append('div').attr('class', 'd3chart').style('position', 'relative') // .style('overflow', 'hidden')
  .style('width', '100%').style('height', '100%');
  var svgSelection = rootSelection.append('svg').attr('xmlns', svgXmlns).attr('width', 1) // 清除默认宽高
  .attr('height', 1) // 清除默认宽高
  .attr('fill', 'none').attr('text-anchor', 'middle').attr('font-size', this.fontSize).attr('stroke', 'none').attr('stroke-width', 1).attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round').style('position', 'absolute');
  svgSelection.append('defs').append('svg:clipPath').attr('id', pathClipId).append('rect');
  var groupSelection = svgSelection.append('g').attr('class', 'group');
  axisType.forEach(function (key) {
    if (_this6.scale[key]) {
      groupSelection.append('g').attr('class', "".concat(key, "Axis"));
      groupSelection.append('g').attr('class', "".concat(key, "Label")).attr('fill', 'currentColor').attr('dominant-baseline', 'text-before-edge').append('text');
    }
  });
  var pathClipId = util.guid('clip');
  groupSelection.append('g').attr('class', 'zAxis').attr('clip-path', "url(#".concat(pathClipId, ")"));
  groupSelection.append('g').attr('class', 'zLabel').attr('fill', 'currentColor').attr('dominant-baseline', 'text-before-edge');
  var divSelection = rootSelection.append('div').attr('class', 'actions').style('position', 'absolute').style('top', 0).style('left', 0);
  var zoomSelection = divSelection.append('div').attr('class', 'xyzoom').style('position', 'absolute') // .style('overflow', 'hidden')
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

  actions.forEach(function (action) {
    divSelection.append('div').attr('class', action.className).style('position', 'absolute').attr('title', action.label).style('font-size', '18px').append('svg').attr('xmlns', svgXmlns).attr('fill', 'currentColor').attr('viewBox', '0 0 1024 1024').attr('width', '1em').attr('height', '1em').append('path').attr('d', action.path);
  });

  if (this.tooptip) {
    var cross = this.tooptip.cross;
    zoomSelection.append('div').attr('class', 'tooptip').style('display', 'none').style('z-index', '999').style('border-radius', '8px').style('transition', 'none').style('padding', '10px 14px').style('font-size', "".concat(this.fontSize, "px")).style('line-height', '22px').style('position', 'absolute').style('top', 0).style('left', 0);
    cross.split('').forEach(function (key) {
      if (key) {
        zoomSelection.append('div').attr('class', "".concat(key, "-cross")).style('display', 'none').style('position', 'absolute').style('transition', 'none').style('width', key === 'x' ? '1px' : '100%').style('height', key === 'x' ? '100%' : '1px').style('top', 0).style('left', 0);
      }
    });
  }

  this.rootSelection$ = rootSelection;
  this.zoomSelection$ = zoomSelection;
  updateElement.call(this, size);

  if (!(util.isNumber(size.width) && size.width > 1 && util.isNumber(size.height) && size.height > 1)) {
    var resize = util.debounce(function (e) {
      if (_this6.destroyed) return;
      updateElement.call(_this6, size);
      updateScale.call(_this6);
      updateZoom.call(_this6);

      if (_this6.rendered) {
        _this6.reset();
      }

      _this6.resize$.call(null, {
        sourceEvent: e || null,
        target: _this6.rootSelection$,
        transform: [].concat((0, _toConsumableArray2.default)(_this6.zoomSelection$.datum()), [d3.zoomTransform(_this6.zoomSelection$.node())]),
        scaleAxis: getScaleAxis.call(_this6),
        type: 'resize'
      }, {
        width: _this6.width$,
        height: _this6.height$,
        padding: _this6.padding
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
  var _this7 = this;

  var pointX0 = [0, 0];
  var pointY0 = [0, 0];
  var point0 = [0, 0];
  var transform0 = d3.zoomIdentity;
  this.zoomSelection$.datum([d3.zoomIdentity, d3.zoomIdentity]);
  this.zoomer$.on('start', function (e) {
    if (_this7.destroyed || !_this7.rendered) return;

    var _this7$zoomSelection$ = _this7.zoomSelection$.datum(),
        _this7$zoomSelection$2 = (0, _slicedToArray2.default)(_this7$zoomSelection$, 2),
        xTransform = _this7$zoomSelection$2[0],
        yTransform = _this7$zoomSelection$2[1];

    var transform = e.transform,
        sourceEvent = e.sourceEvent;

    if (sourceEvent.type !== 'call') {
      if (!_this7.xCanZoom$ && !_this7.yCanZoom$) return;
      var point = d3.pointer(e, _this7.zoomSelection$.node());

      if (_this7.xCanZoom$) {
        pointX0 = xTransform.invert(point);
      }

      if (_this7.yCanZoom$) {
        pointY0 = yTransform.invert(point);
      }

      point0 = point;
      transform0 = transform;
    }

    _this7.zoomstart$.call(null, _objectSpread(_objectSpread({}, e), {}, {
      transform: [xTransform, yTransform, transform],
      scaleAxis: getScaleAxis.call(_this7)
    }));
  }).on('zoom', function (e) {
    if (_this7.destroyed || !_this7.rendered) return;

    var _this7$zoomSelection$3 = _this7.zoomSelection$.datum(),
        _this7$zoomSelection$4 = (0, _slicedToArray2.default)(_this7$zoomSelection$3, 2),
        xTransform = _this7$zoomSelection$4[0],
        yTransform = _this7$zoomSelection$4[1];

    var transform = e.transform,
        sourceEvent = e.sourceEvent; // sourceEvent存在表示事鼠标触发，如滚轮和移动

    if (sourceEvent.type !== 'call') {
      if (!_this7.xCanZoom$ && !_this7.yCanZoom$) return;
      var point = d3.pointer(e, _this7.zoomSelection$.node());
      if (sourceEvent.type === 'mousemove' && !util.isCanEmit(point0, point)) return;
      var deltK = transform.k / transform0.k;
      var changed = point[0] !== point0[0] || point[1] !== point0[1];
      var p = point;

      if (sourceEvent.type === 'wheel') {
        p = changed ? point : point0;
      }

      if (_this7.xCanZoom$) {
        var px0 = pointX0;

        if (sourceEvent.type === 'wheel') {
          px0 = changed ? xTransform.invert(point) : pointX0;
        }

        xTransform = _this7.transform$('x', xTransform, deltK, p, px0);
      }

      if (_this7.yCanZoom$) {
        var py0 = pointY0;

        if (sourceEvent.type === 'wheel') {
          py0 = changed ? yTransform.invert(point) : pointY0;
        }

        yTransform = _this7.transform$('y', yTransform, deltK, p, py0);
      }

      transform0 = transform;
    } else if (sourceEvent.transform) {
      // 跳到指定的transform，则直接赋值到xy
      // 如果存在xy缩放，则会有补间调用，万一补间一半，触发了滚轮或移动，则补间会停止，造成无法到达指定缩放位置，所以xy锁定的时候应该忽略补间
      var notZoom = !_this7.xCanZoom$ && !_this7.yCanZoom$;

      if (sourceEvent.zoomX) {
        xTransform = notZoom ? sourceEvent.transform : transform;
      }

      if (sourceEvent.zoomY) {
        yTransform = notZoom ? sourceEvent.transform : transform;
      }
    }

    _this7.zoomSelection$.datum([xTransform, yTransform]);

    var scaleAxis = getScaleAxis.call(_this7);
    Object.keys(scaleAxis).forEach(function (key) {
      var _scaleAxis$key = scaleAxis[key],
          axis = _scaleAxis$key.axis,
          scale = _scaleAxis$key.scale;

      _this7.rootSelection$.select(".".concat(key, "Axis")).call(axis);

      _this7.rootSelection$.select(".".concat(key, "Label")).call(scaleLable, [_this7.scale[key], scale.domain()]);
    });

    _this7.zooming$.call(null, _objectSpread(_objectSpread({}, e), {}, {
      transform: [xTransform, yTransform, transform],
      scaleAxis: scaleAxis
    }));
  }).on('end', function (e) {
    if (_this7.destroyed || !_this7.rendered) return;
    var transform = e.transform,
        sourceEvent = e.sourceEvent;

    if (sourceEvent.type !== 'call') {
      if (!_this7.xCanZoom$ && !_this7.yCanZoom$) return;
      var point = d3.pointer(e, _this7.zoomSelection$.node());
      if (sourceEvent.type === 'mousemove' && !util.isCanEmit(point0, point)) return;
      pointX0 = [0, 0];
      pointY0 = [0, 0];
      point0 = [0, 0];
      transform0 = d3.zoomIdentity;
    }

    _this7.zoomend$.call(null, _objectSpread(_objectSpread({}, e), {}, {
      transform: [].concat((0, _toConsumableArray2.default)(_this7.zoomSelection$.datum()), [transform]),
      scaleAxis: getScaleAxis.call(_this7)
    }));
  });
  this.zoomSelection$.call(this.zoomer$).on('mouseover', function (e) {
    if (_this7.destroyed) return;

    _this7.mouseover$.call(null, {
      sourceEvent: e,
      target: _this7.zoomSelection$,
      transform: [].concat((0, _toConsumableArray2.default)(_this7.zoomSelection$.datum()), [d3.zoomTransform(_this7.zoomSelection$.node())]),
      scaleAxis: getScaleAxis.call(_this7),
      type: 'mouseover'
    });
  }).on('mouseout', function (e) {
    if (_this7.destroyed) return;

    if (_this7.tooptip) {
      var cross = _this7.tooptip.cross;

      var zNode = _this7.zoomSelection$.node();

      var toElement = e.toElement;

      if (!toElement || toElement.parentNode !== zNode && toElement.parentNode.parentNode !== zNode) {
        if (cross.indexOf('x') !== -1) {
          _this7.zoomSelection$.select('.x-cross').style('display', 'none');
        }

        if (cross.indexOf('y') !== -1) {
          _this7.zoomSelection$.select('.y-cross').style('display', 'none');
        }

        _this7.zoomSelection$.select('.tooptip').style('display', 'none');
      }
    }

    _this7.mouseout$.call(null, {
      sourceEvent: e,
      target: _this7.zoomSelection$,
      transform: [].concat((0, _toConsumableArray2.default)(_this7.zoomSelection$.datum()), [d3.zoomTransform(_this7.zoomSelection$.node())]),
      scaleAxis: getScaleAxis.call(_this7),
      type: 'mouseout'
    });
  }).on('mousemove', function (e) {
    if (_this7.destroyed) return;
    var scaleAxis = getScaleAxis.call(_this7);

    if (_this7.tooptip) {
      var _this7$tooptip = _this7.tooptip,
          cross = _this7$tooptip.cross,
          compute = _this7$tooptip.compute;
      var crossX = cross.indexOf('x') !== -1;
      var crossY = cross.indexOf('y') !== -1;

      if (crossX || crossY) {
        var _d3$pointer = d3.pointer(e),
            _d3$pointer2 = (0, _slicedToArray2.default)(_d3$pointer, 2),
            x0 = _d3$pointer2[0],
            y0 = _d3$pointer2[1];

        var _compute = compute([x0, y0], scaleAxis),
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
          _this7.zoomSelection$.select('.x-cross').style('left', "".concat(x00, "px")).style('display', display);
        }

        if (crossY) {
          _this7.zoomSelection$.select('.y-cross').style('top', "".concat(y00, "px")).style('display', display);
        }

        var tooptip = _this7.zoomSelection$.select('.tooptip');

        tooptip.style('display', display).call(result);

        if (display !== 'none') {
          var width = tooptip.node().clientWidth;
          var height = tooptip.node().clientHeight;
          var left = x0 + 10;
          var top = y0 - height - 10;

          if (_this7.width$ - left < width) {
            left = x0 - 10 - width;
          }

          left = left <= -60 ? -60 : left;
          top = top <= -20 ? -20 : top;
          tooptip.style('left', "".concat(left, "px")).style('top', "".concat(top, "px"));
        }
      }
    }

    _this7.mouseout$.call(null, {
      sourceEvent: e,
      target: _this7.zoomSelection$,
      transform: [].concat((0, _toConsumableArray2.default)(_this7.zoomSelection$.datum()), [d3.zoomTransform(_this7.zoomSelection$.node())]),
      scaleAxis: scaleAxis,
      type: 'mousemove'
    });
  }).on('click', function (e) {
    if (_this7.destroyed) return;

    _this7.click$.call(null, {
      sourceEvent: e,
      target: _this7.zoomSelection$,
      transform: [].concat((0, _toConsumableArray2.default)(_this7.zoomSelection$.datum()), [d3.zoomTransform(_this7.zoomSelection$.node())]),
      scaleAxis: getScaleAxis.call(_this7),
      type: 'click'
    });
  }).on('contextmenu', function (e) {
    if (_this7.destroyed) return;

    _this7.contextmenu$.call(null, {
      sourceEvent: e,
      target: _this7.zoomSelection$,
      transform: [].concat((0, _toConsumableArray2.default)(_this7.zoomSelection$.datum()), [d3.zoomTransform(_this7.zoomSelection$.node())]),
      scaleAxis: getScaleAxis.call(_this7),
      type: 'contextmenu'
    });

    e.preventDefault();
  }).on('dblclick', function (e) {
    if (_this7.destroyed) return;

    _this7.dblclick$.call(null, {
      sourceEvent: e,
      target: _this7.zoomSelection$,
      transform: [].concat((0, _toConsumableArray2.default)(_this7.zoomSelection$.datum()), [d3.zoomTransform(_this7.zoomSelection$.node())]),
      scaleAxis: getScaleAxis.call(_this7),
      type: 'dblclick'
    });
  });

  if (!this.zoom.doubleZoom) {
    // 取消双击放大
    this.zoomSelection$.on('dblclick.zoom', null);
  }

  if (this.zoom.x) {
    var xlock = this.rootSelection$.select('.xlock');
    xlock.on('click', function () {
      _this7.xCanZoom$ = !_this7.xCanZoom$;
      xlock.select('path').attr('d', _this7.xCanZoom$ ? unlockPath : lockPath);
    });
  }

  if (this.zoom.y) {
    var ylock = this.rootSelection$.select('.ylock');
    ylock.on('click', function () {
      _this7.yCanZoom$ = !_this7.yCanZoom$;
      ylock.select('path').attr('d', _this7.yCanZoom$ ? unlockPath : lockPath);
    });
  }

  if (this.zoom.x || this.zoom.y) {
    this.rootSelection$.select('.reset').on('click', function () {
      _this7.reset$();

      _this7.reset();
    });
  }

  if (this.download) {
    this.rootSelection$.select('.download').on('click', function () {
      if (_this7.download.action) {
        _this7.download.action(function () {
          _this7.downloadImage();
        }, _this7.rootSelection$);
      } else {
        _this7.downloadImage();
      }
    });
  }
}

var BaseChart = /*#__PURE__*/function () {
  function BaseChart() {
    var _this8 = this;

    (0, _classCallCheck2.default)(this, BaseChart);

    var _ref15 = (arguments.length <= 0 ? undefined : arguments[0]) || {},
        container = _ref15.container,
        width = _ref15.width,
        height = _ref15.height,
        _ref15$padding = _ref15.padding,
        padding = _ref15$padding === void 0 ? [0, 0, 0, 0] : _ref15$padding,
        _ref15$fontSize = _ref15.fontSize,
        fontSize = _ref15$fontSize === void 0 ? 12 : _ref15$fontSize,
        download = _ref15.download,
        tooptip = _ref15.tooptip,
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

    this.tooptip = !tooptip ? false : _objectSpread(_objectSpread({
      cross: ''
    }, tooptip), {}, {
      compute: function compute() {
        var result = {};

        if (typeof tooptip.compute === 'function') {
          var _tooptip$compute;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          result = (_tooptip$compute = tooptip.compute).call.apply(_tooptip$compute, [_this8, result].concat(args));
        }

        return result;
      }
    });
    this.zoom = _objectSpread({
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
    this.scale = _objectSpread({
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
    this.fontSize = fontSize;
    this.data = data || {};
    this.dataDomains$ = {};
    this.zoomer$ = d3.zoom();
    this.xCanZoom$ = !!this.zoom.x;
    this.yCanZoom$ = !!this.zoom.y;
    createElement.call(this, container, {
      width: width,
      height: height,
      padding: padding
    });
    createScale.call(this);
    createZoom.call(this);
    bindEvents.call(this);
    this.click$ = util.noop;
    this.dblclick$ = util.noop;
    this.contextmenu$ = util.noop;
    this.mouseover$ = util.noop;
    this.mousemove$ = util.noop;
    this.mouseout$ = util.noop;
    this.zoomstart$ = util.noop;
    this.zooming$ = util.noop;
    this.zoomend$ = util.noop;
    this.resize$ = util.noop;
    this.reset$ = util.noop;
  }

  (0, _createClass2.default)(BaseChart, [{
    key: "reset",
    value: function reset(noTransition) {
      this.render(d3.zoomIdentity, 'xy', noTransition);
      return this;
    }
  }, {
    key: "render",
    value: function render(tf) {
      var ax = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'xy';
      var noTransition = arguments.length > 2 ? arguments[2] : undefined;
      this.rendered = true;
      var transform = tf || d3.zoomTransform(this.zoomSelection$.node()); // 对this.zoomSelection$调用this.zoomer$.transform函数变换到指定的transform
      // 变换过程中用240ms及ease函数进行transition

      (noTransition ? this.zoomSelection$ : this.zoomSelection$.transition().duration(240).ease(d3.easeLinear)).call(this.zoomer$.transform, transform, null, {
        type: 'call',
        transform: tf,
        zoomX: ax.indexOf('x') !== -1,
        zoomY: ax.indexOf('y') !== -1
      });
      return this;
    }
  }, {
    key: "setEvent",
    value: function setEvent(type, handler) {
      if (typeof handler === 'function') {
        var oldHandler = this["".concat(type, "$")];

        this["".concat(type, "$")] = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          handler.call.apply(handler, [null].concat(args, [oldHandler.call.apply(oldHandler, [null].concat(args))]));
        };
      }
    }
  }, {
    key: "setData",
    value: function setData(data, render) {
      var _this9 = this;

      var computeDomain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : util.noop;
      if (!data) return this;
      this.rendered = false;
      this.data = data; // 根据data计算domain

      var needCompute = axisType.filter(function (key) {
        return _this9.scale[key] && !_this9.scale[key].domain;
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
    }
  }, {
    key: "setDomain",
    value: function setDomain(domain, render) {
      var _this10 = this;

      if (!domain) return this;
      var isScale = false;
      axisType.forEach(function (key) {
        if (_this10.scale[key] && domain[key]) {
          _this10.scale[key].domain = domain[key];
          isScale = true;
        }
      });

      if (isScale) {
        this.rendered = false;
        updateScale.call(this);
        var isZoom = false;
        ['x', 'y'].forEach(function (key) {
          isZoom = _this10.zoom[key] && (_this10.scale[key] && domain[key] || _this10.scale["".concat(key, "2")] && domain["".concat(key, "2")]);
        });

        if (isZoom) {
          updateZoom.call(this);
        }

        if (render) {
          this.render();
        }
      }

      return this;
    }
  }, {
    key: "setTranslate",
    value: function setTranslate(translate, render) {
      var _this11 = this;

      if (!translate) return this;
      var isZoom = false;
      ['x', 'y'].forEach(function (key) {
        if (_this11.zoom[key]) {
          _this11.zoom[key].translate = translate[key];
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
    }
  }, {
    key: "setPrecision",
    value: function setPrecision(precision, render) {
      var _this12 = this;

      if (!precision) return this;
      var isZoom = false;
      ['x', 'y'].forEach(function (key) {
        if (_this12.zoom[key]) {
          _this12.zoom[key].precision = precision[key];
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
    }
  }, {
    key: "setLabel",
    value: function setLabel(label, render) {
      var _this13 = this;

      if (!label) return this;
      var isScale = false;
      axisType.forEach(function (key) {
        if (_this13.scale[key] && label[key]) {
          _this13.scale[key].label = label[key].label;
          _this13.scale[key].unit = label[key].unit;
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
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.destroyed = true;
      this.rendered = false;
      this.data = {};
      this.zoomer$.on('start', null).on('zoom', null).on('end', null);
      this.zoomSelection$.on('mouseover', null).on('mouseout', null).on('mousemove', null).on('dblclick.zoom', null).on('click', null).on('contextmenu', null);
      if (this.unBindResize$) this.unBindResize$();
      this.rootSelection$.remove();
      this.rootSelection$ = null;
    }
  }, {
    key: "resize",
    value: function resize() {
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
    }
  }, {
    key: "downloadImage",
    value: function downloadImage(name, content) {
      var svgSel = this.rootSelection$.select('svg');
      var width = +svgSel.attr('width');
      var height = +svgSel.attr('height');
      var tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      var tempCxt = tempCanvas.getContext('2d');
      tempCxt.clearRect(0, 0, width, height);

      if (content) {
        tempCxt.drawImage(content.image, content.x, content.y);
      }

      var tempImage = new Image();
      tempImage.src = "data:image/svg+xml;base64,".concat(window.btoa(window.unescape(window.encodeURIComponent("<?xml version=\"1.0\" standalone=\"no\"?>\n          ".concat(new XMLSerializer().serializeToString(svgSel.node()))))));
      var ext = this.download.ext || 'png';

      tempImage.onload = function () {
        tempCxt.drawImage(tempImage, 0, 0);
        var a = document.createElement('a');
        a.download = "".concat(name || 'basechart', ".").concat(ext);
        a.href = tempCanvas.toDataURL("image/".concat(ext));
        a.click();
      };
    }
  }]);
  return BaseChart;
}();

var _default = BaseChart;
exports.default = _default;
//# sourceMappingURL=BaseChart.js.map