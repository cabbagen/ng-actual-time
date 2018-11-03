import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';
import { ChatSocketService } from './services/chat.socket.service';
import { ChatHttpService } from './services/chat.http.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component';
import { ChatContactsItemComponent } from './chat-contacts/chat-contacts-item/chat-contacts-item.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatReplyComponent } from './chat-reply/chat-reply.component';
// import { ChatContactsModalComponent } from './chat-contacts/chat-contacts-modal/chat-contacts-modal.component';
import { UploadInputComponent } from '../common/upload-input/upload-input.component';

@NgModule({
  declarations: [
    ChatComponent,
    ChatContactsComponent,
    ChatContactsItemComponent,
    ChatRoomComponent,
    ChatReplyComponent,
    // ChatContactsModalComponent,
    UploadInputComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  providers: [ ChatSocketService, ChatHttpService, NzModalService, NzMessageService ],
  bootstrap: [],
})
export class ChatModule { }
