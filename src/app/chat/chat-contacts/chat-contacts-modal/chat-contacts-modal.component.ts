import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ChatHttpService } from '../../services/chat.http.service';

@Component({
  selector: 'app-chat-contacts-modal',
  templateUrl: './chat-contacts-modal.component.html',
  styleUrls: ['./chat-contacts-modal.component.css']
})
export class ChatContactsModalComponent implements OnInit {

  @Input() isShowContactsModal: boolean;

  @Output() handleContactsModalCancel = new EventEmitter();

  // -   1 => 综合查询,  2 => nickname,  3 => username
  public type: number = 1;

  public search: string = '';

  public contactInfos: any[] = [];

  public pagination: { pageIndex: number, pageSize: number, total: number } = {
    pageIndex: 1,
    pageSize: 5,
    total: 0,
  };

  constructor(
    private chatHttpService: ChatHttpService,
    private messageService: NzMessageService
  ) { }

  public ngOnInit() {
    this.updateContactInfos(1);
  }

  public updateContactInfos(pageIndex) {
    const { pageSize } = this.pagination;
    this.chatHttpService.getContactInfos({ type: this.type, pageIndex: pageIndex - 1, pageSize, search: this.search }).subscribe((result) => {
      if (result.state === 200) {
        this.contactInfos = result.data.contacts;
        this.pagination = Object.assign({}, { pageIndex, pageSize, total: result.data.total });
      } else {
        this.messageService.error('获取 IM 人员信息失败');
      }
    });
  }

  public handleCancel() {
    this.handleContactsModalCancel.emit();
  }

  public handleOk() {
    this.handleContactsModalCancel.emit();
  }

  public searchContacts() {
    this.updateContactInfos(1);
  }

  public handleChangePagination(pageIndex) {
    this.updateContactInfos(pageIndex);
  }
}
