/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-11-17 14:32:11
 * @Description: ******
 */

import { format } from 'd3-format';
import { HeatMap, LineGraph } from '../src/index';
import './data';
import './index.less';

const data = window.CHART_DATA;

const exponentFormat = format('.4~g');

const heatMap = new HeatMap({
  container: '#heatmap',
  padding: [20, 62, 36, 62],
  download: 'png',
  colorBar: { show: true, width: 22, left: 12, right: 50 },
  tooptip: { cross: 'xy', select: 'x' },
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
  padding: [20, 12, 40, 62],
  smooth: 1,
  tooptip: { cross: 'x', onlyOneMerge: true },
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
      label: '距离',
      unit: 'm',
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
    lineGraph
      .setData({
        line: [
          {
            key: x,
            label: x,
            color: 'red',
            data:
              z.map((v, i) => ({
                y: v,
                x: y[i],
              })) || [],
          },
        ],
      })
      .render(e.transform[1], 'xy');
  }
});

const heatData = { x: [], y: [], z: [] };

data.forEach(({ time, step, value }, i) => {
  heatData.x[i] = +time;
  value.forEach((val, j) => {
    if (i === 0) {
      heatData.y[j] = step * j;
    }
    if (!heatData.z[j]) {
      heatData.z[j] = [];
    }
    heatData.z[j][i] = +val;
  });
});

heatMap.setData({ heat: heatData }, true);

const x0 = heatData.x[0];
const zz = heatData.z;
const yy = heatData.y;

lineGraph.setData(
  {
    line: [
      {
        key: x0,
        label: x0,
        color: 'red',
        data:
          zz.map((y, i) => ({
            x: yy[i],
            y: y[0],
          })) || [],
      },
    ],
  },
  true
);
