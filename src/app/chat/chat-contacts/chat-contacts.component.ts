import { Component, OnInit, Input } from '@angular/core';
import { domain } from '../../config';

@Component({
  selector: 'app-chat-contacts',
  templateUrl: './chat-contacts.component.html',
  styleUrls: ['./chat-contacts.component.css']
})
export class ChatContactsComponent implements OnInit {

  @Input() selfInfo;

  @Input() currentTab: number;

  public domain: string = domain;

  constructor() { }

  ngOnInit() {
  }

}
