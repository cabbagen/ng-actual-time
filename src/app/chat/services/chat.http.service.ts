import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { domain } from '../../config';
import * as utils from '../../utils/utils';

@Injectable()
export class ChatHttpService {

  private authErrorMsg: string = '获取 鉴权信息 错误';

  private authInfo: { appkey: string, id: string } = null;

  constructor(private http: HttpClient) {
    this.authInfo = utils.getAuthInfo();
  }

  // 登录 application 获取用户信息
  public loginApplication() {
    if (!this.authInfo) {
      throw new Error(this.authErrorMsg);
    }

    return this.http.get(`${domain}/getContactInfo`, { headers: this.authInfo})
      .pipe(retry(3), catchError(this.handleError));
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
    if (!this.authInfo) {
      throw new Error(this.authErrorMsg);
    }
    
    return this.http.post(`${domain}/saveContactInfo`, contactInfo, { headers: this.authInfo })
      .pipe(catchError(this.handleError));
  }

  // 获取联系人信息
  public getContactInfos(searchInfo: { type: number, pageIndex: number, pageSize: number, search: string }) {
    if (!this.authInfo) {
      throw new Error(this.authErrorMsg);
    }

    return this.http.post(`${domain}/getContactInfos`, searchInfo, { headers: this.authInfo })
      .pipe(catchError(this.handleError));
  }

  // 获取群组信息
  public getGroupInfos(searchInfo: { pageIndex: number, pageSize: number, search: string }) {
    if (!this.authInfo) {
      throw new Error(this.authErrorMsg);
    }

    return this.http.post(`${domain}/getGroupInfos`, searchInfo, { headers: this.authInfo })
      .pipe(catchError(this.handleError));
  }

  // 添加好友
  public createContactFriend(contactId: string, friendId: string) {
    if (!this.authInfo) {
      throw new Error(this.authErrorMsg);
    }

    return this.http.post(`${domain}/createContactFriend`, { contactId, friendId }, { headers: this.authInfo })
      .pipe(catchError(this.handleError));
  }

  // 删除联系人好友
  public removeContactFriend(contactId: string, friendId: string) {
    if (!this.authInfo) {
      throw new Error(this.authErrorMsg);
    }

    return this.http.post(`${domain}/removeContactFriend`, { contactId, friendId }, { headers: this.authInfo })
      .pipe(catchError(this.handleError));
  }

  public contactJoinGroup(contactId: string, groupId: string) {
    if (!this.authInfo) {
      throw new Error(this.authErrorMsg);
    }

    return this.http.post(`${domain}/contactJoinGroup`, { contactId, groupId }, { headers: this.authInfo })
      .pipe(catchError(this.handleError));
  }
}
