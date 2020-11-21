import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-application-angular';
//   https://www.youtube.com/watch?v=vpQDkEgO-kA
  user: String;
  room: String;
  FromMessageArray: Array<{ user: String, message: String }> = [];
  ToMessageArray: Array<{ user: String, message: String }> = [];
  messageText: String;
  data;

  constructor(private chatSservice: ChatService) {
    this.chatSservice.newUserJoined().subscribe(
      data => {
        this.FromMessageArray.push(data);
      }
    );

    this.chatSservice.leftRoom().subscribe(
      data => {
        this.FromMessageArray.push(data);
      }
    );

    this.chatSservice.newMessageReceived().subscribe(
      data => {
        if (data.user !== 'sai')
          this.FromMessageArray.push(data);
        else
          this.ToMessageArray.push(data);
      }
    );

    this.chatSservice.userDetails().subscribe(
      data => {
        console.log(data);
        this.data = data;
      }
    );
  }

  join() {
    this.chatSservice.joinRoom({ user: this.user, room: this.room });
  }

  leave() {
    this.chatSservice.leaveRoom({ user: this.user, room: this.room });
  }

  sendMessage() {
    this.chatSservice.sendMessage({ user: this.user, room: this.room, message: this.messageText });
  }

  getUserDetails() {
    this.chatSservice.GetUserDetails({ user: this.user, room: this.room });
  }
}
