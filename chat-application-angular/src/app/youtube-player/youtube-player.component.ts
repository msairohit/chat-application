import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.css']
})
export class YoutubePlayerComponent implements OnInit {

  // https://gouravkajal.medium.com/integrate-youtube-iframe-player-api-in-angular-98ab9661aff6

  @Input() completeVideoUrl: any;

  @Input() displayControls: any = 1;

  @Input() autoplay: any = 1;

  @Input() videoOwner: any = false;

  @Input() user: any = '';

  @Input() room: any = '';

  styles = {
    'pointer-events': this.displayControls == 1 ? 'auto' : 'none'
  };

  constructor(private chatService: ChatService) {
    this.chatService.pauseVideo().subscribe(
      (data: any) => {
        console.log(data);
        this.pauseVideo();
      }
    );

    this.chatService.resumeVideo().subscribe(
      (data: any) => {
        console.log(data);
        this.playVideo();
      }
    );
  }

  /* 1. Some required variables which will be used by YT API*/
  public YT: any;
  public video: any;
  public player: any;
  public reframed: Boolean = false;

  rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

  ngOnInit(): void {

    this.video = 'nRiOw3qGYq4';

    let r = this.completeVideoUrl.match(this.rx);
    console.log(r[1]);
    this.video = r[1];
    this.init();

  }

  /* 2. Initialize method for YT IFrame API */
  init() {
    // Return if Player is already created
    if (window['YT']) {
      this.startVideo();
      return;
    }

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    /* 3. startVideo() will create an <iframe> (and YouTube player) after the API code downloads. */
    window['onYouTubeIframeAPIReady'] = () => this.startVideo();
  }

  startVideo() {
    this.reframed = false;
    // controls=0&autoplay=0&showinfo=0
    this.player = new window['YT'].Player('player', {
      videoId: this.video,
      height: '315',
      width: '560',
      allowfullscreen: 1,
      playerVars: {
        autoplay: this.autoplay,
        modestbranding: 1,
        controls: /* this.displayControls */1,
        disablekb: 1,
        rel: 0,
        showinfo: 1,
        fs: 0,
        playsinline: 1,
        allowfullscreen: 1

      },
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this),
        'onError': this.onPlayerError.bind(this),
        'onReady': this.onPlayerReady.bind(this),
      }
    });

  }

  getStyles() {
    this.styles = {
      'pointer-events': this.displayControls == 1 ? 'auto' : 'none'
    };
  }

  /* 4. It will be called when the Video Player is ready */
  onPlayerReady(event) {
    // event.target.mute();
    event.target.playVideo();
  }

  /* 5. API will call this function when Player State changes like PLAYING, PAUSED, ENDED */
  onPlayerStateChange(event) {
    console.log(event);
    console.log(`video owner: ` + this.videoOwner);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          //send socket to start all users video if current user is video owner.
          console.log('playing ' + this.cleanTime())
        };
        // if(this.videoOwner)
        this.chatService.videoResumed({ user: this.user, room: this.room/* , message: this.videoUrl  */ });
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        };
        //Uncomment if we want to enable pause for others video only for the video owner.
        // if(this.videoOwner)
        this.chatService.videoPaused({ user: this.user, room: this.room/* , message: this.videoUrl  */ });
        //send socket to pause all users video if current user is video owner.
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    };
  };

  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  };

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };

  pauseVideo() {
    console.log("pause video.");
    this.player.pauseVideo();
  }

  playVideo() {
    console.log("video un paused.")
    this.player.playVideo();
  }

}
