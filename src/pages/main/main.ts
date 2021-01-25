import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { SettingMainPage } from '../setting-main/setting-main';
import { ControllerPage } from '../controller/controller';
import { MonitorPage } from '../monitor/monitor';
import { DetectPage } from '../detect/detect';
import { HistoryPage } from '../history/history';
import { SettingPage } from '../setting/setting';
import { AccountPage } from '../account/account';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

import { Port3000Provider } from '../../providers/port3000/port3000';
import { Port3051Provider } from '../../providers/port3051/port3051';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';



@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  @ViewChild(Content) content: Content;

  homeName: string = "";
  detectLenght: any = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private port3000: Port3000Provider,
    private youtube: YoutubeVideoPlayer,
    private port3051: Port3051Provider) {
    this.events.subscribe('detectPage', () => {
      this.pushPage("detections");
    });
    this.checkFirstTime();
  }



  ionViewWillEnter() {
    this.content.resize();
    this.getLogDetect();
  }

  checkFirstTime() {
    let ft = localStorage.getItem('first');
    console.log(ft);
    if (ft == "0") {
      localStorage.setItem('first', "1");
      this.events.publish('connectNoti');
    }

  }

  pushPage(page) {
    if (page == "settingHome") {
      this.navCtrl.push(SettingMainPage, { pages: 'setting' });
    } else if (page == "unitSet") {
      this.navCtrl.push(SettingMainPage, { pages: 'unitSet' });
    } else if (page == "member") {
      this.navCtrl.push(SettingMainPage, { pages: 'member' });
    } else if (page == "controller") {
      this.navCtrl.push(ControllerPage);
    } else if (page == "graph") {
      this.navCtrl.push(MonitorPage);
    } else if (page == "detections") {
      this.navCtrl.push(DetectPage);
    } else if (page == "history") {
      this.navCtrl.push(HistoryPage);
    } else if (page == "setting") {
      this.navCtrl.push(SettingPage);
    } else if (page == "account") {
      this.navCtrl.push(AccountPage);
    } else if (page == "about") {
      this.youtube.openVideo('tnkxhL4KTE8&feature=youtu.be');
    }
  }

  getUserInformation() {
    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;
        let homeID = localStorage.getItem('homeID');
        homes.forEach(home => {
          if (home._id == homeID) {
            this.homeName = home.homeName;
          }
        });


      }, error => {
        this.events.publish('alertError', error.status);

      });
  }


  getLogDetect() {
    this.port3051.getLog()
      .then((data: any) => {
        this.detectLenght = data.length;
        this.getUserInformation();
       }, error => { 
        this.events.publish('alertError', error.status);
      });
  }


}
