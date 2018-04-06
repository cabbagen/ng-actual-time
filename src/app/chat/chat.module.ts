import { NgModule } from '@angular/core';
import { ChatComponent } from './chat.component';
import { ChatNavComponent } from './chat-nav/chat-nav.component';
import { LoginService } from './share/login.service';

@NgModule({
  declarations: [
    ChatComponent,
    ChatNavComponent
  ],
  imports: [],
  providers: [ LoginService ],
  bootstrap: [],
})
export class ChatModule { }
