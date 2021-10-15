/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-10-15 11:02:24
 * @Description: ******
 */

import { v4 as uuID } from 'uuid';
import { differenceWith, debounce, noop, delay } from 'lodash';

const measureSvgText = (text, fontSize) => {
  const svgXmlns = 'http://www.w3.org/2000/svg';
  const svgDom = document.createElementNS(svgXmlns, 'svg');
  const svgText = document.createElementNS(svgXmlns, 'text');
  svgText.style.fontSize = fontSize;
  svgText.appendChild(document.createTextNode(text));
  svgDom.appendChild(svgText);
  let width = svgText.getComputedTextLength();
  document.body.appendChild(svgDom);
  width = svgText.getComputedTextLength();
  document.body.removeChild(svgDom);
  return width;
};

// 查找给定值在数组中哪两个数据之间的索引值，数组已排序
const findNearIndex = (val, arr, single) => {
  let start = 0;
  let end = arr.length - 1;
  if (val < arr[start]) {
    return single ? start : [-1, start];
  }
  if (val > arr[end]) {
    return single ? end : [end, -1];
  }
  // 二分查找
  while (start <= end) {
    const middle = Math.ceil((end + start) / 2);
    if (val === arr[middle]) {
      return single ? middle : [middle, middle];
    }
    if (val < arr[middle]) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }
  if (single) {
    // 取最接近数值的索引
    return Math.abs(arr[end] - val) < Math.abs(arr[start] - val) ? end : start;
  }
  // 取夹在中间的两边数值的索引
  return [end, start];
};

const isNumber = (v) => typeof v === 'number' && !Number.isNaN(v);
const isCanEmit = ([x0, y0], [x1, y1]) => (x1 - x0) ** 2 + (y1 - y0) ** 2 > 3 ** 2;

export {
  measureSvgText,
  findNearIndex,
  isNumber,
  isCanEmit,
  uuID,
  differenceWith,
  debounce,
  noop,
  delay,
};
