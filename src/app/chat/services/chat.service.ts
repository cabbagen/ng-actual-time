import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { domain, chatSocketURL } from '../../config';
import * as utils from '../../utils/utils';

declare const window;

@Injectable()
export class ChatService {

  private chatSocket = null;

  constructor(private http: HttpClient) {
  }

  public loginApplication() {
    const { appKey, username } = utils.getQuery();
    
    if (!appKey || !username) {
      throw new Error("获取 IM 用户信息 请求参数 错误");
    }

    return this.http.get(`${domain}/getContactInfo`, {
      params: { appKey, username },
    })
    .pipe(retry(3),catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('An error occurred: ', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + 
        `body was: ${error.error}`
      );
    }

    return Observable.throw(
      'Something bad happened; please try again later.'
    );
  }

  public socketConnect() {
    this.chatSocket = window.io.connect(chatSocketURL);
    this.chatSocket.on('connect', () => {
      console.log('websocket connect successful');
    });

    return this.chatSocket;
  }

}
