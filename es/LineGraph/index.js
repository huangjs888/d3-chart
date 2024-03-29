const _excluded = ["smooth", "data", "tooltip"],
  _excluded2 = ["line"],
  _excluded3 = ["data"],
  _excluded4 = ["line"],
  _excluded5 = ["data"];
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 13:34:05
 * @Description: 默认LineGraph构造器
 */

import * as d3 from 'd3';
import BaseChart from '../BaseChart';
import * as util from '../util';
function lineLabel() {
  const {
    onlyOneMerge
  } = this.tooltip;
  const pWidth = onlyOneMerge ? 0 : 20;
  const color = (v, c) => this.filter$.findIndex(f => f.key === v.key) !== -1 ? '#aaa' : c;
  const width = v => util.measureSvgText(v.label, this.fontSize) + pWidth;
  let tWidth = 0;
  const zlabel = this.rootSelection$.select('.zLabel');
  zlabel.selectAll('g').remove();
  zlabel.selectAll('g').data(this.data.line).join(enter => {
    const legend = enter.append('g').attr('class', 'line-legend').attr('transform', v => {
      let moveX = 0;
      const w = width(v) + 5;
      if (onlyOneMerge) {
        moveX = this.scale.y ? -((this.width$ + w) / 2) : (this.width$ - w) / 2;
      } else {
        moveX = this.scale.y ? 5 - tWidth - w : tWidth;
        tWidth += w;
      }
      return `translate(${moveX},0)`;
    });
    if (!onlyOneMerge) {
      legend.insert('path').attr('fill', 'none').attr('stroke-width', 4).attr('transform', `translate(0,${-this.fontSize / 2}),scale(0.5)`).attr('d', this.smooth === 1 ? 'M0 6 C4 0,8 0,12 6 S20 12,24 6' : 'M0 6,28 6').attr('stroke', v => color(v, v.color || 'inherit'));
    }
    legend.insert('text').attr('dx', pWidth).attr('text-anchor', 'start').attr('stroke-width', 0.5).text(v => v.label).attr('fill', v => color(v, 'currentColor'));
    return legend;
  }, update => update, exit => exit.remove());
  const showData = util.differenceWith(this.data.line, this.filter$, (a, b) => a.key === b.key);
  this.rootSelection$.select('.zAxis').selectAll('path').data(showData).join('path').attr('stroke', d => d.color || 'inherit').attr('stroke-width', 1.2);
}
function tipCompute(prevRes, point, scaleAxis) {
  const ok = a => a === 0 || !!a;
  const scaleOpt = this.scale;
  const {
    cross,
    average,
    onlyOneMerge
  } = this.tooltip;
  const crossX = cross.indexOf('x') !== -1;
  const crossY = cross.indexOf('y') !== -1;
  const xScale = scaleAxis.x && scaleAxis.x.scale;
  const x2Scale = scaleAxis.x2 && scaleAxis.x2.scale;
  const yScale = scaleAxis.y && scaleAxis.y.scale;
  const y2Scale = scaleAxis.y2 && scaleAxis.y2.scale;
  let [x0, y0] = point;
  const xyValue = [];
  const fData = util.differenceWith(this.data.line, this.filter$, (a, b) => a.key === b.key);
  if (crossX) {
    fData.forEach(({
      data,
      color,
      label
    }) => {
      let xxKey = 'x';
      let xxScale = xScale;
      if (x2Scale && data.length > 0) {
        if (ok(data[0].x2)) {
          xxKey = 'x2';
          xxScale = x2Scale;
        } else if (!xScale) {
          throw new Error('scale只配置了x2坐标，但数据中没有x2值');
        }
      }
      let yyKey = 'y';
      if (y2Scale && data.length > 0) {
        if (ok(data[0].y2)) {
          yyKey = 'y2';
        } else if (!yScale) {
          throw new Error('scale只配置了y2坐标，但数据中没有y2值');
        }
      }
      let xval = xxScale.invert(x0);
      let yval = null;
      const [xi0, xi1] = util.findNearIndex(+xval, data.map(d => d[xxKey]));
      if (xi0 >= 0 && xi1 >= 0) {
        const xval0 = !data[xi0] ? 0 : data[xi0][xxKey];
        const xval1 = !data[xi1] ? 0 : data[xi1][xxKey];
        if (xval0 === xval1) {
          // 正好移动到了数据点上
          yval = !data[xi0] ? 0 : data[xi0][yyKey];
        } else if (average) {
          // 平均值显示
          const valRate = (xval - xval0) / (xval1 - xval0);
          yval = valRate * ((!data[xi1] ? 0 : data[xi1][yyKey]) - (!data[xi0] ? 0 : data[xi0][yyKey])) + (!data[xi0] ? 0 : data[xi0][yyKey]);
        } else {
          // 最近值显示
          const xi = Math.abs(xval - xval0) > Math.abs(xval - xval1) ? xi1 : xi0;
          xval = !data[xi] ? 0 : data[xi][xxKey];
          yval = !data[xi] ? 0 : data[xi][yyKey];
          x0 = xxScale(xval);
        }
        xyValue[0] = _extends({}, scaleOpt[xxKey], {
          value: xval
        });
        xyValue.push(_extends({}, scaleOpt[yyKey], {
          value: yval,
          color
        }, onlyOneMerge ? {} : {
          label
        }));
      }
    });
  } else if (crossY) {
    fData.forEach(({
      data,
      color,
      label
    }) => {
      let yyKey = 'y';
      let yyScale = yScale;
      if (y2Scale && data.length > 0) {
        if (ok(data[0].y2)) {
          yyKey = 'y2';
          yyScale = y2Scale;
        } else if (!yScale) {
          throw new Error('scale只配置了y2坐标，但数据中没有y2值');
        }
      }
      let xxKey = 'x';
      if (x2Scale && data.length > 0) {
        if (ok(data[0].x2)) {
          xxKey = 'x2';
        } else if (!xScale) {
          throw new Error('scale只配置了x2坐标，但数据中没有x2值');
        }
      }
      let yval = yyScale.invert(y0);
      let xval = null;
      const [yi0, yi1] = util.findNearIndex(+yval, data.map(d => d[yyKey]));
      if (yi0 >= 0 && yi1 >= 0) {
        const yval0 = !data[yi0] ? 0 : data[yi0][yyKey];
        const yval1 = !data[yi1] ? 0 : data[yi1][yyKey];
        if (yval0 === yval1) {
          // 正好移动到了数据点上
          xval = !data[yi0] ? 0 : data[yi0][xxKey];
        } else if (average) {
          // 平均值显示
          const valRate = (yval - yval0) / (yval1 - yval0);
          xval = valRate * ((!data[yi1] ? 0 : data[yi1][xxKey]) - (!data[yi0] ? 0 : data[yi0][xxKey])) + (!data[yi0] ? 0 : data[yi0][xxKey]);
        } else {
          // 最近值显示
          const yi = Math.abs(yval - yval0) > Math.abs(yval - yval1) ? yi1 : yi0;
          yval = !data[yi] ? 0 : data[yi][yyKey];
          xval = !data[yi] ? 0 : data[yi][xxKey];
          y0 = yyScale(yval);
        }
        xyValue[0] = _extends({}, scaleOpt[yyKey], {
          value: yval
        });
        xyValue.push(_extends({}, scaleOpt[xxKey], {
          value: xval,
          color
        }, onlyOneMerge ? {} : {
          label
        }));
      }
    });
  }
  if (xyValue.length > 0) {
    // 去掉第一个因为第一个是标题
    const prevValue = (prevRes.data || []).slice(1);
    const data = [...xyValue, ...prevValue];
    const result = selection => {
      selection.selectAll('div').data(data).join('div').attr('style', 'white-space: nowrap;').html((d, i) => i === 0 ? `${d.label ? `${d.label}: ` : ''}${d.format(d.value)}${d.unit || ''}` : `${onlyOneMerge || !d.color ? '' : `<span style="background: ${d.color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>`}<span>${d.label ? `${d.label}: ` : ''}</span><span style="display: inline-block; ${onlyOneMerge || !d.color ? '' : 'margin-left: 30px;'}">${d.format(d.value)}${d.unit || ''}</span>`);
    };
    return {
      x0,
      y0,
      data,
      result
    };
  }
  return _extends({}, prevRes);
}
function updateLine() {
  let curve = d3.curveLinear; // 折线
  if (this.smooth >= 1) {
    curve = d3.curveBasis; // 平滑曲线
  } else if (this.smooth < 1 && this.smooth > 0) {
    curve = d3.curveBundle.beta(this.smooth); // 平滑度为0.8曲线
  }

  this.line$.curve(curve);
}
class LineGraph extends BaseChart {
  constructor(...params) {
    const _ref = params[0] || {},
      {
        smooth,
        data,
        tooltip
      } = _ref,
      restOptions = _objectWithoutPropertiesLoose(_ref, _excluded);
    const _ref2 = data || {},
      {
        line
      } = _ref2,
      restData = _objectWithoutPropertiesLoose(_ref2, _excluded2);
    super(_extends({}, restOptions, {
      data: _extends({
        line: (line || []).map(_ref3 => {
          let {
              data: xy
            } = _ref3,
            restLine = _objectWithoutPropertiesLoose(_ref3, _excluded3);
          return _extends({
            data: xy || []
          }, restLine);
        })
      }, restData),
      tooltip: !tooltip ? false : _extends({
        cross: 'x'
      }, tooltip, {
        compute: (res, ...args) => {
          let result = tipCompute.call(this, res, ...args);
          if (typeof tooltip.compute === 'function') {
            result = tooltip.compute.call(this, result, ...args);
          }
          return result;
        }
      })
    }));
    this.smooth = smooth || 0;
    this.line$ = d3.line();
    updateLine.call(this);
    this.filter$ = [];
    const zooming$$ = this.zooming$;
    this.zooming$ = (e, ...args) => {
      zooming$$.call(null, e, ...args);
      const {
        scaleAxis
      } = e;
      const xScale = (scaleAxis.x || scaleAxis.x2).scale;
      const x2Scale = (scaleAxis.x2 || scaleAxis.x).scale;
      const yScale = (scaleAxis.y || scaleAxis.y2).scale;
      const y2Scale = (scaleAxis.y2 || scaleAxis.y).scale;
      this.rootSelection$.select('.zAxis')
      // .selectChildren() // ie11及以下不支持SVGSVGElement.children（其实可以SVGSVGElement.childNodes，但是d3未做兼容）
      .selectAll('path').attr('d', d => this.line$.x(({
        x,
        x2
      }) => typeof x === 'undefined' ? x2Scale(x2 || 0) : xScale(x || 0)).y(({
        y,
        y2
      }) => typeof y === 'undefined' ? y2Scale(y2 || 0) : yScale(y || 0))(d.data));
    };
    this.rootSelection$.select('.zLabel').on('click', e => {
      if (this.destroyed) return;
      const datum = d3.select(e.target).datum();
      const index = this.filter$.findIndex(f => f.key === datum.key);
      if (index === -1) {
        this.filter$.push(datum);
      } else {
        this.filter$.splice(index, 1);
      }
      lineLabel.call(this);
      if (this.rendered) {
        this.render();
      }
    });
    lineLabel.call(this);
  }
  setData(data, render, computeDomain) {
    if (!data) return this;
    const {
        line
      } = data,
      restData = _objectWithoutPropertiesLoose(data, _excluded4);
    super.setData(_extends({
      line: (line || []).map(_ref4 => {
        let {
            data: xy
          } = _ref4,
          restLine = _objectWithoutPropertiesLoose(_ref4, _excluded5);
        return _extends({
          data: xy || []
        }, restLine);
      })
    }, restData), false, !line ? computeDomain : ({
      line: lineData
    }, needDomain) => {
      const domains = {};
      lineData.forEach(rd => {
        const xy = {};
        rd.data.forEach(dc => {
          Object.keys(dc).forEach(k => {
            if (!xy[k]) xy[k] = [];
            xy[k].push(dc[k]);
          });
        });
        needDomain.forEach(key => {
          if (xy[key] && xy[key].length > 0) {
            domains[key] = d3.extent([...xy[key], ...(domains[key] || [])]);
          }
        });
      });
      return domains;
    });
    if (this.data.line.length !== 1) {
      this.tooltip.onlyOneMerge = false;
    }
    lineLabel.call(this);
    if (render) {
      this.render();
    }
    return this;
  }
  setSmooth(smooth, render) {
    this.smooth = smooth;
    this.rendered = false;
    updateLine.call(this);
    if (render) {
      this.render();
    }
    return this;
  }
  destroy() {
    this.line$ = null;
    this.filter$ = null;
    this.zooming$ = null;
    super.destroy();
    return this;
  }
}
export default LineGraph;