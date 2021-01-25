import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

//import { Keyboard } from '@ionic-native/keyboard';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

import { Port3030Provider } from '../../providers/port3030/port3030';


@IonicPage()
@Component({
  selector: 'page-add-device',
  templateUrl: 'add-device.html',
})
export class AddDevicePage {
  //loader: any;

  @ViewChild(Content) content: Content;

  idDevice: string;
  nameDevice: string;
  location: string;
  parentID: string;
  devices: any;
  parentName: string;
  check: boolean;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    //private keyboard: Keyboard
    private port3030: Port3030Provider,
    public events: Events,
    //public loadingCtrl: LoadingController,
  ) {
    //this.loading();
  }

  ionViewWillEnter() {
    //this.loader.present();    
    this.content.resize();
    this.devices = this.navParams.get('devices');
    this.parentName = "เลือกอุปกรณ์ก่อนหน้า";
    this.check = false;
    //this.loader.dismiss();    
  }


  //loading() {
  //  this.loader = this.loadingCtrl.create({
  //    content: `<p>กรุณารอสักครู่...</p>`,
  //  });
  //}

  showParentDevice() {

    let alert = this.alertCtrl.create();
    alert.setTitle('เลือกอุปกรณ์ก่อนหน้า');

    let deviceName: any = [];

    this.devices.forEach(device => {
      alert.addInput({
        type: 'radio',
        label: device.deviceName,
        value: device._id,
      });

      deviceName[device._id] = device.deviceName;
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.parentName = deviceName[data];
        this.check = true;
        //this.keyboard.close();
        //this.keyboard.disableScroll(false);
        //this.keyboard.onKeyboardHide();   

      }
    });

    alert.present();
  }

  addDevice() {

    let deviceID = this.idDevice;
    let deviceName = this.nameDevice;
    let deviceLocation = this.location;
    let parentName = this.parentName;
    let parentID;

    if (this.devices != null) {
      this.devices.forEach(device => {
        if (device.deviceName == parentName) {
          parentID = device._id;
        }
      });
    }


    console.log(deviceID);
    console.log(deviceName);
    console.log(deviceLocation);
    console.log(parentID);

    let alert = this.alertCtrl.create();
    alert.setTitle('เพิ่มอุปกรณ์ ?');
    alert.setMessage('คุณยืนยันที่จะเพิ่มอุปกรณ์ใช่ไหม');
    alert.addButton({
      text: 'ไม่ใช่',
    });
    alert.addButton({
      text: 'ใช่',
      handler: data => {

        this.port3030.addDeviceToHome(deviceID, deviceName, deviceLocation, parentID)
          .then(data => {
            this.showPass();
            console.log('pass');
            console.log(data);
          }, error => {
            if (error.status == 0) {
              this.events.publish('alertError', error.status);
            } else {
              this.showError();
              console.log('not pass');
              console.log(error.status);
            }
          });

      }
    });


    alert.present();

  }

  showError() {
    let alert = this.alertCtrl.create();
    alert.setTitle('<img src="assets/false.png"> ข้อมูลไม่ถูกต้อง');
    alert.setMessage('<p>กรุณาตรวจสอบความถูกต้อง</p>');
    alert.addButton('ตกลง');
    alert.present();
  }

  showPass() {
    let alert = this.alertCtrl.create();
    alert.setTitle('<img src="assets/true.png"> เพิ่มอุปกรณ์สำเร็จ');
    alert.setMessage('<p>เพิ่มอุปกรณ์ลงในบ้านสำเร็จ</p>');
    alert.addButton({
      text: 'ตกลง',
      handler: () => {
        this.navCtrl.pop();
      }
    });
    alert.present();
  }

}
