import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { ContactsItem } from '../interfaces/chat-contact.interface';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.css']
})
export class ChatContactsComponent implements OnInit, AfterViewInit {

  @Input() selfInfo;

  @Input() currentTab: number;

  @Input() currentContacts;

  @Output() onChangeChatTab = new EventEmitter<number>();

  @Output() onSelectContact = new EventEmitter<ContactsItem>();

  public iconInfos: {icon: string, content: string, type: string}[] = [
    { icon: 'anticon-edit', content: '修改信息', type: 'modifyInfo' },
    { icon: 'anticon-user-add', content: '添加好友', type: 'addFriends' },
    { icon: 'anticon-usergroup-add', content: '添加群组', type: 'addGroup' },
  ];

  public isShowMenu: boolean = false;

  public modalInfo: {title: string, type: string, isVisible: boolean} = {
    title: '',
    type: '',
    isVisible: false,
  };

  constructor() { }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    document.body.addEventListener('click', () => {
      this.isShowMenu = false;
    }, false);
  }

  public triggerMenu($event): void {
    $event.stopPropagation();
    this.isShowMenu = true;
  }

  public showModal(title: string, type: string): void {
    this.modalInfo = {title, type, isVisible: true};
  }

  public changeChatTab(currentTab: number): void {
    this.onChangeChatTab.emit(currentTab);
  }

  public selectContact(contact: ContactsItem): void {
    this.onSelectContact.emit(contact);
  }

  public handleOkModal(data): void {
    console.log('修改用户信息保存', data);
    this.modalInfo = { title: '', type: '', isVisible: false };
  }

  public handleCancelModal(): void {
    this.modalInfo = { title: '', type: '', isVisible: false };
  }

}
