/*
 * @Author: Huangjs
 * @Date: 2021-03-17 16:23:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2021-12-07 15:06:39
 * @Description: ******
 */

import differenceWith from 'lodash/differenceWith';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import delay from 'lodash/delay';
import uniqueId from 'lodash/uniqueId';

const measureSvgText = (text, fontSize) => {
  const svgXmlns = 'http://www.w3.org/2000/svg';
  const svgDom = document.createElementNS(svgXmlns, 'svg');
  const svgText = document.createElementNS(svgXmlns, 'text');
  svgText.style.fontSize = fontSize;
  svgText.appendChild(document.createTextNode(text));
  svgDom.appendChild(svgText);
  document.body.appendChild(svgDom);
  const width = !svgDom.getBBox ? svgDom.clientWidth : svgDom.getBBox().width;
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
const isCanEmit = ([x0, y0], [x1, y1], l = 3) => (x1 - x0) ** 2 + (y1 - y0) ** 2 > l ** 2;
const guid = (prefix) => {
  let n = new Date().getTime().toString(32);
  for (let i = 0; i < 5; i += 1) {
    n += Math.floor(Math.random() * 65535).toString(32);
  }
  // @ts-ignore
  n += uniqueId(prefix).toString(32);
  return prefix ? `${prefix}-${n}` : n;
};

export { measureSvgText, findNearIndex, isNumber, isCanEmit, guid, differenceWith, debounce, noop, delay };
