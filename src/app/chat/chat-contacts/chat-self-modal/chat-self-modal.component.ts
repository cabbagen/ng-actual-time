import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ChatHttpService } from '../../services/chat.http.service';

@Component({
  selector: 'app-chat-self-modal',
  templateUrl: './chat-self-modal.component.html',
  styleUrls: ['./chat-self-modal.component.css']
})
export class ChatSelfModalComponent implements OnInit {

  @Input() isShowSelfModal: boolean;

  @Output() handleSelfModalOk = new EventEmitter()

  @Output() handleSelfModalCancel = new EventEmitter();

  public nickname: string = '';

  public avator: string = '';

  constructor(
    private chatHttpService: ChatHttpService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
  ) { }

  public ngOnInit() {
  }

  public handleCancel() {
    this.handleSelfModalCancel.emit();
  }

  public handleOk() {
    if (this.nickname === '') {
      this.modalService.warning({ title: '警告提示', content: '请填写用户昵称' });
      return;
    }
    if (this.avator === '') {
      this.modalService.warning({ title: '警告提示', content: '请上传用户头像' });
      return;
    }

    this.handleSelfModalOk.emit({ nickname: this.nickname, avator: this.avator });
  }

  public uploadImgSuccess(value) {
    this.avator = value;
    this.messageService.success('上传成功');
  }
}
