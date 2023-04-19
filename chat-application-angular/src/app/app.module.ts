import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { RpsComponent } from './games/rps/rps.component';

@NgModule({
  declarations: [
    AppComponent,
    YoutubePlayerComponent,
    RpsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
