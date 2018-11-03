import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, AfterViewInit, DoCheck } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalSpec } from '../../interfaces/chat-contacts-modal-interface';
import { ChatHttpService } from '../../services/chat.http.service';

@Component({
  selector: 'app-chat-contacts-modal',
  templateUrl: './chat-contacts-modal.component.html',
  styleUrls: ['./chat-contacts-modal.component.css']
})
export class ChatContactsModalComponent implements OnInit, AfterViewInit, DoCheck {

  @Input() isShowModal: boolean;

  @Input() modalTitle: string;

  @Input() modalType: string;

  @Output() onCancelModal = new EventEmitter();

  @Output() onOkModal = new EventEmitter();

  @ViewChild('imUser')
  public imUserWithTpl: TemplateRef<any>;

  @ViewChild('imFriends')
  public imFriendsWithTpl: TemplateRef<any>;

  @ViewChild('imGroups')
  public imGroupsWithTpl: TemplateRef<any>;

  // ======= state 信息预定义 ========= //
  private imUserDef: ModalSpec = {
    tpl: this.imUserWithTpl,
    spec: {
      width: '500px',
    },
    state: {
      nickname: '',
      avator: '',
    },
  };

  private imFriendsDef: ModalSpec = {
    tpl: this.imFriendsWithTpl,
    spec: {
      width: '500px',
    },
    state: {
      type: 'nickname',
        search: '',
        pagination: {
          pageIndex: 1,
          total: 0,
        },
        contacts: [],
    },
  };

  private imGroupsDef: ModalSpec = {
    tpl: this.imGroupsWithTpl,
    spec: {
      width: '700px'
    },
    state: {
      type: 'groupname',
      search: '',
      pagination: {
        pageIndex: 1,
        total: 0,
      },
      groups: [],
    },
  };

  private lastModalType: string;

  // modal template map
  public modalTemplateMap: { [key: string]: ModalSpec } = {
    imUser: this.imUserDef,
    imFriends: this.imFriendsDef,
    imGroups: this.imGroupsDef,
  };

  constructor(private chatHttpService: ChatHttpService, private messageService: NzMessageService) { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.lastModalType !== this.modalType) {
      
    }
    console.log('modelType', this.modalType);
  }

  ngAfterViewInit() {
    this.modalTemplateMap.imUser.tpl = this.imUserWithTpl;
    this.modalTemplateMap.imFriends.tpl = this.imFriendsWithTpl;
    this.modalTemplateMap.imGroups.tpl = this.imGroupsWithTpl;
  }

  public handleCancelModal(): void {
    this.lastModalType = this.modalType;
    this.onCancelModal.emit();
  }

  public handleOkModal(): void {
    this.lastModalType = this.modalType;
    const state = this.modalTemplateMap[this.modalType].state;
    console.log('state: ', state);
    // this.onOkModal.emit();
  }

  public uploadImgSuccess(imgSrc: string) {
    this.messageService.success('上传成功');
    this.modalTemplateMap.imUser.state.avator = imgSrc;
  }
}
