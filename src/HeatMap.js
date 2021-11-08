/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-11-08 11:01:14
 * @Description: ******
 */

import * as d3 from 'd3';
import BaseChart from './BaseChart';
import * as util from './util';

const prefixSIFormat = d3.format('~s');

const findValIndex = (val, arr) => {
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
  const index0 = findValIndex(pixel, valPixs);
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
    const val0 = z[yInterp.bin0];
    const val1 = z[yInterp.bin1];
    for (let i = x0; i < x1; i += 1) {
      let xInterp = xInterpArray[i];
      if (!xInterp) {
        xInterp = getInterpFactor(i, xValPixs);
        xInterpArray[i] = xInterp;
      }
      const chasm = x.chasm || [];
      const xbin = Math.max(xInterp.bin0, xInterp.bin1);
      const noChasm = chasm.findIndex((o) => o === xbin) === -1;
      const { r, g, b, opacity } = noChasm
        ? c(
            matrixAverage(
              xInterp.factor,
              val0[xInterp.bin0],
              val0[xInterp.bin1],
              yInterp.factor,
              val1[xInterp.bin0],
              val1[xInterp.bin1]
            )
          )
        : { r: 0, g: 0, b: 0, opacity: 0 };
      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = opacity * 255; // 透明度0-1需要转换成0-255
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

function drawing(zContext, { xScale, yScale }, [lineMarkX, lineMarkY]) {
  if (this.showHeat$) {
    if (lineMarkX.node()) {
      const xp = xScale(lineMarkX.datum()) || (!this.scale.x ? this.width$ : 0);
      lineMarkX.style('left', `${xp}px`).style('visibility', xp < 0 || xp > this.width$ ? 'hidden' : 'visible');
    }
    if (lineMarkY.node()) {
      const yp = yScale(lineMarkY.datum()) || (!this.scale.y ? this.height$ : 0);
      lineMarkY.style('top', `${yp}px`).style('visibility', yp < 0 || yp > this.height$ ? 'hidden' : 'visible');
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
  const { cross, average } = this.tooptip;
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
        zval = data.z[yi0][xi0];
      } else if (average) {
        const xInterp = computeFactor(+xval, xval0, xval1, xi0, xi1);
        const yInterp = computeFactor(+yval, yval0, yval1, yi0, yi1);
        const val00 = data.z[yInterp.bin0][xInterp.bin0];
        const val01 = data.z[yInterp.bin0][xInterp.bin1];
        const val10 = data.z[yInterp.bin1][xInterp.bin0];
        const val11 = data.z[yInterp.bin1][xInterp.bin1];
        zval = matrixAverage(xInterp.factor, val00, val01, yInterp.factor, val10, val11);
      } else {
        const xi = Math.abs(xval - xval0) > Math.abs(xval - xval1) ? xi1 : xi0;
        const yi = Math.abs(yval - yval0) > Math.abs(yval - yval1) ? yi1 : yi0;
        xval = +data.x[xi];
        yval = +data.y[yi];
        zval = data.z[yi][xi];
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
            ? `${d.label}：${d.format(d.value)}${d.unit}`
            : `${
                !d.color
                  ? ''
                  : `<span style="background: ${d.color}; width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px;"></span>`
              }<span>${d.label}</span>: <span style="display: inline-block; ${
                !d.color ? '' : 'margin-left: 30px;'
              }">${d.format(d.value)}${d.unit}</span>`
        );
    };
    return { x0, y0, data: ndata, result };
  }
  return { ...prevRes };
}

function updateScale() {
  if (this.scale.z) {
    const [opacity, range, domain] = this.scale.z.domain || [];
    this.zScale$
      .range((range || ['#fff', '#fff']).map((c) => d3.color(c).copy({ opacity: opacity || 0 })))
      .domain(domain || [0, 0])
      .clamp(true); // 设置true可以卡住所给不在domain中的参数生成的数据仍然在range范围内
  }
}

function doubleClick(point, { xScale, yScale }, [lineMarkX, lineMarkY]) {
  const data = this.data.heat;
  const { select, average } = this.tooptip;
  const result = {};
  if (this.showHeat$) {
    const selectX = select.indexOf('x') !== -1;
    const selectY = select.indexOf('y') !== -1;
    let zval = [];
    let [x0, y0] = point;
    if (selectX) {
      // 竖线
      let xval = +xScale.invert(x0);
      let xi = util.findNearIndex(xval, data.x, !average);
      if (xi.length === 2) {
        const [xi0, xi1] = xi;
        if (xi0 < 0) {
          xi = xi1;
        } else if (xi1 < 0 || xi0 === xi1) {
          xi = xi0;
        }
      }
      if (xi.length === 2) {
        const xval0 = +data.x[xi[0]];
        const xval1 = +data.x[xi[1]];
        const rate = (xval - xval0) / (xval1 - xval0);
        zval = data.z.map((v) => rate * (v[xi[1]] - v[xi[0]]) + v[xi[0]]);
      } else {
        xval = data.x[xi];
        x0 = xScale(xval);
        zval = data.z.map((v) => v[xi]);
      }
      result.xSelect = { x: xval, y: data.y, z: zval };
      if (lineMarkX.node() && x0 !== 'undefined') {
        lineMarkX.style('left', `${x0}px`).style('display', 'block').datum(xval);
      }
    }
    if (selectY) {
      // 横线
      let yval = +yScale.invert(y0);
      let yi = util.findNearIndex(yval, data.y, !average);
      if (yi.length === 2) {
        const [yi0, yi1] = yi;
        if (yi0 < 0) {
          yi = yi1;
        } else if (yi1 < 0 || yi0 === yi1) {
          yi = yi0;
        }
      }
      if (yi.length === 2) {
        const yval0 = +data.y[yi[0]];
        const yval1 = +data.y[yi[1]];
        const rate = (yval - yval0) / (yval1 - yval0);
        zval = data.z[yi[0]].map((v0, i) => {
          const v1 = data.z[yi[1]][i];
          return rate * (v1 - v0) + v0;
        });
      } else {
        yval = data.y[yi];
        y0 = yScale(yval);
        zval = data.z[yi] || [];
      }
      result.ySelect = { x: data.x, y: yval, z: zval };
      if (lineMarkY.node() && y0 !== 'undefined') {
        lineMarkY.style('top', `${y0}px`).style('display', 'block').datum(yval);
      }
    }
  }
  return result;
}

class HeatMap extends BaseChart {
  constructor(...params) {
    const { data, tooptip, scale, ...restOptions } = params[0] || {};
    const { heat, ...restData } = data || {};
    super({
      ...restOptions,
      data: {
        heat: !heat ? { x: [], y: [], z: [] } : { x: heat.x || [], y: heat.y || [], z: heat.z || [] },
        ...restData,
      },
      tooptip: !tooptip
        ? false
        : {
            cross: 'xy',
            select: '',
            average: true,
            ...tooptip,
            compute: (res, ...args) => {
              let result = tipCompute.call(this, res, ...args);
              if (typeof tooptip.compute === 'function') {
                result = tooptip.compute.call(this, result, ...args);
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
    this.showHeat$ = true;
    const tempText = `${this.scale.z.label || ''}${this.scale.z.subLabel ? ` ( ${this.scale.z.subLabel} )` : ''}${
      this.scale.z.unit ? ` ( ${this.scale.z.unit} )` : ''
    }`;
    const heatLabel = this.rootSelection$
      .select('g.group')
      .append('g')
      .attr('class', 'heatLabel')
      .attr('fill', 'currentColor')
      .attr('dominant-baseline', 'text-before-edge')
      .attr('transform', `translate(${this.scale.y ? 10 : this.width$ - 10},${this.scale.x2 ? 0 : -this.padding[0]})`);
    heatLabel
      .append('text')
      .attr('dx', util.measureSvgText(tempText, this.fontSize) / 2)
      .text(tempText);
    if (this.tooptip) {
      const { select } = this.tooptip;
      select.split('').forEach((key) => {
        if (key) {
          this.zoomSelection$
            .append('div')
            .attr('class', `${key}-linemark`)
            .style('background', '#fa9305')
            .style('display', 'none')
            .style('position', 'absolute')
            .style('top', !this.scale.y ? this.height$ : 0)
            .style('left', !this.scale.x ? this.width$ : 0)
            .style('width', key === 'x' ? '1px' : '100%')
            .style('height', key === 'x' ? '100%' : '1px');
        }
      });
    }
    const lineMark = [this.zoomSelection$.select('.x-linemark'), this.zoomSelection$.select('.y-linemark')];
    const zCanvasParent = this.rootSelection$
      .insert('div', 'svg')
      .style('position', 'absolute')
      .style('width', `${this.width$}px`)
      .style('height', `${this.height$}px`)
      .style('top', `${this.padding[0]}px`)
      .style('left', `${this.padding[3] + 1}px`);
    const zCanvas = zCanvasParent
      .append('canvas')
      .style('width', '100%')
      .style('height', '100%')
      .attr('width', this.width$)
      .attr('height', this.height$);
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
      return doubleClick.call(this, d3.pointer(e.sourceEvent), { xScale, yScale }, lineMark);
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
      drawing.call(this, zContext, { xScale, yScale }, lineMark);
    };
    const zoomend$$ = this.zoomend$;
    this.debounceDrawend$ = util.debounce(drawend, 450, { leading: false, trailing: true });
    this.zoomend$ = (e, ...args) => {
      zoomend$$.call(null, e, ...args);
      const { x, x2, y, y2 } = e.scaleAxis;
      const xScale = (x || x2).scale;
      const yScale = (y || y2).scale;
      this.debounceDrawend$.call(this, zContext, { xScale, yScale });
      if (e.sourceEvent.type === 'call') {
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
        .style('left', `${padding[3] + 1}px`);
      zCanvas.attr('width', width).attr('height', height);
      heatLabel.attr('transform', `translate(${this.scale.y ? 10 : width - 10},${this.scale.x2 ? 0 : -padding[0]})`);
    };
    heatLabel.on('click', () => {
      if (this.destroyed) return;
      this.showHeat$ = !this.showHeat$;
      lineMark.forEach((lm) => lm.node() && lm.style('display', this.showHeat$ ? 'block' : 'none'));
      heatLabel.attr('fill', !this.showHeat$ ? '#aaaa' : 'currentColor');
      if (this.rendered) {
        this.render();
      }
    });
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
    const lineMarkX = this.zoomSelection$.select('.x-linemark');
    const lineMarkY = this.zoomSelection$.select('.y-linemark');
    if (lineMarkX.node()) {
      lineMarkX.datum(this.data.heat.x[0]);
    }
    if (lineMarkY.node()) {
      lineMarkY.datum(this.data.heat.y[0]);
    }
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
        .attr('dx', util.measureSvgText(tempText, this.fontSize) / 2)
        .text(tempText);
      if (render) {
        this.render();
      }
    }
    return this;
  }

  downloadImage() {
    const zCanvas = this.rootSelection$.select('canvas').node();
    const svgDiv = this.rootSelection$.select('.svg');
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

export default HeatMap;
