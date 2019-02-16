import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ChatHttpService } from '../../services/chat.http.service';

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
    private messageService: NzMessageService
  ) { }

  public ngOnInit() {
    this.updateGroupInfos(1);
  }

  private updateGroupInfos(pageIndex) {
    const { pageSize } = this.pagination;
    this.chatHttpService.getGroupInfos({ pageIndex: pageIndex - 1, pageSize, search: this.search }).subscribe((result) => {
      if (result.state === 200) {
        this.groupInfos = result.data.groupInfos;
        this.pagination = Object.assign({}, { pageIndex, pageSize, total: result.data.total });
      } else {
        this.messageService.error('获取群组信息失败');
      }
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
}
