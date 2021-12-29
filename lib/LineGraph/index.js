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

var _BaseChart2 = _interopRequireDefault(require("../BaseChart"));

var util = _interopRequireWildcard(require("../util"));

var _excluded = ["smooth", "data", "tooptip"],
    _excluded2 = ["line"],
    _excluded3 = ["data"],
    _excluded4 = ["line"],
    _excluded5 = ["data"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function lineLabel() {
  var _this = this;

  var onlyOneMerge = this.tooptip.onlyOneMerge;
  var pWidth = onlyOneMerge ? 0 : 20;

  var color = function color(v, c) {
    return _this.filter$.findIndex(function (f) {
      return f.key === v.key;
    }) !== -1 ? '#aaa' : c;
  };

  var width = function width(v) {
    return util.measureSvgText(v.label, _this.fontSize) + pWidth;
  };

  var tWidth = 0;
  var zlabel = this.rootSelection$.select('.zLabel');
  zlabel.selectAll('g').remove();
  zlabel.selectAll('g').data(this.data.line).join(function (enter) {
    var legend = enter.append('g').attr('class', 'line-legend').attr('transform', function (v) {
      var moveX = 0;
      var w = width(v) + 5;

      if (onlyOneMerge) {
        moveX = _this.scale.y ? -((_this.width$ + w) / 2) : (_this.width$ - w) / 2;
      } else {
        moveX = _this.scale.y ? 5 - tWidth - w : tWidth;
        tWidth += w;
      }

      return "translate(".concat(moveX, ",0)");
    });

    if (!onlyOneMerge) {
      legend.insert('path').attr('fill', 'none').attr('stroke-width', 4).attr('transform', "translate(0,".concat(-_this.fontSize / 2, "),scale(0.5)")).attr('d', _this.smooth === 1 ? 'M0 6 C4 0,8 0,12 6 S20 12,24 6' : 'M0 6,28 6').attr('stroke', function (v) {
        return color(v, v.color || 'inherit');
      });
    }

    legend.insert('text').attr('dx', pWidth).attr('text-anchor', 'start').attr('stroke-width', 0.5).text(function (v) {
      return v.label;
    }).attr('fill', function (v) {
      return color(v, 'currentColor');
    });
    return legend;
  }, function (update) {
    return update;
  }, function (exit) {
    return exit.remove();
  });
  var showData = util.differenceWith(this.data.line, this.filter$, function (a, b) {
    return a.key === b.key;
  });
  this.rootSelection$.select('.zAxis').selectAll('path').data(showData).join('path').attr('stroke', function (d) {
    return d.color || 'inherit';
  }).attr('stroke-width', 1.2);
}

function tipCompute(prevRes, point, scaleAxis) {
  var ok = function ok(a) {
    return a === 0 || !!a;
  };

  var scaleOpt = this.scale;
  var _this$tooptip = this.tooptip,
      cross = _this$tooptip.cross,
      average = _this$tooptip.average,
      onlyOneMerge = _this$tooptip.onlyOneMerge;
  var crossX = cross.indexOf('x') !== -1;
  var crossY = cross.indexOf('y') !== -1;
  var xScale = scaleAxis.x && scaleAxis.x.scale;
  var x2Scale = scaleAxis.x2 && scaleAxis.x2.scale;
  var yScale = scaleAxis.y && scaleAxis.y.scale;
  var y2Scale = scaleAxis.y2 && scaleAxis.y2.scale;

  var _point = (0, _slicedToArray2.default)(point, 2),
      x0 = _point[0],
      y0 = _point[1];

  var xyValue = [];
  var fData = util.differenceWith(this.data.line, this.filter$, function (a, b) {
    return a.key === b.key;
  });

  if (crossX) {
    fData.forEach(function (_ref) {
      var data = _ref.data,
          color = _ref.color,
          label = _ref.label;
      var xxKey = 'x';
      var xxScale = xScale;

      if (x2Scale && data.length > 0) {
        if (ok(data[0].x2)) {
          xxKey = 'x2';
          xxScale = x2Scale;
        } else if (!xScale) {
          throw new Error('只使用了x2坐标，但数据中没有x2值');
        }
      }

      var yyKey = 'y';

      if (y2Scale && data.length > 0) {
        if (ok(data[0].y2)) {
          yyKey = 'y2';
        } else if (!yScale) {
          throw new Error('只使用了y2坐标，但数据中没有y2值');
        }
      }

      var xval = xxScale.invert(x0);
      var yval = null; // @ts-ignore

      var _util$findNearIndex = util.findNearIndex(+xval, data.map(function (d) {
        return d[xxKey];
      })),
          _util$findNearIndex2 = (0, _slicedToArray2.default)(_util$findNearIndex, 2),
          xi0 = _util$findNearIndex2[0],
          xi1 = _util$findNearIndex2[1];

      if (xi0 >= 0 && xi1 >= 0) {
        var xval0 = !data[xi0] ? 0 : data[xi0][xxKey];
        var xval1 = !data[xi1] ? 0 : data[xi1][xxKey];

        if (xval0 === xval1) {
          // 正好移动到了数据点上
          yval = !data[xi0] ? 0 : data[xi0][yyKey];
        } else if (average) {
          // 平均值显示
          var valRate = (xval - xval0) / (xval1 - xval0);
          yval = valRate * ((!data[xi1] ? 0 : data[xi1][yyKey]) - (!data[xi0] ? 0 : data[xi0][yyKey])) + (!data[xi0] ? 0 : data[xi0][yyKey]);
        } else {
          // 最近值显示
          var xi = Math.abs(xval - xval0) > Math.abs(xval - xval1) ? xi1 : xi0;
          xval = !data[xi] ? 0 : data[xi][xxKey];
          yval = !data[xi] ? 0 : data[xi][yyKey];
          x0 = xxScale(xval);
        }

        xyValue[0] = _objectSpread(_objectSpread({}, scaleOpt[xxKey]), {}, {
          value: xval
        });
        xyValue.push(_objectSpread(_objectSpread({}, scaleOpt[yyKey]), {}, {
          value: yval,
          color: color
        }, onlyOneMerge ? {} : {
          label: label
        }));
      }
    });
  } else if (crossY) {
    fData.forEach(function (_ref2) {
      var data = _ref2.data,
          color = _ref2.color,
          label = _ref2.label;
      var yyKey = 'y';
      var yyScale = yScale;

      if (y2Scale && data.length > 0) {
        if (ok(data[0].y2)) {
          yyKey = 'y2';
          yyScale = y2Scale;
        } else if (!yScale) {
          throw new Error('只使用了y2坐标，但数据中没有y2值');
        }
      }

      var xxKey = 'x';

      if (x2Scale && data.length > 0) {
        if (ok(data[0].x2)) {
          xxKey = 'x2';
        } else if (!xScale) {
          throw new Error('只使用了x2坐标，但数据中没有x2值');
        }
      }

      var yval = yyScale.invert(y0);
      var xval = null;

      var _util$findNearIndex3 = util.findNearIndex(+yval, data.map(function (d) {
        return d[yyKey];
      })),
          _util$findNearIndex4 = (0, _slicedToArray2.default)(_util$findNearIndex3, 2),
          yi0 = _util$findNearIndex4[0],
          yi1 = _util$findNearIndex4[1];

      if (yi0 >= 0 && yi1 >= 0) {
        var yval0 = !data[yi0] ? 0 : data[yi0][yyKey];
        var yval1 = !data[yi1] ? 0 : data[yi1][yyKey];

        if (yval0 === yval1) {
          // 正好移动到了数据点上
          xval = !data[yi0] ? 0 : data[yi0][xxKey];
        } else if (average) {
          // 平均值显示
          var valRate = (yval - yval0) / (yval1 - yval0);
          xval = valRate * ((!data[yi1] ? 0 : data[yi1][xxKey]) - (!data[yi0] ? 0 : data[yi0][xxKey])) + (!data[yi0] ? 0 : data[yi0][xxKey]);
        } else {
          // 最近值显示
          var yi = Math.abs(yval - yval0) > Math.abs(yval - yval1) ? yi1 : yi0;
          yval = !data[yi] ? 0 : data[yi][yyKey];
          xval = !data[yi] ? 0 : data[yi][xxKey];
          y0 = yyScale(yval);
        }

        xyValue[0] = _objectSpread(_objectSpread({}, scaleOpt[yyKey]), {}, {
          value: yval
        });
        xyValue.push(_objectSpread(_objectSpread({}, scaleOpt[xxKey]), {}, {
          value: xval,
          color: color
        }, onlyOneMerge ? {} : {
          label: label
        }));
      }
    });
  }

  if (xyValue.length > 0) {
    // 去掉第一个因为第一个是标题
    var prevValue = (prevRes.data || []).slice(1);
    var data = [].concat(xyValue, (0, _toConsumableArray2.default)(prevValue));

    var result = function result(selection) {
      selection.selectAll('div').data(data).join('div').attr('style', 'white-space: nowrap;').html(function (d, i) {
        return i === 0 ? "".concat(d.label, "\uFF1A").concat(d.format(d.value)).concat(d.unit) : "".concat(onlyOneMerge || !d.color ? '' : "<span style=\"background: ".concat(d.color, "; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;\"></span>"), "<span>").concat(d.label, "</span>: <span style=\"display: inline-block; ").concat(onlyOneMerge || !d.color ? '' : 'margin-left: 30px;', "\">").concat(d.format(d.value)).concat(d.unit, "</span>");
      });
    };

    return {
      x0: x0,
      y0: y0,
      data: data,
      result: result
    };
  }

  return _objectSpread({}, prevRes);
}

function updateLine() {
  var curve = d3.curveLinear; // 折线

  if (this.smooth >= 1) {
    curve = d3.curveBasis; // 平滑曲线
  } else if (this.smooth < 1 && this.smooth > 0) {
    // @ts-ignore
    curve = d3.curveBundle.beta(this.smooth); // 平滑度为0.8曲线
  }

  this.line$.curve(curve);
}

var LineGraph = /*#__PURE__*/function (_BaseChart) {
  (0, _inherits2.default)(LineGraph, _BaseChart);

  var _super = _createSuper(LineGraph);

  function LineGraph() {
    var _this2;

    (0, _classCallCheck2.default)(this, LineGraph);

    var _ref3 = (arguments.length <= 0 ? undefined : arguments[0]) || {},
        smooth = _ref3.smooth,
        data = _ref3.data,
        tooptip = _ref3.tooptip,
        restOptions = (0, _objectWithoutProperties2.default)(_ref3, _excluded);

    var _ref4 = data || {},
        line = _ref4.line,
        restData = (0, _objectWithoutProperties2.default)(_ref4, _excluded2);

    _this2 = _super.call(this, _objectSpread(_objectSpread({}, restOptions), {}, {
      data: _objectSpread({
        line: (line || []).map(function (_ref5) {
          var xy = _ref5.data,
              restLine = (0, _objectWithoutProperties2.default)(_ref5, _excluded3);
          return _objectSpread({
            data: xy || []
          }, restLine);
        })
      }, restData),
      tooptip: !tooptip ? false : _objectSpread(_objectSpread({
        cross: 'x'
      }, tooptip), {}, {
        compute: function compute(res) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var result = tipCompute.call.apply(tipCompute, [(0, _assertThisInitialized2.default)(_this2), res].concat(args));

          if (typeof tooptip.compute === 'function') {
            var _tooptip$compute;

            result = (_tooptip$compute = tooptip.compute).call.apply(_tooptip$compute, [(0, _assertThisInitialized2.default)(_this2), result].concat(args));
          }

          return result;
        }
      })
    }));
    _this2.smooth = smooth || 0;
    _this2.line$ = d3.line();
    updateLine.call((0, _assertThisInitialized2.default)(_this2));
    _this2.filter$ = [];
    var zooming$$ = _this2.zooming$;

    _this2.zooming$ = function (e) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      zooming$$.call.apply(zooming$$, [null, e].concat(args));
      var scaleAxis = e.scaleAxis;
      var xScale = (scaleAxis.x || scaleAxis.x2).scale;
      var x2Scale = (scaleAxis.x2 || scaleAxis.x).scale;
      var yScale = (scaleAxis.y || scaleAxis.y2).scale;
      var y2Scale = (scaleAxis.y2 || scaleAxis.y).scale;

      _this2.rootSelection$.select('.zAxis') // .selectChildren() // ie11及以下不支持SVGSVGElement.children（其实可以SVGSVGElement.childNodes，但是d3未做兼容）
      .selectAll('path').attr('d', function (d) {
        return _this2.line$ // @ts-ignore
        .x(function (_ref6) {
          var x = _ref6.x,
              x2 = _ref6.x2;
          return typeof x === 'undefined' ? x2Scale(x2 || 0) : xScale(x || 0);
        }) // @ts-ignore
        .y(function (_ref7) {
          var y = _ref7.y,
              y2 = _ref7.y2;
          return typeof y === 'undefined' ? y2Scale(y2 || 0) : yScale(y || 0);
        })(d.data);
      });
    };

    _this2.rootSelection$.select('.zLabel').on('click', function (e) {
      if (_this2.destroyed) return;
      var datum = d3.select(e.target).datum();

      var index = _this2.filter$.findIndex(function (f) {
        return f.key === datum.key;
      });

      if (index === -1) {
        _this2.filter$.push(datum);
      } else {
        _this2.filter$.splice(index, 1);
      }

      lineLabel.call((0, _assertThisInitialized2.default)(_this2));

      if (_this2.rendered) {
        _this2.render();
      }
    });

    lineLabel.call((0, _assertThisInitialized2.default)(_this2));
    return _this2;
  }

  (0, _createClass2.default)(LineGraph, [{
    key: "setData",
    value: function setData(data, render, computeDomain) {
      if (!data) return this;
      var line = data.line,
          restData = (0, _objectWithoutProperties2.default)(data, _excluded4);
      (0, _get2.default)((0, _getPrototypeOf2.default)(LineGraph.prototype), "setData", this).call(this, _objectSpread({
        line: (line || []).map(function (_ref8) {
          var xy = _ref8.data,
              restLine = (0, _objectWithoutProperties2.default)(_ref8, _excluded5);
          return _objectSpread({
            data: xy || []
          }, restLine);
        })
      }, restData), false, !line ? computeDomain : function (_ref9, needDomain) {
        var lineData = _ref9.line;
        var domains = {};
        lineData.forEach(function (rd) {
          var xy = {};
          rd.data.forEach(function (dc) {
            Object.keys(dc).forEach(function (k) {
              if (!xy[k]) xy[k] = [];
              xy[k].push(dc[k]);
            });
          });
          needDomain.forEach(function (key) {
            if (xy[key] && xy[key].length > 0) {
              domains[key] = d3.extent([].concat((0, _toConsumableArray2.default)(xy[key]), (0, _toConsumableArray2.default)(domains[key] || [])));
            }
          });
        });
        return domains;
      });

      if (this.data.line.length !== 1) {
        this.tooptip.onlyOneMerge = false;
      }

      lineLabel.call(this);

      if (render) {
        this.render();
      }

      return this;
    }
  }, {
    key: "setSmooth",
    value: function setSmooth(smooth, render) {
      this.smooth = smooth;
      this.rendered = false;
      updateLine.call(this);

      if (render) {
        this.render();
      }

      return this;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.line$) this.line$ = null;
      if (this.filter$) this.filter$ = [];
      (0, _get2.default)((0, _getPrototypeOf2.default)(LineGraph.prototype), "destroy", this).call(this);
      return this;
    }
  }]);
  return LineGraph;
}(_BaseChart2.default);

var _default = LineGraph;
exports.default = _default;
//# sourceMappingURL=index.js.map