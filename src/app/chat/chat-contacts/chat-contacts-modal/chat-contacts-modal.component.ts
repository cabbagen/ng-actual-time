import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { IMNoticeForAddFriend } from '../../interfaces/chat-notice.interface';
import { ChatHttpService } from '../../services/chat.http.service';
import { ChatSocketService } from '../../services/chat.socket.service';
import { NoticeEventCenter } from '../../../chat/services/chat.event';

@Component({
  selector: 'app-chat-contacts-modal',
  templateUrl: './chat-contacts-modal.component.html',
  styleUrls: ['./chat-contacts-modal.component.css']
})
export class ChatContactsModalComponent implements OnInit {

  @Input() isShowContactsModal: boolean;

  @Input() selfInfo: any;

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
    private chatSocketService: ChatSocketService,
    private messageService: NzMessageService
  ) { }

  public ngOnInit() {
    this.updateContactInfos(1);
  }

  public updateContactInfos(pageIndex: number) {
    const { pageSize } = this.pagination;
    const { friends = [] } = this.selfInfo;
    const friendIds = friends.map((friend: any) => {
      return friend._id
    });

    this.chatHttpService.getContactInfos({ type: this.type, pageIndex: pageIndex - 1, pageSize, search: this.search }).subscribe((result) => {
      
      // 未获取到好友信息
      if (result.state !== 200) {
        this.messageService.error('获取 IM 人员信息失败');
        return;
      }

      // 重构好友列表
      this.contactInfos = result.data.contacts.map((contact: any) => {
        return Object.assign({}, contact, { isCan: !(friendIds.indexOf(contact._id) > -1) });
      });

      this.pagination = Object.assign({}, { pageIndex, pageSize, total: result.data.total });
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

  // 添加好友
  public handleAddFriend(contactInfo: any) {
    const sendMessage: IMNoticeForAddFriend = {
      notice_type: NoticeEventCenter.im_notice_add_friend,
      source_contact_id: this.selfInfo._id,
      source_contact_nickname: this.selfInfo.nickname,
      target_contact_id: contactInfo._id,
      target_contact_nickname: contactInfo.nickname,
      appkey: this.selfInfo.appkey,
    };

    console.log('handleAddFriend: ', sendMessage);
    this.chatSocketService.sendNoticeForAddFriend(sendMessage);
  }
}
