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
  //   https://www.youtube.com/watch?v=vpQDkEgO-kA

  /* 
                        TODO:
  ==================================================
  make youtube video responsive
  send and received messages alignment in UI -- done
  use bootstrap components for all inputs and all
  add sidebar or navigation bar for loading different components based on user choice like 
      simple chatting, viewing youtube video, playing multiplayer games etc.(add all these features.)
  if possible make this chat as chat bot kind of component so that it can be floating around with single button not blocking entire page.
      or else transparent overlay component which can be displayed on top of video player.
  Add database and save all data like users logegd in, messages sent, user is admin or not,yoube videos watch history etc.
  Add session once user joins a chat room and chat should be saved and retrieved from DB even if we refresh the page.
  Display joined username at top all the time. -- done
  After entering some data enter should click the button e.g. after room selection join button and after entering message send button.
  support to send emojis, gifs, images, videos when chatting.
   */



  user: String;
  room: String;
  messages: Array<{ user: String, message: String }> = [];
  messageText: String;
  data;

  videoUrl;

  displayVideo: boolean = false;

  youtubeVideoAddedByThisUser: boolean = false;
  userJoined: boolean = false;

  constructor(private chatSservice: ChatService, private sanitizer: DomSanitizer) {
    this.chatSservice.newUserJoined().subscribe(
      data => {
        this.messages.push(data);
      }
    );

    this.chatSservice.leftRoom().subscribe(
      data => {
        this.messages.push(data);
      }
    );

    this.chatSservice.newMessageReceived().subscribe(
      data => {
          this.messages.push(data);
      }
    );

    this.chatSservice.userDetails().subscribe(
      data => {
        console.log(data);
        this.data = data;
      }
    );
    this.chatSservice.newYoutubeVideoAdded().subscribe(
      (data: any) => {
        console.log(data);
        //commenting because not using iframe youtube embedded link, uncomment for using that.
        // this.addVideoToSiteWithoutSendingToServer(data.data.message.changingThisBreaksApplicationSecurity);
        this.addVideoToSiteWithoutSendingToServer(data.data.message);
      }
    );
  }

  join() {
    this.chatSservice.joinRoom({ user: this.user, room: this.room });
    this.userJoined = true;
  }

  leave() {
    this.chatSservice.leaveRoom({ user: this.user, room: this.room });
    this.userJoined = false;
  }

  sendMessage() {
    this.chatSservice.sendMessage({ user: this.user, room: this.room, message: this.messageText });
    this.messageText = '';
  }

  getUserDetails() {
    this.chatSservice.GetUserDetails({ user: this.user, room: this.room });
  }

  addVideoToSite(url: string) {
    /*     let embedUrl;
        console.log(url);
        if (url.includes('index')) {
          embedUrl = this.convertPlaylistUrlToNormalEmbedUrl(url);
        } else {
          embedUrl = this.convertNormalUrlToEmbed(url);
        }
        embedUrl += `?enablejsapi=1`;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        console.log(this.videoUrl); */
    console.log(url);
    this.videoUrl = url;
    this.displayVideo = true;

    this.youtubeVideoAddedByThisUser = true;
    this.chatSservice.addNewYoutubeVideo({ user: this.user, room: this.room, message: this.videoUrl });
  }

  displayVideoWithoutControls: boolean = false;
  addVideoToSiteWithoutSendingToServer(url: string) {
    /* let embedUrl;
    console.log(url);
    if (url.includes('index')) {
      embedUrl = this.convertPlaylistUrlToNormalEmbedUrl(url);
    } else {
      embedUrl = this.convertNormalUrlToEmbed(url);
    }
    embedUrl += `?controls=0&autoplay=0&showinfo=0&enablejsapi=1`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    console.log(this.videoUrl); */
    console.log(url);
    this.videoUrl = url;
    this.displayVideoWithoutControls = true;

  }

  /**
   * 
   * @param url Normal video url
   * from https://www.youtube.com/watch?v=9YffrCViTVk
      to https://www.youtube.com/embed/9YffrCViTVk

   * @returns Embed url for that video
   */
  convertNormalUrlToEmbed(url: string): string {
    let embedUrl = url.replace("watch?v=", "embed/");
    return embedUrl;
  }


  /**
   * 
   * @param url 
   * from https://www.youtube.com/watch?v=PSJiF18ewdo&list=PLGWM-WydG5jJWmFUe3l7YXAwFmMZWieW8&index=12
      to https://www.youtube.com/embed/PSJiF18ewdo?list=PLGWM-WydG5jJWmFUe3l7YXAwFmMZWieW8"
   * @returns 
   */
  convertPlaylistUrlToNormalEmbedUrl(url: string): string {
    let embedUrl = url.replace("watch?v=", "embed/");
    //split in order to remove last index part 
    let splitUrl = embedUrl.split("&");
    let requiredString = '';

    //not adding the last index part to the url.
    for (let i = 0; i < splitUrl.length - 1; i++) {
      requiredString += '&' + splitUrl[i];
    }

    //substring for removing the starting & added above.
    let result = requiredString.substring(1).replace("&", "?");
    return result;
  }
}
