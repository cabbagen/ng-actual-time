import { Component, OnInit } from '@angular/core';
import { ChatService } from './share/chat.service';
import { domain } from '../config';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private username = 'xia';

  private appKey = '1234abc';

  public domain = domain;

  public selfInfo = {};

  public currentTab: number  = 0;

  constructor(private chatService: ChatService) {
  }

  public ngOnInit() {
    this.chatService.login(this.appKey, this.username)
      .subscribe((result) => {
        this.selfInfo = result.data;
      });
  }

  public changeChatTab(currentTab: number) {
    this.currentTab = currentTab;
  }

}
