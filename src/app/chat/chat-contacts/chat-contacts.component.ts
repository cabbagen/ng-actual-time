import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ContactsItem } from '../interfaces/chat-contact.interface';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.css']
})
export class ChatContactsComponent implements OnInit {

  @Input() selfInfo;

  @Input() currentTab: number;

  @Input() currentContacts;

  @Output() onChangeChatTab = new EventEmitter<number>();

  @Output() onSelectContact = new EventEmitter<ContactsItem>();

  public iconInfos: {icon: string, content: string}[] = [
    { icon: 'anticon-edit', content: '修改信息' },
    { icon: 'anticon-user-add', content: '添加好友' },
    { icon: 'anticon-usergroup-add', content: '添加群组' },
  ];

  public isShowMenu: boolean = false;

  constructor() { }

  public ngOnInit() {
  }

  public triggerMenu() {
    this.isShowMenu = !this.isShowMenu;
  }

  public changeChatTab(currentTab: number) {
    this.onChangeChatTab.emit(currentTab);
  }

  public selectContact(contact: ContactsItem) {
    this.onSelectContact.emit(contact);
  }

}
