import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../share/chat.service';
import { domain } from '../../config';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.css']
})
export class ChatNavComponent implements OnInit {

  @Input() appKey: string;

  @Input() username: string;

  public selfInfo = {};

  public domain: string = domain;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.login(this.appKey, this.username)
      .subscribe((result) => {
        console.log(result.data);
        this.selfInfo = result.data;
      });
  }

}
