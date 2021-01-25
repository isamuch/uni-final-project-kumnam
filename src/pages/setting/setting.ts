import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, AlertController } from 'ionic-angular';

import { Port3000Provider } from '../../providers/port3000/port3000';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  @ViewChild(Content) content: Content;

  loader: any;
  alertOnOff: boolean;
  alertDetect: boolean;

  homeName: string;
  name: string;
  email: string;
  homes: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private events: Events,
    private port3000: Port3000Provider,
    private alertCtrl: AlertController) {
      this.loading();
  }

  ionViewWillEnter() {
    this.content.resize();
    this.loader.present();
    this.checkDetect();
    this.checkOnOff();
    this.getAccountDetail();
    this.getUserInformation();
  }

  loading() {
    this.loader = this.loadingCtrl.create({
      content: `<p>กรุณารอสักครู่...</p>`,
    });
  }

  // Change Alert =========================================================

  checkOnOff() {
    let check = localStorage.getItem("alertOnOff");
    if (check == "open") {
      this.alertOnOff = true;
    } else if (check == "close") {
      this.alertOnOff = false;
    }
  }

  checkDetect() {
    let check = localStorage.getItem("alertDetect");
    if (check == "open") {
      this.alertDetect = true;
    } else if (check == "close") {
      this.alertDetect = false;
    }
  }

  changeOnOff() {
    this.load();    
    let check = this.alertOnOff;
    if (check == true) {
      localStorage.setItem("alertOnOff", "open");
      this.events.publish('checkOnOff');
      this.events.publish('onDeviceNoti');
    } else if (check == false) {
      localStorage.setItem("alertOnOff", "close");
      this.events.publish('checkOnOff');
      this.events.publish('offDeviceNoti');      
    }
  }

  changeDetect() {
    this.load();
    let check = this.alertDetect;
    if (check == true) {
      localStorage.setItem("alertDetect", "open");
      this.events.publish('onDetectNoti');      
      this.events.publish('checkDetect');
    } else if (check == false) {
      localStorage.setItem("alertDetect", "close");
      this.events.publish('offDetectNoti');            
      this.events.publish('checkDetect');
    }
  }

  changeOnOff2() {
    let check = this.alertOnOff;
    if (check == true) {
      this.events.publish('onDeviceNoti');
    } else if (check == false) {
      this.events.publish('offDeviceNoti');      
    }
  }

  changeDetect2() {
    let check = this.alertDetect;
    if (check == true) {
      this.events.publish('onDetectNoti');      
    } else if (check == false) {
      this.events.publish('offDetectNoti');            
    }
  }

  // ===============================================================

  // Get Home Name ================================================

  getUserInformation(refresher?) {
    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;
        this.homes = homes;
        
        let homeID = localStorage.getItem('homeID');
        homes.forEach(home => {
          if (home._id == homeID) {
            this.homeName = home.homeName;
          }
        });

        if (refresher){
          refresher.complete();
        } else {
          this.loader.dismiss();
        }
      }, error => {
        this.events.publish('alertError',error.status); 
        if (refresher){
          refresher.complete();
        } else {
          this.loader.dismiss();
        }
      });
  }

  //===============================================================

  getAccountDetail() {
    let name = localStorage.getItem('fullName');
    let email = localStorage.getItem('email');

    this.name = name;
    this.email = email;
    
  }

  changeHome() {
    let alert = this.alertCtrl.create();
    alert.setTitle('<img src="assets/selectHome.png"> เลือกบ้าน');
    let homeID = localStorage.getItem('homeID');

    let homes = this.homes;
    homes.forEach(home => {
      if (homeID == home._id) {
        alert.addInput({
          type: 'radio',
          label: home.homeName,
          value: home._id,
          checked: true,
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: home.homeName,
          value: home._id,
        });
      }
    });
    alert.addButton('ยกเลิก');    
    alert.addButton({
      text: 'ตกลง',
      handler: data => {
        localStorage.setItem('homeID', data);
        this.getUserInformation();
        this.load();
        this.changeOnOff2();
        this.changeDetect2();
      }
    });
    alert.present();
  }

  load() {
    this.loader = this.loadingCtrl.create({
      content: `<p>กรุณารอสักครู่...</p>`,
      duration: 1000,
    });
    this.loader.present();
  }

  loadding(refresher) {
    this.content.resize();
    this.checkDetect();
    this.checkOnOff();
    this.getAccountDetail();
    this.getUserInformation(refresher);
  }

  doRefresh(refresher) {
    this.loadding(refresher);
  }


}
