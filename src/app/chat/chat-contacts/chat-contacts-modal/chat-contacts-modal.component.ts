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
    this.onOkModal.emit('qweqwe');
  }
}
