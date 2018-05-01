import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private username = 'xia';

  private appKey = '1234abc';

  private tabIndexMap: { [key: number]: string } = {
    0: 'recentContacts',
    1: 'friends',
    2: 'groups',
  };

  public selfInfo = {};

  public currentContacts = [];

  public currentTab: number  = 0;

  constructor(private chatService: ChatService) {
  }

  public ngOnInit() {
    this.chatService.login(this.appKey, this.username)
      .subscribe((result) => {
        console.log('selfInfo', result.data);
        this.selfInfo = result.data;
        this.updateCurrentContacts(this.currentTab);
      });
  }

  private updateCurrentContacts(tabIndex: number) {
    this.currentContacts = this.selfInfo[this.tabIndexMap[tabIndex]] || [];
  }

  public changeChatTab(currentTab: number) {
    this.currentTab = currentTab;
    this.updateCurrentContacts(currentTab);
  }

}
