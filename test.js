// @ts-nocheck
/*
 * @Author: Huangjs
 * @Date: 2021-10-15 16:12:44
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 12:22:12
 * @Description: ******
 */

import 'jest-canvas-mock';
import * as d3 from 'd3';
import { BaseChart, HeatMap, HeatMapLine, LineGraph } from './src/index';
import * as util from './src/util/index';
import mixin from './src/util/mixin';
import data from './example/data';

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
const x0 = heatData.x[0];
const zz = heatData.z;
const yy = heatData.y;

describe('util', () => {
  test('findNearIndex', () => {
    const arr = [1, 2, 5, 8, 10];
    expect(util.findNearIndex(3, arr)).toEqual([1, 2]);
    expect(util.findNearIndex(8, arr)).toEqual([3, 3]);
    expect(util.findNearIndex(4, arr, true)).toBe(2);
    expect(util.findNearIndex(6, arr, true)).toBe(2);
  });

  test('isNumber', () => {
    expect(util.isCanEmit([2, 4], [-3, 6], 6)).toBe(false);
    expect(util.isCanEmit([2, 4], [-3, 6])).toBe(true);
  });

  test('isCanEmit', () => {
    expect(util.isCanEmit([2, 4], [-3, 6], 6)).toBe(false);
    expect(util.isCanEmit([2, 4], [-3, 6])).toBe(true);
  });
});
describe('mixin-inherit', () => {
  class A {
    constructor() {
      this.aa = 'aa';
      this.kk = 'akk';
    }

    static a = 'a';

    static af() {
      return A.a;
    }

    aff() {
      return `${this.aa},${this.kk}`;
    }
  }
  class B {
    constructor() {
      this.bb = 'bb';
      this.kk = 'bkk';
    }
    static b = 'b';

    static bf() {
      return B.b;
    }

    bff() {
      return `${this.bb},${this.kk}`;
    }
  }
  class C {
    constructor() {
      this.cc = 'cc';
      this.kk = 'ckk';
    }
    static c = 'c';

    static cf() {
      return C.c;
    }

    cff() {
      return `${this.cc},${this.kk}`;
    }
  }
  test('inherit', () => {
    const I = mixin.inherit(A, B, C);
    expect(I.c).toBe('c');
    expect(I.b).toBe('b');
    expect(I.a).toBe('a');
    expect(I.cf()).toBe('c');
    expect(I.bf()).toBe('b');
    expect(I.af()).toBe('a');
    const i = new I();
    expect(i.kk).toBe('ckk');
    expect(i.cc).toBe('cc');
    expect(i.bb).toBe('bb');
    expect(i.aa).toBe('aa');
    expect(i.cff()).toBe('cc,ckk');
    expect(i.bff()).toBe('bb,ckk');
    expect(i.aff()).toBe('aa,ckk');
    expect(i).toBeInstanceOf(A);
    expect(i).toBeInstanceOf(B);
    expect(i).toBeInstanceOf(C);
  });
  test('mixin', () => {
    const M = mixin.mixin(A, B, C);
    expect(M.c).toBe('c');
    expect(M.b).toBe('b');
    expect(M.a).toBe('a');
    expect(M.cf()).toBe('c');
    expect(M.bf()).toBe('b');
    expect(M.af()).toBe('a');
    const m = new M();
    expect(m.kk).toBe('ckk');
    expect(m.cc).toBe('cc');
    expect(m.bb).toBe('bb');
    expect(m.aa).toBe('aa');
    expect(m.cff()).toBe('cc,ckk');
    expect(m.bff()).toBe('bb,ckk');
    expect(m.aff()).toBe('aa,ckk');
    expect(m).not.toBeInstanceOf(A);
    expect(m).not.toBeInstanceOf(B);
    expect(m).not.toBeInstanceOf(C);
  });
});
describe('HeatMap', () => {
  const heatMap = new HeatMap({
    width: 500,
    height: 300,
    padding: [20, 20, 36, 62],
    download: 'jpg',
    tooltip: { select: 'xy' },
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
        ticks: 10,
        unit: '',
      },
      y: {
        type: 'linear',
        label: '距离',
        unit: 'm',
      },
    },
  });

  it('constructor', () => {
    expect(heatMap.download).toEqual({ ext: 'jpg' });
    expect(heatMap.data.heat.x).toEqual([]);
    expect(heatMap.tooltip.cross).toBe('xy');
    expect(heatMap.tooltip.select).toBe('xy');
    expect(heatMap.zoom.doubleZoom).toBe(false);
    expect(heatMap.scale.x.type).toBe('time');
    expect(heatMap.fontSize).toBe(12);
    expect(heatMap.width$).toBe(418);
    expect(heatMap.height$).toBe(244);
    expect(heatMap).toBeInstanceOf(HeatMap);
    expect(heatMap).toBeInstanceOf(BaseChart);
    expect(heatMap).not.toBeInstanceOf(LineGraph);
    expect(heatMap).not.toBeInstanceOf(HeatMapLine);
  });

  it('setData', () => {
    heatMap.setData({ heat: heatData }, true);
    expect(heatMap.data.heat.x[1]).toBe(+data[1].time);
  });

  it('setDomain', () => {
    heatMap.setDomain({
      x: [0, 1000],
      y: [100, 800],
      z: [
        1,
        ['#003ddf', '#00acc0', '#5afa00', '#ffff00', '#ffa500', '#ff0000'],
        [0, 0.2, 0.4, 0.6, 0.8, 1],
      ],
    });
    expect(heatMap.scale.x.domain).toEqual([0, 1000]);
    expect(heatMap.scale.y.domain).toEqual([100, 800]);
    expect(heatMap.scale.z.domain).toEqual([
      1,
      ['#003ddf', '#00acc0', '#5afa00', '#ffff00', '#ffa500', '#ff0000'],
      [0, 0.2, 0.4, 0.6, 0.8, 1],
    ]);
  });

  it('render', () => {
    const clearEvent = jest.fn();
    heatMap.setEvent('zoomstart', clearEvent);
    heatMap.setEvent('zooming', clearEvent);
    heatMap.setEvent('zoomend', clearEvent);
    // 第三个参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    heatMap.render(d3.zoomIdentity.translate(100, -100).scale(2), 'xy', false);
    expect(clearEvent).toBeCalledTimes(3);
    expect(heatMap.zoomSelection$.datum()).toEqual([
      d3.zoomIdentity.translate(100, -100).scale(2),
      d3.zoomIdentity.translate(100, -100).scale(2),
    ]);
  });

  it('reset', () => {
    const clearEvent = jest.fn();
    heatMap.setEvent('zoomstart', clearEvent);
    heatMap.setEvent('zooming', clearEvent);
    heatMap.setEvent('zoomend', clearEvent);
    // 参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    heatMap.reset(false);
    expect(clearEvent).toBeCalledTimes(3);
    expect(heatMap.zoomSelection$.datum()).toEqual([d3.zoomIdentity, d3.zoomIdentity]);
  });

  it('destroy', () => {
    heatMap.destroy();
    expect(heatMap.debounceDrawend$).toBeNull();
    expect(heatMap.tempCanvas$).toBeNull();
    expect(heatMap.zScale$).toBeNull();
    expect(heatMap.destroyed).toBe(true);
    expect(heatMap.rendered).toBe(false);
    expect(heatMap.data).toBeNull();
    expect(heatMap.rootSelection$).toBeNull();
  });
});
describe('LineGraph', () => {
  const lineGraph = new LineGraph({
    width: 500,
    height: 300,
    padding: [20, 12, 40, 62],
    smooth: 1,
    tooltip: { cross: 'x', onlyOneMerge: true },
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
        nice: true,
        ticks: 3,
      },
    },
  });
  it('constructor', () => {
    expect(lineGraph.download).toBe(false);
    expect(lineGraph.data.line).toEqual([]);
    expect(lineGraph.tooltip.cross).toBe('x');
    expect(lineGraph.zoom.doubleZoom).toBe(true);
    expect(lineGraph.scale.x.type).toBe('linear');
    expect(lineGraph.fontSize).toBe(12);
    expect(lineGraph.width$).toBe(426);
    expect(lineGraph.height$).toBe(240);
    expect(lineGraph).toBeInstanceOf(LineGraph);
    expect(lineGraph).toBeInstanceOf(BaseChart);
    expect(lineGraph).not.toBeInstanceOf(HeatMapLine);
    expect(lineGraph).not.toBeInstanceOf(HeatMap);
  });

  it('setData', () => {
    lineGraph.setData({
      line: [
        {
          key: x0,
          label: x0,
          color: '#FFB676',
          data:
            zz.map((y, i) => ({
              x: yy[i],
              y: y[0],
            })) || [],
        },
      ],
    });
    expect(lineGraph.data.line[0].data[2].y).toBe(+data[0].value[2]);
  });

  it('setSmooth', () => {
    lineGraph.setSmooth(0);
    expect(lineGraph.smooth).toBe(0);
  });

  it('render', () => {
    const clearEvent = jest.fn();
    lineGraph.setEvent('zoomstart', clearEvent);
    lineGraph.setEvent('zooming', clearEvent);
    lineGraph.setEvent('zoomend', clearEvent);
    // 第三个参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    lineGraph.render(d3.zoomIdentity.translate(-100, 100).scale(0.2), 'y', false);
    expect(clearEvent).toBeCalledTimes(3);
    expect(lineGraph.zoomSelection$.datum()).toEqual([
      d3.zoomIdentity,
      d3.zoomIdentity.translate(-100, 100).scale(0.2),
    ]);
  });

  it('reset', () => {
    const clearEvent = jest.fn();
    lineGraph.setEvent('zoomstart', clearEvent);
    lineGraph.setEvent('zooming', clearEvent);
    lineGraph.setEvent('zoomend', clearEvent);
    // 参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    lineGraph.reset(false);
    expect(clearEvent).toBeCalledTimes(3);
    expect(lineGraph.zoomSelection$.datum()).toEqual([d3.zoomIdentity, d3.zoomIdentity]);
  });

  it('destroy', () => {
    lineGraph.destroy();
    expect(lineGraph.line$).toBeNull();
    expect(lineGraph.filter$).toBeNull();
    expect(lineGraph.destroyed).toBe(true);
    expect(lineGraph.rendered).toBe(false);
    expect(lineGraph.data).toBeNull();
    expect(lineGraph.rootSelection$).toBeNull();
  });
});
describe('HeatMapLine', () => {
  const heatMap2 = new HeatMapLine({
    width: 500,
    height: 300,
    padding: [20, 20, 36, 62],
    download: 'jpg',
    tooltip: { select: 'xy' },
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
        ticks: 10,
        unit: '',
      },
      y: {
        type: 'linear',
        label: '距离',
        unit: 'm',
      },
    },
  });
  it('constructor', () => {
    expect(heatMap2.data.heat.x).toEqual([]);
    expect(heatMap2.tooltip.cross).toBe('xy');
    expect(heatMap2.data.line).toEqual([]);
    expect(heatMap2).toBeInstanceOf(HeatMapLine);
    expect(heatMap2).toBeInstanceOf(LineGraph);
    expect(heatMap2).toBeInstanceOf(BaseChart);
    expect(heatMap2).not.toBeInstanceOf(HeatMap);
  });

  it('setSmooth', () => {
    heatMap2.setSmooth(0);
    expect(heatMap2.smooth).toBe(0);
  });

  it('setData', () => {
    heatMap2.setData(
      {
        heat: heatData,
        line: [
          {
            key: x0,
            label: x0,
            color: '#FFB676',
            data:
              heatData.x.map((x, i) => ({
                x: x,
                y: i === 5 ? 312 : Math.floor(Math.random() * 10000),
              })) || [],
          },
        ],
      },
      true,
    );
    expect(heatMap2.data.heat.x[1]).toBe(+data[1].time);
    expect(heatMap2.data.line[0].data[1].x).toBe(+data[1].time);
    expect(heatMap2.data.line[0].data[5].y).toBe(312);
  });

  it('destroy', () => {
    heatMap2.destroy();
    expect(heatMap2.debounceDrawend$).toBeNull();
    expect(heatMap2.tempCanvas$).toBeNull();
    expect(heatMap2.zScale$).toBeNull();
    expect(heatMap2.line$).toBeNull();
    expect(heatMap2.filter$).toBeNull();
    expect(heatMap2.destroyed).toBe(true);
    expect(heatMap2.rendered).toBe(false);
    expect(heatMap2.data).toBeNull();
    expect(heatMap2.rootSelection$).toBeNull();
  });
});
