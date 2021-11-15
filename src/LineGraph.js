/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-11-15 14:35:50
 * @Description: ******
 */

import * as d3 from 'd3';
import BaseChart from './BaseChart';
import * as util from './util';

function lineLabel() {
  const { onlyOneMerge } = this.tooptip;
  const dx = onlyOneMerge ? 0 : 20;
  let totalWidth = 0;
  this.rootSelection$
    .select('.zLabel')
    .selectAll('g.line-legend')
    .each((d, i, g) => {
      totalWidth -= +d3.select(g[i]).select('rect').attr('width');
    })
    .data(this.data.line.slice().reverse())
    .join(
      (enter) => {
        return enter
          .append('g')
          .attr('class', 'line-legend')
          .attr('transform', (d, i, g) => {
            const group = d3.select(g[i]);
            const width = util.measureSvgText(d.label, this.fontSize) + dx + 5;
            totalWidth -= width;
            const isHide = this.filter$.findIndex((f) => f.key === d.key) !== -1;
            group
              .insert('rect')
              .attr('x', -2)
              .attr('y', -2)
              .attr('width', width)
              .attr('height', 20)
              .attr('fill', 'transparent');
            if (!onlyOneMerge) {
              group
                .insert('path')
                .attr('fill', 'none')
                .attr('stroke', isHide ? '#aaaa' : d.color || 'inherit')
                .attr('stroke-width', 4)
                .attr('transform', 'translate(0,6),scale(0.5)')
                // .attr('d', 'M0 6 C4 0,8 0,12 6 S20 12,24 6') // 曲线
                .attr('d', 'M0 6,28 6');
            }
            group
              .insert('text')
              .attr('dx', dx)
              .attr('fill', isHide ? '#aaaa' : 'currentColor')
              .attr('text-anchor', 'start')
              .attr('stroke-width', 0.5)
              .text(d.label);
            if (onlyOneMerge) {
              totalWidth -= (this.width$ - (width - 5)) / 2;
            }
            return `translate(${totalWidth},0)`;
          });
      },
      (update) => {
        return update.each((d, i, g) => {
          const group = d3.select(g[i]);
          const isHide = this.filter$.findIndex((f) => f.key === d.key) !== -1;
          group.select('path').attr('stroke', isHide ? '#aaaa' : d.color || 'inherit');
          group
            .select('text')
            .attr('fill', isHide ? '#aaaa' : 'currentColor')
            .text(d.label);
        });
      }
    );
  const showData = util.differenceWith(this.data.line, this.filter$, (a, b) => a.key === b.key);
  this.rootSelection$
    .select('.zAxis')
    .selectAll('path')
    .data(showData)
    .join('path')
    .attr('stroke', (d) => d.color || 'inherit')
    .attr('stroke-width', 1.2);
}

function tipCompute(prevRes, point, scaleAxis) {
  const ok = (a) => a === 0 || !!a;
  const scaleOpt = this.scale;
  const { cross, average, onlyOneMerge } = this.tooptip;
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
    fData.forEach(({ data, color, label }) => {
      let xxKey = 'x';
      let xxScale = xScale;
      if (x2Scale && data.length > 0 && ok(data.x2)) {
        xxKey = 'x2';
        xxScale = x2Scale;
      }
      const yyKey = y2Scale && data.length > 0 && ok(data[0].y2) ? 'y2' : 'y';
      let xval = xxScale.invert(x0);
      let yval = null;
      const [xi0, xi1] = util.findNearIndex(
        +xval,
        data.map((d) => d[xxKey])
      );
      if (xi0 >= 0 && xi1 >= 0) {
        const xval0 = !data[xi0] ? 0 : data[xi0][xxKey];
        const xval1 = !data[xi1] ? 0 : data[xi1][xxKey];
        if (xval0 === xval1) {
          // 正好移动到了数据点上
          yval = !data[xi0] ? 0 : data[xi0][yyKey];
        } else if (average) {
          // 平均值显示
          const valRate = (xval - xval0) / (xval1 - xval0);
          yval =
            valRate * ((!data[xi1] ? 0 : data[xi1][yyKey]) - (!data[xi0] ? 0 : data[xi0][yyKey])) +
            (!data[xi0] ? 0 : data[xi0][yyKey]);
        } else {
          // 最近值显示
          const xi = Math.abs(xval - xval0) > Math.abs(xval - xval1) ? xi1 : xi0;
          xval = !data[xi] ? 0 : data[xi][xxKey];
          yval = !data[xi] ? 0 : data[xi][yyKey];
          x0 = xxScale(xval);
        }
        xyValue[0] = { ...scaleOpt[xxKey], value: xval };
        xyValue.push({
          ...scaleOpt[yyKey],
          value: yval,
          color,
          ...(onlyOneMerge ? {} : { label }),
        });
      }
    });
  } else if (crossY) {
    fData.forEach(({ data, color, label }) => {
      let yyKey = 'y';
      let yyScale = yScale;
      if (y2Scale && data.length > 0 && ok(data.y2)) {
        yyKey = 'y2';
        yyScale = y2Scale;
      }
      const xxKey = x2Scale && data.length > 0 && ok(data[0].x2) ? 'x2' : 'x';
      let yval = yyScale.invert(y0);
      let xval = null;
      const [yi0, yi1] = util.findNearIndex(
        +yval,
        data.map((d) => d[yyKey])
      );
      if (yi0 >= 0 && yi1 >= 0) {
        const yval0 = !data[yi0] ? 0 : data[yi0][yyKey];
        const yval1 = !data[yi1] ? 0 : data[yi1][yyKey];
        if (yval0 === yval1) {
          // 正好移动到了数据点上
          xval = !data[yi0] ? 0 : data[yi0][xxKey];
        } else if (average) {
          // 平均值显示
          const valRate = (yval - yval0) / (yval1 - yval0);
          xval =
            valRate * ((!data[yi1] ? 0 : data[yi1][xxKey]) - (!data[yi0] ? 0 : data[yi0][xxKey])) +
            (!data[yi0] ? 0 : data[yi0][xxKey]);
        } else {
          // 最近值显示
          const yi = Math.abs(yval - yval0) > Math.abs(yval - yval1) ? yi1 : yi0;
          yval = !data[yi] ? 0 : data[yi][yyKey];
          xval = !data[yi] ? 0 : data[yi][xxKey];
          y0 = yyScale(yval);
        }
        xyValue[0] = { ...scaleOpt[yyKey], value: yval };
        xyValue.push({
          ...scaleOpt[xxKey],
          value: xval,
          color,
          ...(onlyOneMerge ? {} : { label }),
        });
      }
    });
  }
  if (xyValue.length > 0) {
    // 去掉第一个因为第一个是标题
    const prevValue = (prevRes.data || []).slice(1);
    const data = [...xyValue, ...prevValue];
    const result = (selection) => {
      selection
        .selectAll('div')
        .data(data)
        .join('div')
        .attr('style', 'white-space: nowrap;')
        .html((d, i) =>
          i === 0
            ? `${d.label}：${d.format(d.value)}${d.unit}`
            : `${
                onlyOneMerge || !d.color
                  ? ''
                  : `<span style="background: ${d.color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>`
              }<span>${d.label}</span>: <span style="display: inline-block; ${
                onlyOneMerge || !d.color ? '' : 'margin-left: 30px;'
              }">${d.format(d.value)}${d.unit}</span>`
        );
    };
    return { x0, y0, data, result };
  }
  return { ...prevRes };
}

