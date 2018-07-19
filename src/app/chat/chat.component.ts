import { Component, OnInit, group } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ChatService } from './services/chat.service';
import { ContactsItem } from './interfaces/chat-contact.interface';
import { Channel } from './interfaces/chat-channel.interface';
import { ChatMessage, ChatFullMessage } from './interfaces/chat-message.interface';
import { NoticeEventCenter, EventCenter } from './services/chat.event';
import * as utils from '../utils/utils';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private tabIndexMap: { [key: number]: { name: string, func: string } } = {
    0: { name: 'recentContacts', func: 'adapteRecentContacts' },
    1: { name: 'friends', func: 'adapteFriends' },
    2: { name: 'groups', func: 'adapteGroups' },
  };

  private chatSocket: any = null;

  private appkey: any = utils.getQuery().appkey;

  public selfInfo: any = {};

  public currentContacts: ContactsItem[] = [];

  public currentTab: number = 0;

  public currentContact: ContactsItem = {
    id: '',
    avator: '',
    nickname: '',
    information: '',
  };

  public currentMessages: ChatFullMessage[] = [];

  private chatChannelCenter: Channel = {};

  constructor(private chatService: ChatService, private nzModalService: NzModalService) {
  }

  public ngOnInit() {
    this.chatService.loginApplication().subscribe((result) => {
      this.selfInfo = result.data;
      this.chatSocket = this.chatService.socketConnect(this.registeChatSocketEventListener.bind(this));
      this.updateCurrentContacts(this.currentTab);
    });
  }

  private updateCurrentContacts(tabIndex: number): void {
    const { name, func } = this.tabIndexMap[tabIndex];
    this.currentContacts = this[func](this.selfInfo[name]) || [];
  }

  private adapteRecentContacts(recentContacts: any[]) {
    const id: string = this.selfInfo._id || '';

    return recentContacts.map((contact) => {
      const isSelf: boolean = id === contact.last_source[0]._id;
      const otherContact: any = isSelf ? contact.last_target[0] : contact.last_source[0];

      const adaptedContact: ContactsItem = {
        nickname: otherContact.nickname,
        id: otherContact._id,
        avator: otherContact.avator,
        information: contact.last_message,
        unReadMessages: isSelf ? 0 : contact.total,
        lastTime: utils.formatTime(contact.last_time),
      };

      return adaptedContact;
    });
  }

  private adapteFriends(friends: any[]): ContactsItem[] {
    return friends.map((friend) => {
      const adaptedFriend: ContactsItem = {
        nickname: friend.nickname,
        id: friend._id,
        avator: friend.avator,
        information: friend.extra,
      };
      return adaptedFriend;
    });
  }

  private adapteGroups(groups: any[]): ContactsItem[] {
    return groups.map((group) => {
      const adaptedGroup: ContactsItem = {
        nickname: group.group_name,
        id: group._id,
        avator: group.group_avator,
        information: group.group_introduce,
      };
      return adaptedGroup;
    });
  }

  private registeChatSocketEventListener() {
    const events = [
      { eventName: EventCenter.im_create_channel, responseCallBack: this.handleCreateChannel.bind(this) },
      { eventName: EventCenter.im_signal_chat, responseCallBack: this.handleSignalChat.bind(this) },
      { eventName: EventCenter.im_notice, responseCallBack: this.handleNotice.bind(this) },
    ];
    this.chatService.registeEventListener(events);
  }

  // 处理创建聊天通道
  private handleCreateChannel(data) {
    // ... 这里不需要处理
    console.log('创建通道响应: ', data);
  }

  // 处理单聊接收消息
  private handleSignalChat(data) {
    // ... 
    console.log('接收到消息：', data);
  }

  // 处理通知消息
  private handleNotice() {
    // ... 暂时搁置
  }

  public changeChatTab(currentTab: number): void {
    this.currentTab = currentTab;
    this.updateCurrentContacts(currentTab);
  }

  // 选择联系人，创建聊天通道
  public selectContact(contact: ContactsItem): void {
    const createChannelInfo: { [key: string]: string } = {
      sourceId: this.selfInfo._id,
      targetId: contact.id,
      appkey: this.appkey,
      channelType: this.currentTab.toString(),
    };

    this.currentContact = contact;
    this.currentMessages = this.chatChannelCenter[contact.id] || [];
    this.chatService.createIMChannel(createChannelInfo);
  }

  // 发送 IM 消息
  public sendMessage(message: string): void {
    if (this.currentContact.id === '') {
      this.nzModalService.warning({ title: '警告提示', content: '请先选择聊天对象' });
      return;
    }

    const msgItem: ChatMessage = {
      type: 1,
      content: message,
      source: this.selfInfo._id,
      target: this.currentContact.id,
      appkey: this.appkey,
    };

    this.chatService.sendSignalMessage(msgItem);
  }
}
