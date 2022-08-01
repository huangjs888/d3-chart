// @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-12-07 15:02:48
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-08-01 15:03:33
 * @Description: 按需生成HeatMap构造器
 */

import * as d3 from 'd3';
import BaseChart from '../BaseChart';
import LineGraph from '../LineGraph';
import * as util from '../util';
import mixin from '../util/mixin';

const iconSize = 18;

const prefixSIFormat = d3.format('~s');

const searchValIndex = (val, arr) => {
  let n1 = 0;
  let n2 = arr.length;
  let c = 0;
  const binSize = n2 > 1 ? (arr[n2 - 1] - arr[0]) / (n2 - 1) : 1;
  let n;
  let test;
  if (binSize >= 0) {
    test = (a, b) => a <= b;
  } else {
    test = (a, b) => a > b;
  }
  // don't trust floating point equality - fraction of bin size to call
  const v = val + binSize * 1e-9 * (binSize >= 0 ? 1 : -1);
  // c is just to avoid infinite loops if there's an error
  while (n1 < n2 && c < 100) {
    c += 1;
    n = Math.floor((n1 + n2) / 2);
    if (test(arr[n], v)) n1 = n + 1;
    else n2 = n;
  }
  if (c > 90) window.console.log('Long binary search...');
  return Math.min(Math.max(n1 - 1, 0), arr.length - 1);
};
// 计算两值之间任意值占比以及前后值
const computeFactor = (val, val0, val1, bin0, bin1) => {
  const factor = (val - val0) / (val1 - val0) || 0;
  if (factor <= 0) {
    return {
      factor: 0,
      bin0,
      bin1: bin0,
    };
  }
  if (factor > 0.5) {
    return {
      factor: 1 - factor,
      bin0: bin1,
      bin1: bin0,
    };
  }
  return {
    factor,
    bin0,
    bin1,
  };
};
// 计算每个像素对应值的插值计算比例
const getInterpFactor = (pixel, valPixs) => {
  const index0 = searchValIndex(pixel, valPixs);
  const index1 = index0 + 1;
  return computeFactor(pixel, valPixs[index0], valPixs[index1], index0, index1);
};
// 根据四个点计算中间点的平均值
const matrixAverage = (xFactor, val00, val01, yFactor, val10, val11) => {
  let val = 0;
  if (val00 !== undefined) {
    const dx = val01 - val00 || 0;
    const dy = val10 - val00 || 0;
    let dxy = 0;
    if (val01 === undefined) {
      if (val11 === undefined) dxy = 0;
      else if (val10 === undefined) dxy = 2 * (val11 - val00);
      else dxy = ((2 * val11 - val10 - val00) * 2) / 3;
    } else if (val11 === undefined) {
      if (val10 === undefined) dxy = 0;
      else dxy = ((2 * val00 - val01 - val10) * 2) / 3;
    } else if (val10 === undefined) dxy = ((2 * val11 - val01 - val00) * 2) / 3;
    else dxy = val11 + val00 - val01 - val10;
    val = val00 + (xFactor || 0) * dx + (yFactor || 0) * (dy + (xFactor || 0) * dxy);
  }
  return val;
};
// 将给定值数组中的值映射到给定长度的每一个像素点上
// 若值数组长度比像素点多，则会均匀抽稀映射
// 若值数组长度比像素点少，则会平滑插值映射
const valueForPixel = (value, pixel, reverse) => {
  const valPixs = [];
  const len = value.length;
  const minVal = value[0];
  const maxVal = value[len - 1];
  for (let i = 0; i < len; i += 1) {
    valPixs[reverse ? len - 1 - i : i] = Math.round(
      Math.round(100 * pixel * ((value[i] - minVal) / (maxVal - minVal))) / 100
    );
  }
  return valPixs;
};
// 矩阵插值上色（根据矩形四个点值，计算矩形内部所有像素点的值，并渲染颜色）
const matrixInterp = ({ w, h, d }, { x, y, z }, c) => {
  const [[x0, y0], [x1, y1]] = d;
  const cw = x1 - x0;
  const ch = y1 - y0;
  const xValPixs = valueForPixel(x, w);
  const yValPixs = valueForPixel(y, h, true);
  let pixels;
  let index = 0;
  try {
    pixels = new Uint8Array(cw * ch * 4);
  } catch (e) {
    pixels = new Array(cw * ch * 4);
  }
  const xInterpArray = [];
  for (let j = y0; j < y1; j += 1) {
    const yInterp = getInterpFactor(j, yValPixs);
    const val0 = z[yInterp.bin0] || [];
    const val1 = z[yInterp.bin1] || [];
    // 获取y轴(横向)范围内无效索引集合
    const yInvalidIndex = y.invalid || [];
    // 判断当前横向一整条像素的上bin0下bin1都是无效索引，则无效
    const yInvalid = yInvalidIndex.findIndex((o) => o === yInterp.bin0 || o === yInterp.bin1) !== -1;
    for (let i = x0; i < x1; i += 1) {
      let rgba = { r: 0, g: 0, b: 0, opacity: 0 };
      // 有效才计算颜色
      if (!yInvalid) {
        let xInterp = xInterpArray[i];
        if (!xInterp) {
          xInterp = getInterpFactor(i, xValPixs);
          xInterpArray[i] = xInterp;
        }
        // 获取x轴(竖向)范围内无效索引集合
        const xInvalidIndex = x.invalid || [];
        // 判断当前像素点的左bin0右bin1都是无效索引，则无效
        const xInvalid = xInvalidIndex.findIndex((o) => o === xInterp.bin0 || o === xInterp.bin1) !== -1;
        // 有效才计算颜色
        if (!xInvalid) {
          rgba = c(
            matrixAverage(
              xInterp.factor,
              val0[xInterp.bin0],
              val0[xInterp.bin1],
              yInterp.factor,
              val1[xInterp.bin0],
              val1[xInterp.bin1]
            )
          );
        }
      }
      pixels[index] = rgba.r;
      pixels[index + 1] = rgba.g;
      pixels[index + 2] = rgba.b;
      pixels[index + 3] = rgba.opacity * 255; // 透明度0-1需要转换成0-255
      index += 4;
    }
  }
  return pixels;
};

