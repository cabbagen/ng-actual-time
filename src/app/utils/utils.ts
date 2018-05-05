/**
 * 这里提供一些工具类函数
 */

import * as querystring from 'querystring';

export function getQuery() {
  return querystring.parse(window.location.search.slice(1));
}
