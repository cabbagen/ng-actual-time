import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ContactsItem } from './chat-contacts-item.interface'; 

@Component({
  selector: 'app-chat-contacts-item',
  templateUrl: './chat-contacts-item.component.html',
  styleUrls: ['./chat-contacts-item.component.css']
})
export class ChatContactsItemComponent implements OnInit, OnChanges {

  @Input() currentContacts;

  @Input() currentTab;

  private adapterMap: { [key: number]: string } = {
    0: 'adapterRecentContacts',
    1: 'adapterFriends',
    2: 'adapterGroups',
  };

  public adaptiveContacts: ContactsItem[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.currentContactsAdapter(this.currentTab);
  }

  currentContactsAdapter(currentTabIndex: number) {
    this[this.adapterMap[currentTabIndex]]();
  }

  adapterRecentContacts() {
    // this.adaptiveContacts = this.currentContacts.map(())
    this.adaptiveContacts = [];
  }

  adapterFriends() {
    this.adaptiveContacts = this.currentContacts.map((friend) => {
      const friendItem: ContactsItem = {
        nickname: friend.nickname,
        id: friend._id,
        avator: friend.avator,
        information: friend.extra
      };

      return friendItem;
    });
  }

  adapterGroups() {
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
}