function drawend(zContext, { xScale, yScale }) {
  zContext.save();
  // 先清空画布
  zContext.clearRect(0, 0, this.width$, this.height$);
  if (this.showHeat$) {
    const zScale = this.zScale$;
    let viewRange = null;
    const { x, y, z } = this.data.heat;
    // 原始范围
    // 根据xy轴的刻度变换函数分别计算出原始数据图的上下左右坐标位置
    const xMinPx = xScale(x[0] || 0);
    const xMaxPx = xScale(x[x.length - 1] || 0);
    // 因为y坐标是反转的（domain和range大小反转对应）
    const yMinPx = yScale(y[y.length - 1] || 0);
    const yMaxPx = yScale(y[0] || 0);
    // 原始数据的实际宽高
    const width = Math.round(xMaxPx - xMinPx);
    const height = Math.round(yMaxPx - yMinPx);
    // 如果实际的宽高小于或等于0则表示压根没有数据
    if (width > 0 && height > 0) {
      // 画布范围
      // 画布上下左右坐标位置，this.width$, this.height$是画布的宽高
      const xcMinPx = 0;
      const xcMaxPx = this.width$ + xcMinPx;
      const ycMinPx = 0;
      const ycMaxPx = this.height$ + ycMinPx;
      // 真实渲染的数据，是原始数据的范围，配置中筛选的范围以及画布的范围最终确定
      // 根据以上三个范围计算确定真正需要渲染的范围，要考虑此范围的两个问题：
      // 1，对于原始数据段转换的像素范围，应该选择哪一段像素去渲染？
      // 2，对于视图，这一段数据应该渲染在画布上哪一个范围（在画布内部的位置）？
      // 以下计算需要渲染的像素段在原始数据像素范围内（宽和高）起点和终点的索引
      const xMin = Math.max(xcMinPx, xMinPx); // 取x最小范围中的最大值
      const xMax = Math.min(xcMaxPx, xMaxPx); // 取x最大范围中的最小值
      const yMin = Math.max(ycMinPx, yMinPx); // 取y最小范围中的最大值
      const yMax = Math.min(ycMaxPx, yMaxPx); // 取y最大范围中的最小值
      // 实际被裁减后的宽高（可能等于画布宽高，也可能小于，但是不会大于因为被裁掉了）
      const dataRange = [
        [Math.round(xMin - xMinPx), Math.round(yMin - yMinPx)], // 筛选后数据在原数据的起点index
        [Math.round(xMax - xMinPx), Math.round(yMax - yMinPx)], // 筛选后数据在原数据的终点index
      ];
      const cWidth = dataRange[1][0] - dataRange[0][0];
      const cHeight = dataRange[1][1] - dataRange[0][1];
      // 如果裁剪后的宽高小于或等于0则表示没有可以渲染的数据了
      if (cWidth > 0 && cHeight > 0) {
        // 计算出渲染图片的每个像素rgba值
        const pixelData = matrixInterp(
          {
            w: width,
            h: height,
            d: dataRange,
          },
          { x, y, z },
          (v) => {
            // 老版本d3得到的rgba是字符串，新版本d3是对象，这里做个兼容
            const rgba = zScale(v);
            return typeof rgba === 'string' ? d3.color(rgba) : rgba;
          }
        );
        // 创建一个空的图片数据（使用裁剪后的宽高）
        const imageData = zContext.createImageData(cWidth, cHeight);
        // 将像素数据设置到图片数据内
        try {
          imageData.data.set(pixelData);
        } catch (e) {
          const cdata = imageData.data;
          const len = cdata.length;
          for (let i = 0; i < len; i += 1) {
            cdata[i] = pixelData[i];
          }
        }
        // 以下计在算在画布上需要渲染的范围起点和终点的位置（相对于画布）
        viewRange = [
          [xMin - xcMinPx, yMin - ycMinPx],
          [xMax - xcMinPx, yMax - ycMinPx],
        ];
        // 将计算好的数据放到画布
        zContext.putImageData(imageData, Math.round(viewRange[0][0]), Math.round(viewRange[0][1]));
        const { canvas } = this.tempCanvas$;
        if (canvas) {
          // 存储渲染后的裁剪数据和图片数据
          canvas.width = cWidth;
          canvas.height = cHeight;
          canvas.getContext('2d').putImageData(imageData, 0, 0);
        }
      }
    }
    this.tempCanvas$.range = !viewRange
      ? null
      : viewRange.map((r) => r.map((v, i) => (i === 0 ? xScale : yScale).invert(v)));
  }
  zContext.restore();
}

