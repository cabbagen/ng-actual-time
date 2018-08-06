import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-contacts-modify-modal',
  templateUrl: './chat-contacts-modify-modal.component.html',
  styleUrls: ['./chat-contacts-modify-modal.component.css']
})
export class ChatContactsModifyModalComponent implements OnInit {

  @Input() isVisible: boolean;

  @Input() title: string;

  @Input() type: string;

  @Output() handleOkModifyModal = new EventEmitter<any>();

  @Output() handleCancelModifyModal = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  public handleOk(): void {
    this.handleOkModifyModal.emit(this.type);
  }

  public handleCancel(): void {
    this.handleCancelModifyModal.emit();
  }

}
