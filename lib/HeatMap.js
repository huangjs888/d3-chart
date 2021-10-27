"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var d3 = _interopRequireWildcard(require("d3"));

var _BaseChart2 = _interopRequireDefault(require("./BaseChart"));

var util = _interopRequireWildcard(require("./util"));

var _excluded = ["data", "tooptip", "scale"],
    _excluded2 = ["heat"],
    _excluded3 = ["width", "height", "padding"],
    _excluded4 = ["heat"],
    _excluded5 = ["z"],
    _excluded6 = ["z"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var prefixSIFormat = d3.format('~s');

var findValIndex = function findValIndex(val, arr) {
  var n1 = 0;
  var n2 = arr.length;
  var c = 0;
  var binSize = n2 > 1 ? (arr[n2 - 1] - arr[0]) / (n2 - 1) : 1;
  var n;
  var test;

  if (binSize >= 0) {
    test = function test(a, b) {
      return a <= b;
    };
  } else {
    test = function test(a, b) {
      return a > b;
    };
  } // don't trust floating point equality - fraction of bin size to call


  var v = val + binSize * 1e-9 * (binSize >= 0 ? 1 : -1); // c is just to avoid infinite loops if there's an error

  while (n1 < n2 && c < 100) {
    c += 1;
    n = Math.floor((n1 + n2) / 2);
    if (test(arr[n], v)) n1 = n + 1;else n2 = n;
  }

  if (c > 90) window.console.log('Long binary search...');
  return Math.min(Math.max(n1 - 1, 0), arr.length - 1);
}; // 计算两值之间任意值占比以及前后值


var computeFactor = function computeFactor(val, val0, val1, bin0, bin1) {
  var factor = (val - val0) / (val1 - val0) || 0;

  if (factor <= 0) {
    return {
      factor: 0,
      bin0: bin0,
      bin1: bin0
    };
  }

  if (factor > 0.5) {
    return {
      factor: 1 - factor,
      bin0: bin1,
      bin1: bin0
    };
  }

  return {
    factor: factor,
    bin0: bin0,
    bin1: bin1
  };
}; // 计算每个像素对应值的插值计算比例


var getInterpFactor = function getInterpFactor(pixel, valPixs) {
  var index0 = findValIndex(pixel, valPixs);
  var index1 = index0 + 1;
  return computeFactor(pixel, valPixs[index0], valPixs[index1], index0, index1);
}; // 根据四个点计算中间点的平均值


var matrixAverage = function matrixAverage(xFactor, val00, val01, yFactor, val10, val11) {
  var val = 0;

  if (val00 !== undefined) {
    var dx = val01 - val00 || 0;
    var dy = val10 - val00 || 0;
    var dxy = 0;

    if (val01 === undefined) {
      if (val11 === undefined) dxy = 0;else if (val10 === undefined) dxy = 2 * (val11 - val00);else dxy = (2 * val11 - val10 - val00) * 2 / 3;
    } else if (val11 === undefined) {
      if (val10 === undefined) dxy = 0;else dxy = (2 * val00 - val01 - val10) * 2 / 3;
    } else if (val10 === undefined) dxy = (2 * val11 - val01 - val00) * 2 / 3;else dxy = val11 + val00 - val01 - val10;

    val = val00 + (xFactor || 0) * dx + (yFactor || 0) * (dy + xFactor * dxy);
  }

  return val;
}; // 将给定值数组中的值映射到给定长度的每一个像素点上
// 若值数组长度比像素点多，则会均匀抽稀映射
// 若值数组长度比像素点少，则会平滑插值映射


var valueForPixel = function valueForPixel(value, pixel, reverse) {
  var valPixs = [];
  var len = value.length;
  var minVal = value[0];
  var maxVal = value[len - 1];

  for (var i = 0; i < len; i += 1) {
    valPixs[reverse ? len - 1 - i : i] = Math.round(Math.round(100 * pixel * ((value[i] - minVal) / (maxVal - minVal))) / 100);
  }

  return valPixs;
}; // 矩阵插值上色（根据矩形四个点值，计算矩形内部所有像素点的值，并渲染颜色）


var matrixInterp = function matrixInterp(_ref, _ref2, c) {
  var w = _ref.w,
      h = _ref.h,
      d = _ref.d;
  var x = _ref2.x,
      y = _ref2.y,
      z = _ref2.z;

  var _d = (0, _slicedToArray2.default)(d, 2),
      _d$ = (0, _slicedToArray2.default)(_d[0], 2),
      x0 = _d$[0],
      y0 = _d$[1],
      _d$2 = (0, _slicedToArray2.default)(_d[1], 2),
      x1 = _d$2[0],
      y1 = _d$2[1];

  var cw = x1 - x0;
  var ch = y1 - y0;
  var xValPixs = valueForPixel(x, w);
  var yValPixs = valueForPixel(y, h, true);
  var pixels;
  var index = 0;

  try {
    pixels = new Uint8Array(cw * ch * 4);
  } catch (e) {
    pixels = new Array(cw * ch * 4);
  }

  var xInterpArray = [];

  for (var j = y0; j < y1; j += 1) {
    var yInterp = getInterpFactor(j, yValPixs);
    var val0 = z[yInterp.bin0];
    var val1 = z[yInterp.bin1];

    var _loop = function _loop(i) {
      var xInterp = xInterpArray[i];

      if (!xInterp) {
        xInterp = getInterpFactor(i, xValPixs);
        xInterpArray[i] = xInterp;
      }

      var chasm = x.chasm || [];
      var xbin = Math.max(xInterp.bin0, xInterp.bin1);
      var noChasm = chasm.findIndex(function (o) {
        return o === xbin;
      }) === -1;

      var _ref3 = noChasm ? c(matrixAverage(xInterp.factor, val0[xInterp.bin0], val0[xInterp.bin1], yInterp.factor, val1[xInterp.bin0], val1[xInterp.bin1])) : {
        r: 0,
        g: 0,
        b: 0,
        opacity: 0
      },
          r = _ref3.r,
          g = _ref3.g,
          b = _ref3.b,
          opacity = _ref3.opacity;

      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = opacity * 255; // 透明度0-1需要转换成0-255

      index += 4;
    };

    for (var i = x0; i < x1; i += 1) {
      _loop(i);
    }
  }

  return pixels;
};

function drawend(zContext, _ref4) {
  var xScale = _ref4.xScale,
      yScale = _ref4.yScale;
  zContext.save(); // 先清空画布

  zContext.clearRect(0, 0, this.width$, this.height$);

  if (this.showHeat$) {
    var zScale = this.zScale$;
    var viewRange = null;
    var _this$data$heat = this.data.heat,
        x = _this$data$heat.x,
        y = _this$data$heat.y,
        z = _this$data$heat.z; // 原始范围
    // 根据xy轴的刻度变换函数分别计算出原始数据图的上下左右坐标位置

    var xMinPx = xScale(x[0] || 0);
    var xMaxPx = xScale(x[x.length - 1] || 0); // 因为y坐标是反转的（domain和range大小反转对应）

    var yMinPx = yScale(y[y.length - 1] || 0);
    var yMaxPx = yScale(y[0] || 0); // 原始数据的实际宽高

    var width = Math.round(xMaxPx - xMinPx);
    var height = Math.round(yMaxPx - yMinPx); // 如果实际的宽高小于或等于0则表示压根没有数据

    if (width > 0 && height > 0) {
      // 画布范围
      // 画布上下左右坐标位置，this.width$, this.height$是画布的宽高
      var xcMinPx = 0;
      var xcMaxPx = this.width$ + xcMinPx;
      var ycMinPx = 0;
      var ycMaxPx = this.height$ + ycMinPx; // 真实渲染的数据，是原始数据的范围，配置中筛选的范围以及画布的范围最终确定
      // 根据以上三个范围计算确定真正需要渲染的范围，要考虑此范围的两个问题：
      // 1，对于原始数据段转换的像素范围，应该选择哪一段像素去渲染？
      // 2，对于视图，这一段数据应该渲染在画布上哪一个范围（在画布内部的位置）？
      // 以下计算需要渲染的像素段在原始数据像素范围内（宽和高）起点和终点的索引

      var xMin = Math.max(xcMinPx, xMinPx); // 取x最小范围中的最大值

      var xMax = Math.min(xcMaxPx, xMaxPx); // 取x最大范围中的最小值

      var yMin = Math.max(ycMinPx, yMinPx); // 取y最小范围中的最大值

      var yMax = Math.min(ycMaxPx, yMaxPx); // 取y最大范围中的最小值
      // 实际被裁减后的宽高（可能等于画布宽高，也可能小于，但是不会大于因为被裁掉了）

      var dataRange = [[Math.round(xMin - xMinPx), Math.round(yMin - yMinPx)], // 筛选后数据在原数据的起点index
      [Math.round(xMax - xMinPx), Math.round(yMax - yMinPx)] // 筛选后数据在原数据的终点index
      ];
      var cWidth = dataRange[1][0] - dataRange[0][0];
      var cHeight = dataRange[1][1] - dataRange[0][1]; // 如果裁剪后的宽高小于或等于0则表示没有可以渲染的数据了

      if (cWidth > 0 && cHeight > 0) {
        // 计算出渲染图片的每个像素rgba值
        var pixelData = matrixInterp({
          w: width,
          h: height,
          d: dataRange
        }, {
          x: x,
          y: y,
          z: z
        }, function (v) {
          // 老版本d3得到的rgba是字符串，新版本d3是对象，这里做个兼容
          var rgba = zScale(v);
          return typeof rgba === 'string' ? d3.color(rgba) : rgba;
        }); // 创建一个空的图片数据（使用裁剪后的宽高）

        var imageData = zContext.createImageData(cWidth, cHeight); // 将像素数据设置到图片数据内

        try {
          imageData.data.set(pixelData);
        } catch (e) {
          var cdata = imageData.data;
          var len = cdata.length;

          for (var i = 0; i < len; i += 1) {
            cdata[i] = pixelData[i];
          }
        } // 以下计在算在画布上需要渲染的范围起点和终点的位置（相对于画布）


        viewRange = [[xMin - xcMinPx, yMin - ycMinPx], [xMax - xcMinPx, yMax - ycMinPx]]; // 将计算好的数据放到画布

        zContext.putImageData(imageData, Math.round(viewRange[0][0]), Math.round(viewRange[0][1]));
        var canvas = this.tempCanvas$.canvas;

        if (canvas) {
          // 存储渲染后的裁剪数据和图片数据
          canvas.width = cWidth;
          canvas.height = cHeight;
          canvas.getContext('2d').putImageData(imageData, 0, 0);
        }
      }
    }

    this.tempCanvas$.range = !viewRange ? null : viewRange.map(function (r) {
      return r.map(function (v, i) {
        return (i === 0 ? xScale : yScale).invert(v);
      });
    });
  }

  zContext.restore();
}

function drawing(zContext, _ref5, lineMark) {
  var xScale = _ref5.xScale,
      yScale = _ref5.yScale;

  if (this.showHeat$) {
    var xp = xScale(lineMark.datum()) || 0;
    lineMark.style('left', "".concat(xp, "px")).style('visibility', xp < 0 || xp > this.width$ ? 'hidden' : 'visible');
    var _this$tempCanvas$ = this.tempCanvas$,
        canvas = _this$tempCanvas$.canvas,
        range = _this$tempCanvas$.range;

    if (range) {
      // 将上一次变换后的图，经过本次变换的变形重新绘制到画布上
      var _range$map = range.map(function (r) {
        return r.map(function (v, i) {
          return (i === 0 ? xScale : yScale)(v);
        });
      }),
          _range$map2 = (0, _slicedToArray2.default)(_range$map, 2),
          _range$map2$ = (0, _slicedToArray2.default)(_range$map2[0], 2),
          x0 = _range$map2$[0],
          y0 = _range$map2$[1],
          _range$map2$2 = (0, _slicedToArray2.default)(_range$map2[1], 2),
          x1 = _range$map2$2[0],
          y1 = _range$map2$2[1];

      zContext.save();
      zContext.clearRect(0, 0, this.width$, this.height$);
      zContext.drawImage(canvas, x0, y0, x1 - x0, y1 - y0);
      zContext.restore();
    }
  }
}

function tipCompute(prevRes, point, scaleAxis) {
  var data = this.data.heat;
  var scaleOpt = this.scale;
  var _this$tooptip = this.tooptip,
      cross = _this$tooptip.cross,
      average = _this$tooptip.average;
  var crossX = cross.indexOf('x') !== -1;
  var crossY = cross.indexOf('y') !== -1;
  var xScale = scaleAxis.x ? scaleAxis.x.scale : scaleAxis.x2.scale;
  var yScale = scaleAxis.y ? scaleAxis.y.scale : scaleAxis.y2.scale;

  var _point = (0, _slicedToArray2.default)(point, 2),
      x0 = _point[0],
      y0 = _point[1];

  var xyzValue = [];

  if (this.showHeat$ && crossX && crossY) {
    var xval = xScale.invert(x0);
    var yval = yScale.invert(y0);
    var zval = 0;

    var _util$findNearIndex = util.findNearIndex(+xval, data.x),
        _util$findNearIndex2 = (0, _slicedToArray2.default)(_util$findNearIndex, 2),
        xi0 = _util$findNearIndex2[0],
        xi1 = _util$findNearIndex2[1];

    var _util$findNearIndex3 = util.findNearIndex(+yval, data.y),
        _util$findNearIndex4 = (0, _slicedToArray2.default)(_util$findNearIndex3, 2),
        yi0 = _util$findNearIndex4[0],
        yi1 = _util$findNearIndex4[1];

    if (xi0 >= 0 && xi1 >= 0 && yi0 >= 0 && yi1 >= 0) {
      var xval0 = +data.x[xi0];
      var xval1 = +data.x[xi1];
      var yval0 = +data.y[yi0];
      var yval1 = +data.y[yi1];

      if (xval0 === xval1 && yval0 === yval1) {
        // 正好移动到了xy交叉数据点上
        zval = data.z[yi0][xi0];
      } else if (average) {
        var xInterp = computeFactor(+xval, xval0, xval1, xi0, xi1);
        var yInterp = computeFactor(+yval, yval0, yval1, yi0, yi1);
        var val00 = data.z[yInterp.bin0][xInterp.bin0];
        var val01 = data.z[yInterp.bin0][xInterp.bin1];
        var val10 = data.z[yInterp.bin1][xInterp.bin0];
        var val11 = data.z[yInterp.bin1][xInterp.bin1];
        zval = matrixAverage(xInterp.factor, val00, val01, yInterp.factor, val10, val11);
      } else {
        var xi = Math.abs(xval - xval0) > Math.abs(xval - xval1) ? xi1 : xi0;
        var yi = Math.abs(yval - yval0) > Math.abs(yval - yval1) ? yi1 : yi0;
        xval = +data.x[xi];
        yval = +data.y[yi];
        zval = data.z[yi][xi];
        x0 = xScale(xval);
        y0 = yScale(yval);
      }

      xyzValue.push(_objectSpread(_objectSpread({}, scaleOpt[scaleAxis.x ? 'x' : 'x2']), {}, {
        value: xval
      }), _objectSpread(_objectSpread({}, scaleOpt[scaleAxis.y ? 'y' : 'y2']), {}, {
        value: yval
      }), _objectSpread(_objectSpread({}, scaleOpt.z), {}, {
        value: zval
      }));
    }
  }

  if (xyzValue.length > 0) {
    // 去掉第一个因为第一个是标题
    var prevValue = (prevRes.data || []).slice(1);
    var ndata = [].concat(xyzValue, (0, _toConsumableArray2.default)(prevValue));

    var result = function result(selection) {
      selection.selectAll('div').data(ndata).join('div').attr('style', 'white-space: nowrap;').html(function (d, i) {
        return i === 0 ? "".concat(d.label, "\uFF1A").concat(d.format(d.value)).concat(d.unit) : "".concat(!d.color ? '' : "<span style=\"background: ".concat(d.color, "; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;\"></span>"), "<span>").concat(d.label, "</span>: <span style=\"display: inline-block; ").concat(!d.color ? '' : 'margin-left: 30px;', "\">").concat(d.format(d.value)).concat(d.unit, "</span>");
      });
    };

    return {
      x0: x0,
      y0: y0,
      data: ndata,
      result: result
    };
  }

  return _objectSpread({}, prevRes);
}

function updateScale() {
  if (this.scale.z) {
    var _ref6 = this.scale.z.domain || [],
        _ref7 = (0, _slicedToArray2.default)(_ref6, 3),
        opacity = _ref7[0],
        range = _ref7[1],
        domain = _ref7[2];

    this.zScale$.range((range || ['#fff', '#fff']).map(function (c) {
      return d3.color(c).copy({
        opacity: opacity || 0
      });
    })).domain(domain || [0, 0]).clamp(true); // 设置true可以卡住所给不在domain中的参数生成的数据仍然在range范围内
  }
}

function doubleClick(point, xScale, lineMark) {
  if (!this.showHeat$) {
    return null;
  }

  var data = this.data.heat;
  var average = this.tooptip.average;

  var _point2 = (0, _slicedToArray2.default)(point, 1),
      x0 = _point2[0];

  var z = [];
  var x = xScale.invert(x0);
  var xi = util.findNearIndex(+x, data.x, !average);

  if (average) {
    var _xi = (0, _slicedToArray2.default)(xi, 2),
        xi0 = _xi[0],
        xi1 = _xi[1];

    if (xi0 < 0) {
      z = data.z.map(function (v) {
        return v[xi1];
      });
      x = data.x[xi1];
      x0 = xScale(x);
    } else if (xi1 < 0) {
      z = data.z.map(function (v) {
        return v[xi0];
      });
      x = data.x[xi0];
      x0 = xScale(x);
    } else {
      var xInterp = computeFactor(+x, +data.x[xi0], +data.x[xi1], xi0, xi1);
      z = data.z.map(function (v) {
        return matrixAverage(xInterp.factor, v[xInterp.bin0], v[xInterp.bin1]);
      });
    }
  } else {
    z = data.z.map(function (v) {
      return v[xi];
    });
    x = data.x[xi];
    x0 = xScale(x);
  }

  lineMark.style('left', "".concat(x0, "px")).style('display', 'block').datum(x);
  return {
    x: x,
    y: data.y,
    z: z
  };
}

var HeatMap = /*#__PURE__*/function (_BaseChart) {
  (0, _inherits2.default)(HeatMap, _BaseChart);

  var _super = _createSuper(HeatMap);

  function HeatMap() {
    var _this;

    (0, _classCallCheck2.default)(this, HeatMap);

    var _ref8 = (arguments.length <= 0 ? undefined : arguments[0]) || {},
        data = _ref8.data,
        tooptip = _ref8.tooptip,
        scale = _ref8.scale,
        restOptions = (0, _objectWithoutProperties2.default)(_ref8, _excluded);

    var _ref9 = data || {},
        heat = _ref9.heat,
        restData = (0, _objectWithoutProperties2.default)(_ref9, _excluded2);

    _this = _super.call(this, _objectSpread(_objectSpread({}, restOptions), {}, {
      data: _objectSpread({
        heat: !heat ? {
          x: [],
          y: [],
          z: []
        } : {
          x: heat.x || [],
          y: heat.y || [],
          z: heat.z || []
        }
      }, restData),
      tooptip: !tooptip ? false : _objectSpread(_objectSpread({
        cross: 'xy',
        average: true
      }, tooptip), {}, {
        compute: function compute(res) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var result = tipCompute.call.apply(tipCompute, [(0, _assertThisInitialized2.default)(_this), res].concat(args));

          if (typeof tooptip.compute === 'function') {
            var _tooptip$compute;

            result = (_tooptip$compute = tooptip.compute).call.apply(_tooptip$compute, [(0, _assertThisInitialized2.default)(_this), result].concat(args));
          }

          return result;
        }
      }),
      scale: _objectSpread({
        /* z: {
          type: 'linear', // 坐标类型
          ticks: 5, // 坐标刻度数目
          format: (v) => v, // 坐标值格式化函数
          domain: [0, ['#fff', '#fff'], [0, 0]], // 值的色域范围和透明度
          label: '', // 坐标名称
          unit: '', // 坐标值单位
        }, */
        z: {
          format: prefixSIFormat
        }
      }, scale)
    }));
    _this.showHeat$ = true;
    var tempText = "".concat(_this.scale.z.label || '').concat(_this.scale.z.subLabel ? " ( ".concat(_this.scale.z.subLabel, " )") : '').concat(_this.scale.z.unit ? " ( ".concat(_this.scale.z.unit, " )") : '');

    var heatLabel = _this.rootSelection$.select('g.group').append('g').attr('class', 'heatLabel').attr('fill', 'currentColor').attr('dominant-baseline', 'text-before-edge').attr('transform', "translate(".concat(_this.scale.y ? 10 : _this.width$ - 10, ",").concat(_this.scale.x2 ? 0 : -_this.padding[0], ")"));

    heatLabel.append('text').attr('dx', util.measureSvgText(tempText, _this.fontSize) / 2).text(tempText);

    var lineMark = _this.zoomSelection$.append('div').attr('class', 'line-mark').style('background', '#fa9305').style('display', 'none').style('position', 'absolute').style('top', 0).style('left', 0).style('width', '1px').style('height', '100%');

    var zCanvasParent = _this.rootSelection$.insert('div', 'svg').style('position', 'absolute').style('width', "".concat(_this.width$, "px")).style('height', "".concat(_this.height$, "px")).style('top', "".concat(_this.padding[0], "px")).style('left', "".concat(_this.padding[3] + 1, "px"));

    var zCanvas = zCanvasParent.append('canvas').style('width', '100%').style('height', '100%').attr('width', _this.width$).attr('height', _this.height$);
    var zContext = zCanvas.node().getContext('2d');
    _this.zScale$ = d3.scaleLinear();
    updateScale.call((0, _assertThisInitialized2.default)(_this));
    _this.tempCanvas$ = {
      canvas: document.createElement('canvas'),
      range: null
    };
    var dblclick$$ = _this.dblclick$;

    _this.dblclick$ = function (e) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      dblclick$$.call.apply(dblclick$$, [null, e].concat(args));
      var x = e.scaleAxis.x;
      var xScale = x.scale;
      return doubleClick.call((0, _assertThisInitialized2.default)(_this), d3.pointer(e.sourceEvent), xScale, lineMark);
    };

    var contextmenu$$ = _this.contextmenu$;

    _this.contextmenu$ = function (e) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      contextmenu$$.call.apply(contextmenu$$, [null, e].concat(args));
      lineMark.style('display', 'none');
    };

    var zooming$$ = _this.zooming$;

    _this.zooming$ = function (e) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      zooming$$.call.apply(zooming$$, [null, e].concat(args));
      var _e$scaleAxis = e.scaleAxis,
          x = _e$scaleAxis.x,
          y = _e$scaleAxis.y;
      var xScale = x.scale;
      var yScale = y.scale;
      drawing.call((0, _assertThisInitialized2.default)(_this), zContext, {
        xScale: xScale,
        yScale: yScale
      }, lineMark);
    };

    var zoomend$$ = _this.zoomend$;
    _this.debounceDrawend$ = util.debounce(drawend, 450, {
      leading: false,
      trailing: true
    });

    _this.zoomend$ = function (e) {
      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      zoomend$$.call.apply(zoomend$$, [null, e].concat(args));
      var _e$scaleAxis2 = e.scaleAxis,
          x = _e$scaleAxis2.x,
          y = _e$scaleAxis2.y;
      var xScale = x.scale;
      var yScale = y.scale;

      _this.debounceDrawend$.call((0, _assertThisInitialized2.default)(_this), zContext, {
        xScale: xScale,
        yScale: yScale
      });

      if (e.sourceEvent.type === 'call') {
        util.delay(function () {
          _this.debounceDrawend$.flush();
        }, 1);
      }
    };

    var resize$$ = _this.resize$;

    _this.resize$ = function (e, _ref10) {
      var width = _ref10.width,
          height = _ref10.height,
          padding = _ref10.padding,
          rest = (0, _objectWithoutProperties2.default)(_ref10, _excluded3);

      for (var _len6 = arguments.length, args = new Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
        args[_key6 - 2] = arguments[_key6];
      }

      resize$$.call.apply(resize$$, [null, e, _objectSpread({
        width: width,
        height: height,
        padding: padding
      }, rest)].concat(args));
      zCanvasParent.style('width', "".concat(width, "px")).style('height', "".concat(height, "px")).style('top', "".concat(padding[0], "px")).style('left', "".concat(padding[3] + 1, "px"));
      zCanvas.attr('width', width).attr('height', height);
      heatLabel.attr('transform', "translate(".concat(_this.scale.y ? 10 : width - 10, ",").concat(_this.scale.x2 ? 0 : -padding[0], ")"));
    };

    heatLabel.on('click', function () {
      if (_this.destroyed) return;
      _this.showHeat$ = !_this.showHeat$;
      lineMark.style('display', _this.showHeat$ ? 'block' : 'none');
      heatLabel.attr('fill', !_this.showHeat$ ? '#aaaa' : 'currentColor');

      if (_this.rendered) {
        _this.render();
      }
    });
    return _this;
  }

  (0, _createClass2.default)(HeatMap, [{
    key: "setData",
    value: function setData(data, render, computeDomain) {
      if (!data) return this;

      var _ref11 = data || {},
          heat = _ref11.heat,
          restData = (0, _objectWithoutProperties2.default)(_ref11, _excluded4);

      (0, _get2.default)((0, _getPrototypeOf2.default)(HeatMap.prototype), "setData", this).call(this, _objectSpread({
        heat: !heat ? {
          x: [],
          y: [],
          z: []
        } : {
          x: heat.x || [],
          y: heat.y || [],
          z: heat.z || []
        }
      }, restData), false, !heat ? computeDomain : function (_ref12, needDomain) {
        var heatData = _ref12.heat;
        var domains = {};
        needDomain.forEach(function (key) {
          if (heatData[key] && heatData[key].length > 0) {
            domains[key] = d3.extent((0, _toConsumableArray2.default)(heatData[key]));
          }
        });
        return domains;
      });
      this.zoomSelection$.select('.line-mark').datum(this.data.heat.x[0]);

      if (render) {
        this.render();
      }

      return this;
    }
  }, {
    key: "setDomain",
    value: function setDomain(domain, render) {
      if (!domain) return this;
      var z = domain.z,
          rest = (0, _objectWithoutProperties2.default)(domain, _excluded5);
      (0, _get2.default)((0, _getPrototypeOf2.default)(HeatMap.prototype), "setDomain", this).call(this, rest);

      if (z && this.scale.z) {
        this.scale.z.domain = z;
        updateScale.call(this);

        if (render) {
          this.render();
        }
      }

      return this;
    }
  }, {
    key: "setLabel",
    value: function setLabel(label, render) {
      if (!label) return this;
      var z = label.z,
          rest = (0, _objectWithoutProperties2.default)(label, _excluded6);
      (0, _get2.default)((0, _getPrototypeOf2.default)(HeatMap.prototype), "setLabel", this).call(this, rest);

      if (z && this.scale.z) {
        this.scale.z.label = z.label;
        this.scale.z.subLabel = z.subLabel;
        this.scale.z.unit = z.unit;
        var tempText = "".concat(this.scale.z.label || '').concat(this.scale.z.subLabel ? " ( ".concat(this.scale.z.subLabel, " )") : '').concat(this.scale.z.unit ? " ( ".concat(this.scale.z.unit, " )") : '');
        this.rootSelection$.select('.heatLabel').select('text').attr('dx', util.measureSvgText(tempText, this.fontSize) / 2).text(tempText);

        if (render) {
          this.render();
        }
      }

      return this;
    }
  }, {
    key: "downloadImage",
    value: function downloadImage() {
      var zCanvas = this.rootSelection$.select('canvas').node();
      var svgDiv = this.rootSelection$.select('.svg');
      var left = window.parseInt(svgDiv.style('left'));
      var top = window.parseInt(svgDiv.style('top'));
      (0, _get2.default)((0, _getPrototypeOf2.default)(HeatMap.prototype), "downloadImage", this).call(this, (this.scale.z || {}).label, {
        image: zCanvas,
        x: left,
        y: top
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.debounceDrawend$) {
        this.debounceDrawend$.cancel();
        this.debounceDrawend$ = null;
      }

      if (this.zScale$) this.zScale$ = null;
      if (this.tempCanvas$) this.tempCanvas$ = {};
      (0, _get2.default)((0, _getPrototypeOf2.default)(HeatMap.prototype), "destroy", this).call(this);
      return this;
    }
  }]);
  return HeatMap;
}(_BaseChart2.default);

var _default = HeatMap;
exports.default = _default;
//# sourceMappingURL=HeatMap.js.map