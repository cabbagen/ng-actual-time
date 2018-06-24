import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { ContactsItem } from '../interfaces/chat-contact.interface';
import { ChatFullMessage } from '../interfaces/chat-message.interface';
import { formatTime } from '../../utils/utils';

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
    this.handleChatRoomScrollToBottom();
  }

  handleChatRoomScrollToBottom(): void {
    const element: Element = document.getElementById('chat-room-content');
    const needDistanceToBottom: number = element.scrollHeight - element.clientHeight;

    if (needDistanceToBottom > 0) {
      element.scrollTop = needDistanceToBottom;
    }
  }

  isMySelf(chatFullMessage: ChatFullMessage): boolean {
    const source: ContactsItem = chatFullMessage.source;
    return this.selfInfo._id === source.id;
  }

  formatTime(time): string {
    return formatTime(time);
  }
}
