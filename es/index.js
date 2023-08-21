/*
 * @Author: Huangjs
 * @Date: 2021-10-11 11:41:02
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-21 12:38:43
 * @Description: ******
 */

import BaseChart from './BaseChart';
import LineGraph from './LineGraph';
import HeatMap from './HeatMap';
import generateHeatMap from './HeatMap/generate';
const HeatMapLine = generateHeatMap('LineGraph');
export { BaseChart, HeatMap, HeatMapLine, LineGraph };