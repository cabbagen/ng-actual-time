import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactsItem } from '../../interfaces/chat-contact.interface'; 

@Component({
  selector: 'app-chat-contacts-item',
  templateUrl: './chat-contacts-item.component.html',
  styleUrls: ['./chat-contacts-item.component.css']
})
export class ChatContactsItemComponent implements OnInit {

  @Input() currentContacts;

  @Input() currentTab;

  @Output() selectContact = new EventEmitter<ContactsItem>();

  constructor() { }

  public ngOnInit() {
  }

  public selectContactItem(contact: ContactsItem) {
    this.selectContact.emit(contact);
  }
}
