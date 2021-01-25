import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  @ViewChild(Content) content: Content;   
  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private youtube: YoutubeVideoPlayer) {
  }

  ionViewWillEnter() {
    this.content.resize();   
    this.youtube.openVideo('tnkxhL4KTE8&feature=youtu.be');   
  }

  
  


}