function drawing(zContext, { xScale, yScale }) {
  if (this.showHeat$) {
    const lineMarkX = this.lineMark$[0];
    if (lineMarkX.node()) {
      const xp = xScale(lineMarkX.datum()) || (!this.scale.x ? this.width$ : 0);
      lineMarkX.style('left', `${xp}px`).style('display', xp < 0 || xp >= this.width$ ? 'none' : 'block');
    }
    const lineMarkY = this.lineMark$[1];
    if (lineMarkY.node()) {
      const yp = yScale(lineMarkY.datum()) || (!this.scale.y ? 0 : this.height$);
      lineMarkY.style('top', `${yp}px`).style('display', yp < 0 || yp >= this.height$ ? 'none' : 'block');
    }
    const { canvas, range } = this.tempCanvas$;
    if (range) {
      // 将上一次变换后的图，经过本次变换的变形重新绘制到画布上
      const [[x0, y0], [x1, y1]] = range.map((r) => r.map((v, i) => (i === 0 ? xScale : yScale)(v)));
      zContext.save();
      zContext.clearRect(0, 0, this.width$, this.height$);
      zContext.drawImage(canvas, x0, y0, x1 - x0, y1 - y0);
      zContext.restore();
    }
  }
}

function tipCompute(prevRes, point, scaleAxis) {
  const data = this.data.heat;
  const scaleOpt = this.scale;
  const { cross, average } = this.tooltip;
  let [x0, y0] = point;
  const xyzValue = [];
  if (this.showHeat$ && cross === 'xy') {
    const xScale = (scaleAxis.x || scaleAxis.x2).scale;
    const yScale = (scaleAxis.y || scaleAxis.y2).scale;
    let xval = xScale.invert(x0);
    let yval = yScale.invert(y0);
    let zval = 0;
    const [xi0, xi1] = util.findNearIndex(+xval, data.x);
    const [yi0, yi1] = util.findNearIndex(+yval, data.y);
    if (xi0 >= 0 && xi1 >= 0 && yi0 >= 0 && yi1 >= 0) {
      const xval0 = +data.x[xi0];
      const xval1 = +data.x[xi1];
      const yval0 = +data.y[yi0];
      const yval1 = +data.y[yi1];
      if (xval0 === xval1 && yval0 === yval1) {
        // 正好移动到了xy交叉数据点上
        zval = (data.z[yi0] || [])[xi0];
      } else if (average) {
        const xInterp = computeFactor(+xval, xval0, xval1, xi0, xi1);
        const yInterp = computeFactor(+yval, yval0, yval1, yi0, yi1);
        const val00 = (data.z[yInterp.bin0] || [])[xInterp.bin0];
        const val01 = (data.z[yInterp.bin0] || [])[xInterp.bin1];
        const val10 = (data.z[yInterp.bin1] || [])[xInterp.bin0];
        const val11 = (data.z[yInterp.bin1] || [])[xInterp.bin1];
        zval = matrixAverage(xInterp.factor, val00, val01, yInterp.factor, val10, val11);
      } else {
        const xi = Math.abs(xval - xval0) > Math.abs(xval - xval1) ? xi1 : xi0;
        const yi = Math.abs(yval - yval0) > Math.abs(yval - yval1) ? yi1 : yi0;
        xval = +data.x[xi];
        yval = +data.y[yi];
        zval = (data.z[yi] || [])[xi];
        x0 = xScale(xval);
        y0 = yScale(yval);
      }
      xyzValue.push(
        {
          ...scaleOpt[scaleAxis.x ? 'x' : 'x2'],
          value: xval,
        },
        {
          ...scaleOpt[scaleAxis.y ? 'y' : 'y2'],
          value: yval,
        },
        {
          ...scaleOpt.z,
          value: zval,
        }
      );
    }
  }
  if (xyzValue.length > 0) {
    // 去掉第一个因为第一个是标题
    const prevValue = (prevRes.data || []).slice(1);
    const ndata = [...xyzValue, ...prevValue];
    const result = (selection) => {
      selection
        .selectAll('div')
        .data(ndata)
        .join('div')
        .attr('style', 'white-space: nowrap;')
        .html((d, i) =>
          i === 0
            ? `${d.label ? `${d.label}: ` : ''}${d.format(d.value)}${d.unit || ''}`
            : `${
                !d.color
                  ? ''
                  : `<span style="background: ${d.color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>`
              }<span>${d.label ? `${d.label}: ` : ''}</span><span style="display: inline-block; ${
                !d.color ? '' : 'margin-left: 30px;'
              }">${d.format(d.value)}${d.unit || ''}</span>`
        );
    };
    return { x0, y0, data: ndata, result };
  }
  return { ...prevRes };
}

