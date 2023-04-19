import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat-application-angular';
  featureGamesRps = true;
  featureChatApp = true;

  constructor() {
  }

}
