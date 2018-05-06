import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-reply',
  templateUrl: './chat-reply.component.html',
  styleUrls: ['./chat-reply.component.css']
})
export class ChatReplyComponent implements OnInit {

  @Output() onSendMessage = new EventEmitter<string>();

  public content: string = '';

  constructor() { }

  ngOnInit() {
  }

  public sendMessage() {
    this.onSendMessage.emit(this.content);
  }

}
