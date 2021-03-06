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

  public ngOnInit() {
  }

  public ngDoCheck() {
    this.handleChatRoomScrollToBottom();
  }

  public handleChatRoomScrollToBottom(): void {
    const element: Element = document.getElementById('chat-room-content');
    const neededDistanceToBottom: number = element.scrollHeight - element.clientHeight;

    if (neededDistanceToBottom > 0) {
      element.scrollTop = neededDistanceToBottom;
    }
  }

  public isMySelf(chatFullMessage: ChatFullMessage): boolean {
    const source: ContactsItem = chatFullMessage.source;
    return this.selfInfo._id === source.id;
  }

  public formatTime(time): string {
    return formatTime(time);
  }
}
