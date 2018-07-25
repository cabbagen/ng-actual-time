import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { domain, chatSocketURL } from '../../config';
import { ChatMessage } from '../interfaces/chat-message.interface';
import { EventRegiste } from '../interfaces/chat.event.interface';
import { EventCenter } from './chat.event';
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

  public socketConnect(callback: Function) {
    this.chatSocket = window.io.connect(chatSocketURL);
    this.chatSocket.on(EventCenter.im_connection, () => {
      console.log('websocket connect successful');
      this.IMLogin();
      callback();
    });

    return this.chatSocket;
  }

  // 注册监听事件
  registeEventListener(events: EventRegiste[]) {
    events.forEach((event) => {
      this.chatSocket.on(event.eventName, event.responseCallBack);
    });
  }

  // 用户登录
  private IMLogin() {
    const { appkey, id } = utils.getQuery();
    this.chatSocket.emit(EventCenter.im_online, { appkey, id });
  }

  // 当选择用户的时候，创建聊天通道
  public createIMChannel(channelInfo: { [key: string]: string }) {
    this.chatSocket.emit(EventCenter.im_create_channel, channelInfo);
  }

  // 单聊发送消息
  public sendSignalMessage(message: ChatMessage) {
    this.chatSocket.emit(EventCenter.im_signal_chat, message);
  }
}
