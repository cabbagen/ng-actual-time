import { Component, OnInit, Input } from '@angular/core';
import { ContactsItem } from '../interfaces/chat-contact.interface';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  @Input() currentContact: ContactsItem;

  constructor() { }

  ngOnInit() {
  }

}
