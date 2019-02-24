import { Injectable } from '@angular/core';
import { chatSocketURL } from '../../config';
import { ChatMessage } from '../interfaces/chat-message.interface';
import { EventRegiste } from '../interfaces/chat.event.interface';
import { IMNoticeForAddFriend, IMNoticeForAddGroup } from '../interfaces/chat-notice.interface';
import { EventCenter } from './chat.event';
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
  public sendSingleMessage(message: ChatMessage) {
    this.chatSocket.emit(EventCenter.im_single_chat, message);
  }

  // 群聊发送消息
  public sendGroupMessage(message: ChatMessage) {
    console.log('send group message: ', message);
    this.chatSocket.emit(EventCenter.im_group_chat, message);
  }

  // 发送加好友通知
  public sendNoticeForAddFriend(message: IMNoticeForAddFriend) {
    this.chatSocket.emit(EventCenter.im_notice, message);
  }

  // 发送加群通知
  public sendNoticeForAddGroup(message: IMNoticeForAddGroup) {
    this.chatSocket.emit(EventCenter.im_notice, message);
  }
}
