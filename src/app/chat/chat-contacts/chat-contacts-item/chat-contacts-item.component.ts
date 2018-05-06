import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ContactsItem } from '../../interfaces/chat-contact.interface'; 

@Component({
  selector: 'app-chat-contacts-item',
  templateUrl: './chat-contacts-item.component.html',
  styleUrls: ['./chat-contacts-item.component.css']
})
export class ChatContactsItemComponent implements OnInit, OnChanges {

  @Input() currentContacts;

  @Input() currentTab;

  @Output() selectContact = new EventEmitter<ContactsItem>();

  private adapterMap: { [key: number]: string } = {
    0: 'adapterRecentContacts',
    1: 'adapterFriends',
    2: 'adapterGroups',
  };

  public adaptiveContacts: ContactsItem[] = [];

  constructor() { }

  public ngOnInit() {
  }

  public ngOnChanges() {
    this.currentContactsAdapter(this.currentTab);
  }

  private currentContactsAdapter(currentTabIndex: number) {
    this[this.adapterMap[currentTabIndex]]();
  }

  private adapterRecentContacts() {
    // this.adaptiveContacts = this.currentContacts.map(())
    this.adaptiveContacts = [];
  }

  private adapterFriends() {
    this.adaptiveContacts = this.currentContacts.map((friend) => {
      const friendItem: ContactsItem = {
        nickname: friend.nickname,
        id: friend._id,
        avator: friend.avator,
        information: friend.extra,
      };

      return friendItem;
    });
  }

  private adapterGroups() {
    this.adaptiveContacts = this.currentContacts.map((group) => {
      const groupItem: ContactsItem = {
        nickname: group.group_name,
        id: group._id,
        avator: group.group_avator,
        information: group.group_introduce,
      };

      return groupItem;
    });
  }

  public selectContactItem(contact: ContactsItem) {
    this.selectContact.emit(contact);
  }
}
