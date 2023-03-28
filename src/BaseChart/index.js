// @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-03-28 15:13:28
 * @Description: 基础图表构造器
 */

import * as d3 from 'd3';
import * as util from '../util';

const iconSize = 18;
const downloadPath =
  'M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z';
const resetPath =
  'M483.031 380.989v-61.004l-162.969 92.891 162.969 99.24v-64.04c128.025 0.122 157.093 64.052 157.093 94.107 0 33.863-29.068 97.771-157.093 97.771l-98.957 0.011v63.919l98.957-0.011c157.093 0.011 221.105-63.907 221.105-159.017 0.001-96.647-64.012-163.856-221.105-163.867 M511.372 64.548c-247.628 0-448.369 200.319-448.369 447.426S263.744 959.4 511.372 959.4s448.369-200.32 448.369-447.426S758.999 64.548 511.372 64.548z m-0.203 823.564c-207.318 0-375.382-167.71-375.382-374.592s168.064-374.592 375.382-374.592 375.382 167.71 375.382 374.592-168.064 374.592-375.382 374.592z';
const lockPath =
  'M650 432.6v-99.4c0-76.3-61.8-138.1-138.1-138.1S373.8 258 373.8 334.3v99.4H650z m-382.9 1.1l-0.1-3.1V322.5c0-59.9 23.8-117.4 66.2-159.8C375.6 120.3 433 96.5 493 96.5h37.9c124.8 0 225.9 101.2 225.9 225.9v111.3c58.2 8.1 101.5 57.9 101.5 116.7v258.3c0 65.1-52.7 117.8-117.8 117.8H283.3c-65.1 0-117.8-52.7-117.8-117.8V550.5c0-58.8 43.3-108.6 101.6-116.8z m217.6 266v77c0 15 12.2 27.2 27.2 27.2s27.2-12.2 27.2-27.2v-77c33.5-13.1 53-48.2 46.3-83.5-6.7-35.4-37.5-61-73.5-61s-66.9 25.6-73.5 61c-6.7 35.3 12.8 70.4 46.3 83.5z';
const unlockPath =
  'M650 432.6v-99.4c0-76.3-61.8-138.1-138.1-138.1S373.8 258 373.8 334.3v99.4H650z m-382.9 1.1l-0.1-3.1V322.5c0-59.9 23.8-117.4 66.2-159.8C375.6 120.3 433 96.5 493 96.5h37.9c124.8 0 225.9 101.2 225.9 225.9v111.3c58.2 8.1 101.5 57.9 101.5 116.7v258.3c0 65.1-52.7 117.8-117.8 117.8H283.3c-65.1 0-117.8-52.7-117.8-117.8V550.5c0-58.8 43.3-108.6 101.6-116.8z m217.6 266v77c0 15 12.2 27.2 27.2 27.2s27.2-12.2 27.2-27.2v-77c33.5-13.1 53-48.2 46.3-83.5-6.7-35.4-37.5-61-73.5-61s-66.9 25.6-73.5 61c-6.7 35.3 12.8 70.4 46.3 83.5zm272 -369h-106.5v103h106.5z';
