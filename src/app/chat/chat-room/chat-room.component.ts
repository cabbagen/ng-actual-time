import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { ContactsItem } from '../interfaces/chat-contact.interface';
import { ChatFullMessage } from '../interfaces/chat-message.interface';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, DoCheck {

  @Input() currentContact: ContactsItem;

  @Input() currentMessages: ChatFullMessage[];

  @Input() selfInfo: any;

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck() {
    console.log(this.selfInfo);
  }

  isMySelf(chatFullMessage: ChatFullMessage): boolean {
    const source: ContactsItem = chatFullMessage.source;
    return this.selfInfo._id === source.id;
  }

}
