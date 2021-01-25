import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';

import { ShowGraphPage } from '../show-graph/show-graph';

import { Port3030Provider } from '../../providers/port3030/port3030';

import * as io from "socket.io-client";

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-monitor',
  templateUrl: 'monitor.html',
})
export class MonitorPage {

  @ViewChild(Content) content: Content;

  screen: boolean = false;

  socket: io.Socket;
  devices: Array<any> = [{}];
  data: Array<any> = [{}];
  data2: any;
  length: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3030: Port3030Provider,
    private alertCtrl: AlertController,) {
  }

  ionViewWillEnter() {
    this.content.resize();
    this.getDevices(0);
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }


  toShowGraph(device) {
    this.navCtrl.push(ShowGraphPage, {
      'device': device,
    });
  }

  getDevices(refresher) {

    this.port3030.getDevicesByHomeID()
      .then((data: any) => {
        this.devices = data;
        let length = data;
        this.length = length.length;

        data.forEach(device => {
          this.data[device._id] = 0;
        });
        this.realTimeDataFromArduino();
        this.screen = true;
        console.log('2');

        if (refresher) {
          console.log('3');
          refresher.complete();
        }
        
      }, error => {
        alert(error);
        console.log(error);
        this.screen = true;        
      });
  }

  showIdDevice(id, name) {
    let alert = this.alertCtrl.create();
    alert.setTitle('<img src="assets/cpu.png"> ไอดีของ ' + name);
    alert.setMessage(id);
    alert.addButton({
      text: 'ตกลง'
    });
    alert.present();

  }

  realTimeDataFromArduino() {
    let homeID = localStorage.getItem('homeID');
    this.socket = io('http://kumnam.me:4000');

    this.socket.on('connect', () => {
      this.socket.emit('create', homeID);
      this.socket.on('added', (data) => {
        let realData = ((data.data / 1000) * 60).toFixed(2);
        this.data[data.deviceID] = realData;
        console.log("fuck from monitor");
      });
    });
  }

  load(refresher) {
    this.content.resize();
    this.getDevices(refresher);
  }

  doRefresh(refresher) {
    this.load(refresher);
  }

}