const actionButtons = {
  download: {
    title: '下载视图',
    path: downloadPath,
    className: 'download',
  },
  reset: {
    title: '重置视图',
    path: resetPath,
    className: 'reset',
  },
  xlock: {
    title: 'X轴缩放开关',
    path: unlockPath,
    className: 'xlock',
  },
  ylock: {
    title: 'Y轴缩放开关',
    path: unlockPath,
    className: 'ylock',
  },
};
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
const computeSize = (element, { width, height, padding, rWidth, rHeight }) => {
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
    rWidth: util.isNumber(rWidth) ? rWidth : 0,
    rHeight: util.isNumber(rHeight) ? rHeight : 0,
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
  this.transform$ = (axis, tf, t, p, l) => {
    let transform = tf;
    if (this.zoomExtent$) {
      const { viewExtent, translateExtent, scaleExtent } = this.zoomExtent$;
      const tk = Math.max(
        axis === 'x' ? scaleExtent[0][0] : scaleExtent[0][1],
        Math.min(axis === 'x' ? scaleExtent[1][0] : scaleExtent[1][1], transform.k * t)
      );
      const tx = p[0] - tk * l[0];
      const ty = p[1] - tk * l[1];
      if (tk !== transform.k || tx !== transform.x || ty !== transform.y) {
        transform = this.zoomer$.constrain()(d3.zoomIdentity.translate(tx, ty).scale(tk), viewExtent, translateExtent);
      }
    }
    return transform;
  };
}
function updateElement(size) {
  const { width, height, padding, rWidth, rHeight } = computeSize(this.rootSelection$.node(), size);
  let zw = width - rWidth - padding[3] - padding[1];
  let zh = height - rHeight - padding[0] - padding[2];
  if (zw < 1) zw = 1;
  if (zh < 1) zh = 1;
  const group = this.rootSelection$
    .select('svg')
    .attr('width', width)
    .attr('height', height)
    .select('g.group')
    .attr('transform', `translate(${padding[3]},${padding[0]})`);
  this.rootSelection$.select('clipPath').select('rect').attr('width', zw).attr('height', zh);
  const baselineDelt = this.fontSize + 2;
  if (this.scale.x) {
    group.select('.xAxis').attr('transform', `translate(0,${zh})`);
    if (this.scale.x.showRange || typeof this.scale.x.showRange === 'undefined') {
      group
        .select('.xLabel')
        .attr('transform', `translate(${zw / 2} ${zh + padding[2] - iconSize + baselineDelt}) rotate(0)`);
    }
  }
  if (this.scale.x2 && (this.scale.x2.showRange || typeof this.scale.x2.showRange === 'undefined')) {
    group.select('.x2Label').attr('transform', `translate(${zw / 2} ${baselineDelt - padding[0]}) rotate(0)`);
  }
  if (this.scale.y && (this.scale.y.showRange || typeof this.scale.y.showRange === 'undefined')) {
    group.select('.yLabel').attr('transform', `translate(${baselineDelt - padding[3]} ${zh / 2}) rotate(-90)`);
  }
  if (this.scale.y2) {
    group.select('.y2Axis').attr('transform', `translate(${zw},0)`);
    if (this.scale.y2.showRange || typeof this.scale.y2.showRange === 'undefined') {
      group
        .select('.y2Label')
        .attr('transform', `translate(${zw + padding[1] - iconSize + baselineDelt} ${zh / 2}) rotate(-90)`);
    }
  }
  const svgDiv = this.rootSelection$
    .select('div.actions')
    .style('width', `${zw}px`)
    .style('height', `${zh}px`)
    .style('top', `${padding[0]}px`)
    .style('left', `${padding[3]}px`);
  if (this.zoom.x) {
    svgDiv
      .select('.xlock')
      .style('top', `${this.scale.x ? zh + padding[2] - iconSize : -padding[0]}px`)
      .style('left', `${this.scale.y ? zw - iconSize / 2 : -iconSize / 2}px`);
  }
  if (this.zoom.y) {
    svgDiv
      .select('.ylock')
      .style('top', `${this.scale.x ? -iconSize / 2 : zh - iconSize / 2}px`)
      .style('left', `${this.scale.y ? -padding[3] : zw + padding[1] - iconSize}px`);
  }
  let offset = 5;
  if (this.zoom.x || this.zoom.y) {
    svgDiv
      .select('.reset')
      .style('top', `${this.scale.x ? -padding[0] : zh + padding[2] - iconSize}px`)
      .style('left', `${this.scale.y ? zw - offset - iconSize : offset}px`);
    offset += 23;
  }
  if (this.download) {
    svgDiv
      .select('.download')
      .style('top', `${this.scale.x ? -padding[0] : zh + padding[2] - iconSize}px`)
      .style('left', `${this.scale.y ? zw - offset - iconSize : offset}px`);
    offset += 23;
  }
  this.actions.forEach((a, i) => {
    if (!a) return;
    svgDiv
      .select(`.action-${i}`)
      .style('top', `${this.scale.x ? -padding[0] : zh + padding[2] - iconSize}px`)
      .style('left', `${this.scale.y ? zw - offset - iconSize : offset}px`);
    offset += 23;
  });
  group
    .select('.zLabel')
    .attr(
      'transform',
      `translate(${this.scale.y ? zw - offset : offset} ${
        (this.scale.x ? -padding[0] : zh + padding[2] - iconSize) + baselineDelt
      })`
    );

  this.width = width;
  this.height = height;
  this.padding = padding;
  this.width$ = zw;
  this.height$ = zh;
}
function createElement(container, size) {
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
  const pathClipId = util.guid('clip');
  svgSelection.append('defs').append('svg:clipPath').attr('id', pathClipId).append('rect');
  const groupSelection = svgSelection.append('g').attr('class', 'group');
  axisType.forEach((key) => {
    if (this.scale[key]) {
      groupSelection.append('g').attr('class', `${key}Axis`);
      if (this.scale[key].showRange || typeof this.scale[key].showRange === 'undefined') {
        groupSelection.append('g').attr('class', `${key}Label`).attr('fill', 'currentColor').append('text');
      }
    }
  });
  groupSelection.append('g').attr('class', 'zAxis').attr('clip-path', `url(#${pathClipId})`);
  groupSelection.append('g').attr('class', 'zLabel').attr('fill', 'currentColor');
  const divSelection = rootSelection
    .append('div')
    .attr('class', 'actions')
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
  const actions = [];
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
  [...actions, ...this.actions].forEach((action, i) => {
    const index = i - actions.length;
    if (!action) return;
    const { className, title, path, text, src, menus } = action;
    const actionSelection = divSelection
      .append('div')
      .attr('class', index < 0 ? className : `action-${index}`)
      .style('position', 'absolute')
      .attr('title', title || '')
      .style('display', 'inline-flex')
      .style('font-size', `${path ? iconSize : 12}px`);
    if (path) {
      actionSelection
        .append('svg')
        .attr('xmlns', svgXmlns)
        .attr('fill', 'currentColor')
        .attr('viewBox', '0 0 1024 1024')
        .attr('width', '1em')
        .attr('height', '1em')
        .append('path')
        .attr('d', path);
    } else if (text) {
      actionSelection.append('span').text(text);
    } else if (src) {
      actionSelection.append('img').attr('src', src).attr('width', iconSize).attr('height', iconSize);
    }
    if (Array.isArray(menus)) {
      const menusSelection = actionSelection
        .append('div')
        .attr('class', `action-menu action-${index}-menu`)
        .style('position', 'absolute')
        .style('top', '24px')
        .style('font-size', '12px')
        .style('padding', '6px 0px');
      let maxWidth = 0;
      menus.forEach((menu, j) => {
        if (!menu) return;
        const { text } = menu;
        maxWidth = Math.max(maxWidth, util.measureSvgText(text, 12));
        menusSelection.append('div').attr('class', `action-${index}-menu-${j}`).style('padding', '6px 12px').text(text);
      });
      menusSelection
        .style('width', `${maxWidth + 24}px`)
        .style('left', `${-(maxWidth + 24) / 2}px`)
        .style('display', 'none');
    }
  });
  if (this.tooltip) {
    const { cross } = this.tooltip;
    zoomSelection
      .append('div')
      .attr('class', 'tooltip')
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
            transform: [d3.zoomTransform(this.zoomSelection$.node()), ...this.zoomSelection$.datum()],
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
  let point = null;
  let transform0 = null;
  let longPress = 0;
  const showTooltip = (point) => {
    if (this.tooltip) {
      const { cross, compute } = this.tooltip;
      const crossX = cross.indexOf('x') !== -1;
      const crossY = cross.indexOf('y') !== -1;
      if (crossX || crossY) {
        const [x0, y0] = point;
        let { x0: x00, y0: y00, result } = compute([x0, y0], getScaleAxis.call(this));
        x00 = x00 || x00 === 0 ? x00 : x0;
        y00 = y00 || y00 === 0 ? y00 : y0;
        let display = 'none';
        if (typeof result !== 'function') {
          result = util.noop;
        } else {
          display = 'block';
        }
        if (crossX) {
          selection.select('.x-cross').style('left', `${x00}px`).style('display', display);
        }
        if (crossY) {
          selection.select('.y-cross').style('top', `${y00}px`).style('display', display);
        }
        const tooltip = selection.select('.tooltip');
        tooltip.style('display', display).call(result);
        if (display !== 'none') {
          const width = tooltip.node().clientWidth;
          const height = tooltip.node().clientHeight;
          let left = x0 + 10;
          let top = y0 - height - 10;
          if (this.width$ - left < width) {
            left = x0 - 10 - width;
          }
          left = left <= -60 ? -60 : left;
          top = top <= -20 ? -20 : top;
          tooltip.style('left', `${left}px`).style('top', `${top}px`);
        }
      }
    }
  };
  const hideTooltip = (target) => {
    if (this.tooltip) {
      const { cross } = this.tooltip;
      const zNode = element;
      if (!target || (target !== zNode && target.parentNode !== zNode)) {
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
  const selection = this.zoomSelection$;
  const element = selection
    .call(
      this.zoomer$
        .on('start', ({ transform, sourceEvent, ...restEvent }, [xTransform, yTransform]) => {
          if (this.destroyed || !this.rendered) return;
          const { type } = sourceEvent;
          // 移动端双击放大的时候，因为是模拟的双击，所以event实际传过来的是touchend的事件对象
          const touches = type === 'touchend' ? sourceEvent.changedTouches : sourceEvent.touches;
          if (type !== 'call' && (this.xCanZoom$ || this.yCanZoom$)) {
            let p = null;
            if (touches) {
              // 表示移动端触摸事件
              point = [];
              for (let i = 0, len = touches.length; i < len; i += 1) {
                const touch = touches.item(i);
                p = d3.pointer(touch, element);
                p = [p, [xTransform.invert(p), yTransform.invert(p)], touch.identifier];
                if (!point[0]) point[0] = p;
                else if (!point[1] && point[0][2] !== p[2]) point[1] = p;
              }
            } else {
              p = d3.pointer(sourceEvent, element);
              p = [p, [xTransform.invert(p), yTransform.invert(p)]];
              point = p;
            }
            transform0 = transform;
          }
          if (touches) {
            longPress = setTimeout(() => {
              showTooltip(d3.pointer(touches.item(0), element));
              longPress = 0;
            }, 500);
          }
          this.zoomstart$.call(null, {
            ...restEvent,
            sourceEvent,
            scaleAxis: getScaleAxis.call(this),
            transform: [transform, xTransform, yTransform],
          });
        })
        .on('zoom', ({ transform, sourceEvent, ...restEvent }, [xTransform, yTransform]) => {
          if (this.destroyed || !this.rendered) return;
          let [newXTransform, newYTransform] = [xTransform, yTransform];
          const { type, changedTouches: touches, transform: eventTransform } = sourceEvent;
          // 表示事用户主动触发，如滚轮和移动，触摸缩放
          if (type !== 'call') {
            if (this.xCanZoom$ || this.yCanZoom$) {
              const t = transform.k / transform0.k;
              let p = null;
              let lx = null;
              let ly = null;
              if (touches) {
                // 表示移动端触摸事件
                let np = null;
                let np1 = null;
                for (let i = 0, len = touches.length; i < len; i += 1) {
                  const touch = touches.item(i);
                  const pt = d3.pointer(touch, element);
                  if (point[0] && point[0][2] === touch.identifier) np = pt;
                  else if (point[1] && point[1][2] === touch.identifier) np1 = pt;
                }
                if (point[0]) {
                  p = np || point[0][0];
                  lx = this.xCanZoom$ && point[0][1][0];
                  ly = this.yCanZoom$ && point[0][1][1];
                  if (point[1]) {
                    const p1 = np1 || point[1][0];
                    const [lx1, ly1] = point[1][1];
                    p = [(p[0] + p1[0]) / 2, (p[1] + p1[1]) / 2];
                    lx = this.xCanZoom$ && [(lx[0] + lx1[0]) / 2, (lx[1] + lx1[1]) / 2];
                    ly = this.yCanZoom$ && [(ly[0] + ly1[0]) / 2, (ly[1] + ly1[1]) / 2];
                  }
                }
              } else {
                p = d3.pointer(sourceEvent, element);
                const changed = p[0] !== point[0][0] || p[1] !== point[0][1]; // zoom的时候点（鼠标）是否移动过
                const wheel = type === 'wheel'; // 是否是滚轮
                if (wheel && !changed) p = point[0];
                lx = this.xCanZoom$ && (wheel && changed ? xTransform.invert(p) : point[1][0]);
                ly = this.yCanZoom$ && (wheel && changed ? yTransform.invert(p) : point[1][1]);
              }
              if (p) {
                if (lx) {
                  newXTransform = this.transform$('x', xTransform, t, p, lx);
                }
                if (ly) {
                  newYTransform = this.transform$('y', yTransform, t, p, ly);
                }
              }
              transform0 = transform;
            }
          } else if (eventTransform) {
            // 如果存在xy缩放，则会有补间调用，万一补间一半，触发了滚轮或移动，则补间会停止，造成无法到达指定缩放位置，所以xy锁定的时候应该忽略补间
            // transform和eventTransform原本是一样的，但是动画补间的每一次调用时transform会变化，直到最后一次才会和eventTransform一样
            // eventTransform是不变的，是最终的指定的变换结果
            let xtf = transform;
            let ytf = transform;
            if (Array.isArray(eventTransform)) {
              xtf = eventTransform[1];
              ytf = eventTransform[2];
            } else {
              if (!this.xCanZoom$) xtf = eventTransform;
              if (!this.yCanZoom$) ytf = eventTransform;
            }
            if (sourceEvent.zoomX) {
              newXTransform = xtf;
            }
            if (sourceEvent.zoomY) {
              newYTransform = ytf;
            }
          }
          selection.datum([newXTransform, newYTransform]);
          const scaleAxis = getScaleAxis.call(this);
          Object.keys(scaleAxis).forEach((key) => {
            const { axis, scale } = scaleAxis[key];
            this.rootSelection$.select(`.${key}Axis`).call(axis);
            this.rootSelection$.select(`.${key}Label`).call(scaleLable, [this.scale[key], scale.domain()]);
          });
          if (touches) {
            if (longPress != 0) {
              clearTimeout(longPress);
              longPress = 0;
            }
            hideTooltip();
          }
          this.zooming$.call(null, {
            ...restEvent,
            sourceEvent,
            transform: [transform, newXTransform, newYTransform],
            scaleAxis,
          });
        })
        .on('end', ({ transform, sourceEvent, ...restEvent }, [xTransform, yTransform]) => {
          if (this.destroyed || !this.rendered) return;
          if (sourceEvent.type !== 'call' && (this.xCanZoom$ || this.yCanZoom$)) {
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
          this.zoomend$.call(null, {
            ...restEvent,
            sourceEvent,
            transform: [transform, xTransform, yTransform],
            scaleAxis: getScaleAxis.call(this),
          });
        })
    )
    .on('click', (e) => {
      if (this.destroyed) return;
      this.click$.call(null, {
        sourceEvent: e,
        target: selection,
        transform: [d3.zoomTransform(element), ...selection.datum()],
        scaleAxis: getScaleAxis.call(this),
        type: 'click',
      });
    })
    .on('dblclick', (e) => {
      if (this.destroyed) return;
      this.dblclick$.call(null, {
        sourceEvent: e,
        target: selection,
        transform: [d3.zoomTransform(element), ...selection.datum()],
        scaleAxis: getScaleAxis.call(this),
        type: 'dblclick',
      });
    })
    .on('contextmenu', (e) => {
      if (this.destroyed) return;
      this.contextmenu$.call(null, {
        sourceEvent: e,
        target: selection,
        transform: [d3.zoomTransform(element), ...selection.datum()],
        scaleAxis: getScaleAxis.call(this),
        type: 'contextmenu',
      });
      e.preventDefault();
    })
    .datum([d3.zoomIdentity, d3.zoomIdentity])
    .node();
  if (!(window.navigator.maxTouchPoints || 'ontouchstart' in window)) {
    selection
      .on('mouseout', (e) => {
        if (this.destroyed || !this.rendered) return;
        hideTooltip(e.relatedTarget);
      })
      .on('mousemove', (e) => {
        if (this.destroyed || !this.rendered) return;
        showTooltip(d3.pointer(e));
      });
  }
  if (!this.zoom.doubleZoom) {
    // 取消双击放大
    selection.on('dblclick.zoom', null);
  }
  if (this.zoom.x) {
    const xlock = this.rootSelection$.select('.xlock');
    xlock.on('click', () => {
      if (this.destroyed) return;
      this.setCanZoom('x', !this.xCanZoom$);
      this.canZoom$('x', this.xCanZoom$);
    });
  }
  if (this.zoom.y) {
    const ylock = this.rootSelection$.select('.ylock');
    ylock.on('click', () => {
      if (this.destroyed) return;
      this.setCanZoom('y', !this.yCanZoom$);
      this.canZoom$('y', this.yCanZoom$);
    });
  }
  if (this.zoom.x || this.zoom.y) {
    this.rootSelection$.select('.reset').on('click', () => {
      if (this.destroyed) return;
      this.reset();
      this.reset$();
    });
  }
  if (this.download) {
    this.rootSelection$.select('.download').on('click', () => {
      if (this.destroyed) return;
      if (this.download.action) {
        this.download.action(() => {
          this.downloadImage();
        }, this.rootSelection$);
      } else {
        this.downloadImage();
      }
    });
  }
  this.actions.forEach((a, i) => {
    if (!a) return;
    const { action, menus } = a;
    const am = this.rootSelection$.select(`.action-${i}-menu`);
    const at = this.rootSelection$.select(`.action-${i}`);
    at.on('click', (e) => {
      e.stopPropagation();
      if (e.currentTarget === at.node()) {
        if (this.destroyed) return;
        if (action) {
          action(this.rootSelection$, () => {});
        }
        const display = am.style('display');
        am.style('display', display === 'none' ? 'block' : 'none');
      }
    });
    if (Array.isArray(menus)) {
      menus.forEach((menu, j) => {
        if (!menu) return;
        this.rootSelection$.select(`.action-${i}-menu-${j}`).on('click', (e) => {
          e.stopPropagation();
          if (this.destroyed) return;
          if (menu.action) {
            menu.action(this.rootSelection$, () => {});
          }
          am.style('display', 'none');
        });
      });
    }
  });
  if (this.actions.length) {
    d3.select('body').on('click', () => {
      this.rootSelection$.selectAll('.action-menu').style('display', 'none');
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
      rWidth,
      rHeight,
      fontSize = 12,
      download,
      actions,
      tooltip,
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
    this.tooltip = !tooltip
      ? false
      : {
          cross: '',
          ...tooltip,
          compute: (...args) => {
            let result = {};
            if (typeof tooltip.compute === 'function') {
              result = tooltip.compute.call(this, result, ...args);
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
    this.actions = Array.isArray(actions) ? actions : [];
    this.fontSize = fontSize;
    this.data = data || {};
    this.dataDomains$ = {};
    this.zoomer$ = d3.zoom();
    this.xCanZoom$ = !!this.zoom.x;
    this.yCanZoom$ = !!this.zoom.y;
    createElement.call(this, container, { width, height, padding, rWidth, rHeight });
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

  reset(ta) {
    this.render(d3.zoomIdentity, 'xy', ta);
    return this;
  }

  render(tf, ax = 'xy', ta = true) {
    this.rendered = true;
    const transform = (Array.isArray(tf) ? tf[0] : tf) || d3.zoomTransform(this.zoomSelection$.node());
    // 对this.zoomSelection$调用this.zoomer$.transform函数变换到指定的transform
    // 变换过程中用240ms及ease函数进行transition
    (!ta ? this.zoomSelection$ : this.zoomSelection$.transition().duration(240).ease(d3.easeLinear)).call(
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

  getCanZoom() {
    return [this.xCanZoom$, this.yCanZoom$];
  }

  getTransform() {
    return [d3.zoomTransform(this.zoomSelection$.node()), ...this.zoomSelection$.datum()];
  }

  setCanZoom(ax = 'xy', canZoom = true) {
    let xCanZoom = canZoom;
    let yCanZoom = canZoom;
    if (Array.isArray(canZoom)) {
      [xCanZoom = true, yCanZoom = true] = canZoom;
    }
    if (ax.indexOf('x') !== -1) {
      this.xCanZoom$ = xCanZoom;
      this.rootSelection$
        .select('.xlock')
        .select('path')
        .attr('d', xCanZoom ? unlockPath : lockPath);
    }
    if (ax.indexOf('y') !== -1) {
      this.yCanZoom$ = yCanZoom;
      this.rootSelection$
        .select('.ylock')
        .select('path')
        .attr('d', yCanZoom ? unlockPath : lockPath);
    }
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

  runEvent(type, data = {}) {
    if (this.destroyed) return;
    const { sourceEvent, transform, scaleAxis, target } = data;
    this[`${type}$`].call(null, {
      type,
      sourceEvent: sourceEvent || null,
      target: target || this.zoomSelection$,
      transform: transform || [d3.zoomTransform(this.zoomSelection$.node()), ...this.zoomSelection$.datum()],
      scaleAxis: scaleAxis || getScaleAxis.call(this),
    });
  }

  getData() {
    return this.data;
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
    this.data = null;
    if (this.zoomer$) {
      this.zoomer$.on('start', null).on('zoom', null).on('end', null);
      this.zoomer$ = null;
    }
    if (this.zoomSelection$) {
      this.zoomSelection$
        .on('click', null)
        .on('dblclick', null)
        .on('contextmenu', null)
        .on('mouseout', null)
        .on('mousemove', null);
      this.rootSelection$.select('.xlock').on('click', null);
      this.rootSelection$.select('.ylock').on('click', null);
      this.rootSelection$.select('.reset').on('click', null);
      this.rootSelection$.remove();
      this.rootSelection$ = null;
    }

    if (this.actions && this.actions.length) {
      this.actions.forEach((a, i) => {
        if (!a) return;
        const { menus } = a;
        this.rootSelection$.select(`.action-${i}`).on('click', null);
        if (Array.isArray(menus)) {
          menus.forEach((menu, j) => {
            if (!menu) return;
            this.rootSelection$.select(`.action-${i}-menu-${j}`).on('click', null);
          });
        }
      });
      d3.select('body').on('click', null);
      this.actions = null;
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
