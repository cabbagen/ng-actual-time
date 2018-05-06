import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ChatService } from './services/chat.service';
import { ContactsItem } from './interfaces/chat-contact.interface';

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

  private chatSocket = null;

  public selfInfo = {};

  public currentContacts = [];

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
      this.updateCurrentContacts(this.currentTab);
    });
    
    this.chatSocket = this.chatService.socketConnect();
  }

  private updateCurrentContacts(tabIndex: number) {
    this.currentContacts = this.selfInfo[this.tabIndexMap[tabIndex]] || [];
  }

  private emitMessage() {
    console.log('发送消息');
  }

  private listenMessage() {
    console.log('监听消息');
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

  }
}