function updateLine() {
  let curve = d3.curveLinear; // 折线
  if (this.smooth >= 1) {
    curve = d3.curveBasis; // 平滑曲线
  } else if (this.smooth < 1 && this.smooth > 0) {
    curve = d3.curveBundle(this.smooth); // 平滑度为0.8曲线
  }
  this.line$.curve(curve);
}

class LineGraph extends BaseChart {
  constructor(...params) {
    const { smooth, data, tooptip, ...restOptions } = params[0] || {};
    const { line, ...restData } = data || {};
    super({
      ...restOptions,
      data: {
        line: (line || []).map(({ data: xy, ...restLine }) => ({
          data: xy || [],
          ...restLine,
        })),
        ...restData,
      },
      tooptip: !tooptip
        ? false
        : {
            cross: 'x',
            ...tooptip,
            compute: (res, ...args) => {
              let result = tipCompute.call(this, res, ...args);
              if (typeof tooptip.compute === 'function') {
                result = tooptip.compute.call(this, result, ...args);
              }
              return result;
            },
          },
    });
    this.smooth = smooth || 0;
    this.line$ = d3.line();
    updateLine.call(this);
    this.filter$ = [];
    const zooming$$ = this.zooming$;
    this.zooming$ = (e, ...args) => {
      zooming$$.call(null, e, ...args);
      const { scaleAxis } = e;
      const xScale = (scaleAxis.x || scaleAxis.x2).scale;
      const x2Scale = (scaleAxis.x2 || scaleAxis.x).scale;
      const yScale = (scaleAxis.y || scaleAxis.y2).scale;
      const y2Scale = (scaleAxis.y2 || scaleAxis.y).scale;
      this.rootSelection$
        .select('.zAxis')
        // .selectChildren() // ie11及以下不支持SVGSVGElement.children（其实可以SVGSVGElement.childNodes，但是d3未做兼容）
        .selectAll('path')
        .attr('d', (d) =>
          this.line$
            .x(({ x, x2 }) => (typeof x === 'undefined' ? x2Scale(x2 || 0) : xScale(x || 0)))
            .y(({ y, y2 }) => (typeof y === 'undefined' ? y2Scale(y2 || 0) : yScale(y || 0)))(d.data)
        );
    };
    this.rootSelection$.select('.zLabel').on('click', (e) => {
      if (this.destroyed) return;
      const datum = d3.select(e.target).datum();
      const index = this.filter$.findIndex((f) => f.key === datum.key);
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
    const { line, ...restData } = data;
    super.setData(
      {
        line: (line || []).map(({ data: xy, ...restLine }) => ({
          data: xy || [],
          ...restLine,
        })),
        ...restData,
      },
      false,
      !line
        ? computeDomain
        : ({ line: lineData }, needDomain) => {
            const domains = {};
            lineData.forEach((rd) => {
              const xy = {};
              rd.data.forEach((dc) => {
                Object.keys(dc).forEach((k) => {
                  if (!xy[k]) xy[k] = [];
                  xy[k].push(dc[k]);
                });
              });
              needDomain.forEach((key) => {
                if (xy[key] && xy[key].length > 0) {
                  domains[key] = d3.extent([...xy[key], ...(domains[key] || [])]);
                }
              });
            });
            return domains;
          }
    );
    if (this.data.line.length !== 1) {
      this.tooptip.onlyOneMerge = false;
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
    if (this.line$) this.line$ = null;
    if (this.filter$) this.filter$ = [];
    super.destroy();
    return this;
  }
}

export default LineGraph;
