import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Port3000Provider } from '../../providers/port3000/port3000';

import * as io from "socket.io-client";

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

import { Chart } from 'chart.js';



@IonicPage()
@Component({
  selector: 'page-show-graph',
  templateUrl: 'show-graph.html',
})
export class ShowGraphPage {

  loader: any;

  @ViewChild(Content) content: Content;
  @ViewChild('lineCanvas') lineCanvas;

  lineChart: any;
  socket: io.Socket;
  data: any;
  dataChart: Array<any> = [];
  label: Array<any> = [];

  homeName: string;
  deviceName: string;
  location: string;
  available: boolean;
  deviceID: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3000: Port3000Provider,
    public loadingCtrl: LoadingController, ) {
    this.loading();
  }

  ionViewWillEnter() {
    this.loader.present();
    this.content.resize();
    this.data = 0;
    this.getDevice();
    this.createGraph();
    this.realTimeDataFromArduino();
  }

  ionViewWillLeave() {
    console.log('Fuck Me');
    this.socket.disconnect();
  }

  loading() {
    this.loader = this.loadingCtrl.create({
      content: `<p>กรุณารอสักครู่...</p>`,
    });
  }

  getDevice() {
    let _homeID = localStorage.getItem('homeID');
    this.getHomeName(_homeID);
    let device = this.navParams.get('device');

    let _deviceName = device.deviceName;
    let _location = device.location;
    let _available = device.available;
    let _deviceID = device._id;

    this.deviceName = _deviceName;
    this.location = _location;
    this.available = _available;
    this.deviceID = _deviceID;
  }

  getHomeName(id) {
    let homeID = id;
    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;

        homes.forEach(home => {
          let _homeID = home._id
          if (homeID == _homeID) {
            let _homeName = home.homeName;
            this.homeName = _homeName;
          }
        });
      }, error => {
        alert(error);
      });
  }

  realTimeDataFromArduino() {
    let homeID = localStorage.getItem('homeID');
    this.socket = io('http://kumnam.me:4000');

    this.socket.on('connect', () => {
      this.socket.emit('create', homeID);
      this.socket.on('added', (data) => {

        let _deviceID = this.deviceID;
        let dataDeviceID = data.deviceID;

        if (_deviceID == dataDeviceID) {
          let realData = ((data.data / 1000) * 60).toFixed(2);
          this.data = realData;

          let dataChart = ((data.data / 1000)).toFixed(2);

          this.dataChart.push(dataChart);
          this.label.push("");

          if (this.dataChart.length > 20) {
            this.dataChart.shift();
            this.label.shift();
          }
          this.lineChart.update();
        }
      });
      this.loader.dismiss();
    });

  }

  createGraph() {

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      responsive: true,
      animation: true,
      data: {
        labels: this.label,
        datasets: [
          {
            label: 'ลิตร/วินาที',
            data: this.dataChart,
            backgroundColor: [// 'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)'//'rgba(255, 206, 86, 0.2)',
              //'rgba(75, 192, 192, 0.2)',
              //'rgba(153, 102, 255, 0.7)'
              //'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [//'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)'//'rgba(255, 206, 86, 1)',
              //'rgba(75, 192, 192, 1)',
              //'rgba(153, 102, 255, 1)'
              //'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
          }
        ]
      }, options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });

    Chart.defaults.global.defaultFontColor = "#fff";
    Chart.defaults.global.defaultFontFamily = "Cloud-Light";

  }

}
