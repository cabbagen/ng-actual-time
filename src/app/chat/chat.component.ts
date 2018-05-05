import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';

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

  constructor(private chatService: ChatService) {
  }

  public ngOnInit() {
    this.chatService.loginApplication().subscribe((result) => {
      this.selfInfo = result.data;
      this.updateCurrentContacts(this.currentTab);
    });
    
    this.chatSocket = this.chatService.socketConnect();
    this.emitMessage();
    this.listenMessage();
  }

  private updateCurrentContacts(tabIndex: number) {
    this.currentContacts = this.selfInfo[this.tabIndexMap[tabIndex]] || [];
  }

  public emitMessage() {
    console.log('发送消息');
  }

  public listenMessage() {
    console.log('监听消息');
  }

  public changeChatTab(currentTab: number) {
    this.currentTab = currentTab;
    this.updateCurrentContacts(currentTab);
  }

}
