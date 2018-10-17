import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry, throttle } from 'rxjs/operators';
import { domain } from '../../config';
import * as utils from '../../utils/utils';

@Injectable()
export class ChatHttpService {

  private authErrorMsg: string = '获取 鉴权信息 错误';

  constructor(private http: HttpClient) {
  }

  // 登录 application 获取用户信息
  public loginApplication() {
    const { appkey, id } = utils.getAuthInfo();
    
    if (!appkey || !id) throw new Error(this.authErrorMsg);

    return this.http.get(`${domain}/getContactInfo?${utils.serialize({appkey, id})}`)
      .pipe(retry(3),catchError(this.handleError));
  }

  // 响应错误处理
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('An error occurred: ', error.error.message);
    } else {
      console.error( `Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return Observable.throw('Something bad happened; please try again later.');
  }

  // 保存用户编辑信息
  public saveContactInfo(contactInfo: { avator: string, nickname: string }) {
    const { appkey, id } = utils.getAuthInfo();

    if (!appkey || !id) {
      throw new Error(this.authErrorMsg);
    }
    
    const params =  Object.assign({}, contactInfo, { appkey, id });

    return this.http.post(`${domain}/saveContactInfo`, params)
      .pipe(retry(3), catchError(this.handleError));
  }

  // 获取联系人信息
  public getContactInfos(searchInfo: { type: string, pageIndex: number, pageSize: number, search: string }) {
    const { appkey } = utils.getAuthInfo();

    if (!appkey) {
      throw new Error(this.authErrorMsg);
    }

    const params = Object.assign({}, searchInfo, { appkey });

    return this.http.post(`${domain}/getContactInfos`, params)
      .pipe(retry(3), catchError(this.handleError));
  }
}
