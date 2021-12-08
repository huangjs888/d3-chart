/*
 * @Author: Huangjs
 * @Date: 2021-10-11 11:41:02
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-12-07 15:24:59
 * @Description: ******
 */

import BaseChart from './BaseChart';
import LineGraph from './LineGraph';
import HeatMap from './HeatMap';
import generateHeatMap from './HeatMap/generate';
import mixin from './util/mixin';

const HeatMapLine = generateHeatMap('LineGraph');

export { BaseChart, HeatMap, HeatMapLine, LineGraph, mixin };
