<!--
 * @Author: Huangjs
 * @Date: 2021-05-10 15:55:29
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-11-12 14:58:03
 * @Description: ******
-->
## d3-chart
基于d3库实现一些图表
目前只有热力图和曲线图
### 使用方法
```html
  <body>
    <div id="heatmap"></div>
    <div id="linegraph"></div>
  </body>
```
```javascript
import { format } from 'd3-format';
import { HeatMap, LineGraph } from '../src/index';
import './data';
import './index.less';

// data 查看data.js
const data = window.CHART_DATA;

const exponentFormat = format('.4~g');

const heatMap = new HeatMap({
  container: '#heatmap',
  padding: [20, 20, 36, 62],
  download: 'png',
  tooptip: { cross: 'xy' },
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
// 热力图双击事件
heatMap.setEvent('dblclick', (e, data) => {
  if (data) {
    const { x, y, z } = data;
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

// 对数据解析一下
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
```
