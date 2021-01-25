import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';

import { Port3030Provider } from '../../providers/port3030/port3030';
import { Port9090Provider } from '../../providers/port9090/port9090';
import { Port3000Provider } from '../../providers/port3000/port3000';

import { AddDevicePage } from '../add-device/add-device';
import { EditDevicePage } from '../edit-device/edit-device';

//import { Keyboard } from '@ionic-native/keyboard';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({

  selector: 'page-controller',
  templateUrl: 'controller.html',
})
export class ControllerPage {
  //loader: any;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3030: Port3030Provider,
    private port9090: Port9090Provider,
    private port3000: Port3000Provider,
    public alertCtrl: AlertController,
    public events: Events,
    //public loadingCtrl: LoadingController
    //private keyboard: Keyboard,
  ) {
  }

  screen: boolean;
  length: any;
  devices: Object;
  available: Array<boolean> = [];
  mainDevice: string;

  ionViewWillEnter() {
    //this.loading();    
    this.content.resize();
    this.getDeviceByHome();
    this.setMainDevice(0);
  }

  //loading() {
  //  this.loader = this.loadingCtrl.create({
  //    content: `<p>กรุณารอสักครู่...</p>`,
  //  });
  //  this.loader.present();    
  //}

  load(refresher) {
    this.content.resize();
    this.getDeviceByHome();
    this.setMainDevice(refresher);
  }


  getDeviceByHome() {
    this.port3030.getDevicesByHomeID()
      .then((data: any) => {
        this.devices = data;

        let length: any = data;
        this.length = length;

        data.forEach(device => {
          this.available[device._id] = device.available;
        });
      }, error => {
        console.log(error);
      });
  }

  checkAvailable(id, deviceName) {

    if (this.available[id] == true) {
      this.available[id] = true;
    } else {
      this.available[id] = false;
    }

    let email = localStorage.getItem('email');
    let homeID = localStorage.getItem('homeID');

    if (this.available[id] == true) {
      this.port9090.turnOnDevice(id, email, homeID, deviceName);
    } else {
      this.port9090.turnOffDevice(id, email, homeID, deviceName);
    }

  }

  setMainDevice(refresher) {
    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;
        let homeID = localStorage.getItem('homeID');
        homes.forEach(home => {
          if (homeID == home._id) {
            this.mainDevice = home.mainDevice;
          }
        });
        this.screen = true;
        
        if (refresher){
          if (refresher != 0){
            refresher.complete();
            console.log('refresher.complete();');
          }
        }
        //this.loader.dismiss();
      }, error => {
        this.events.publish('alertError',error.status); 
        console.log(error);
      });
  }

  delete(id) {
    let prompt = this.alertCtrl.create({
      title: '<img src="assets/delete.png" /> ลบอุปกรณ์ ?',
      message: '<p>***หากลบไปเเล้วต้องใช้ไอดีของอุปกรณ์<br>ในการเพิ่มใหม่ !</p>',
      buttons: [{
        text: 'ไม่ใช่',
        handler: data => {
          console.log('fuck you');
        }
      }, {
        text: 'ใช่',
        handler: data => {
          this.port3030.deleteDevice(id)
            .then((data: any) => {
              this.load(0);
              this.alertDel('pass');
              console.log(data);
            }, error => {
              console.log(error);
              this.alertDel('fail');
              
            });
          console.log('fuck me');
        }
      }]
    });
    prompt.present();
  }

  setting(device) {
    let prompt = this.alertCtrl.create({
      title: '<img src="assets/edit.png" /> แก้ไขอุปกรณ์ ?',
      message: '<span>คุณต้องการแก้ไขอุปกรณ์ใช่หรือไม่</span>',
      buttons: [{
        text: 'ไม่ใช่'
      }, {
        text: 'ใช่',
        handler: data => {
          this.navCtrl.push(EditDevicePage, { device: device });
        }
      }
      ]
    });
    prompt.present();
  }

  add() {
    let prompt = this.alertCtrl.create({
      title: '<img src="assets/add_device.png"/> เพิ่มอุปกรณ์ ?',
      message: '<span>คุณต้องการเพิ่มอุปกรณ์ใช่หรือไม่</span>',
      buttons: [{
        text: 'ไม่ใช่'
      }, {
        text: 'ใช่',
        handler: data => {
          this.navCtrl.push(AddDevicePage, { devices: this.devices });
        }
      }
      ]
    });
    prompt.present();
  }

  alertDel(msg) {
    let alert;
    if (msg == 'pass'){
      alert = this.alertCtrl.create();
      alert.setTitle('<img src="assets/true.png"> ลบอุปกรณ์สำเร็จ');
      alert.addButton('ตกลง');
      alert.present();
    } else if (msg == 'fail') {
      alert = this.alertCtrl.create();
      alert.setTitle('<img src="assets/false.png"> ลบอุปกรณ์ไม่สำเร็จ');
      alert.addButton('ตกลง');
      alert.present();
    }
  }


  doRefresh(refresher) {
    console.log(refresher);
    this.load(refresher);
  }

}
