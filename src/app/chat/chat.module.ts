import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChatComponent } from './chat.component';
import { ChatService } from './services/chat.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component';
import { ChatContactsItemComponent } from './chat-contacts/chat-contacts-item/chat-contacts-item.component'

@NgModule({
  declarations: [
    ChatComponent,
    ChatContactsComponent,
    ChatContactsItemComponent,
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
  ],
  providers: [ ChatService ],
  bootstrap: [],
})
export class ChatModule { }
