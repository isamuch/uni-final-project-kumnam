import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';
import { DatePipe } from '@angular/common';

import { Port3051Provider } from '../../providers/port3051/port3051';
import { Port3030Provider } from '../../providers/port3030/port3030';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-detect',
  templateUrl: 'detect.html',
})
export class DetectPage {

  @ViewChild(Content) content: Content;

  screen: boolean;

  //loader: any;
  logs: Array<Object> = [];
  show: boolean = false;
  length: any = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3051: Port3051Provider,
    private datePipe: DatePipe,
    private alertCtrl: AlertController,
    private port3030: Port3030Provider,
    public events: Events,) {
  }

  ionViewWillEnter() {
    this.content.resize();    
    this.getLog();
  }

  getLog(refresher?) {
    this.port3051.getLog()
      .then((data: any) => {
        console.log(data.length);

        this.logs = [];

        data.forEach(log => {
          let deviceName = "";
          let time = this.datePipe.transform(log.time, 'yyyy/M/dd HH:mm:ss');;
          let detect = log.detectBy;
          let token = log.token;
          let i = 0

          log.devicesName.forEach(device => {
            if (log.devicesName.length > 1) {
              if (i == log.devicesName.length-1){
                deviceName += device.deviceName;
              } else {
                deviceName += device.deviceName+",";
              }
            } else {
              deviceName += device.deviceName;
            }
            i++
          });

          let msg = {
            deviceName: deviceName,
            time: time,
            detect: detect,
            token: token,
            devicesID: log.devicesID
          };
          this.logs.push(msg);
          this.length = this.logs.length;
        });

        if (refresher){
          refresher.complete();
        }

          
        this.screen = true;
      }, error => {
        if (refresher){
          refresher.complete();
        }
        this.events.publish('alertError',error.status); 
      });
      
  }

  alert(devicesID, detect, device, token) {

    let alert = this.alertCtrl.create();
    alert.setTitle('<img src="assets/search.png"> ตรวจพบน้ำรั่ว โดย ' + detect);
    alert.setMessage('พบน้ำรั่วที่อุปกรณ์ [' + device + '] ต้องการปิดน้ำหรือไม่?');
    alert.addButton({
      text: 'ไม่ใช่',
      handler: data => {
        this.detectOn(devicesID, detect, token);
      }
    });
    alert.addButton({
      text: 'ใช่',
      handler: data => {
        this.detectOff(devicesID, detect, token);
      }
    });

    alert.present();
  }

  detectOn(devicesID, detectBy, token) {
    this.port3030.detecOn(devicesID, detectBy, token)
      .then(data => {
        this.getLog();
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }, error => {
        this.events.publish('alertError',error.status);
        this.getLog();        
      });
  }

  detectOff(devicesID, detectBy, token) {
    this.port3030.detecOff(devicesID, detectBy, token)
      .then(data => {
        this.getLog();      
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);

      }, error => {
        this.events.publish('alertError',error.status);        
        this.getLog();
      });
  }

  load(refresher) {
    this.content.resize();
    this.getLog(refresher);
  }

  doRefresh(refresher) {
    this.load(refresher);
  }

}
