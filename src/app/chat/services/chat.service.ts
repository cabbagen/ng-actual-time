import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { domain, chatSocketURL } from '../../config';
import { EventCenter, NoticeEventCenter } from './chat.event';
import * as utils from '../../utils/utils';

declare const window;

@Injectable()
export class ChatService {

  private chatSocket = null;

  constructor(private http: HttpClient) {
  }

  public loginApplication() {
    const { appkey, id } = utils.getQuery();
    
    if (!appkey || !id) throw new Error('获取 IM 用户信息 请求参数 错误');

    return this.http.get(`${domain}/getContactInfo?${utils.serialize({appkey, id})}`)
      .pipe(retry(3),catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('An error occurred: ', error.error.message);
    } else {
      console.error( `Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return Observable.throw('Something bad happened; please try again later.');
  }

  public socketConnect() {
    const { appkey, id } = utils.getQuery();
    this.chatSocket = window.io.connect(chatSocketURL);
    console.log('start connect websocket');
    this.chatSocket.on(EventCenter.im_connection, () => {
      console.log('websocket connect successful');
      this.chatSocket.emit(EventCenter.im_online, { appkey, id });
      this.chatSocket.on(EventCenter.im_notice, (data) => {
        this.listenChatNotice(data);
      });
      this.chatSocket.on(EventCenter.im_signal_chat, (data) => {
        console.log('signel data: ', data);
      })
    });

    return this.chatSocket;
  }

  public sendChatNotice(notice: any) {
    console.log('notice: ', notice);
    this.chatSocket.emit(EventCenter.im_notice, notice);
  }

  private listenChatNotice(notice: any) {
    console.log('notice type', notice.type)
    switch (notice.type) {
      case NoticeEventCenter.notice_join_room:
        this.joinChatRoom(notice);
      break;
      default:
        console.log(notice);
    }
  }

  private joinChatRoom(noticeInfo) {
    const { id } = utils.getQuery();
    console.log('接收通知：', noticeInfo);
    if (id === noticeInfo.data.id) {
      console.log('我收到了给我的通知');
      this.sendChatNotice(noticeInfo);
    }
  }
}
