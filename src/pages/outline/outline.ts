import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';

import { Port3030Provider } from '../../providers/port3030/port3030';

import { GraphOutLinePage } from '../../pages/graph-out-line/graph-out-line';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-outline',
  templateUrl: 'outline.html',
})
export class OutlinePage {

  @ViewChild(Content) content: Content;

  loader: any;

  idDevices: Array<any> = [];
  devices: Array<{
    _id: string,
    deviceName: string,
    sun: {
      created_pattern: boolean,
      week_of_lenarned: number,
    },
    mon: {
      created_pattern: boolean,
      week_of_lenarned: number,
    },
    tues: {
      created_pattern: boolean,
      week_of_lenarned: number,
    },
    wed: {
      created_pattern: boolean,
      week_of_lenarned: number,
    },
    thurs: {
      created_pattern: boolean,
      week_of_lenarned: number,
    },
    fri: {
      created_pattern: boolean,
      week_of_lenarned: number,
    },
    sat: {
      created_pattern: boolean,
      week_of_lenarned: number,
    },
    quatity_of_water: Array<any>,
    time_use_water: Array<any>,

  }> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3030: Port3030Provider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public events: Events) {
  }

  ionViewWillEnter() {
    this.loading();
    this.content.resize();
    this.getDeviceByHomeID();
  }

  loading() {
    this.loader = this.loadingCtrl.create({
      content: `<p>กรุณารอสักครู่...</p>`,
    });
    this.loader.present();
  }

  getDeviceByHomeID(refresher?) {
    this.port3030.getDevicesByHomeID()
      .then((data: any) => {
        this.idDevices = data;
        data.forEach(device => {
          this.devices[device._id] = {
            _id: device._id,
            deviceName: device.deviceName,
            sun: {
              created_pattern: false,
              week_of_lenarned: 0,
            },
            mon: {
              created_pattern: false,
              week_of_lenarned: 0,
            },
            tues: {
              created_pattern: false,
              week_of_lenarned: 0,
            },
            wed: {
              created_pattern: false,
              week_of_lenarned: 0,
            },
            thurs: {
              created_pattern: false,
              week_of_lenarned: 0,
            },
            fri: {
              created_pattern: false,
              week_of_lenarned: 0,
            },
            sat: {
              created_pattern: false,
              week_of_lenarned: 0,
            },
            quatity_of_water: [],
            time_use_water: [],
          }
        });
        this.getOutlineByHomeID(refresher);
      }, error => {
        this.events.publish('alertError', error.status);
        if (refresher) {
          refresher.complete();
        } else {
          this.loader.dismiss();
        }
      });
  }

  getOutlineByHomeID(refresher?) {
    this.port3030.getOutlineByHomeID()
      .then((data: any) => {
        data.forEach(data => {
          if (data.day == "Sunday") {
            this.devices[data.deviceID].sun.week_of_lenarned = data.week_of_learned;
            this.devices[data.deviceID].sun.created_pattern = data.created_pattern;
          } else if (data.day == "Monday") {
            this.devices[data.deviceID].mon.week_of_lenarned = data.week_of_learned;
            this.devices[data.deviceID].mon.created_pattern = data.created_pattern;
          } else if (data.day == "Tuesday") {
            this.devices[data.deviceID].tues.week_of_lenarned = data.week_of_learned;
            this.devices[data.deviceID].tues.created_pattern = data.created_pattern;
          } else if (data.day == "Wednesday") {
            this.devices[data.deviceID].wed.week_of_lenarned = data.week_of_learned;
            this.devices[data.deviceID].wed.created_pattern = data.created_pattern;
          } else if (data.day == "Thursday") {
            this.devices[data.deviceID].thurs.week_of_lenarned = data.week_of_learned;
            this.devices[data.deviceID].thurs.created_pattern = data.created_pattern;
          } else if (data.day == "Friday") {
            this.devices[data.deviceID].fri.week_of_lenarned = data.week_of_learned;
            this.devices[data.deviceID].fri.created_pattern = data.created_pattern;
          } else if (data.day == "Saturday") {
            this.devices[data.deviceID].sat.week_of_lenarned = data.week_of_learned;
            this.devices[data.deviceID].sat.created_pattern = data.created_pattern;
          }

          this.devices[data.deviceID].quatity_of_water = data.quatity_of_water;
          this.devices[data.deviceID].time_use_water = data.time_use_water;

        });
        if (refresher) {
          refresher.complete();
        } else {
          this.loader.dismiss();
        }
      }, error => {
        this.events.publish('alertError', error.status);
        if (refresher) {
          refresher.complete();
        } else {
          this.loader.dismiss();
        }
      });
  }

  showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('<img src="assets/recycling-water.png"> เรียนรู้ใหม่');

    let i = 0;

    this.idDevices.forEach(device => {
      if (i == 0) {
        alert.addInput({
          type: 'radio',
          label: device.deviceName,
          value: device._id,
          checked: true
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: device.deviceName,
          value: device._id
        });
      }
      i++;
    });
    alert.addButton('ไม่ใช่');
    alert.addButton({
      text: 'ใช่',
      handler: data => {

        this.port3030.delPattern(data)
          .then((data: any) => {
            this.alert();
            console.log(data);
          }, error => {
            this.alertError(error.status);
          });

      }
    });
    alert.present();
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle('<img src="assets/graph.png"> Graph Paterrns');

    let i = 0;

    this.idDevices.forEach(device => {

      if (i == 0) {
        alert.addInput({
          type: 'radio',
          label: device.deviceName,
          value: device._id,
          checked: true,
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: device.deviceName,
          value: device._id
        });
      }

      i++;
    });
    alert.addButton('ไม่ใช่');
    alert.addButton({
      text: 'ใช่',
      handler: data => {
        this.pushPage(data);
      }
    });
    alert.present();
  }

  pushPage(id) {
    if (id != null) {
      this.navCtrl.push(GraphOutLinePage, { data: this.devices[id] });
    }

  }

  alertError(msg) {
    this.events.publish('alertError', msg);
  }

  alert() {
    let prompt = this.alertCtrl.create({
      title: "<img src='assets/true.png'> อัพเดทสำเร็จ",
      message: "<p>รีเซทข้อมูลสำเร็จ</p>",
      buttons: [{
        text: "ตกลง",
        handler: () => {
          this.getDeviceByHomeID();
        }
      }],
    });
    prompt.present();
  }

  load(refresher) {
    this.content.resize();
    this.getDeviceByHomeID(refresher);
  }

  doRefresh(refresher) {
    this.load(refresher);
  }




}
