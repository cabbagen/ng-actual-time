import { Component, OnInit, group } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ChatService } from './services/chat.service';
import { ContactsItem } from './interfaces/chat-contact.interface';
import { Channel } from './interfaces/chat-channel.interface';
import { ChatMessage, ChatFullMessage } from './interfaces/chat-message.interface';
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
      this.chatSocket = this.chatService.socketConnect();
      this.listenMessage('chat_private');
      this.updateCurrentContacts(this.currentTab);
      console.log('result:', result);
    });
  }

  private updateCurrentContacts(tabIndex: number): void {
    const { name, func } = this.tabIndexMap[tabIndex];
    this.currentContacts = this[func](this.selfInfo[name]) || [];
  }

  private adapteRecentContacts(recentContacts: any[]) {
    return recentContacts.map((contact) => {
      const adaptedContact: ContactsItem = {
        nickname: contact.last_target[0].nickname,
        id: contact.last_target[0]._id,
        avator: contact.last_target[0].avator,
        information: contact.last_message,
        unReadMessages: contact.total,
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

  private emitMessage(event: string, data: ChatMessage): void {
    this.chatSocket.emit(event, this.appkey, data);
  }

  private listenMessage(event: string): void {
    this.chatSocket.on(event, (data) => {
      const adaptedMessage = this.adapteMessage(data);
      const channelId: string = adaptedMessage.target.id;
      this.addChannelMessage(channelId, adaptedMessage);
    });
  }

  private adapteMessage(data: any): ChatFullMessage {
    const adaptedMessage: ChatFullMessage = {
      type: data.message_type,
      time: data.created_at,
      content: data.message_content,
      source: this.adapteFriends([data.message_source])[0],
      target: this.adapteFriends([data.message_target])[0],
    };
    return adaptedMessage;
  }

  private addChannelMessage(channelId: string, message: ChatFullMessage): void {
    if (typeof this.chatChannelCenter[channelId] !== 'undefined') {
      this.chatChannelCenter[channelId].push(message);
    } else {
      this.chatChannelCenter[channelId] = [message];      
    }
    this.currentMessages.push(message);
  }

  public changeChatTab(currentTab: number): void {
    this.currentTab = currentTab;
    this.updateCurrentContacts(currentTab);
  }

  public selectContact(contact: ContactsItem): void {
    this.currentContact = contact;
    this.currentMessages = this.chatChannelCenter[contact.id] || [];
  }

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
    };

    this.emitMessage('chat_private', msgItem);
  }
}
