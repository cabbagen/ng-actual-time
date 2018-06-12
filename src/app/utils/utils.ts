/**
 * 这里提供一些工具类函数
 */
import * as moment from 'moment';
import * as querystring from 'querystring';

export function getQuery() {
  return querystring.parse(window.location.search.slice(1));
}

export function formatTime(time) {
  return moment(time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
}