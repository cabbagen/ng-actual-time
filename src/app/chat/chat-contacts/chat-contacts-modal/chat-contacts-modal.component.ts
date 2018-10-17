import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, DoCheck } from '@angular/core';
import { ChatHttpService } from '../../services/chat.http.service'; 

let requestFlag = false;

@Component({
  selector: 'app-chat-contacts-modal',
  templateUrl: './chat-contacts-modal.component.html',
  styleUrls: ['./chat-contacts-modal.component.css']
})
export class ChatContactsModalComponent implements OnInit, DoCheck {

  @Input() isShowModal: boolean;

  @Input() modalTitle: string;

  @Input() modalType: string;

  @Output() onCancelModal = new EventEmitter();

  @Output() onOkModal = new EventEmitter();

  @ViewChild('modifyInfo')
  public modifyInfoTpl: TemplateRef<any>;

  @ViewChild('addFriends')
  public addFriendsTpl: TemplateRef<any>;

  @ViewChild('addGroup')
  public addGroupTpl: TemplateRef<any>;

  public currentModalTpl: TemplateRef<any> | string = '';

  // 修改个人信息 state
  public stateForModifyInfo: { nickname: string, avator: string } = {
    nickname: '',
    avator: '',
  };

  // 添加好友 state
  public stateForAddFriends: { type: string, pageIndex: number, search: string, contacts: any[] } = {
    type: 'username',            // 查询类型
    pageIndex: 1,         // 第一页
    search: '',           // 查询关键此
    contacts: [],         // 联系人列表
  };

  // 添加群组 state
  public stateForAddGroup: { groupName: string, groupId: number } = {
    groupName: '',
    groupId: 0
  };

  constructor(private chatHttpService: ChatHttpService) { }

  ngOnInit() {
  }

  ngDoCheck() {
    this.currentModalTpl = this[this.modalType + 'Tpl'] || '';
    // 加载联系人列表
    if (this.modalType === 'addFriends' && this.stateForAddFriends.contacts.length === 0 && !requestFlag) {
      requestFlag = true;
      this.getContactInfos();
    }
  }

  getContactInfos() {
    const { type, pageIndex, search } = this.stateForAddFriends;
    this.chatHttpService.getContactInfos({ type, pageIndex, search, pageSize: 5 })
      .subscribe((result) => {
        this.stateForAddFriends.contacts = result.data.contacts;
        console.log(result);
      });
  }

  public handleCancelModal(): void {
    this.onCancelModal.emit();
  }

  public handleOkModal(): void {
    const modalInfoMap: { [key: string]: { state: any, reset: Function }  } = {
      modifyInfo: { state: this.stateForModifyInfo, reset: this.resetStateForModifyInfo.bind(this) },
      addFriends: { state: null, reset: this.resetStateForAddFriends.bind(this) },
      addGroup: { state: null, reset: this.resetStateForAddGroup.bind(this) },
    };
  
    this.onOkModal.emit({ type: this.modalType, params: modalInfoMap[this.modalType].state });

    modalInfoMap[this.modalType].reset();
  }

  private resetStateForModifyInfo(): void {
    this.stateForModifyInfo = { nickname: '', avator: '' };
  }

  private resetStateForAddFriends(): void {
    this.stateForAddFriends = { type: 'username', pageIndex: 0, search: '', contacts: [] };
  }

  private resetStateForAddGroup(): void {
    this.stateForAddGroup = { groupName: '', groupId: 0 };
  }

  public uploadImgSuccess(img: string): void {
    this.stateForModifyInfo.avator = img;
  }
}
