"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js/weak-map");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = generateHeatMap;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutPropertiesLoose"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _findIndex = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/find-index"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/slice"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/concat"));
var d3 = _interopRequireWildcard(require("d3"));
var _BaseChart = _interopRequireDefault(require("../BaseChart"));
var _LineGraph = _interopRequireDefault(require("../LineGraph"));
var util = _interopRequireWildcard(require("../util"));
var _excluded = ["data", "tooltip", "legend", "scale"],
  _excluded2 = ["heat"],
  _excluded3 = ["width", "height", "padding"],
  _excluded4 = ["heat"],
  _excluded5 = ["z"],
  _excluded6 = ["z"]; // @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-12-07 15:02:48
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 13:43:05
 * @Description: 按需生成HeatMap构造器
 */
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var iconSize = 18;
var prefixSIFormat = d3.format('~s');
var searchValIndex = function searchValIndex(val, arr) {
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
  }
  // don't trust floating point equality - fraction of bin size to call
  var v = val + binSize * 1e-9 * (binSize >= 0 ? 1 : -1);
  // c is just to avoid infinite loops if there's an error
  while (n1 < n2 && c < 100) {
    c += 1;
    n = Math.floor((n1 + n2) / 2);
    if (test(arr[n], v)) n1 = n + 1;else n2 = n;
  }
  if (c > 90) window.console.log('Long binary search...');
  return Math.min(Math.max(n1 - 1, 0), arr.length - 1);
};
// 计算两值之间任意值占比以及前后值
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
};
// 计算每个像素对应值的插值计算比例
var getInterpFactor = function getInterpFactor(pixel, valPixs) {
  var index0 = searchValIndex(pixel, valPixs);
  var index1 = index0 + 1;
  return computeFactor(pixel, valPixs[index0], valPixs[index1], index0, index1);
};
// 根据四个点计算中间点的平均值
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
    val = val00 + (xFactor || 0) * dx + (yFactor || 0) * (dy + (xFactor || 0) * dxy);
  }
  return val;
};
// 将给定值数组中的值映射到给定长度的每一个像素点上
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
};
// 矩阵插值上色（根据矩形四个点值，计算矩形内部所有像素点的值，并渲染颜色）
var matrixInterp = function matrixInterp(_ref, _ref2, c) {
  var w = _ref.w,
    h = _ref.h,
    d = _ref.d;
  var x = _ref2.x,
    y = _ref2.y,
    z = _ref2.z;
  var _d$ = d[0],
    x0 = _d$[0],
    y0 = _d$[1],
    _d$2 = d[1],
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
  var _loop = function _loop() {
    var yInterp = getInterpFactor(j, yValPixs);
    var val0 = z[yInterp.bin0] || [];
    var val1 = z[yInterp.bin1] || [];
    // 获取y轴(横向)范围内无效索引集合
    var yInvalidIndex = y.invalid || [];
    // 判断当前横向一整条像素的上bin0下bin1都是无效索引，则无效
    var yInvalid = (0, _findIndex.default)(yInvalidIndex).call(yInvalidIndex, function (o) {
      return o === yInterp.bin0 || o === yInterp.bin1;
    }) !== -1;
    var _loop2 = function _loop2() {
      var rgba = {
        r: 0,
        g: 0,
        b: 0,
        opacity: 0
      };
      // 有效才计算颜色
      if (!yInvalid) {
        var xInterp = xInterpArray[i];
        if (!xInterp) {
          xInterp = getInterpFactor(i, xValPixs);
          xInterpArray[i] = xInterp;
        }
        // 获取x轴(竖向)范围内无效索引集合
        var xInvalidIndex = x.invalid || [];
        // 判断当前像素点的左bin0右bin1都是无效索引，则无效
        var xInvalid = (0, _findIndex.default)(xInvalidIndex).call(xInvalidIndex, function (o) {
          return o === xInterp.bin0 || o === xInterp.bin1;
        }) !== -1;
        // 有效才计算颜色
        if (!xInvalid) {
          rgba = c(matrixAverage(xInterp.factor, val0[xInterp.bin0], val0[xInterp.bin1], yInterp.factor, val1[xInterp.bin0], val1[xInterp.bin1]));
        }
      }
      pixels[index] = rgba.r;
      pixels[index + 1] = rgba.g;
      pixels[index + 2] = rgba.b;
      pixels[index + 3] = rgba.opacity * 255; // 透明度0-1需要转换成0-255
      index += 4;
    };
    for (var i = x0; i < x1; i += 1) {
      _loop2();
    }
  };
  for (var j = y0; j < y1; j += 1) {
    _loop();
  }
  return pixels;
};
function drawend(zContext, _ref3) {
  var xScale = _ref3.xScale,
    yScale = _ref3.yScale;
  zContext.save();
  // 先清空画布
  zContext.clearRect(0, 0, this.width$, this.height$);
  if (this.showHeat$) {
    var zScale = this.zScale$;
    var viewRange = null;
    var _this$data$heat = this.data.heat,
      x = _this$data$heat.x,
      y = _this$data$heat.y,
      z = _this$data$heat.z;
    // 原始范围
    // 根据xy轴的刻度变换函数分别计算出原始数据图的上下左右坐标位置
    var xMinPx = xScale(x[0] || 0);
    var xMaxPx = xScale(x[x.length - 1] || 0);
    // 因为y坐标是反转的（domain和range大小反转对应）
    var yMinPx = yScale(y[y.length - 1] || 0);
    var yMaxPx = yScale(y[0] || 0);
    // 原始数据的实际宽高
    var width = Math.round(xMaxPx - xMinPx);
    var height = Math.round(yMaxPx - yMinPx);
    // 如果实际的宽高小于或等于0则表示压根没有数据
    if (width > 0 && height > 0) {
      // 画布范围
      // 画布上下左右坐标位置，this.width$, this.height$是画布的宽高
      var xcMinPx = 0;
      var xcMaxPx = this.width$ + xcMinPx;
      var ycMinPx = 0;
      var ycMaxPx = this.height$ + ycMinPx;
      // 真实渲染的数据，是原始数据的范围，配置中筛选的范围以及画布的范围最终确定
      // 根据以上三个范围计算确定真正需要渲染的范围，要考虑此范围的两个问题：
      // 1，对于原始数据段转换的像素范围，应该选择哪一段像素去渲染？
      // 2，对于视图，这一段数据应该渲染在画布上哪一个范围（在画布内部的位置）？
      // 以下计算需要渲染的像素段在原始数据像素范围内（宽和高）起点和终点的索引
      var xMin = Math.max(xcMinPx, xMinPx); // 取x最小范围中的最大值
      var xMax = Math.min(xcMaxPx, xMaxPx); // 取x最大范围中的最小值
      var yMin = Math.max(ycMinPx, yMinPx); // 取y最小范围中的最大值
      var yMax = Math.min(ycMaxPx, yMaxPx); // 取y最大范围中的最小值
      // 实际被裁减后的宽高（可能等于画布宽高，也可能小于，但是不会大于因为被裁掉了）
      var dataRange = [[Math.round(xMin - xMinPx), Math.round(yMin - yMinPx)],
      // 筛选后数据在原数据的起点index
      [Math.round(xMax - xMinPx), Math.round(yMax - yMinPx)] // 筛选后数据在原数据的终点index
      ];

      var cWidth = dataRange[1][0] - dataRange[0][0];
      var cHeight = dataRange[1][1] - dataRange[0][1];
      // 如果裁剪后的宽高小于或等于0则表示没有可以渲染的数据了
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
        });
        // 创建一个空的图片数据（使用裁剪后的宽高）
        var imageData = zContext.createImageData(cWidth, cHeight);
        // 将像素数据设置到图片数据内
        try {
          imageData.data.set(pixelData);
        } catch (e) {
          var cdata = imageData.data;
          var len = cdata.length;
          for (var i = 0; i < len; i += 1) {
            cdata[i] = pixelData[i];
          }
        }
        // 以下计在算在画布上需要渲染的范围起点和终点的位置（相对于画布）
        viewRange = [[xMin - xcMinPx, yMin - ycMinPx], [xMax - xcMinPx, yMax - ycMinPx]];
        // 将计算好的数据放到画布
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
    this.tempCanvas$.range = !viewRange ? null : (0, _map.default)(viewRange).call(viewRange, function (r) {
      return (0, _map.default)(r).call(r, function (v, i) {
        return (i === 0 ? xScale : yScale).invert(v);
      });
    });
  }
  zContext.restore();
}
function drawing(zContext, _ref4) {
  var xScale = _ref4.xScale,
    yScale = _ref4.yScale;
  if (this.showHeat$) {
    var lineMarkX = this.lineMark$[0];
    if (lineMarkX.node()) {
      var xp = xScale(lineMarkX.datum()) || (!this.scale.x ? this.width$ : 0);
      lineMarkX.style('left', xp + "px").style('display', xp < 0 || xp >= this.width$ ? 'none' : 'block');
    }
    var lineMarkY = this.lineMark$[1];
    if (lineMarkY.node()) {
      var yp = yScale(lineMarkY.datum()) || (!this.scale.y ? 0 : this.height$);
      lineMarkY.style('top', yp + "px").style('display', yp < 0 || yp >= this.height$ ? 'none' : 'block');
    }
    var _this$tempCanvas$ = this.tempCanvas$,
      canvas = _this$tempCanvas$.canvas,
      range = _this$tempCanvas$.range;
    if (range) {
      // 将上一次变换后的图，经过本次变换的变形重新绘制到画布上
      var _range$map = (0, _map.default)(range).call(range, function (r) {
          return (0, _map.default)(r).call(r, function (v, i) {
            return (i === 0 ? xScale : yScale)(v);
          });
        }),
        _range$map$ = _range$map[0],
        x0 = _range$map$[0],
        y0 = _range$map$[1],
        _range$map$2 = _range$map[1],
        x1 = _range$map$2[0],
        y1 = _range$map$2[1];
      zContext.save();
      zContext.clearRect(0, 0, this.width$, this.height$);
      zContext.drawImage(canvas, x0, y0, x1 - x0, y1 - y0);
      zContext.restore();
    }
  }
}
function tipCompute(prevRes, point, scaleAxis) {
  var scaleOpt = this.scale;
  var _this$tooltip = this.tooltip,
    cross = _this$tooltip.cross,
    average = _this$tooltip.average;
  var _ref5 = cross === 'xy' ? this.getPointData(point, scaleAxis, average) : {
      point: point,
      value: []
    },
    newPoint = _ref5.point,
    value = _ref5.value;
  if (value.length > 0) {
    var _context, _context2;
    // 去掉第一个因为第一个是标题
    var prevValue = (0, _slice.default)(_context = prevRes.data || []).call(_context, 1);
    var ndata = (0, _concat.default)(_context2 = []).call(_context2, (0, _map.default)(value).call(value, function (v, i) {
      var k = i === 0 ? 'x' : i === 1 ? 'y' : 'z';
      return (0, _extends2.default)({}, scaleOpt[scaleAxis[k] ? k : "" + k + (k != 'z' ? '2' : '')], {
        value: v
      });
    }), prevValue);
    var result = function result(selection) {
      selection.selectAll('div').data(ndata).join('div').attr('style', 'white-space: nowrap;').html(function (d, i) {
        return i === 0 ? "" + (d.label ? d.label + ": " : '') + d.format(d.value) + (d.unit || '') : (!d.color ? '' : "<span style=\"background: " + d.color + "; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;\"></span>") + "<span>" + (d.label ? d.label + ": " : '') + "</span><span style=\"display: inline-block; " + (!d.color ? '' : 'margin-left: 30px;') + "\">" + d.format(d.value) + (d.unit || '') + "</span>";
      });
    };
    return {
      x0: newPoint[0],
      y0: newPoint[1],
      data: ndata,
      result: result
    };
  }
  return (0, _extends2.default)({}, prevRes);
}
function updateScale() {
  if (this.scale.z) {
    var zFormat = this.scale.z.format || function (v) {
      return v;
    };
    var _ref6 = this.scale.z.domain || [],
      opacity = _ref6[0],
      range = _ref6[1],
      domain = _ref6[2];
    opacity = opacity || 1;
    range = range || ['#000', '#fff'];
    domain = domain || [0, 1];
    this.zScale$.range((0, _map.default)(range).call(range, function (c) {
      return d3.color(c).copy({
        opacity: opacity
      });
    })).domain(domain).clamp(true); // 设置true可以卡住所给不在domain中的参数生成的数据仍然在range范围内
    if (this.legend) {
      var linearGradient = this.rootSelection$.select('linearGradient');
      var heatLegend = this.rootSelection$.select('.heatLegend');
      var height = this.height$;
      var startDomain = domain[0];
      var deltDomain = domain[domain.length - 1] - startDomain;
      var width = this.legend.width;
      linearGradient.selectAll('stop').data(domain).join('stop').attr('offset', function (v) {
        return 100 * (v - startDomain) / deltDomain + "%";
      }).attr('stop-color', function (_, i) {
        return range[i];
      });
      heatLegend.selectAll('g').data(domain).join(function (enter) {
        var tick = enter.append('g').attr('class', 'tick').attr('transform', function (v) {
          return "translate(" + width + "," + height * (1 - (v - startDomain) / deltDomain) + ")";
        });
        tick.append('path').attr('d', 'M0,0 L4,4 L4,-4 Z');
        tick.append('text').attr('x', 8).attr('dy', '0.32em').attr('text-anchor', 'start').text(function (v) {
          return zFormat(v);
        });
        return tick;
      }, function (update) {
        update.attr('transform', function (v) {
          return "translate(" + width + "," + height * (1 - (v - startDomain) / deltDomain) + ")";
        });
        update.select('text').text(function (v) {
          return zFormat(v);
        });
        return update;
      });
    }
  }
}
function doubleClick(point, _ref7) {
  var xScale = _ref7.xScale,
    yScale = _ref7.yScale;
  var result = {};
  if (this.showHeat$) {
    var heatData = this.data.heat;
    var x0 = point[0],
      y0 = point[1];
    var _ref8 = [],
      xval = _ref8[0],
      yval = _ref8[1];
    var lineMarkX = this.lineMark$[0];
    if (lineMarkX.node()) {
      xval = Math.max(Math.min(+xScale.invert(x0), heatData.x[heatData.x.length - 1]), heatData.x[0]);
      x0 = xScale(xval);
      lineMarkX.style('left', x0 + "px").style('display', 'block');
    }
    var lineMarkY = this.lineMark$[1];
    if (lineMarkY.node()) {
      yval = Math.max(Math.min(+yScale.invert(y0), heatData.y[heatData.y.length - 1]), heatData.y[0]);
      y0 = yScale(yval);
      lineMarkY.style('top', y0 + "px").style('display', 'block');
    }
    this.setLineMark([xval, yval], function (res) {
      result = res;
    });
  }
  return result;
}
function generateHeatMap(superName) {
  var HeatMap = /*#__PURE__*/function (_ref9) {
    (0, _inheritsLoose2.default)(HeatMap, _ref9);
    function HeatMap() {
      var _this;
      var _ref10 = (arguments.length <= 0 ? undefined : arguments[0]) || {},
        data = _ref10.data,
        tooltip = _ref10.tooltip,
        legend = _ref10.legend,
        scale = _ref10.scale,
        restOptions = (0, _objectWithoutPropertiesLoose2.default)(_ref10, _excluded);
      var _ref11 = data || {},
        heat = _ref11.heat,
        restData = (0, _objectWithoutPropertiesLoose2.default)(_ref11, _excluded2);
      var rWidth = restOptions.rWidth;
      if (legend) {
        legend.show = !!legend.show;
        legend.left = util.isNumber(legend.left) ? legend.left : 0;
        legend.width = util.isNumber(legend.width) ? legend.width : 0;
        legend.right = util.isNumber(legend.right) ? legend.right : 0;
        if (legend.show) {
          rWidth = (util.isNumber(rWidth) ? rWidth : 0) + legend.left + legend.width + legend.right;
        }
      }
      _this = _ref9.call(this, (0, _extends2.default)({}, restOptions, {
        rWidth: rWidth,
        data: (0, _extends2.default)({
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
        tooltip: !tooltip ? false : (0, _extends2.default)({
          cross: 'xy',
          select: '',
          average: true
        }, tooltip, {
          compute: function compute(res) {
            var _context3;
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            var result = tipCompute.call.apply(tipCompute, (0, _concat.default)(_context3 = [(0, _assertThisInitialized2.default)(_this), res]).call(_context3, args));
            if (typeof tooltip.compute === 'function') {
              var _tooltip$compute, _context4;
              result = (_tooltip$compute = tooltip.compute).call.apply(_tooltip$compute, (0, _concat.default)(_context4 = [(0, _assertThisInitialized2.default)(_this), result]).call(_context4, args));
            }
            return result;
          }
        }),
        scale: (0, _extends2.default)({
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
      })) || this;
      _this.legend = legend;
      _this.showHeat$ = true;
      var tempText = "" + (_this.scale.z.label || '') + (_this.scale.z.subLabel ? " ( " + _this.scale.z.subLabel + " )" : '') + (_this.scale.z.unit ? " ( " + _this.scale.z.unit + " )" : '');
      var baselineDelt = _this.fontSize + 2;
      var heatLabel = _this.rootSelection$.select('g.group').append('g').attr('class', 'heatLabel').attr('fill', 'currentColor').attr('transform', "translate(" + (_this.scale.y ? 10 : _this.width$ - 10) + "," + (_this.scale.x ? baselineDelt - _this.padding[0] : _this.height$ + _this.padding[2] - iconSize + baselineDelt) + ")");
      heatLabel.append('text').attr('dx', (_this.scale.y ? 1 : -1) * util.measureSvgText(tempText, _this.fontSize) / 2).text(tempText);
      if (_this.tooltip) {
        var select = _this.tooltip.select;
        (select || '').split('').forEach(function (key) {
          if (key) {
            _this.zoomSelection$.append('div').attr('class', key + "-linemark").style('background', '#fa9305').style('display', 'none').style('position', 'absolute').style('top', !_this.scale.y ? 0 : _this.height$ - 1).style('left', !_this.scale.x ? _this.width$ - 1 : 0).style('width', key === 'x' ? '1px' : '100%').style('height', key === 'x' ? '100%' : '1px');
          }
        });
      }
      var lineMark = [_this.zoomSelection$.select('.x-linemark'), _this.zoomSelection$.select('.y-linemark')];
      _this.lineMark$ = lineMark;
      var zCanvasParent = _this.rootSelection$.insert('div', 'svg').style('position', 'absolute').style('width', _this.width$ + "px").style('height', _this.height$ + "px").style('top', _this.padding[0] + "px").style('left', _this.padding[3] + "px");
      var zCanvas = zCanvasParent.append('canvas').style('width', '100%').style('height', '100%').attr('width', _this.width$).attr('height', _this.height$);
      if (legend) {
        var gradientId = util.guid('gradient');
        _this.rootSelection$.select('svg').select('defs').append('linearGradient').attr('id', gradientId).attr('x1', '0%').attr('y1', '100%').attr('x2', '0%').attr('y2', '0%');
        _this.rootSelection$.select('svg').select('.group').append('g').attr('class', 'heatLegend').style('display', legend.show ? 'block' : 'none').attr('fill', 'currentColor').attr('transform', "translate(" + (_this.width$ + _this.padding[1] + legend.left) + ",0)").append('rect').attr('x', 0).attr('y', 0).attr('width', legend.width).attr('height', _this.height$).attr('fill', "url(#" + gradientId + ")");
      }
      var zContext = zCanvas.node().getContext('2d');
      _this.zScale$ = d3.scaleLinear();
      updateScale.call((0, _assertThisInitialized2.default)(_this));
      _this.tempCanvas$ = {
        canvas: document.createElement('canvas'),
        range: null
      };
      var dblclick$$ = _this.dblclick$;
      _this.dblclick$ = function (e) {
        var _context5;
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        dblclick$$.call.apply(dblclick$$, (0, _concat.default)(_context5 = [null, e]).call(_context5, args));
        var _e$scaleAxis = e.scaleAxis,
          x = _e$scaleAxis.x,
          x2 = _e$scaleAxis.x2,
          y = _e$scaleAxis.y,
          y2 = _e$scaleAxis.y2;
        var xScale = (x || x2).scale;
        var yScale = (y || y2).scale;
        return doubleClick.call((0, _assertThisInitialized2.default)(_this), e.sourceEvent ? d3.pointer(e.sourceEvent) : [0, 0], {
          xScale: xScale,
          yScale: yScale
        });
      };
      var click$$ = _this.click$;
      _this.click$ = function (e) {
        var _context6;
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }
        click$$.call.apply(click$$, (0, _concat.default)(_context6 = [null, e]).call(_context6, args));
        lineMark.forEach(function (lm) {
          return lm.node() && lm.style('display', 'none');
        });
      };
      var contextmenu$$ = _this.contextmenu$;
      _this.contextmenu$ = function (e) {
        var _context7;
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }
        contextmenu$$.call.apply(contextmenu$$, (0, _concat.default)(_context7 = [null, e]).call(_context7, args));
        lineMark.forEach(function (lm) {
          return lm.node() && lm.style('display', 'none');
        });
      };
      var zooming$$ = _this.zooming$;
      _this.zooming$ = function (e) {
        var _context8;
        for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }
        zooming$$.call.apply(zooming$$, (0, _concat.default)(_context8 = [null, e]).call(_context8, args));
        var _e$scaleAxis2 = e.scaleAxis,
          x = _e$scaleAxis2.x,
          x2 = _e$scaleAxis2.x2,
          y = _e$scaleAxis2.y,
          y2 = _e$scaleAxis2.y2;
        var xScale = (x || x2).scale;
        var yScale = (y || y2).scale;
        drawing.call((0, _assertThisInitialized2.default)(_this), zContext, {
          xScale: xScale,
          yScale: yScale
        });
      };
      var zoomend$$ = _this.zoomend$;
      _this.debounceDrawend$ = util.debounce(drawend, 450, {
        leading: false,
        trailing: true
      });
      _this.zoomend$ = function (e) {
        var _context9;
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        zoomend$$.call.apply(zoomend$$, (0, _concat.default)(_context9 = [null, e]).call(_context9, args));
        var _e$scaleAxis3 = e.scaleAxis,
          x = _e$scaleAxis3.x,
          x2 = _e$scaleAxis3.x2,
          y = _e$scaleAxis3.y,
          y2 = _e$scaleAxis3.y2;
        var xScale = (x || x2).scale;
        var yScale = (y || y2).scale;
        _this.debounceDrawend$.call((0, _assertThisInitialized2.default)(_this), zContext, {
          xScale: xScale,
          yScale: yScale
        });
        if (!e.sourceEvent || e.sourceEvent.type === 'call') {
          util.delay(function () {
            _this.debounceDrawend$.flush();
          }, 1);
        }
      };
      var resize$$ = _this.resize$;
      _this.resize$ = function (e, _ref12) {
        var _context10;
        var width = _ref12.width,
          height = _ref12.height,
          padding = _ref12.padding,
          rest = (0, _objectWithoutPropertiesLoose2.default)(_ref12, _excluded3);
        for (var _len7 = arguments.length, args = new Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
          args[_key7 - 2] = arguments[_key7];
        }
        resize$$.call.apply(resize$$, (0, _concat.default)(_context10 = [null, e, (0, _extends2.default)({
          width: width,
          height: height,
          padding: padding
        }, rest)]).call(_context10, args));
        zCanvasParent.style('width', width + "px").style('height', height + "px").style('top', padding[0] + "px").style('left', padding[3] + "px");
        zCanvas.attr('width', width).attr('height', height);
        heatLabel.attr('transform', "translate(" + (_this.scale.y ? 10 : width - 10) + "," + (_this.scale.x ? baselineDelt - padding[0] : height + padding[2] - iconSize + baselineDelt) + ")");
        if (legend) {
          var heatLegend = _this.rootSelection$.select('.heatLegend');
          heatLegend.attr('transform', "translate(" + (width + padding[1] + legend.left) + ",0)");
          heatLegend.select('rect').attr('height', height);
          var ticks = heatLegend.selectAll('.tick');
          var domain = ticks.data();
          var startDomain = domain[0];
          var deltDomain = domain[domain.length - 1] - startDomain;
          ticks.attr('transform', function (v) {
            return "translate(" + legend.width + "," + height * (1 - (v - startDomain) / deltDomain) + ")";
          });
        }
      };
      heatLabel.on('click', function () {
        if (_this.destroyed) return;
        _this.showHeat$ = !_this.showHeat$;
        lineMark.forEach(function (lm) {
          return lm.node() && lm.style('display', _this.showHeat$ ? 'block' : 'none');
        });
        heatLabel.attr('fill', !_this.showHeat$ ? '#aaa' : 'currentColor');
        if (_this.rendered) {
          _this.render();
        }
      });
      return _this;
    }
    var _proto = HeatMap.prototype;
    _proto.getPointData = function getPointData(point, scaleAxis, avg) {
      var currentPoint = point;
      if (!Array.isArray(point)) {
        currentPoint = d3.pointer(point, this.zoomSelection$.node());
      }
      var _currentPoint = currentPoint,
        x0 = _currentPoint[0],
        y0 = _currentPoint[1];
      var data = this.data.heat;
      var value = [];
      if (this.showHeat$) {
        var xScale = (scaleAxis.x || scaleAxis.x2).scale;
        var yScale = (scaleAxis.y || scaleAxis.y2).scale;
        var xval = xScale.invert(x0);
        var yval = yScale.invert(y0);
        var zval = 0;
        var _util$findNearIndex = util.findNearIndex(+xval, data.x),
          xi0 = _util$findNearIndex[0],
          xi1 = _util$findNearIndex[1];
        var _util$findNearIndex2 = util.findNearIndex(+yval, data.y),
          yi0 = _util$findNearIndex2[0],
          yi1 = _util$findNearIndex2[1];
        // 确保point在图层内
        if (xi0 >= 0 && xi1 >= 0 && yi0 >= 0 && yi1 >= 0) {
          var xval0 = +data.x[xi0];
          var xval1 = +data.x[xi1];
          var yval0 = +data.y[yi0];
          var yval1 = +data.y[yi1];
          if (xval0 === xval1 && yval0 === yval1) {
            // 正好移动到了xy交叉数据点上
            zval = (data.z[yi0] || [])[xi0];
          } else if (avg) {
            var xInterp = computeFactor(+xval, xval0, xval1, xi0, xi1);
            var yInterp = computeFactor(+yval, yval0, yval1, yi0, yi1);
            var val00 = (data.z[yInterp.bin0] || [])[xInterp.bin0];
            var val01 = (data.z[yInterp.bin0] || [])[xInterp.bin1];
            var val10 = (data.z[yInterp.bin1] || [])[xInterp.bin0];
            var val11 = (data.z[yInterp.bin1] || [])[xInterp.bin1];
            zval = matrixAverage(xInterp.factor, val00, val01, yInterp.factor, val10, val11);
          } else {
            var xi = Math.abs(xval - xval0) > Math.abs(xval - xval1) ? xi1 : xi0;
            var yi = Math.abs(yval - yval0) > Math.abs(yval - yval1) ? yi1 : yi0;
            xval = +data.x[xi];
            yval = +data.y[yi];
            zval = (data.z[yi] || [])[xi];
            x0 = xScale(xval);
            y0 = yScale(yval);
          }
          value.push(xval, yval, zval);
        }
      }
      return {
        value: value,
        point: [x0, y0]
      };
    };
    _proto.getLineMark = function getLineMark() {
      var result = [];
      var lineMarkX = this.lineMark$[0];
      if (lineMarkX.node()) {
        var xval = lineMarkX.datum();
        result[0] = xval;
      }
      var lineMarkY = this.lineMark$[1];
      if (lineMarkY.node()) {
        var yval = lineMarkY.datum();
        result[1] = yval;
      }
      return result;
    };
    _proto.setLineMark = function setLineMark(lm, cb) {
      var lineMark = lm || [];
      var average = this.tooltip.average;
      var heatData = this.data.heat;
      var xSelect = null;
      var ySelect = null;
      var lineMarkX = this.lineMark$[0];
      if (lineMarkX.node()) {
        var xval = !lineMark[0] && lineMark[0] !== 0 ? heatData.x[0] : lineMark[0];
        lineMarkX.datum(xval);
        var zval = [];
        // xval在数据范围之内才可计算出zval
        if (xval >= heatData.x[0] && xval <= heatData.x[heatData.x.length - 1]) {
          var _context11;
          var xi = util.findNearIndex(xval, heatData.x, !average);
          if (!average) xi = [xi, xi];
          var xBin = 0;
          if (xi[0] !== xi[1]) xBin = (xval - heatData.x[xi[0]]) / (heatData.x[xi[1]] - heatData.x[xi[0]]);
          zval = (0, _map.default)(_context11 = heatData.z).call(_context11, function (v) {
            var vv = v || [];
            return xBin * ((vv[xi[1]] || 0) - (vv[xi[0]] || 0)) + (vv[xi[0]] || 0);
          });
        }
        xSelect = {
          x: xval,
          y: heatData.y,
          z: zval
        };
      }
      var lineMarkY = this.lineMark$[1];
      if (lineMarkY.node()) {
        var yval = !lineMark[1] && lineMark[1] !== 0 ? heatData.y[0] : lineMark[1];
        lineMarkY.datum(yval);
        var _zval = [];
        // yval在数据范围之内才可计算出zval
        if (yval >= heatData.y[0] && yval <= heatData.y[heatData.y.length - 1]) {
          var _context12;
          var yi = util.findNearIndex(yval, heatData.y, !average);
          if (!average) yi = [yi, yi];
          var yBin = 0;
          if (yi[0] !== yi[1]) yBin = (yval - heatData.y[yi[0]]) / (heatData.y[yi[1]] - heatData.y[yi[0]]);
          _zval = (0, _map.default)(_context12 = heatData.z[yi[0]] || []).call(_context12, function (v0, i) {
            var v1 = (heatData.z[yi[1]] || [])[i] || 0;
            return yBin * (v1 - v0) + v0;
          });
        }
        ySelect = {
          x: heatData.x,
          y: yval,
          z: _zval
        };
      }
      if (typeof cb === 'function') {
        cb({
          xSelect: xSelect,
          ySelect: ySelect
        });
      }
      return this;
    };
    _proto.setData = function setData(data, render, computeDomain) {
      if (!data) return this;
      var _ref13 = data || {},
        heat = _ref13.heat,
        restData = (0, _objectWithoutPropertiesLoose2.default)(_ref13, _excluded4);
      _ref9.prototype.setData.call(this, (0, _extends2.default)({
        heat: !heat ? {
          x: [],
          y: [],
          z: []
        } : {
          x: heat.x || [],
          y: heat.y || [],
          z: heat.z || []
        }
      }, restData), false, !heat ? computeDomain : function (_ref14, needDomain) {
        var heatData = _ref14.heat;
        var domains = {};
        needDomain.forEach(function (key) {
          if (heatData[key] && heatData[key].length > 0) {
            var _context13;
            domains[key] = d3.extent((0, _concat.default)(_context13 = []).call(_context13, heatData[key]));
          }
        });
        return domains;
      });
      // 将linemark归位到起点
      this.setLineMark();
      if (render) {
        this.render();
      }
      return this;
    };
    _proto.setDomain = function setDomain(domain, render) {
      if (!domain) return this;
      var z = domain.z,
        rest = (0, _objectWithoutPropertiesLoose2.default)(domain, _excluded5);
      _ref9.prototype.setDomain.call(this, rest);
      if (z && this.scale.z) {
        this.scale.z.domain = z;
        updateScale.call(this);
        if (render) {
          this.render();
        }
      }
      return this;
    };
    _proto.setLabel = function setLabel(label, render) {
      if (!label) return this;
      var z = label.z,
        rest = (0, _objectWithoutPropertiesLoose2.default)(label, _excluded6);
      _ref9.prototype.setLabel.call(this, rest);
      if (z && this.scale.z) {
        this.scale.z.label = z.label;
        this.scale.z.subLabel = z.subLabel;
        this.scale.z.unit = z.unit;
        var tempText = "" + (this.scale.z.label || '') + (this.scale.z.subLabel ? " ( " + this.scale.z.subLabel + " )" : '') + (this.scale.z.unit ? " ( " + this.scale.z.unit + " )" : '');
        this.rootSelection$.select('.heatLabel').select('text').attr('dx', (this.scale.y ? 1 : -1) * util.measureSvgText(tempText, this.fontSize) / 2).text(tempText);
        if (render) {
          this.render();
        }
      }
      return this;
    };
    _proto.downloadImage = function downloadImage() {
      var zCanvas = this.rootSelection$.select('canvas').node();
      var svgDiv = this.rootSelection$.select('.actions');
      var left = window.parseInt(svgDiv.style('left'));
      var top = window.parseInt(svgDiv.style('top'));
      _ref9.prototype.downloadImage.call(this, (this.scale.z || {}).label, {
        image: zCanvas,
        x: left,
        y: top
      });
    };
    _proto.destroy = function destroy() {
      if (this.debounceDrawend$) {
        this.debounceDrawend$.cancel();
        this.debounceDrawend$ = null;
      }
      this.zScale$ = null;
      this.tempCanvas$ = null;
      this.click$ = null;
      this.dblclick$ = null;
      this.contextmenu$ = null;
      this.zoomstart$ = null;
      this.zooming$ = null;
      this.zoomend$ = null;
      this.resize$ = null;
      this.reset$ = null;
      this.canZoom$ = null;
      _ref9.prototype.destroy.call(this);
      return this;
    };
    return HeatMap;
  }(superName === 'LineGraph' ? _LineGraph.default : _BaseChart.default);
  return HeatMap;
}