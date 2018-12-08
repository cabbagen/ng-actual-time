import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ChatHttpService } from '../services/chat.http.service';
import { ContactsItem } from '../interfaces/chat-contact.interface';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.css']
})
export class ChatContactsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() selfInfo;

  @Input() currentTab: number;

  @Input() currentContacts;

  @Output() onChangeChatTab = new EventEmitter<number>();

  @Output() onSelectContact = new EventEmitter<ContactsItem>();

  public iconInfos: {icon: string, content: string, type: string}[] = [
    { icon: 'anticon-edit', content: '修改信息', type: 'isShowSelfModal' },
    { icon: 'anticon-user-add', content: '添加好友', type: 'isShowContactsModal' },
    { icon: 'anticon-usergroup-add', content: '添加群组', type: 'isShowGroupsModal' },
  ];

  public isShowMenu: boolean = false;

  // 控制 三个 modal 的显示
  public isShowSelfModal: boolean = false;

  public isShowContactsModal: boolean = false;

  public isShowGroupsModal: boolean = false;

  // search 栏文本
  public searchText: string = "";

  // 适配筛选后的联系人列表
  public adaptedCurrentContacts: ContactsItem[] = [];

  constructor(private chatHttpService: ChatHttpService, private messageService: NzMessageService) { }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    document.body.addEventListener('click', () => {
      this.isShowMenu = false;
    }, false);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const currentContacts: ContactsItem[] = changes.currentContacts.currentValue;
    this.updateAdaptedCurrentContacts(currentContacts);
  }

  public handleChangeSearch(): void {
    this.updateAdaptedCurrentContacts(this.currentContacts);
  }

  private updateAdaptedCurrentContacts(currentContacts: ContactsItem[]): void {
    const searchRegExp = new RegExp(this.searchText);

    this.adaptedCurrentContacts = this.searchText === ''
      ? currentContacts
      : currentContacts.filter((contact) => searchRegExp.test(contact.nickname))
  }

  public triggerMenu($event): void {
    $event.stopPropagation();
    this.isShowMenu = true;
  }

  public changeChatTab(currentTab: number): void {
    this.onChangeChatTab.emit(currentTab);
  }

  public selectContact(contact: ContactsItem): void {
    this.onSelectContact.emit(contact);
  }

  public showMenuModal(modalType) {
    this[modalType] = true;
  }

  public handleSelfModalOk(submitData) {
    this.isShowSelfModal = false;
    // 保存编辑的用户信息
    this.chatHttpService.saveContactInfo(submitData).subscribe((result) => {
      if (result.state === 200) {
        this.messageService.success('修改成功');
      } else {
        this.messageService.error(result.msg);
      }
    });
  }

  public handleSelfModalCancel($event) {
    this.isShowSelfModal = false;
  }

  public handleContactsModalCancel($event) {
    this.isShowContactsModal = false;
  }

  public handleGroupsModalCancel($event) {
    this.isShowGroupsModal = false;
  }
}
