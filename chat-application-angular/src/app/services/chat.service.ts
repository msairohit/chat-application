import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  private socket = io('http://localhost:3000');

  joinRoom(data) {
    this.socket.emit('join', data);
  }

  newUserJoined() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('new user joined', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  leaveRoom(data) {
    this.socket.emit('leave', data);
  }

  leftRoom() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('left room', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  sendMessage(data) {
    this.socket.emit('message', data);
  }

  GetUserDetails(data) {
    this.socket.emit('get data', data);
  }

  newMessageReceived() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('new message', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  userDetails() {
    // { user: String, message: String, noOfMessages: string}
    let observable = new Observable<any>(observer => {
      this.socket.on('all users', (data: any) => {
        console.log(data);
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  addNewYoutubeVideo(data: { user: String; room: String; message: any; }) {
    this.socket.emit('add youtube video', data);
  }

  newYoutubeVideoAdded() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('youtube video added', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  videoPaused(data: { user: any; room: any; }) {
    this.socket.emit('videoPaused', data);
  }

  pauseVideo() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('pause video', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }

  videoResumed(data: { user: any; room: any; }) {
    this.socket.emit('videoResumed', data);
  }

  resumeVideo() {
    let observable = new Observable<{ user: String, message: String }>(observer => {
      this.socket.on('resume video', data => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); }
    });

    return observable;
  }
}
