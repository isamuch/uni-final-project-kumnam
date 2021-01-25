import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

import { Port3000Provider } from '../../providers/port3000/port3000';
import { Port3030Provider } from '../../providers/port3030/port3030';



@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  @ViewChild(Content) content: Content;

  screen: boolean;
  loadScreen: boolean = false;
  //loader: any;  
  fullName: string = "";
  email: string = "";
  homeName: string = "";
  mainDeviceID: string = "";
  mainDevice: string = "";
  sumDevice: any;
  homes: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3000: Port3000Provider,
    //public loadingCtrl: LoadingController,
    private port3030: Port3030Provider,
    private alertCtrl: AlertController,
    public events: Events) {
  }

  ionViewWillEnter() {
    //this.loading();
    this.content.resize();
    this.getUserInformation();
    this.checkOnOff();
    this.checkDetect();

  }


  getUserInformation() {
    this.port3000.getUserInformation()
      .then((data: any) => {
        this.fullName = data.fullName;
        this.email = data.email;
        console.log(data);

        let homeID = localStorage.getItem('homeID');

        this.homes = data.homes;

        data.homes.forEach(home => {
          if (home._id == homeID) {
            this.homeName = home.homeName;
            this.mainDeviceID = home.mainDevice;
          }
        });
        console.log(this.mainDeviceID);
        this.getDevice(this.mainDeviceID);

      }, error => {
        console.log(error);
        this.events.publish('alertError', error.status);

      });
  }

  //loading() {
  //  this.loader = this.loadingCtrl.create({
  //    content: `<p>กรุณารอสักครู่...</p>`,
  //  });
  //  this.loader.present();    
  //}

  getDevice(id) {
    this.port3030.getDevicesByHomeID()
      .then((data: any) => {
        let devices = data;

        if (id != null) {
          data.forEach(device => {
            if (device._id == id) {
              this.mainDevice = device.deviceName;
            }
          });
        } else {
          this.mainDevice = "";
        }

        this.sumDevice = devices.length;
        //this.loader.dismiss();
        //this.loadScreen = true;
        this.screen = true;
        console.log(this.loadScreen);
      }, error => {
        console.log(error);
        this.events.publish('alertError', error.status);
      });
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
        //this.loading();        
        this.changeDetect();
        this.changeOnOff();
        localStorage.setItem('homeID', data);
        this.getUserInformation();
      }
    });
    alert.present();
  }

  alertOnOff: boolean;
  alertDetect: boolean;

  changeOnOff() {
    let check = this.alertOnOff;
    if (check == true) {
      this.events.publish('onDeviceNoti');
    } else if (check == false) {
      this.events.publish('offDeviceNoti');
    }
  }

  changeDetect() {
    let check = this.alertDetect;
    if (check == true) {
      this.events.publish('onDetectNoti');
    } else if (check == false) {
      this.events.publish('offDetectNoti');
    }
  }


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

}
