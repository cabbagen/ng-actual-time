/**
 * 这里提供一些工具类函数
 */
import * as moment from 'moment';
import * as querystring from 'querystring';

export function getQuery() {
  return querystring.parse(window.location.search.slice(1));
}

export function formatTime(time: string): string {
  return moment(time).utc().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
}

export function serialize(object: any): string {
  let serializes: string[] = [];
  for (let prop in object) {
    serializes.push(`${prop}=${object[prop]}`);
  }
  return serializes.join('&');
}