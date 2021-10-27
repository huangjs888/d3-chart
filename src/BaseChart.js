/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-10-26 18:25:51
 * @Description: ******
 */

import * as d3 from 'd3';
import * as util from './util';

const downloadPath =
  'M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z';
const resetPath =
  'M483.031 380.989v-61.004l-162.969 92.891 162.969 99.24v-64.04c128.025 0.122 157.093 64.052 157.093 94.107 0 33.863-29.068 97.771-157.093 97.771l-98.957 0.011v63.919l98.957-0.011c157.093 0.011 221.105-63.907 221.105-159.017 0.001-96.647-64.012-163.856-221.105-163.867 M511.372 64.548c-247.628 0-448.369 200.319-448.369 447.426S263.744 959.4 511.372 959.4s448.369-200.32 448.369-447.426S758.999 64.548 511.372 64.548z m-0.203 823.564c-207.318 0-375.382-167.71-375.382-374.592s168.064-374.592 375.382-374.592 375.382 167.71 375.382 374.592-168.064 374.592-375.382 374.592z';
const lockPath =
  'M508.3 66.3c-128 0-232.7 104.7-232.7 232.7v188.5h94.5V333.3c0-98.7 62-179.5 137.8-179.5 75.8 0 137.8 80.8 137.8 179.5v154.2H741V299c0-128-104.7-232.7-232.7-232.7zM792.3 485.5H223.6c-31.3 0-56.6 25.3-56.6 56.6v408.1c0 31.3 25.3 56.6 56.6 56.6h568.7c31.3 0 56.6-25.3 56.6-56.6V542.1c0-31.3-25.4-56.6-56.6-56.6zM537.8 758.4v98h-59.4v-98.2c-23.6-11.2-40-35.2-40-63.1 0-38.6 31.3-69.9 69.9-69.9 38.6 0 69.9 31.3 69.9 69.9-0.1 28.1-16.6 52.2-40.4 63.3z';
const unlockPath =
  'M508.3 66.3c-128 0-232.7 104.7-232.7 232.7v188.5h94.5V333.3c0-98.7 62-179.5 137.8-179.5 75.8 0 137.8 80.8 137.8 179.5v0H741V299c0-128-104.7-232.7-232.7-232.7zM792.3 485.5H223.6c-31.3 0-56.6 25.3-56.6 56.6v408.1c0 31.3 25.3 56.6 56.6 56.6h568.7c31.3 0 56.6-25.3 56.6-56.6V542.1c0-31.3-25.4-56.6-56.6-56.6zM537.8 758.4v98h-59.4v-98.2c-23.6-11.2-40-35.2-40-63.1 0-38.6 31.3-69.9 69.9-69.9 38.6 0 69.9 31.3 69.9 69.9-0.1 28.1-16.6 52.2-40.4 63.3z';