function updateScale() {
  if (this.scale.z) {
    const zFormat = this.scale.z.format || ((v) => v);
    let [opacity, range, domain] = this.scale.z.domain || [];
    opacity = opacity || 1;
    range = range || ['#000', '#fff'];
    domain = domain || [0, 1];
    this.zScale$
      .range(range.map((c) => d3.color(c).copy({ opacity })))
      .domain(domain)
      .clamp(true); // 设置true可以卡住所给不在domain中的参数生成的数据仍然在range范围内
    if (this.legend) {
      const linearGradient = this.rootSelection$.select('linearGradient');
      const heatLegend = this.rootSelection$.select('.heatLegend');
      const height = this.height$;
      const startDomain = domain[0];
      const deltDomain = domain[domain.length - 1] - startDomain;
      const width = this.legend.width;
      linearGradient
        .selectAll('stop')
        .data(domain)
        .join('stop')
        .attr('offset', (v) => `${(100 * (v - startDomain)) / deltDomain}%`)
        .attr('stop-color', (_, i) => range[i]);
      heatLegend
        .selectAll('g')
        .data(domain)
        .join(
          (enter) => {
            const tick = enter
              .append('g')
              .attr('class', 'tick')
              .attr('transform', (v) => `translate(${width},${height * (1 - (v - startDomain) / deltDomain)})`);
            tick.append('path').attr('d', 'M0,0 L4,4 L4,-4 Z');
            tick
              .append('text')
              .attr('x', 8)
              .attr('dy', '0.32em')
              .attr('text-anchor', 'start')
              .text((v) => zFormat(v));
            return tick;
          },
          (update) => {
            update.attr('transform', (v) => `translate(${width},${height * (1 - (v - startDomain) / deltDomain)})`);
            update.select('text').text((v) => zFormat(v));
            return update;
          }
        );
    }
  }
}

