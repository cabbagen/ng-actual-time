import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { ChatNavComponent } from './chat-nav/chat-nav.component';
import { ChatService } from './share/chat.service';

@NgModule({
  declarations: [
    ChatComponent,
    ChatNavComponent
  ],
  imports: [],
  providers: [ ChatService ],
  bootstrap: [],
})
export class ChatModule { }
