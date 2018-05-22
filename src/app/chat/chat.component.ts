import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ChatService } from './services/chat.service';
import { ContactsItem } from './interfaces/chat-contact.interface';
import { ChatMessage } from './interfaces/chat-message.interface';
import * as utils from '../utils/utils';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private tabIndexMap: { [key: number]: string } = {
    0: 'recentContacts',
    1: 'friends',
    2: 'groups',
  };

  private chatSocket: any = null;

  private appkey: any = utils.getQuery().appkey;

  public selfInfo: any = {};

  public currentContacts: any[] = [];

  public currentTab: number = 0;

  public currentContact: ContactsItem = {
    id: '',
    avator: '',
    nickname: '',
    information: '',
  };

  constructor(private chatService: ChatService, private nzModalService: NzModalService) {
  }

  public ngOnInit() {
    this.chatService.loginApplication().subscribe((result) => {
      this.selfInfo = result.data;
      this.chatSocket = this.chatService.socketConnect();
      
      this.updateCurrentContacts(this.currentTab);
      console.log('result:', result);
    });
  }

  private updateCurrentContacts(tabIndex: number) {
    this.currentContacts = this.selfInfo[this.tabIndexMap[tabIndex]] || [];
  }

  private emitMessage(event: string, data: ChatMessage) {
    console.log('发送消息');
    this.chatSocket.emit(event, this.appkey, data);
  }

  private listenMessage(event: string) {
    console.log('监听消息');
    this.chatSocket.on(event, function(data) {
      console.log('接收到的数据', data);
    })
  }

  public changeChatTab(currentTab: number) {
    this.currentTab = currentTab;
    this.updateCurrentContacts(currentTab);
  }

  public selectContact(contact: ContactsItem) {
    this.currentContact = contact;
  }

  public sendMessage(message: string) {
    if (this.currentContact.id === '') {
      this.nzModalService.warning({ title: '警告提示', content: '请先选择聊天对象' });
      return;
    }

    const msgItem: ChatMessage = {
      type: 1,
      content: message,
      from: this.selfInfo._id,
      to: this.currentContact.id,
    };

    this.emitMessage('chat_private', msgItem);
  }
}
