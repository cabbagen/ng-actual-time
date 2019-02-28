import { Component, OnInit } from '@angular/core';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { ChatHttpService } from './services/chat.http.service';
import { ChatSocketService } from './services/chat.socket.service';
import { ContactsItem } from './interfaces/chat-contact.interface';
import { Channel } from './interfaces/chat-channel.interface';
import { ChatMessage, ChatFullMessage } from './interfaces/chat-message.interface';
import { EventCenter, NoticeEventCenter } from './services/chat.event';
import { IMNoticeForAddFriend, IMNoticeForAddGroup } from './interfaces/chat-notice.interface';
import * as utils from '../utils/utils';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // 处理当前聊天面板人员适配
  private tabIndexText: string[] = ['recentContacts', 'friends', 'groups'];

  // 应用 appkey
  private appkey: any = utils.getAuthInfo().appkey;

  // 当前 IM 用户信息
  public selfInfo: any = {};

  // 最近联系人列表
  private recentContacts: ContactsItem[] = [];

  // 好友列表
  private friends: ContactsItem[] = [];

  // 群组列表
  private groups: ContactsItem[] = [];

  // 当前联系人面板人员
  public currentContacts: ContactsItem[] = [];

  // 当前的联系人
  public currentContact: ContactsItem = {
    type: '',
    id: '',
    avator: '',
    nickname: '',
    information: '',
  };

  // 当前面板 tab
  public currentTab: number = 0;

  // IM 用户的聊天通道中心，这里保存了当前的全部聊天记录
  private chatChannelCenter: Channel = {};

  // 当前的消息队列
  public currentMessages: ChatFullMessage[] = [];

  constructor(
    private chatHttpService: ChatHttpService,
    private chatSocketService: ChatSocketService,
    private nzModalService: NzModalService,
    private nzNotificationService: NzNotificationService,
    private nzMessageService: NzMessageService,
  ) {}

  public ngOnInit() {
    this.chatHttpService.loginApplication().subscribe((result) => {
      this.initAppInfo(result);
      this.chatSocketService.socketConnect(this.registeChatSocketEventListener.bind(this));
      this.updateCurrentContacts(this.currentTab);
    });
  }

  private initAppInfo(response: any) {
    const { data } = response;

    this.selfInfo = data;
    this.recentContacts = this.adapteRecentContacts(data.recentContacts) || [];
    this.friends = this.adapteFriends(data.friends) || [];
    this.groups = this.adapteGroups(data.groups) || [];
  }

  private updateCurrentContacts(tabIndex: number): void {
    this.currentContacts = this[this.tabIndexText[tabIndex]];
  }

  private adapteRecentContacts(recentContacts: any[]): ContactsItem[] {
    const id: string = this.selfInfo._id || '';

    return recentContacts.map((contact) => {
      const isSelf: boolean = id === contact.last_source[0]._id;
      
      // 单聊的联系人
      if (contact.last_target.length > 0) {
        const otherContact: any = isSelf ? contact.last_target[0] : contact.last_source[0];

        const adaptedContact: ContactsItem = {
          type: '1',
          nickname: otherContact.nickname,
          id: otherContact._id,
          avator: otherContact.avator,
          information: contact.last_message,
          unReadMessages: isSelf ? 0 : contact.total,
          lastTime: utils.formatTime(contact.last_time),
        };

        return adaptedContact;
      }

      // 群聊的联系人
      const otherContact: any = isSelf ? contact.last_target_group[0] : contact.last_source[0];

      const adaptedContact: ContactsItem = {
        type: '2',
        nickname: otherContact.group_name,
        id: otherContact._id,
        avator: otherContact.group_avator,
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
        type: '1',
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
        type: '2',
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
      { eventName: EventCenter.im_single_chat, responseCallBack: this.handleSingleChat.bind(this) },
      { eventName: EventCenter.im_group_chat, responseCallBack: this.handleGroupChat.bind(this) },
      { eventName: EventCenter.im_notice, responseCallBack: this.handleNoticeDispatch.bind(this) },
    ];
    this.chatSocketService.registeEventListener(events);
  }

  // 处理创建聊天通道
  // 创建聊天通道之后，会将之前未读的聊天记录反馈回来
  private handleCreateChannel(result) {
    const adaptedData: ChatFullMessage[] = result.data.map(messageInfo => {
      return messageInfo.message_target ? this.adapteSingleMessage(messageInfo) : this.adapteGroupMessage(messageInfo);
    });

    if (typeof this.chatChannelCenter[result.channelId] !== 'undefined') {
      this.chatChannelCenter[result.channelId].unshift(...adaptedData);
    } else {
      this.chatChannelCenter[result.channelId] = adaptedData;
    }
    
    this.currentMessages = this.chatChannelCenter[result.channelId];
  }

  // 处理单聊接收消息
  private handleSingleChat(data) {
    // console.log('接收到消息：', data);
    const fullMessage: ChatFullMessage = this.adapteSingleMessage(data);

    // 更新消息中心
    if (typeof this.chatChannelCenter[data.message_channel] !== 'undefined') {
      this.chatChannelCenter[data.message_channel].push(fullMessage);
    } else {
      this.chatChannelCenter[data.message_channel] = [fullMessage];
    }

    // 如果正在聊天的对象不是当前的对象，需要 给出消息 提醒。
    // 创建 notification 提醒
    if (fullMessage.source.id !== this.selfInfo._id) {
      this.createNotification(`接收到来自${fullMessage.source.nickname}的消息`);
    } else {
      this.currentMessages = this.chatChannelCenter[data.message_channel];
    }
  }

  private createNotification(content: string): void {
    this.nzNotificationService.info('消息提醒', content);
  }

  private adapteSingleMessage(data: any): ChatFullMessage {
    const fullMessage: ChatFullMessage = {
      type: data.message_type,
      time: utils.formatTime(data.created_at),
      content: data.message_content,
      source: {
        type: '1',
        nickname: data.message_source.nickname,
        id: data.message_source._id,
        avator: data.message_source.avator,
        information: data.message_source.extra,
      },
      target: {
        type: '1',
        nickname: data.message_target.nickname,
        id: data.message_target._id,
        avator: data.message_target.avator,
        information: data.message_target.extra,
      },
    };
    return fullMessage;
  }

  private handleGroupChat(data) {
    console.log('接收到群聊消息：', data);
    const fullMessage: ChatFullMessage = this.adapteGroupMessage(data);

    // 更新消息中心
    if (typeof this.chatChannelCenter[data.message_channel] !== 'undefined') {
      this.chatChannelCenter[data.message_channel].push(fullMessage);
    } else {
      this.chatChannelCenter[data.message_channel] = [fullMessage];
    }

    // 如果正在聊天的对象不是当前的对象，需要 给出消息 提醒。
    // 创建 notification 提醒
    if (fullMessage.source.id !== this.selfInfo._id) {
      this.createNotification(`接收到来自群组${fullMessage.target.nickname}的消息`);
    } else {
      this.currentMessages = this.chatChannelCenter[data.message_channel];
    }
  }

  private adapteGroupMessage(data: any): ChatFullMessage {
    const fullMessage: ChatFullMessage = {
      type: data.message_type,
      time: utils.formatTime(data.created_at),
      content: data.message_content,
      source: {
        type: '1',
        nickname: data.message_source.nickname,
        id: data.message_source._id,
        avator: data.message_source.avator,
        information: data.message_source.extra,
      },
      target: {
        type: '1',
        nickname: data.message_target_group.group_name,
        id: data.message_target_group._id,
        avator: data.message_target_group.group_avator,
        information: data.message_target_group.group_introduce,
      },
    };
    return fullMessage;
  }

  // 处理通知消息
  private handleNoticeDispatch(data) {
    console.log('我接收到的通知反馈信息', data);

    // 不是自己的消息，不需要接收
    if (data.target_contact_id !== this.selfInfo._id) {
      return;
    }

    // 接收到的消息统一处理
    const dispatcher: { [key: string]: Function } = {
      [NoticeEventCenter.im_notice_add_friend]: this.handleAddFriendNotice.bind(this),
      [NoticeEventCenter.im_notice_add_group]: this.handleAddGroupNotice.bind(this),
    }

    dispatcher[data.notice_type](data);
  }

  private handleAddFriendNotice(data: IMNoticeForAddFriend) {
    var that = this;
    that.nzModalService.confirm({
      title: '添加好友提示',
      content: `${data.source_contact_nickname}请求添加您为好友`,
      showConfirmLoading: true,
      onCancel() {},
      onOk() {
        return new Promise((resolve) => {
          that.chatHttpService.createContactFriend(data.target_contact_id, data.source_contact_id).subscribe((result) => {
            if (result.state === 200) {
              that.nzMessageService.create('success', "已添加，请稍后刷新重试");
            } else {
              that.nzMessageService.create('warning', result.message);
            }
            resolve();
          });
        });
      }
    });
  }

  private handleAddGroupNotice(data: IMNoticeForAddGroup) {
    const that = this;
    that.nzModalService.confirm({
      title: '申请加群提示',
      content: `${data.source_contact_nickname}请求加入${data.target_group_name}`,
      showConfirmLoading: true,
      onCancel() {},
      onOk() {
        return new Promise((resolve) => {
          that.chatHttpService.contactJoinGroup(data.source_contact_id, data.target_group_id).subscribe((result) => {
            if (result.state === 200) {
              that.nzMessageService.create('success', "已添加，请稍后刷新重试");
            } else {
              that.nzMessageService.create('warning', result.message);
            }
            resolve()
          })
        });
      }
    });
  }

  public changeChatTab(currentTab: number): void {
    this.currentTab = currentTab;
    this.updateCurrentContacts(currentTab);
  }

  // 选择联系人
  // 创建聊天通道 - 切换当前聊天对象 - 加载对应的聊天记录
  public selectContact(contact: ContactsItem): void {
    // 当选择聊天人之后，取消未读消息提示
    if (contact.unReadMessages && contact.unReadMessages > 0) {
      contact.unReadMessages = 0;
    }

    this.currentContact = contact;

    const createChannelInfo: { [key: string]: string } = {
      sourceId: this.selfInfo._id,
      targetId: contact.id,
      appkey: this.appkey,
      channelType: contact.type,  // 1 => 单聊通道  2 => 群聊通道
    };

    this.chatSocketService.createIMChannel(createChannelInfo);
    this.updateCurrentMessages(createChannelInfo.channelType, createChannelInfo.sourceId, createChannelInfo.targetId);
  }

  // 当切换联系人的时候，加载之前的聊天记录
  private updateCurrentMessages(channelType: string, sourceId: string, targetId: string) {

    this.currentMessages = [];

    // 群聊
    if (channelType === '2') {
      this.currentMessages = this.chatChannelCenter[targetId];
      return;
    }

    // 单聊
    const channelIds: string[] = [`${sourceId}@@${targetId}`, `${targetId}@@${sourceId}`];

    for (const prop in this.chatChannelCenter) {
      if (channelIds.indexOf(prop) > -1) {
        this.currentMessages = this.chatChannelCenter[prop];
      }
    }
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

    const isSingleMessage = this.currentContact.type === '1';

    if (isSingleMessage) {
      this.chatSocketService.sendSingleMessage(msgItem);
      return;
    }

    this.chatSocketService.sendGroupMessage(msgItem);    
  }
}
