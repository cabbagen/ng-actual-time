import { Injectable } from '@angular/core';
import { chatSocketURL } from '../../config';
import { ChatMessage } from '../interfaces/chat-message.interface';
import { EventRegiste } from '../interfaces/chat.event.interface';
import { IMNoticeForAddFriend } from '../interfaces/chat-notice.interface';
import { EventCenter, NoticeEventCenter } from './chat.event';
import * as utils from '../../utils/utils';

declare const window;

@Injectable()
export class ChatSocketService {

  private chatSocket = null;

  constructor() {
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

  // 发送加好友通知
  public sendNoticeForAddFriend(message: IMNoticeForAddFriend) {
    this.chatSocket.emit(EventCenter.im_notice, message);
  }
}
