/*
 * @Author: Huangjs
 * @Date: 2021-10-15 16:12:44
 * @LastEditors: Huangjs
 * @LastEditTime: 2022-06-23 11:23:57
 * @Description: ******
 */

import 'jest-canvas-mock';
import * as d3 from 'd3';
import { BaseChart, HeatMap, HeatMapLine, LineGraph, mixin } from './src/index';
import * as util from './src/util/index';
import data from './example/data';

const heatData = { x: [], y: [], z: [] };
data.forEach(({ time, step, value }, i) => {
  // @ts-ignore
  heatData.x[i] = +time;
  value.forEach((val, j) => {
    if (i === 0) {
      // @ts-ignore
      heatData.y[j] = step * j;
    }
    if (!heatData.z[j]) {
      // @ts-ignore
      heatData.z[j] = [];
    }
    // @ts-ignore
    heatData.z[j][i] = +val;
  });
});
const x0 = heatData.x[0];
const zz = heatData.z;
const yy = heatData.y;

// @ts-ignore
describe('util', () => {
  // @ts-ignore
  test('findNearIndex', () => {
    const arr = [1, 2, 5, 8, 10];
    // @ts-ignore
    expect(util.findNearIndex(3, arr)).toEqual([1, 2]);
    // @ts-ignore
    expect(util.findNearIndex(8, arr)).toEqual([3, 3]);
    // @ts-ignore
    expect(util.findNearIndex(4, arr, true)).toBe(2);
    // @ts-ignore
    expect(util.findNearIndex(6, arr, true)).toBe(2);
  });

  // @ts-ignore
  test('isNumber', () => {
    // @ts-ignore
    expect(util.isCanEmit([2, 4], [-3, 6], 6)).toBe(false);
    // @ts-ignore
    expect(util.isCanEmit([2, 4], [-3, 6])).toBe(true);
  });

  // @ts-ignore
  test('isCanEmit', () => {
    // @ts-ignore
    expect(util.isCanEmit([2, 4], [-3, 6], 6)).toBe(false);
    // @ts-ignore
    expect(util.isCanEmit([2, 4], [-3, 6])).toBe(true);
  });
});
// @ts-ignore
describe('mixin-inherit-replace', () => {
  // @ts-ignore
  test('replace', () => {
    // @ts-ignore
    expect(new HeatMap()).not.toBeInstanceOf(LineGraph);
    // @ts-ignore
    expect(new HeatMap()).toBeInstanceOf(BaseChart);
    // @ts-ignore
    expect(new LineGraph()).toBeInstanceOf(BaseChart);
    const revoke = mixin.replace(HeatMap, LineGraph);
    // @ts-ignore
    expect(new HeatMap()).toBeInstanceOf(LineGraph);
    // @ts-ignore
    expect(new LineGraph()).toBeInstanceOf(BaseChart);
    revoke();
    // @ts-ignore
    expect(new HeatMap()).not.toBeInstanceOf(LineGraph);
    // @ts-ignore
    expect(new HeatMap()).toBeInstanceOf(BaseChart);
    // @ts-ignore
    expect(new LineGraph()).toBeInstanceOf(BaseChart);
  });

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
  // @ts-ignore
  test('inherit', () => {
    const I = mixin.inherit(A, B, C);
    // @ts-ignore
    expect(I.c).toBe('c');
    // @ts-ignore
    expect(I.b).toBe('b');
    // @ts-ignore
    expect(I.a).toBe('a');
    // @ts-ignore
    expect(I.cf()).toBe('c');
    // @ts-ignore
    expect(I.bf()).toBe('b');
    // @ts-ignore
    expect(I.af()).toBe('a');
    const i = new I();
    // @ts-ignore
    expect(i.kk).toBe('ckk');
    // @ts-ignore
    expect(i.cc).toBe('cc');
    // @ts-ignore
    expect(i.bb).toBe('bb');
    // @ts-ignore
    expect(i.aa).toBe('aa');
    // @ts-ignore
    expect(i.cff()).toBe('cc,ckk');
    // @ts-ignore
    expect(i.bff()).toBe('bb,ckk');
    // @ts-ignore
    expect(i.aff()).toBe('aa,ckk');
    // @ts-ignore
    expect(i).toBeInstanceOf(A);
    // @ts-ignore
    expect(i).toBeInstanceOf(B);
    // @ts-ignore
    expect(i).toBeInstanceOf(C);
  });
  // @ts-ignore
  test('mixin', () => {
    const M = mixin.mixin(A, B, C);
    // @ts-ignore
    expect(M.c).toBe('c');
    // @ts-ignore
    expect(M.b).toBe('b');
    // @ts-ignore
    expect(M.a).toBe('a');
    // @ts-ignore
    expect(M.cf()).toBe('c');
    // @ts-ignore
    expect(M.bf()).toBe('b');
    // @ts-ignore
    expect(M.af()).toBe('a');
    const m = new M();
    // @ts-ignore
    expect(m.kk).toBe('ckk');
    // @ts-ignore
    expect(m.cc).toBe('cc');
    // @ts-ignore
    expect(m.bb).toBe('bb');
    // @ts-ignore
    expect(m.aa).toBe('aa');
    // @ts-ignore
    expect(m.cff()).toBe('cc,ckk');
    // @ts-ignore
    expect(m.bff()).toBe('bb,ckk');
    // @ts-ignore
    expect(m.aff()).toBe('aa,ckk');
    // @ts-ignore
    expect(m).not.toBeInstanceOf(A);
    // @ts-ignore
    expect(m).not.toBeInstanceOf(B);
    // @ts-ignore
    expect(m).not.toBeInstanceOf(C);
  });
});
// @ts-ignore
describe('HeatMap', () => {
  const heatMap = new HeatMap({
    width: 500,
    height: 300,
    padding: [20, 20, 36, 62],
    download: 'jpg',
    tooptip: { select: 'xy' },
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

  // @ts-ignore
  it('constructor', () => {
    // @ts-ignore
    expect(heatMap.download).toEqual({ ext: 'jpg' });
    // @ts-ignore
    expect(heatMap.data.heat.x).toEqual([]);
    // @ts-ignore
    expect(heatMap.tooptip.cross).toBe('xy');
    // @ts-ignore
    expect(heatMap.tooptip.select).toBe('xy');
    // @ts-ignore
    expect(heatMap.zoom.doubleZoom).toBe(false);
    // @ts-ignore
    expect(heatMap.scale.x.type).toBe('time');
    // @ts-ignore
    expect(heatMap.fontSize).toBe(12);
    // @ts-ignore
    expect(heatMap.width$).toBe(418);
    // @ts-ignore
    expect(heatMap.height$).toBe(244);
    // @ts-ignore
    expect(heatMap).toBeInstanceOf(HeatMap);
    // @ts-ignore
    expect(heatMap).toBeInstanceOf(BaseChart);
    // @ts-ignore
    expect(heatMap).not.toBeInstanceOf(LineGraph);
    // @ts-ignore
    expect(heatMap).not.toBeInstanceOf(HeatMapLine);
  });

  // @ts-ignore
  it('setData', () => {
    heatMap.setData({ heat: heatData }, true);
    // @ts-ignore
    expect(heatMap.data.heat.x[1]).toBe(+data[1].time);
  });

  // @ts-ignore
  it('setDomain', () => {
    heatMap.setDomain({
      x: [0, 1000],
      y: [100, 800],
      z: [1, ['#003ddf', '#00acc0', '#5afa00', '#ffff00', '#ffa500', '#ff0000'], [0, 0.2, 0.4, 0.6, 0.8, 1]],
    });
    // @ts-ignore
    expect(heatMap.scale.x.domain).toEqual([0, 1000]);
    // @ts-ignore
    expect(heatMap.scale.y.domain).toEqual([100, 800]);
    // @ts-ignore
    expect(heatMap.scale.z.domain).toEqual([
      1,
      ['#003ddf', '#00acc0', '#5afa00', '#ffff00', '#ffa500', '#ff0000'],
      [0, 0.2, 0.4, 0.6, 0.8, 1],
    ]);
  });

  // @ts-ignore
  it('render', () => {
    // @ts-ignore
    const clearEvent = jest.fn();
    heatMap.setEvent('zoomstart', clearEvent);
    heatMap.setEvent('zooming', clearEvent);
    heatMap.setEvent('zoomend', clearEvent);
    // 第三个参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    heatMap.render(d3.zoomIdentity.translate(100, -100).scale(2), 'xy', false);
    // @ts-ignore
    expect(clearEvent).toBeCalledTimes(3);
    // @ts-ignore
    expect(heatMap.zoomSelection$.datum()).toEqual([
      d3.zoomIdentity.translate(100, -100).scale(2),
      d3.zoomIdentity.translate(100, -100).scale(2),
    ]);
  });

  // @ts-ignore
  it('reset', () => {
    // @ts-ignore
    const clearEvent = jest.fn();
    heatMap.setEvent('zoomstart', clearEvent);
    heatMap.setEvent('zooming', clearEvent);
    heatMap.setEvent('zoomend', clearEvent);
    // 参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    heatMap.reset(false);
    // @ts-ignore
    expect(clearEvent).toBeCalledTimes(3);
    // @ts-ignore
    expect(heatMap.zoomSelection$.datum()).toEqual([d3.zoomIdentity, d3.zoomIdentity]);
  });

  // @ts-ignore
  it('destroy', () => {
    heatMap.destroy();
    // @ts-ignore
    expect(heatMap.debounceDrawend$).toBeNull();
    // @ts-ignore
    expect(heatMap.tempCanvas$).toEqual({});
    // @ts-ignore
    expect(heatMap.zScale$).toBeNull();
    // @ts-ignore
    expect(heatMap.destroyed).toBe(true);
    // @ts-ignore
    expect(heatMap.rendered).toBe(false);
    // @ts-ignore
    expect(heatMap.data).toEqual({});
    // @ts-ignore
    expect(heatMap.rootSelection$).toBeNull();
  });
});
// @ts-ignore
describe('LineGraph', () => {
  const lineGraph = new LineGraph({
    width: 500,
    height: 300,
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
        nice: true,
        ticks: 3,
      },
    },
  });
  // @ts-ignore
  it('constructor', () => {
    // @ts-ignore
    expect(lineGraph.download).toBe(false);
    // @ts-ignore
    expect(lineGraph.data.line).toEqual([]);
    // @ts-ignore
    expect(lineGraph.tooptip.cross).toBe('x');
    // @ts-ignore
    expect(lineGraph.zoom.doubleZoom).toBe(true);
    // @ts-ignore
    expect(lineGraph.scale.x.type).toBe('linear');
    // @ts-ignore
    expect(lineGraph.fontSize).toBe(12);
    // @ts-ignore
    expect(lineGraph.width$).toBe(426);
    // @ts-ignore
    expect(lineGraph.height$).toBe(240);
    // @ts-ignore
    expect(lineGraph).toBeInstanceOf(LineGraph);
    // @ts-ignore
    expect(lineGraph).toBeInstanceOf(BaseChart);
    // @ts-ignore
    expect(lineGraph).not.toBeInstanceOf(HeatMapLine);
    // @ts-ignore
    expect(lineGraph).not.toBeInstanceOf(HeatMap);
  });

  // @ts-ignore
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
    // @ts-ignore
    expect(lineGraph.data.line[0].data[2].y).toBe(+data[0].value[2]);
  });

  // @ts-ignore
  it('setSmooth', () => {
    lineGraph.setSmooth(0);
    // @ts-ignore
    expect(lineGraph.smooth).toBe(0);
  });

  // @ts-ignore
  it('render', () => {
    // @ts-ignore
    const clearEvent = jest.fn();
    lineGraph.setEvent('zoomstart', clearEvent);
    lineGraph.setEvent('zooming', clearEvent);
    lineGraph.setEvent('zoomend', clearEvent);
    // 第三个参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    lineGraph.render(d3.zoomIdentity.translate(-100, 100).scale(0.2), 'y', false);
    // @ts-ignore
    expect(clearEvent).toBeCalledTimes(3);
    // @ts-ignore
    expect(lineGraph.zoomSelection$.datum()).toEqual([
      d3.zoomIdentity,
      d3.zoomIdentity.translate(-100, 100).scale(0.2),
    ]);
  });

  // @ts-ignore
  it('reset', () => {
    // @ts-ignore
    const clearEvent = jest.fn();
    lineGraph.setEvent('zoomstart', clearEvent);
    lineGraph.setEvent('zooming', clearEvent);
    lineGraph.setEvent('zoomend', clearEvent);
    // 参数需要设置false，即没有transition，否则，因为延迟，这不会触发上面的事件
    lineGraph.reset(false);
    // @ts-ignore
    expect(clearEvent).toBeCalledTimes(3);
    // @ts-ignore
    expect(lineGraph.zoomSelection$.datum()).toEqual([d3.zoomIdentity, d3.zoomIdentity]);
  });

  // @ts-ignore
  it('destroy', () => {
    lineGraph.destroy();
    // @ts-ignore
    expect(lineGraph.line$).toBeNull();
    // @ts-ignore
    expect(lineGraph.filter$).toEqual([]);
    // @ts-ignore
    expect(lineGraph.destroyed).toBe(true);
    // @ts-ignore
    expect(lineGraph.rendered).toBe(false);
    // @ts-ignore
    expect(lineGraph.data).toEqual({});
    // @ts-ignore
    expect(lineGraph.rootSelection$).toBeNull();
  });
});
// @ts-ignore
describe('HeatMapLine', () => {
  const heatMap2 = new HeatMapLine({
    width: 500,
    height: 300,
    padding: [20, 20, 36, 62],
    download: 'jpg',
    tooptip: { select: 'xy' },
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
  // @ts-ignore
  it('constructor', () => {
    // @ts-ignore
    expect(heatMap2.data.heat.x).toEqual([]);
    // @ts-ignore
    expect(heatMap2.tooptip.cross).toBe('xy');
    // @ts-ignore
    expect(heatMap2.data.line).toEqual([]);
    // @ts-ignore
    expect(heatMap2).toBeInstanceOf(HeatMapLine);
    // @ts-ignore
    expect(heatMap2).toBeInstanceOf(LineGraph);
    // @ts-ignore
    expect(heatMap2).toBeInstanceOf(BaseChart);
    // @ts-ignore
    expect(heatMap2).not.toBeInstanceOf(HeatMap);
  });

  // @ts-ignore
  it('setSmooth', () => {
    // @ts-ignore
    heatMap2.setSmooth(0);
    // @ts-ignore
    expect(heatMap2.smooth).toBe(0);
  });

  // @ts-ignore
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
      true
    );
    // @ts-ignore
    expect(heatMap2.data.heat.x[1]).toBe(+data[1].time);
    // @ts-ignore
    expect(heatMap2.data.line[0].data[1].x).toBe(+data[1].time);
    // @ts-ignore
    expect(heatMap2.data.line[0].data[5].y).toBe(312);
  });

  // @ts-ignore
  it('destroy', () => {
    heatMap2.destroy();
    // @ts-ignore
    expect(heatMap2.debounceDrawend$).toBeNull();
    // @ts-ignore
    expect(heatMap2.tempCanvas$).toEqual({});
    // @ts-ignore
    expect(heatMap2.zScale$).toBeNull();
    // @ts-ignore
    expect(heatMap2.line$).toBeNull();
    // @ts-ignore
    expect(heatMap2.filter$).toEqual([]);
    // @ts-ignore
    expect(heatMap2.destroyed).toBe(true);
    // @ts-ignore
    expect(heatMap2.rendered).toBe(false);
    // @ts-ignore
    expect(heatMap2.data).toEqual({});
    // @ts-ignore
    expect(heatMap2.rootSelection$).toBeNull();
  });
});
