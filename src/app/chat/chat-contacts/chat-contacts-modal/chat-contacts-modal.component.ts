import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalSpec } from '../../interfaces/chat-contacts-modal-interface';
import { ChatHttpService } from '../../services/chat.http.service';

@Component({
  selector: 'app-chat-contacts-modal',
  templateUrl: './chat-contacts-modal.component.html',
  styleUrls: ['./chat-contacts-modal.component.css']
})
export class ChatContactsModalComponent implements OnInit, AfterViewInit {

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

  // modal template map
  public modalTemplateMap: { [key: string]: ModalSpec } = {
    imUser: {
      tpl: this.imUserWithTpl,
      spec: {
        width: '500px'
      },
      state: {
        nickname: '',
        avator: '',
      },
    },
    imFriends: {
      tpl: this.imFriendsWithTpl,
      spec: {
        width: '700px'
      },
      state: {},
    },
    imGroups: {
      tpl: this.imGroupsWithTpl,
      spec: {
        width: '700px'
      },
      state: {},
    },
  };

  constructor(private chatHttpService: ChatHttpService, private messageService: NzMessageService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.modalTemplateMap.imUser.tpl = this.imUserWithTpl;
    this.modalTemplateMap.imFriends.tpl = this.imFriendsWithTpl;
    this.modalTemplateMap.imGroups.tpl = this.imGroupsWithTpl;
  }

  public handleCancelModal(): void {
    this.onCancelModal.emit();
  }

  public handleOkModal(): void {
    const state = this.modalTemplateMap[this.modalType].state;
    console.log('state: ', state);
    // this.onOkModal.emit();
  }

  public uploadImgSuccess(imgSrc: string) {
    this.messageService.success('上传成功');
    this.modalTemplateMap.imUser.state.avator = imgSrc;
  }
}
