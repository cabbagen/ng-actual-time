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
    const { appkey, id } = utils.getQuery();
    
    if (!appkey || !id) throw new Error("获取 IM 用户信息 请求参数 错误");

    return this.http.get(`${domain}/getContactInfo?${utils.serialize({appkey, id})}`)
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
    const { appkey, id } = utils.getQuery();
    this.chatSocket = window.io.connect(chatSocketURL);
    this.chatSocket.on('connect', () => {
      console.log('websocket connect successful');
      this.chatSocket.emit('on_line', appkey, id);
    });

    return this.chatSocket;
  }

  public createChatChannel(source: string, target: string) {
    const { appkey } = utils.getQuery();
    const params = { source, target, appkey };
    return this.http.post(`${domain}/createChatChannel`, params).pipe(retry(3),catchError(this.handleError));
  }

}
