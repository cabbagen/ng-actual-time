import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.css']
})
export class ChatContactsComponent implements OnInit {

  @Input() selfInfo;

  @Input() currentTab: number;

  @Input() currentContacts;

  @Output() onChangeChatTab = new EventEmitter<number>();

  constructor() { }

  public ngOnInit() {
  }

  public changeChatTab(currentTab: number) {
    this.onChangeChatTab.emit(currentTab);
  }

}
