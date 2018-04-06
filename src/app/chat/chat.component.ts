import { Component, OnInit } from '@angular/core';
import { LoginService } from './share/login.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    const result = this.loginService.login('1', '2');
    console.log(result);
  }

}
