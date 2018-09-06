import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, DoCheck } from '@angular/core';

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

  // 修改信息保存信息
  public stateForModifyInfo: { nickname: string, avator: string } = {
    nickname: '',
    avator: '',
  };

  // 添加好友保存信息
  public stateForAddFriends: { username: string, userId: number } = {
    username: '',
    userId: 0,
  };

  // 添加群组保存信息
  public stateForAddGroup: { groupName: string, groupId: number } = {
    groupName: '',
    groupId: 0
  };

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck() {
    this.currentModalTpl = this[this.modalType + 'Tpl'] || '';
  }

  public handleCancelModal(): void {
    this.onCancelModal.emit();
  }

  public handleOkModal(): void {
    const modalInfoMap: { [key: string]: { state: any, reset: Function }  } = {
      modifyInfo: { state: this.stateForModifyInfo, reset: this.resetStateForModifyInfo.bind(this) },
      addFriends: { state: this.stateForAddFriends, reset: this.resetStateForAddFriends.bind(this) },
      addGroup: { state: this.stateForAddGroup, reset: this.resetStateForAddGroup.bind(this) },
    };
  
    this.onOkModal.emit({ type: this.modalType, params: modalInfoMap[this.modalType].state });

    modalInfoMap[this.modalType].reset();
  }

  private resetStateForModifyInfo() {
    this.stateForModifyInfo = { nickname: '', avator: '' };
  }

  private resetStateForAddFriends() {
    this.stateForAddFriends = { username: '', userId: 0 };
  }

  private resetStateForAddGroup() {
    this.stateForAddGroup = { groupName: '', groupId: 0 };
  }

  public uploadImgSuccess(img: string) {
    this.stateForModifyInfo.avator = img;
  }
}
