/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-02-15 11:19:25
 * @Description: ******
 */

import { format } from 'd3-format';
import { HeatMap, LineGraph } from '../lib/index';
import './data';
import './index.less';

// @ts-ignore
const data = window.CHART_DATA;

const exponentFormat = format('.4~g');

const heatMap = new HeatMap({
  container: '#heatmap',
  padding: [20, 62, 36, 62],
  download: 'png',
  legend: { show: true, width: 22, left: 12, right: 50 },
  tooltip: { cross: 'xy', select: 'x' },
  zoom: {
    x: {
      domain: 'x',
      translate: [-Infinity, Infinity],
      precision: [1000, 366 * 24 * 60 * 60 * 1000],
    },
    y: {
      domain: 'y',
      translate: [-5000, 35000],
      precision: [30, 40000],
    },
    doubleZoom: false,
  },
  scale: {
    x: {
      type: 'time',
      label: '时间',
      unit: '',
      ticks: 10,
    },
    y: {
      type: 'linear',
      label: '距离',
      // showRange: false,
      unit: 'm',
    },
    y2: {
      type: 'linear',
      domain: [0, 0.6],
      format: (v) => Math.round(v * 10000) / 10000,
      label: '厚度',
      unit: 'mm',
    },
    z: {
      label: '值',
      subLabel: 'CO2',
      domain: [1, ['#003ddf', '#00acc0', '#5afa00', '#ffff00', '#ffa500', '#ff0000'], [0, 0.2, 0.4, 0.6, 0.8, 1]],
      unit: '',
      format: exponentFormat,
    },
  },
});

const lineGraph = new LineGraph({
  container: '#linegraph',
  padding: [40, 60],
  smooth: 1,
  download: 'png',
  tooltip: { cross: 'x', onlyOneMerge: false },
  zoom: {
    x: {
      domain: 'x',
    },
    y: {
      domain: 'y',
    },
    doubleZoom: true,
  },
  scale: {
    x: {
      type: 'linear',
      label: '臭氧浓度',
      unit: 'ug/m³',
    },
    y: {
      type: 'linear',
      label: '值',
      unit: '',
      nice: true,
      ticks: 5,
      format: exponentFormat,
    },
  },
});
let count = 1;
heatMap.setEvent('dblclick', (e, data) => {
  count++;
  heatMap.setDomain({
    z: [
      1,
      ['#003ddf', '#00acc0', '#5afa00', '#ffff00', '#ffa500', '#ff0000'],
      [0 * count, 0.2 * count, 0.4 * count, 0.6 * count, 0.8 * count, 1 * count],
    ],
  });
  if (data.xSelect) {
    const { x, y, z } = data.xSelect;
    const d1 = [];
    const d2 = [];
    // 因为z数组中可能存在empty元素，所以不能使用map或forEach
    for (let i = 0; i < z.length; i += 1) {
      d1.push({
        y: z[i] || 0,
        x: y[i],
      });
      d2.push({
        y: (z[i] || 0) + 1,
        x: y[i],
      });
    }
    lineGraph
      .setData({
        line: [
          {
            key: x,
            label: x,
            color: 'red',
            data: d1,
          },
          {
            key: x + 'o',
            label: x,
            color: 'green',
            data: d2,
          },
        ],
      })
      .render(e.transform[1], 'xy');
  }
});

const heatData = { x: [], y: [], z: [] };

data.forEach(({ time, step, value }, i) => {
  // @ts-ignore
  heatData.x[i] = +time;
  // 加入x轴竖向无效记录（不渲染）1606700294000-1606700323000毫秒内
  if (+time > 1606700294000 && +time < 1606700323000) {
    // 大概是两条数据
    // @ts-ignore
    if (!heatData.x.invalid) {
      // @ts-ignore
      heatData.x.invalid = [];
    }
    // @ts-ignore
    heatData.x.invalid.push(i);
  } else {
    value.forEach((val, j) => {
      if (heatData.y.length < value.length) {
        // @ts-ignore
        heatData.y[j] = step * j;
        // 加入y轴横向无效记录（不渲染）1500-3000米内
        if (step * j > 1500 && step * j < 3000) {
          // @ts-ignore
          if (!heatData.y.invalid) {
            // @ts-ignore
            heatData.y.invalid = [];
          }
          // @ts-ignore
          heatData.y.invalid.push(j);
        }
      }
      if (step * j <= 1500 || step * j >= 3000) {
        if (!heatData.z[j]) {
          // @ts-ignore
          heatData.z[j] = [];
        }
        // @ts-ignore
        heatData.z[j][i] = +val;
      }
    });
  }
});

heatMap.setData({ heat: heatData }, true);

const x0 = heatData.x[0];
const zz = heatData.z;
const yy = heatData.y;
// 因为z数组中可能存在empty元素，所以不能使用map或forEach
const d = [];
for (let i = 0; i < zz.length; i += 1) {
  d.push({
    y: (zz[i] || [])[0] || 0,
    x: yy[i],
  });
}
lineGraph.setData(
  {
    line: [
      {
        key: x0,
        label: x0,
        color: 'red',
        data: d,
      },
    ],
  },
  true
);
