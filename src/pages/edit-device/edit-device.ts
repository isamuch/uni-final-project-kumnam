import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Port3030Provider } from '../../providers/port3030/port3030';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-edit-device',
  templateUrl: 'edit-device.html',
})
export class EditDevicePage {

  @ViewChild(Content) content: Content;

  device: any = {};
  name: string;
  location: string;
  id: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3030: Port3030Provider,
    private alertCtrl: AlertController, ) {
  }

  ionViewWillEnter() {
    this.content.resize();    
    this.getDevice();
    this.name = this.device.deviceName;
    this.location = this.device.location;
    this.id = this.device._id;
  }


  getDevice(refresher?) {
    this.device = this.navParams.get('device');
    if (refresher){
      refresher.complete();
    }
  }

  saveDevice() {

    let id = this.id;
    let name = this.name;
    let location = this.location;

    console.log(name);
    console.log(location);
    console.log(id);

    if (this.name && this.location != "") {
      this.port3030.upDateDevice(id, name, location)
        .then(data => {
          let prompt = this.alertCtrl.create({
            title: "<img src='assets/true.png'> บันทึกข้อมูล",
            message: "<p>บันทึกข้อมูลสำเร็จ</p>",
            buttons: [{
              text: "ตกลง",
              handler: () => {
                this.navCtrl.pop();
              }
            }],
          });
          prompt.present();
        })

    } else {

      let prompt = this.alertCtrl.create({
        title: "<img src='assets/false.png'> รูปแบบไม่ถูกต้อง",
        message: "<span>ชื่ออุปกรณ์/ตำแหน่ง <br>ต้องมีอย่างน้อยหนึ่งตัวอักษร !</span>",
        buttons: [{
          text: "ตกลง"
        }],
      });
      prompt.present();

    }
  }

  load(refresher) {
    this.content.resize();
    this.name = this.device.deviceName;
    this.location = this.device.location;
    this.id = this.device._id;
    this.getDevice(refresher);
  }

  doRefresh(refresher) {
    console.log('1');
    this.load(refresher);
  }

}
