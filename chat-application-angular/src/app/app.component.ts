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
  user: String;
  room: String;
  FromMessageArray: Array<{ user: String, message: String }> = [];
  ToMessageArray: Array<{ user: String, message: String }> = [];
  messageText: String;
  data;

  videoUrl;

  displayVideo: boolean = false;

  youtubeVideoAddedByThisUser: boolean = false;

  constructor(private chatSservice: ChatService, private sanitizer: DomSanitizer) {
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
