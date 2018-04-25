import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { domain } from '../../config';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.css']
})
export class ChatContactsComponent implements OnInit {

  @Input() selfInfo;

  @Input() currentTab: number;

  @Output() onChangeChatTab = new EventEmitter<number>();

  public domain: string = domain;

  constructor() { }

  ngOnInit() {
  }

  public changeChatTab(currentTab: number) {
    this.onChangeChatTab.emit(currentTab);
  }

}
