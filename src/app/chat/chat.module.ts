import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChatComponent } from './chat.component';
import { ChatService } from './share/chat.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component'

@NgModule({
  declarations: [
    ChatComponent,
    ChatContactsComponent,
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
  ],
  providers: [ ChatService ],
  bootstrap: [],
})
export class ChatModule { }
