import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ChatHttpService } from '../../services/chat.http.service';
import { ChatSocketService } from '../../services/chat.socket.service';
import { IMNoticeForAddGroup } from '../../interfaces/chat-notice.interface';
import { NoticeEventCenter } from '../../../chat/services/chat.event';

@Component({
  selector: 'app-chat-groups-modal',
  templateUrl: './chat-groups-modal.component.html',
  styleUrls: ['./chat-groups-modal.component.css']
})
export class ChatGroupsModalComponent implements OnInit {

  @Input() isShowGroupsModal: boolean;

  @Input() selfInfo: any;

  @Output() handleGroupsModalCancel = new EventEmitter();

  public search: string = '';

  public groupInfos: any[] = [];

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
    this.updateGroupInfos(1);
  }

  private updateGroupInfos(pageIndex: number) {
    const { pageSize } = this.pagination;
    const { groups = [] } = this.selfInfo;
    const groupIds = groups.map((group: any) => {
      return group._id;
    });

    this.chatHttpService.getGroupInfos({ pageIndex: pageIndex - 1, pageSize, search: this.search }).subscribe((result) => {

      // 获取消息失败
      if (result.state !== 200) {
        this.messageService.error('获取群组信息失败');
        return;
      }

      // 重构群组列表
      this.groupInfos = result.data.groupInfos.map((groupInfo: any) => {
        return Object.assign({}, groupInfo, { isCan: !(groupIds.indexOf(groupInfo._id) > -1) })
      });

      this.pagination = Object.assign({}, { pageIndex, pageSize, total: result.data.total });
    });
  }

  public handleCancel() {
    this.handleGroupsModalCancel.emit();
  }

  public handleOk() {
    this.handleGroupsModalCancel.emit();
  }

  public searchGroups() {
    this.updateGroupInfos(1);
  }

  public handleChangePagination(pageIndex) {
    this.updateGroupInfos(pageIndex);
  }

  public handleAddGroup(groupInfo: any) {
    const sendMessage: IMNoticeForAddGroup = {
      notice_type: NoticeEventCenter.im_notice_add_group,
      source_contact_id: this.selfInfo._id,
      source_contact_nickname: this.selfInfo.nickname,
      target_contact_id: "",
      target_contact_nickname: "",
      target_group_id: groupInfo._id,
      target_group_name: groupInfo.group_name,
      appkey: this.selfInfo.appkey,
    };

    console.log('handleAddGroup: ', sendMessage);
    this.chatSocketService.sendNoticeForAddGroup(sendMessage);
  }
}
