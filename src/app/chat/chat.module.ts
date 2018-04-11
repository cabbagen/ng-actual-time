import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { ChatNavComponent } from './chat-nav/chat-nav.component';
import { ChatService } from './share/chat.service';
import { NgZorroAntdModule } from 'ng-zorro-antd'

@NgModule({
  declarations: [
    ChatComponent,
    ChatNavComponent
  ],
  imports: [
    NgZorroAntdModule,
  ],
  providers: [ ChatService ],
  bootstrap: [],
})
export class ChatModule { }
