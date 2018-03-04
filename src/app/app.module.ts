import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ChatComponent } from './chat/chat.component';
import { ChatNavComponent } from './chat/chat-nav/chat-nav.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
