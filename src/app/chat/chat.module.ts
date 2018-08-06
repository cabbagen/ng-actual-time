import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';
import { ChatService } from './services/chat.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component';
import { ChatContactsItemComponent } from './chat-contacts/chat-contacts-item/chat-contacts-item.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatReplyComponent } from './chat-reply/chat-reply.component';
import { ChatContactsModifyModalComponent } from './chat-contacts/chat-contacts-modify-modal/chat-contacts-modify-modal.component'

@NgModule({
  declarations: [
    ChatComponent,
    ChatContactsComponent,
    ChatContactsItemComponent,
    ChatRoomComponent,
    ChatReplyComponent,
    ChatContactsModifyModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  providers: [ ChatService, NzModalService ],
  bootstrap: [],
})
export class ChatModule { }
