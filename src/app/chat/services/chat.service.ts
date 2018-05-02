import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as querystring from 'querystring';
import { catchError, retry } from 'rxjs/operators';
import { domain } from '../../config';

declare const window;

@Injectable()
export class ChatService {

  private chatSocketURL = 'http://localhost:4000/chat';

  private chatSocket = null;

  constructor(private http: HttpClient) {
  }

  public loginApplication() {
    const { appKey, username } = this.getQuery();
    
    if (!appKey || !username) {
      throw new Error("获取 IM 用户信息 请求参数 错误");
    }

    return this.http.get(`${domain}/getContactInfo`, {
      params: { appKey, username },
    })
    .pipe(retry(3),catchError(this.handleError));
  }

  public getQuery() {
    return querystring.parse(window.location.search.slice(1));
  }

  public handleError(error: HttpErrorResponse) {
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
    this.chatSocket = window.io.connect(this.chatSocketURL);
    this.chatSocket.on('connect', function () {
      console.log('websocket connect successful');
    });

    return this.chatSocket;
  }

}