function doubleClick(point, { xScale, yScale }) {
  let result = {};
  if (this.showHeat$) {
    const heatData = this.data.heat;
    let [x0, y0] = point;
    let [xval, yval] = [];
    const lineMarkX = this.lineMark$[0];
    if (lineMarkX.node()) {
      xval = Math.max(Math.min(+xScale.invert(x0), heatData.x[heatData.x.length - 1]), heatData.x[0]);
      x0 = xScale(xval);
      lineMarkX.style('left', `${x0}px`).style('display', 'block');
    }
    const lineMarkY = this.lineMark$[1];
    if (lineMarkY.node()) {
      yval = Math.max(Math.min(+yScale.invert(y0), heatData.y[heatData.y.length - 1]), heatData.y[0]);
      y0 = yScale(yval);
      lineMarkY.style('top', `${y0}px`).style('display', 'block');
    }
    this.setLineMark([xval, yval], (res) => {
      result = res;
    });
  }
  return result;
}

export default function generateHeatMap(superName) {
  class HeatMap extends BaseChart {
    constructor(...params) {
      const { data, tooltip, legend, scale, ...restOptions } = params[0] || {};
      const { heat, ...restData } = data || {};
      let rWidth = restOptions.rWidth;
      if (legend) {
        legend.show = !!legend.show;
        legend.left = util.isNumber(legend.left) ? legend.left : 0;
        legend.width = util.isNumber(legend.width) ? legend.width : 0;
        legend.right = util.isNumber(legend.right) ? legend.right : 0;
        if (legend.show) {
          rWidth = (util.isNumber(rWidth) ? rWidth : 0) + legend.left + legend.width + legend.right;
        }
      }
      super({
        ...restOptions,
        rWidth,
        data: {
          heat: !heat ? { x: [], y: [], z: [] } : { x: heat.x || [], y: heat.y || [], z: heat.z || [] },
          ...restData,
        },
        tooltip: !tooltip
          ? false
          : {
              cross: 'xy',
              select: '',
              average: true,
              ...tooltip,
              compute: (res, ...args) => {
                let result = tipCompute.call(this, res, ...args);
                if (typeof tooltip.compute === 'function') {
                  result = tooltip.compute.call(this, result, ...args);
                }
                return result;
              },
            },
        scale: {
          /* z: {
            type: 'linear', // 坐标类型
            ticks: 5, // 坐标刻度数目
            format: (v) => v, // 坐标值格式化函数
            domain: [0, ['#fff', '#fff'], [0, 0]], // 值的色域范围和透明度
            label: '', // 坐标名称
            unit: '', // 坐标值单位
          }, */
          z: { format: prefixSIFormat },
          ...scale,
        },
      });
      this.legend = legend;
      this.showHeat$ = true;
      const tempText = `${this.scale.z.label || ''}${this.scale.z.subLabel ? ` ( ${this.scale.z.subLabel} )` : ''}${
        this.scale.z.unit ? ` ( ${this.scale.z.unit} )` : ''
      }`;
      const baselineDelt = this.fontSize + 2;
      const heatLabel = this.rootSelection$
        .select('g.group')
        .append('g')
        .attr('class', 'heatLabel')
        .attr('fill', 'currentColor')
        .attr(
          'transform',
          `translate(${this.scale.y ? 10 : this.width$ - 10},${
            this.scale.x ? baselineDelt - this.padding[0] : this.height$ + this.padding[2] - iconSize + baselineDelt
          })`
        );
      heatLabel
        .append('text')
        .attr('dx', ((this.scale.y ? 1 : -1) * util.measureSvgText(tempText, this.fontSize)) / 2)
        .text(tempText);
      if (this.tooltip) {
        const { select } = this.tooltip;
        (select || '').split('').forEach((key) => {
          if (key) {
            this.zoomSelection$
              .append('div')
              .attr('class', `${key}-linemark`)
              .style('background', '#fa9305')
              .style('display', 'none')
              .style('position', 'absolute')
              .style('top', !this.scale.y ? 0 : this.height$ - 1)
              .style('left', !this.scale.x ? this.width$ - 1 : 0)
              .style('width', key === 'x' ? '1px' : '100%')
              .style('height', key === 'x' ? '100%' : '1px');
          }
        });
      }
      const lineMark = [this.zoomSelection$.select('.x-linemark'), this.zoomSelection$.select('.y-linemark')];
      this.lineMark$ = lineMark;
      const zCanvasParent = this.rootSelection$
        .insert('div', 'svg')
        .style('position', 'absolute')
        .style('width', `${this.width$}px`)
        .style('height', `${this.height$}px`)
        .style('top', `${this.padding[0]}px`)
        .style('left', `${this.padding[3]}px`);
      const zCanvas = zCanvasParent
        .append('canvas')
        .style('width', '100%')
        .style('height', '100%')
        .attr('width', this.width$)
        .attr('height', this.height$);
      if (legend) {
        const gradientId = util.guid('gradient');
        this.rootSelection$
          .select('svg')
          .select('defs')
          .append('linearGradient')
          .attr('id', gradientId)
          .attr('x1', '0%')
          .attr('y1', '100%')
          .attr('x2', '0%')
          .attr('y2', '0%');
        this.rootSelection$
          .select('svg')
          .select('.group')
          .append('g')
          .attr('class', 'heatLegend')
          .style('display', legend.show ? 'block' : 'none')
          .attr('fill', 'currentColor')
          .attr('transform', `translate(${this.width$ + this.padding[1] + legend.left},0)`)
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', legend.width)
          .attr('height', this.height$)
          .attr('fill', `url(#${gradientId})`);
      }
      const zContext = zCanvas.node().getContext('2d');
      this.zScale$ = d3.scaleLinear();
      updateScale.call(this);
      this.tempCanvas$ = {
        canvas: document.createElement('canvas'),
        range: null,
      };
      const dblclick$$ = this.dblclick$;
      this.dblclick$ = (e, ...args) => {
        dblclick$$.call(null, e, ...args);
        const { x, x2, y, y2 } = e.scaleAxis;
        const xScale = (x || x2).scale;
        const yScale = (y || y2).scale;
        return doubleClick.call(this, e.sourceEvent ? d3.pointer(e.sourceEvent) : [0, 0], { xScale, yScale });
      };
      const click$$ = this.click$;
      this.click$ = (e, ...args) => {
        click$$.call(null, e, ...args);
        lineMark.forEach((lm) => lm.node() && lm.style('display', 'none'));
      };
      const contextmenu$$ = this.contextmenu$;
      this.contextmenu$ = (e, ...args) => {
        contextmenu$$.call(null, e, ...args);
        lineMark.forEach((lm) => lm.node() && lm.style('display', 'none'));
      };
      const zooming$$ = this.zooming$;
      this.zooming$ = (e, ...args) => {
        zooming$$.call(null, e, ...args);
        const { x, x2, y, y2 } = e.scaleAxis;
        const xScale = (x || x2).scale;
        const yScale = (y || y2).scale;
        drawing.call(this, zContext, { xScale, yScale });
      };
      const zoomend$$ = this.zoomend$;
      this.debounceDrawend$ = util.debounce(drawend, 450, { leading: false, trailing: true });
      this.zoomend$ = (e, ...args) => {
        zoomend$$.call(null, e, ...args);
        const { x, x2, y, y2 } = e.scaleAxis;
        const xScale = (x || x2).scale;
        const yScale = (y || y2).scale;
        this.debounceDrawend$.call(this, zContext, { xScale, yScale });
        if (!e.sourceEvent || e.sourceEvent.type === 'call') {
          util.delay(() => {
            this.debounceDrawend$.flush();
          }, 1);
        }
      };
      const resize$$ = this.resize$;
      this.resize$ = (e, { width, height, padding, ...rest }, ...args) => {
        resize$$.call(null, e, { width, height, padding, ...rest }, ...args);
        zCanvasParent
          .style('width', `${width}px`)
          .style('height', `${height}px`)
          .style('top', `${padding[0]}px`)
          .style('left', `${padding[3]}px`);
        zCanvas.attr('width', width).attr('height', height);
        heatLabel.attr(
          'transform',
          `translate(${this.scale.y ? 10 : width - 10},${
            this.scale.x ? baselineDelt - padding[0] : height + padding[2] - iconSize + baselineDelt
          })`
        );
        if (legend) {
          const heatLegend = this.rootSelection$.select('.heatLegend');
          heatLegend.attr('transform', `translate(${width + padding[1] + legend.left},0)`);
          heatLegend.select('rect').attr('height', height);
          const ticks = heatLegend.selectAll('.tick');
          const domain = ticks.data();
          const startDomain = domain[0];
          const deltDomain = domain[domain.length - 1] - startDomain;
          ticks.attr('transform', (v) => `translate(${legend.width},${height * (1 - (v - startDomain) / deltDomain)})`);
        }
      };
      heatLabel.on('click', () => {
        if (this.destroyed) return;
        this.showHeat$ = !this.showHeat$;
        lineMark.forEach((lm) => lm.node() && lm.style('display', this.showHeat$ ? 'block' : 'none'));
        heatLabel.attr('fill', !this.showHeat$ ? '#aaa' : 'currentColor');
        if (this.rendered) {
          this.render();
        }
      });
    }

    getLineMark() {
      const result = [];
      const lineMarkX = this.lineMark$[0];
      if (lineMarkX.node()) {
        const xval = lineMarkX.datum();
        result[0] = xval;
      }
      const lineMarkY = this.lineMark$[1];
      if (lineMarkY.node()) {
        const yval = lineMarkY.datum();
        result[1] = yval;
      }
      return result;
    }

    setLineMark(lm, cb) {
      const lineMark = lm || [];
      const { average } = this.tooltip;
      const heatData = this.data.heat;
      let xSelect = null;
      let ySelect = null;
      const lineMarkX = this.lineMark$[0];
      if (lineMarkX.node()) {
        const xval = !lineMark[0] && lineMark[0] !== 0 ? heatData.x[0] : lineMark[0];
        lineMarkX.datum(xval);
        let zval = [];
        // xval在数据范围之内才可计算出zval
        if (xval >= heatData.x[0] && xval <= heatData.x[heatData.x.length - 1]) {
          let xi = util.findNearIndex(xval, heatData.x, !average);
          if (!average) xi = [xi, xi];
          let xBin = 0;
          if (xi[0] !== xi[1]) xBin = (xval - heatData.x[xi[0]]) / (heatData.x[xi[1]] - heatData.x[xi[0]]);
          zval = heatData.z.map((v) => {
            const vv = v || [];
            return xBin * ((vv[xi[1]] || 0) - (vv[xi[0]] || 0)) + (vv[xi[0]] || 0);
          });
        }
        xSelect = { x: xval, y: heatData.y, z: zval };
      }
      const lineMarkY = this.lineMark$[1];
      if (lineMarkY.node()) {
        const yval = !lineMark[1] && lineMark[1] !== 0 ? heatData.y[0] : lineMark[1];
        lineMarkY.datum(yval);
        let zval = [];
        // yval在数据范围之内才可计算出zval
        if (yval >= heatData.y[0] && yval <= heatData.y[heatData.y.length - 1]) {
          let yi = util.findNearIndex(yval, heatData.y, !average);
          if (!average) yi = [yi, yi];
          let yBin = 0;
          if (yi[0] !== yi[1]) yBin = (yval - heatData.y[yi[0]]) / (heatData.y[yi[1]] - heatData.y[yi[0]]);
          zval = (heatData.z[yi[0]] || []).map((v0, i) => {
            const v1 = (heatData.z[yi[1]] || [])[i] || 0;
            return yBin * (v1 - v0) + v0;
          });
        }
        ySelect = { x: heatData.x, y: yval, z: zval };
      }
      if (typeof cb === 'function') {
        cb({ xSelect, ySelect });
      }
      return this;
    }

    setData(data, render, computeDomain) {
      if (!data) return this;
      const { heat, ...restData } = data || {};
      super.setData(
        {
          heat: !heat ? { x: [], y: [], z: [] } : { x: heat.x || [], y: heat.y || [], z: heat.z || [] },
          ...restData,
        },
        false,
        !heat
          ? computeDomain
          : ({ heat: heatData }, needDomain) => {
              const domains = {};
              needDomain.forEach((key) => {
                if (heatData[key] && heatData[key].length > 0) {
                  domains[key] = d3.extent([...heatData[key]]);
                }
              });
              return domains;
            }
      );
      // 将linemark归位到起点
      this.setLineMark();
      if (render) {
        this.render();
      }
      return this;
    }

    setDomain(domain, render) {
      if (!domain) return this;
      const { z, ...rest } = domain;
      super.setDomain(rest);
      if (z && this.scale.z) {
        this.scale.z.domain = z;
        updateScale.call(this);
        if (render) {
          this.render();
        }
      }
      return this;
    }

    setLabel(label, render) {
      if (!label) return this;
      const { z, ...rest } = label;
      super.setLabel(rest);
      if (z && this.scale.z) {
        this.scale.z.label = z.label;
        this.scale.z.subLabel = z.subLabel;
        this.scale.z.unit = z.unit;
        const tempText = `${this.scale.z.label || ''}${this.scale.z.subLabel ? ` ( ${this.scale.z.subLabel} )` : ''}${
          this.scale.z.unit ? ` ( ${this.scale.z.unit} )` : ''
        }`;
        this.rootSelection$
          .select('.heatLabel')
          .select('text')
          .attr('dx', ((this.scale.y ? 1 : -1) * util.measureSvgText(tempText, this.fontSize)) / 2)
          .text(tempText);
        if (render) {
          this.render();
        }
      }
      return this;
    }

    downloadImage() {
      const zCanvas = this.rootSelection$.select('canvas').node();
      const svgDiv = this.rootSelection$.select('.actions');
      const left = window.parseInt(svgDiv.style('left'));
      const top = window.parseInt(svgDiv.style('top'));
      super.downloadImage((this.scale.z || {}).label, {
        image: zCanvas,
        x: left,
        y: top,
      });
    }

    destroy() {
      if (this.debounceDrawend$) {
        this.debounceDrawend$.cancel();
        this.debounceDrawend$ = null;
      }
      if (this.zScale$) this.zScale$ = null;
      if (this.tempCanvas$) this.tempCanvas$ = {};
      super.destroy();
      return this;
    }
  }
  if (superName === 'LineGraph') {
    mixin.replace(HeatMap, LineGraph);
  }
  return HeatMap;
}