const axisType = ['x', 'x2', 'y', 'y2'];
const scaleType = {
  cat: () => d3.scaleBand(),
  timeCat: () => d3.scaleBand(),
  time: () => d3.scaleTime(),
  linear: () => d3.scaleLinear(),
  log: () => d3.scaleLog(),
  sqrt: () => d3.scaleSqrt(),
  pow: () => d3.scalePow(),
  // sequential: () => d3.scaleSequential(),
  quantize: () => d3.scaleQuantize(),
  quantile: () => d3.scaleQuantile(),
  identity: () => d3.scaleIdentity(),
};
const timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');
const formatMillisecond = d3.timeFormat('.%L');
const formatSecond = d3.timeFormat(':%S');
const formatMinute = d3.timeFormat('%H:%M');
const formatHour = d3.timeFormat('%H:00');
const formatDay = d3.timeFormat('%m-%d');
const formatMonth = d3.timeFormat('%m月');
const formatYear = d3.timeFormat('%Y年');
const prefixSIFormat = d3.format('.4~s');
const exponentFormat = d3.format('.4~g');
const roundFormat = d3.format('.4~r');
const getDefaultFormat = (type) => {
  if (type === 'time') {
    return (date, ax) => {
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
  return (v) => v;
};
const computeSize = (element, { width, height, padding }) => {
  let w = width;
  let h = height;
  const style = getComputedStyle(element);
  if (!(util.isNumber(width) && width > 1)) {
    w =
      (element.clientWidth || parseInt(style.width, 10)) -
      parseInt(style.paddingLeft, 10) -
      parseInt(style.paddingRight, 10);
  }
  if (!(util.isNumber(height) && height > 1)) {
    h =
      (element.clientHeight || parseInt(style.height, 10)) -
      parseInt(style.paddingTop, 10) -
      parseInt(style.paddingBottom, 10);
  }
  let [top, right, bottom, left] = [];
  const pad = Array.isArray(padding) ? padding : [];
  let [pad0, pad1, pad2, pad3] = pad;
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
  };
};
const scaleLable = (labelSel, [scale, domain]) => {
  let { type, format, label, unit } = scale;
  type = type || 'linear';
  label = label || '';
  unit = !label || !unit ? '' : ` ( ${unit} )`;
  format = format || getDefaultFormat(type);
  let [min, max] = domain;
  min = min || 0;
  max = max || 0;
  labelSel
    .select('text')
    .selectAll('tspan')
    .data([0, 1])
    .join('tspan')
    .attr('dx', (_, i) => {
      if (!label) return 0;
      return i === 0 ? -12 : 12;
    })
    .text((_, i) => (i === 0 ? `${label}${unit}` : `${format(min)} - ${format(max)}`));
};
function getScaleAxis() {
  const [xTransform, yTransform] = this.zoomSelection$.datum();
  const scaleAxis = {};
  axisType.forEach((key) => {
    if (this.scale[key]) {
      const { scale, axis } = this.rescale$(key === 'x' || key === 'x2' ? xTransform : yTransform, key);
      scaleAxis[key] = {
        axis,
        scale,
      };
    }
  });
  return scaleAxis;
}
function updateScale() {
  axisType.forEach((key) => {
    if (this.axisScale$[key]) {
      const [minDomain, maxDomain] = this.scale[key].domain || this.dataDomains$[key] || [0, 1];
      this.axisScale$[key].scale
        .range(key === 'x' || key === 'x2' ? [0, this.width$] : [this.height$, 0])
        .domain([minDomain || 0, maxDomain || 1]);
      if (this.scale[key].nice) {
        this.axisScale$[key].scale.nice();
        const niceDomain = this.axisScale$[key].scale.domain();
        if (this.scale[key].domain) {
          this.scale[key].domain = niceDomain;
        }
        if (this.dataDomains$[key]) {
          this.dataDomains$[key] = niceDomain;
        }
      }
    }
  });
}
function createScale() {
  const axisScale = {};
  axisType.forEach((key) => {
    if (this.scale[key]) {
      const { type = 'linear', ticks = 5, tickSize, format } = this.scale[key];
      const scale = scaleType[type]();
      let axis = null;
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
      const defaultFormat = getDefaultFormat(type);
      if (!format) {
        this.scale[key].format = defaultFormat;
      }
      axis = axis.tickFormat(format || ((val) => defaultFormat(val, true)));
      axisScale[key] = { scale, axis };
    }
  });
  this.axisScale$ = axisScale;
  updateScale.call(this);
  this.rescale$ = (transform, key) => {
    const as = this.axisScale$[key];
    if (as) {
      const { scale, axis } = as;
      const recale = key === 'x' || key === 'x2' ? transform.rescaleX(scale) : transform.rescaleY(scale);
      return {
        scale: recale,
        axis: axis.scale(recale),
      };
    }
    return as;
  };
}
function updateZoom() {
  const viewExtent = [
    [0, 0],
    [this.width$, this.height$],
  ];
  let scaleExtent = [
    [1, 1],
    [1, 1],
  ];
  let translateExtent = [
    [0, 0],
    [0, 0],
  ];
  const { x: xzoom, y: yzoom } = this.zoom;
  if (xzoom || yzoom) {
    const [xdomain, ydomain] = [xzoom, yzoom].map((zoom, i) => {
      const key = zoom.domain || (i === 0 ? 'x' : 'y');
      let domain = [0, 1];
      if (this.scale[key]) {
        domain = this.scale[key].domain || this.dataDomains$[key] || [0, 1];
      }
      return domain;
    });
    const [xMinDomain, xMaxDomain] = xdomain;
    const [yMinDomain, yMaxDomain] = ydomain;
    const xDomainEx = (xMaxDomain || 1) - (xMinDomain || 0);
    const yDomainEx = (yMaxDomain || 1) - (yMinDomain || 0);
    const [xMinTranslate = 0, xMaxTranslate = 0] = xzoom.translate || [-Infinity, Infinity];
    const [yMinTranslate = 0, yMaxTranslate = 0] = yzoom.translate || [-Infinity, Infinity];
    const [xMinPrecision = xDomainEx / 10, xMaxPrecision = xDomainEx * 10] = xzoom.precision || [
      xDomainEx / 10,
      xDomainEx * 10,
    ];
    const [yMinPrecision = yDomainEx / 10, yMaxPrecision = yDomainEx * 10] = yzoom.precision || [
      yDomainEx / 10,
      yDomainEx * 10,
    ];
    const xRate = this.width$ / xDomainEx;
    const yRate = this.height$ / yDomainEx;
    scaleExtent = [
      [xDomainEx / xMaxPrecision || 1, yDomainEx / yMaxPrecision || 1],
      [xDomainEx / xMinPrecision || 1, yDomainEx / yMinPrecision || 1],
    ];
    translateExtent = [
      [
        (xMinTranslate - (xMinDomain || 0)) * xRate || xMinDomain || 0,
        ((yMaxDomain || 1) - yMaxTranslate) * yRate || yMinDomain || 0,
      ],
      [
        (xMaxTranslate - (xMinDomain || 0)) * xRate || xMaxDomain || 1,
        ((yMaxDomain || 1) - yMinTranslate) * yRate || yMaxDomain || 1,
      ],
    ];
  }
  this.zoomer$
    .extent(viewExtent)
    .scaleExtent([(scaleExtent[0][0] * scaleExtent[0][1]) ** 2, (scaleExtent[1][0] * scaleExtent[1][1]) ** 2])
    .translateExtent(translateExtent);
  this.zoomExtent$ = { viewExtent, scaleExtent, translateExtent };
}
function createZoom() {
  this.zoomExtent$ = null;
  updateZoom.call(this);
  this.transform$ = (axis, tf, deltK, point, point0) => {
    let transform = tf;
    if (this.zoomExtent$) {
      const { viewExtent, translateExtent, scaleExtent } = this.zoomExtent$;
      const tk = Math.max(
        axis === 'x' ? scaleExtent[0][0] : scaleExtent[0][1],
        Math.min(axis === 'x' ? scaleExtent[1][0] : scaleExtent[1][1], transform.k * deltK)
      );
      const tx = point[0] - tk * point0[0];
      const ty = point[1] - tk * point0[1];
      if (tk !== transform.k || tx !== transform.x || ty !== transform.y) {
        transform = d3.zoomIdentity.translate(tx, ty).scale(tk);
        const dx0 = transform.invertX(viewExtent[0][0]) - translateExtent[0][0];
        const dx1 = transform.invertX(viewExtent[1][0]) - translateExtent[1][0];
        const dy0 = transform.invertY(viewExtent[0][1]) - translateExtent[0][1];
        const dy1 = transform.invertY(viewExtent[1][1]) - translateExtent[1][1];
        transform = transform.translate(
          dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
          dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
        );
      }
    }
    return transform;
  };
}
function updateElement(size) {
  const { width, height, padding } = computeSize(this.rootSelection$.node(), size);
  let zw = width - padding[3] - padding[1];
  let zh = height - padding[0] - padding[2];
  if (zw < 1) zw = 1;
  if (zh < 1) zh = 1;
  const group = this.rootSelection$
    .select('svg')
    .attr('width', width)
    .attr('height', height)
    .select('g.group')
    .attr('transform', `translate(${padding[3]},${padding[0]})`);
  this.rootSelection$.select('clipPath').selectChild().attr('x', 1).attr('y', 0).attr('width', zw).attr('height', zh);
  if (this.scale.x) {
    group.select('.xAxis').attr('transform', `translate(0,${zh})`);
    group.select('.xLabel').attr('transform', `translate(${zw / 2} ${zh + padding[2] - 14}) rotate(0)`);
  }
  if (this.scale.x2) {
    group.select('.x2Label').attr('transform', `translate(${zw / 2} ${-padding[0]}) rotate(0)`);
  }
  if (this.scale.y) {
    group.select('.yLabel').attr('transform', `translate(${-padding[3]} ${zh / 2}) rotate(-90)`);
  }
  if (this.scale.y2) {
    group.select('.y2Axis').attr('transform', `translate(${zw},0)`);
    group.select('.y2Label').attr('transform', `translate(${zw + padding[1] - 14} ${zh / 2}) rotate(-90)`);
  }
  const svgDiv = this.rootSelection$
    .select('div.svg')
    .style('width', `${zw}px`)
    .style('height', `${zh}px`)
    .style('top', `${padding[0]}px`)
    .style('left', `${padding[3] + 1}px`);
  if (this.zoom.x) {
    svgDiv
      .select('.xLock')
      .style('top', `${zh + padding[2] - 21}px`)
      .style('left', `${zw - 12}px`);
  }
  if (this.zoom.y) {
    svgDiv.select('.yLock').style('top', '-20px').style('left', `${-padding[3]}px`);
  }
  let offset = 5;
  if (this.zoom.x || this.zoom.y) {
    svgDiv
      .select('.zReset')
      .style('top', `${-padding[0] - 3}px`)
      .style('left', `${this.scale.y ? zw - offset - 18 : offset}px`);
    offset += 23;
  }
  if (this.download) {
    svgDiv
      .select('.zDownload')
      .style('top', `${-padding[0] - 3}px`)
      .style('left', `${this.scale.y ? zw - offset - 18 : offset}px`);
    offset += 23;
  }
  group
    .select('.zLabel')
    .attr('transform', `translate(${this.scale.y ? zw - offset : offset} ${this.scale.x2 ? 0 : -padding[0]})`);
  this.width = width;
  this.height = height;
  this.padding = padding;
  this.width$ = zw;
  this.height$ = zh;
}
function createElement(container, size) {
  const pathClipId = util.guid('clip');
  const svgXmlns = 'http://www.w3.org/2000/svg';
  const rootSelection = d3
    .select(container || document.createElement('div'))
    .append('div')
    .attr('class', 'd3chart')
    .style('position', 'relative')
    // .style('overflow', 'hidden')
    .style('width', '100%')
    .style('height', '100%');
  const svgSelection = rootSelection
    .append('svg')
    .attr('xmlns', svgXmlns)
    .attr('width', 1) // 清除默认宽高
    .attr('height', 1) // 清除默认宽高
    .attr('fill', 'none')
    .attr('text-anchor', 'middle')
    .attr('font-size', this.fontSize)
    .attr('stroke', 'none')
    .attr('stroke-width', 1)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .style('position', 'absolute');
  svgSelection.append('defs').append('svg:clipPath').attr('id', pathClipId).append('rect');
  const groupSelection = svgSelection.append('g').attr('class', 'group');
  axisType.forEach((key) => {
    if (this.scale[key]) {
      groupSelection.append('g').attr('class', `${key}Axis`);
      groupSelection
        .append('g')
        .attr('class', `${key}Label`)
        .attr('fill', 'currentColor')
        .attr('dominant-baseline', 'text-before-edge')
        .append('text');
    }
  });
  groupSelection.append('g').attr('class', 'zAxis').attr('clip-path', `url(#${pathClipId})`);
  groupSelection
    .append('g')
    .attr('class', 'zLabel')
    .attr('fill', 'currentColor')
    .attr('dominant-baseline', 'text-before-edge');
  const divSelection = rootSelection
    .append('div')
    .attr('class', 'svg')
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0);
  const zoomSelection = divSelection
    .append('div')
    .attr('class', 'xyzoom')
    .style('position', 'absolute')
    // .style('overflow', 'hidden')
    .style('background', 'rgba(0,0,0,0)') // IE9,10的层级（z-index）不起作用，需要加个背景使鼠标事件生效
    .style('width', '100%')
    .style('height', '100%')
    .style('top', 0)
    .style('left', 0);
  ['x', 'y', 'z'].forEach((key) => {
    if (this.zoom[key] || (key === 'z' && (this.zoom.x || this.zoom.y))) {
      divSelection
        .append('div')
        .attr('class', key === 'z' ? 'zReset' : `${key}Lock`)
        .style('position', 'absolute')
        .attr('title', key === 'z' ? '重置视图' : `${key.substr(0, 1).toUpperCase()} 轴缩放开关`)
        .style('font-size', '18px')
        .append('svg')
        .attr('xmlns', svgXmlns)
        .attr('fill', 'currentColor')
        .attr('viewBox', '0 0 1024 1024')
        .attr('width', '1em')
        .attr('height', '1em')
        .append('path')
        .attr('d', key === 'z' ? resetPath : unlockPath);
    }
  });
  if (this.download) {
    divSelection
      .append('div')
      .attr('class', 'zDownload')
      .style('position', 'absolute')
      .attr('title', '下载视图')
      .style('font-size', '18px')
      .append('svg')
      .attr('xmlns', svgXmlns)
      .attr('fill', 'currentColor')
      .attr('viewBox', '0 0 1024 1024')
      .attr('width', '1em')
      .attr('height', '1em')
      .append('path')
      .attr('d', downloadPath);
  }
  if (this.tooptip) {
    const { cross } = this.tooptip;
    zoomSelection
      .append('div')
      .attr('class', 'tooptip')
      .style('display', 'none')
      .style('z-index', '999')
      .style('border-radius', '8px')
      .style('transition', 'none')
      .style('padding', '10px 14px')
      .style('font-size', `${this.fontSize}px`)
      .style('line-height', '22px')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0);
    cross.split('').forEach((key) => {
      if (key) {
        zoomSelection
          .append('div')
          .attr('class', `${key}-cross`)
          .style('display', 'none')
          .style('position', 'absolute')
          .style('transition', 'none')
          .style('width', key === 'x' ? '1px' : '100%')
          .style('height', key === 'x' ? '100%' : '1px')
          .style('top', 0)
          .style('left', 0);
      }
    });
  }
  this.rootSelection$ = rootSelection;
  this.zoomSelection$ = zoomSelection;
  updateElement.call(this, size);
  if (!(util.isNumber(size.width) && size.width > 1 && util.isNumber(size.height) && size.height > 1)) {
    const resize = util.debounce(
      (e) => {
        if (this.destroyed) return;
        updateElement.call(this, size);
        updateScale.call(this);
        updateZoom.call(this);
        if (this.rendered) {
          this.reset();
        }
        this.resize$.call(
          null,
          {
            sourceEvent: e || null,
            target: this.rootSelection$,
            transform: [...this.zoomSelection$.datum(), d3.zoomTransform(this.zoomSelection$.node())],
            scaleAxis: getScaleAxis.call(this),
            type: 'resize',
          },
          {
            width: this.width$,
            height: this.height$,
            padding: this.padding,
          }
        );
      },
      250,
      { leading: false, trailing: true }
    );
    window.addEventListener('resize', resize);
    this.unBindResize$ = () => {
      window.removeEventListener('resize', resize);
    };
  }
}
function bindEvents() {
  let pointX0 = [0, 0];
  let pointY0 = [0, 0];
  let point0 = [0, 0];
  let transform0 = d3.zoomIdentity;
  this.zoomSelection$.datum([d3.zoomIdentity, d3.zoomIdentity]);
  this.zoomer$
    .on('start', (e) => {
      if (this.destroyed || !this.rendered) return;
      const [xTransform, yTransform] = this.zoomSelection$.datum();
      const { transform, sourceEvent } = e;
      if (sourceEvent.type !== 'call') {
        if (!this.xCanZoom$ && !this.yCanZoom$) return;
        const point = d3.pointer(e, this.zoomSelection$.node());
        if (this.xCanZoom$) {
          pointX0 = xTransform.invert(point);
        }
        if (this.yCanZoom$) {
          pointY0 = yTransform.invert(point);
        }
        point0 = point;
        transform0 = transform;
      }
      this.zoomstart$.call(null, {
        ...e,
        transform: [xTransform, yTransform, transform],
        scaleAxis: getScaleAxis.call(this),
      });
    })
    .on('zoom', (e) => {
      if (this.destroyed || !this.rendered) return;
      let [xTransform, yTransform] = this.zoomSelection$.datum();
      const { transform, sourceEvent } = e;
      // sourceEvent存在表示事鼠标触发，如滚轮和移动
      if (sourceEvent.type !== 'call') {
        if (!this.xCanZoom$ && !this.yCanZoom$) return;
        const point = d3.pointer(e, this.zoomSelection$.node());
        if (sourceEvent.type === 'mousemove' && !util.isCanEmit(point0, point)) return;
        const deltK = transform.k / transform0.k;
        const changed = point[0] !== point0[0] || point[1] !== point0[1];
        let p = point;
        if (sourceEvent.type === 'wheel') {
          p = changed ? point : point0;
        }
        if (this.xCanZoom$) {
          let px0 = pointX0;
          if (sourceEvent.type === 'wheel') {
            px0 = changed ? xTransform.invert(point) : pointX0;
          }
          xTransform = this.transform$('x', xTransform, deltK, p, px0);
        }
        if (this.yCanZoom$) {
          let py0 = pointY0;
          if (sourceEvent.type === 'wheel') {
            py0 = changed ? yTransform.invert(point) : pointY0;
          }
          yTransform = this.transform$('y', yTransform, deltK, p, py0);
        }
        transform0 = transform;
      } else if (sourceEvent.transform) {
        // 跳到指定的transform，则直接赋值到xy
        // 如果存在xy缩放，则会有补间调用，万一补间一半，触发了滚轮或移动，则补间会停止，造成无法到达指定缩放位置，所以xy锁定的时候应该忽略补间
        const notZoom = !this.xCanZoom$ && !this.yCanZoom$;
        if (sourceEvent.zoomX) {
          xTransform = notZoom ? sourceEvent.transform : transform;
        }
        if (sourceEvent.zoomY) {
          yTransform = notZoom ? sourceEvent.transform : transform;
        }
      }
      this.zoomSelection$.datum([xTransform, yTransform]);
      const scaleAxis = getScaleAxis.call(this);
      Object.keys(scaleAxis).forEach((key) => {
        const { axis, scale } = scaleAxis[key];
        this.rootSelection$.select(`.${key}Axis`).call(axis);
        this.rootSelection$.select(`.${key}Label`).call(scaleLable, [this.scale[key], scale.domain()]);
      });
      this.zooming$.call(null, {
        ...e,
        transform: [xTransform, yTransform, transform],
        scaleAxis,
      });
    })
    .on('end', (e) => {
      if (this.destroyed || !this.rendered) return;
      const { transform, sourceEvent } = e;
      if (sourceEvent.type !== 'call') {
        if (!this.xCanZoom$ && !this.yCanZoom$) return;
        const point = d3.pointer(e, this.zoomSelection$.node());
        if (sourceEvent.type === 'mousemove' && !util.isCanEmit(point0, point)) return;
        pointX0 = [0, 0];
        pointY0 = [0, 0];
        point0 = [0, 0];
        transform0 = d3.zoomIdentity;
      }
      this.zoomend$.call(null, {
        ...e,
        transform: [...this.zoomSelection$.datum(), transform],
        scaleAxis: getScaleAxis.call(this),
      });
    });

  this.zoomSelection$
    .call(this.zoomer$)
    .on('mouseover', (e) => {
      if (this.destroyed) return;
      this.mouseover$.call(null, {
        sourceEvent: e,
        target: this.zoomSelection$,
        transform: [...this.zoomSelection$.datum(), d3.zoomTransform(this.zoomSelection$.node())],
        scaleAxis: getScaleAxis.call(this),
        type: 'mouseover',
      });
    })
    .on('mouseout', (e) => {
      if (this.destroyed) return;
      if (this.tooptip) {
        const { cross } = this.tooptip;
        const zNode = this.zoomSelection$.node();
        const { toElement } = e;
        if (!toElement || (toElement.parentNode !== zNode && toElement.parentNode.parentNode !== zNode)) {
          if (cross.indexOf('x') !== -1) {
            this.zoomSelection$.select('.x-cross').style('display', 'none');
          }
          if (cross.indexOf('y') !== -1) {
            this.zoomSelection$.select('.y-cross').style('display', 'none');
          }
          this.zoomSelection$.select('.tooptip').style('display', 'none');
        }
      }
      this.mouseout$.call(null, {
        sourceEvent: e,
        target: this.zoomSelection$,
        transform: [...this.zoomSelection$.datum(), d3.zoomTransform(this.zoomSelection$.node())],
        scaleAxis: getScaleAxis.call(this),
        type: 'mouseout',
      });
    })
    .on('mousemove', (e) => {
      if (this.destroyed) return;
      const scaleAxis = getScaleAxis.call(this);
      if (this.tooptip) {
        const { cross, compute } = this.tooptip;
        const crossX = cross.indexOf('x') !== -1;
        const crossY = cross.indexOf('y') !== -1;
        if (crossX || crossY) {
          const [x0, y0] = d3.pointer(e);
          let { x0: x00, y0: y00, result } = compute([x0, y0], scaleAxis);
          x00 = x00 || x00 === 0 ? x00 : x0;
          y00 = y00 || y00 === 0 ? y00 : y0;
          let display = 'none';
          if (typeof result !== 'function') {
            result = util.noop;
          } else {
            display = 'block';
          }
          if (crossX) {
            this.zoomSelection$.select('.x-cross').style('left', `${x00}px`).style('display', display);
          }
          if (crossY) {
            this.zoomSelection$.select('.y-cross').style('top', `${y00}px`).style('display', display);
          }
          const tooptip = this.zoomSelection$.select('.tooptip');
          tooptip.style('display', display).call(result);
          if (display !== 'none') {
            const width = tooptip.node().clientWidth;
            const height = tooptip.node().clientHeight;
            let left = x0 + 10;
            let top = y0 - height - 10;
            if (this.width$ - left < width) {
              left = x0 - 10 - width;
            }
            left = left <= -60 ? -60 : left;
            top = top <= -20 ? -20 : top;
            tooptip.style('left', `${left}px`).style('top', `${top}px`);
          }
        }
      }
      this.mouseout$.call(null, {
        sourceEvent: e,
        target: this.zoomSelection$,
        transform: [...this.zoomSelection$.datum(), d3.zoomTransform(this.zoomSelection$.node())],
        scaleAxis,
        type: 'mousemove',
      });
    })
    .on('click', (e) => {
      if (this.destroyed) return;
      this.click$.call(null, {
        sourceEvent: e,
        target: this.zoomSelection$,
        transform: [...this.zoomSelection$.datum(), d3.zoomTransform(this.zoomSelection$.node())],
        scaleAxis: getScaleAxis.call(this),
        type: 'click',
      });
    })
    .on('contextmenu', (e) => {
      if (this.destroyed) return;
      this.contextmenu$.call(null, {
        sourceEvent: e,
        target: this.zoomSelection$,
        transform: [...this.zoomSelection$.datum(), d3.zoomTransform(this.zoomSelection$.node())],
        scaleAxis: getScaleAxis.call(this),
        type: 'contextmenu',
      });
      e.preventDefault();
    })
    .on('dblclick', (e) => {
      if (this.destroyed) return;
      this.dblclick$.call(null, {
        sourceEvent: e,
        target: this.zoomSelection$,
        transform: [...this.zoomSelection$.datum(), d3.zoomTransform(this.zoomSelection$.node())],
        scaleAxis: getScaleAxis.call(this),
        type: 'dblclick',
      });
    });
  if (!this.zoom.doubleZoom) {
    // 取消双击放大
    this.zoomSelection$.on('dblclick.zoom', null);
  }
  if (this.zoom.x) {
    const xlock = this.rootSelection$.select('.xLock');
    xlock.on('click', () => {
      this.xCanZoom$ = !this.xCanZoom$;
      xlock.select('path').attr('d', this.xCanZoom$ ? unlockPath : lockPath);
    });
  }
  if (this.zoom.y) {
    const ylock = this.rootSelection$.select('.yLock');
    ylock.on('click', () => {
      this.yCanZoom$ = !this.yCanZoom$;
      ylock.select('path').attr('d', this.yCanZoom$ ? unlockPath : lockPath);
    });
  }
  if (this.zoom.x || this.zoom.y) {
    this.rootSelection$.select('.zReset').on('click', () => {
      this.reset$();
      this.reset();
    });
  }
  if (this.download) {
    this.rootSelection$.select('.zDownload').on('click', () => {
      if (this.download.action) {
        this.download.action(() => {
          this.downloadImage();
        });
      } else {
        this.downloadImage();
      }
    });
  }
}
class BaseChart {
  constructor(...params) {
    const {
      container,
      width,
      height,
      padding = [0, 0, 0, 0],
      fontSize = 12,
      download,
      tooptip,
      zoom,
      scale,
      data,
    } = params[0] || {};
    this.destroyed = false;
    this.rendered = false;
    if (typeof download === 'function') {
      this.download = { action: download };
    } else if (typeof download === 'string') {
      this.download = { ext: download };
    } else {
      this.download = download || false;
    }
    this.tooptip = !tooptip
      ? false
      : {
          cross: '',
          ...tooptip,
          compute: (...args) => {
            let result = {};
            if (typeof tooptip.compute === 'function') {
              result = tooptip.compute.call(this, result, ...args);
            }
            return result;
          },
        };
    this.zoom = {
      /* x: {
					// 一旦domain设置了x或x2的某一类型，则translate和precision都要按照这一类型数据设置
					domain: 'x', // 坐标缩放为1，位移为0时的坐标范围（会默认取scale的x或x2的domain)
					translate: [-Infinity, Infinity], // 坐标标尺可以拖动的范围值
					precision: [(1 - 0) / 10, (1 - 0) * 10], // 坐标标尺缩到最小和最大的跨度值
				}, */
      x: null,
      y: null,
      doubleZoom: false,
      ...zoom,
    };
    this.scale = {
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
      y2: null,
      ...scale,
    };
    this.fontSize = fontSize;
    this.data = data || {};
    this.dataDomains$ = {};
    this.zoomer$ = d3.zoom();
    this.xCanZoom$ = !!this.zoom.x;
    this.yCanZoom$ = !!this.zoom.y;
    createElement.call(this, container, { width, height, padding });
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

  reset(noTransition) {
    this.render(d3.zoomIdentity, 'xy', noTransition);
    return this;
  }

  render(tf, ax = 'xy', noTransition) {
    this.rendered = true;
    const transform = tf || d3.zoomTransform(this.zoomSelection$.node());
    // 对this.zoomSelection$调用this.zoomer$.transform函数变换到指定的transform
    // 变换过程中用240ms及ease函数进行transition
    (noTransition ? this.zoomSelection$ : this.zoomSelection$.transition().duration(240).ease(d3.easeLinear)).call(
      this.zoomer$.transform,
      transform,
      null,
      {
        type: 'call',
        transform: tf,
        zoomX: ax.indexOf('x') !== -1,
        zoomY: ax.indexOf('y') !== -1,
      }
    );
    return this;
  }

  setEvent(type, handler) {
    if (typeof handler === 'function') {
      const oldHandler = this[`${type}$`];
      this[`${type}$`] = (...args) => {
        handler.call(null, ...args, oldHandler.call(null, ...args));
      };
    }
  }

  setData(data, render, computeDomain = util.noop) {
    if (!data) return this;
    this.rendered = false;
    this.data = data;
    // 根据data计算domain
    const needCompute = axisType.filter((key) => this.scale[key] && !this.scale[key].domain);
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

  setDomain(domain, render) {
    if (!domain) return this;
    let isScale = false;
    axisType.forEach((key) => {
      if (this.scale[key] && domain[key]) {
        this.scale[key].domain = domain[key];
        isScale = true;
      }
    });
    if (isScale) {
      this.rendered = false;
      updateScale.call(this);
      let isZoom = false;
      ['x', 'y'].forEach((key) => {
        isZoom = this.zoom[key] && ((this.scale[key] && domain[key]) || (this.scale[`${key}2`] && domain[`${key}2`]));
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

  setTranslate(translate, render) {
    if (!translate) return this;
    let isZoom = false;
    ['x', 'y'].forEach((key) => {
      if (this.zoom[key]) {
        this.zoom[key].translate = translate[key];
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

  setPrecision(precision, render) {
    if (!precision) return this;
    let isZoom = false;
    ['x', 'y'].forEach((key) => {
      if (this.zoom[key]) {
        this.zoom[key].precision = precision[key];
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

  setLabel(label, render) {
    if (!label) return this;
    let isScale = false;
    axisType.forEach((key) => {
      if (this.scale[key] && label[key]) {
        this.scale[key].label = label[key].label;
        this.scale[key].unit = label[key].unit;
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

  destroy() {
    this.destroyed = true;
    this.rendered = false;
    this.data = {};
    this.zoomer$.on('start', null).on('zoom', null).on('end', null);
    this.zoomSelection$
      .on('mouseover', null)
      .on('mouseout', null)
      .on('mousemove', null)
      .on('dblclick.zoom', null)
      .on('click', null)
      .on('contextmenu', null);
    if (this.unBindResize$) this.unBindResize$();
    this.rootSelection$.remove();
    this.rootSelection$ = null;
  }

  resize() {
    if (document.createEvent) {
      const event = document.createEvent('Event');
      event.initEvent('resize', true, true);
      window.dispatchEvent(event);
    } else if (document.createEventObject) {
      const event = document.createEventObject();
      event.type = 'onresize';
      window.fireEvent('onresize', event);
    }
    return this;
  }

  downloadImage(name, content) {
    const svgSel = this.rootSelection$.select('svg');
    const width = +svgSel.attr('width');
    const height = +svgSel.attr('height');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCxt = tempCanvas.getContext('2d');
    tempCxt.clearRect(0, 0, width, height);
    if (content) {
      tempCxt.drawImage(content.image, content.x, content.y);
    }
    const tempImage = new Image();
    tempImage.src = `data:image/svg+xml;base64,${window.btoa(
      window.unescape(
        window.encodeURIComponent(
          `<?xml version="1.0" standalone="no"?>
          ${new XMLSerializer().serializeToString(svgSel.node())}`
        )
      )
    )}`;
    const ext = this.download.ext || 'png';
    tempImage.onload = () => {
      tempCxt.drawImage(tempImage, 0, 0);
      const a = document.createElement('a');
      a.download = `${name || 'basechart'}.${ext}`;
      a.href = tempCanvas.toDataURL(`image/${ext}`);
      a.click();
    };
  }
}

export default BaseChart;