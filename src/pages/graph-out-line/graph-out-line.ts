import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';

import { Chart } from 'chart.js';
import { Port3030Provider } from '../../providers/port3030/port3030';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-graph-out-line',
  templateUrl: 'graph-out-line.html',
})
export class GraphOutLinePage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild(Content) content: Content;

  loader: any;
  data: any;
  type: any = "ปริมาณน้ำ";
  deviceName: string = "";

  barChart: any;
  water: Array<any> = [];
  time: Array<any> = [];

  dataChart: Array<any> = [];



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3030: Port3030Provider,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events) {
    this.loading();
  }

  ionViewWillEnter() {
    this.loader.present();
    this.getData();
  }

  loading() {
    this.loader = this.loadingCtrl.create({
      content: `<p>กรุณารอสักครู่...</p>`,
    });
  }

  getData(refresher?) {
    this.data = this.navParams.get('data');
    this.deviceName = this.data.deviceName;
    this.getPatternByDeviceID(refresher);
  }

  createGraph() {

    let water = this.water;
    let time = this.time;

    if (this.type == "ปริมาณน้ำ") {

      this.barChart = new Chart(this.barCanvas.nativeElement, {

        type: 'bar',
        data: {
          labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
          datasets: [{
            label: "ลิตร",
            data: water,
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)'],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }

      });

    } else {

      this.barChart = new Chart(this.barCanvas.nativeElement, {

        type: 'bar',
        data: {
          labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
          datasets: [{
            label: "นาที",
            data: time,
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)'],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(54, 162, 235, 1)'],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }

      });

    }

    Chart.defaults.global.defaultFontColor = "#fff";
    Chart.defaults.global.defaultFontFamily = "Cloud-Light";

    this.barChart.update();

  }

  getPatternByDeviceID(refresher?) {
    let deviceID = this.data._id;
    this.port3030.getPatternByDeviceID(deviceID)
      .then((data: any) => {

        console.log(data);

        let days = data[deviceID];

        if (days.Monday != null) {
          let t: number = ((days.Monday.time_use_water.avr + days.Monday.time_use_water.sd) / 60);
          let w: number = ((days.Monday.quatity_of_water.avr + days.Monday.quatity_of_water.sd) / 1000);

          this.time.push(t.toFixed(2));
          this.water.push(w.toFixed(2));
        } else if (days.Monday == null) {
          this.time.push(0);
          this.water.push(0);
        }

        if (days.Tuesday != null) {
          let t: number = ((days.Tuesday.time_use_water.avr + days.Tuesday.time_use_water.sd) / 60);
          let w: number = ((days.Tuesday.quatity_of_water.avr + days.Tuesday.quatity_of_water.sd) / 1000);

          this.time.push(t.toFixed(2));
          this.water.push(w.toFixed(2));
        } else if (days.Tuesday == null) {
          this.time.push(0);
          this.water.push(0);
        }

        if (days.Wednesday != null) {
          let t: number = ((days.Wednesday.time_use_water.avr + days.Wednesday.time_use_water.sd) / 60);
          let w: number = ((days.Wednesday.quatity_of_water.avr + days.Wednesday.quatity_of_water.sd) / 1000);

          this.time.push(t.toFixed(2));
          this.water.push(w.toFixed(2));
        } else if (days.Wednesday == null) {
          this.time.push(0);
          this.water.push(0);
        }

        if (days.Thursday != null) {
          let t: number = ((days.Thursday.time_use_water.avr + days.Thursday.time_use_water.sd) / 60);
          let w: number = ((days.Thursday.quatity_of_water.avr + days.Thursday.quatity_of_water.sd) / 1000);

          this.time.push(t.toFixed(2));
          this.water.push(w.toFixed(2));
        } else if (days.Thursday == null) {
          this.time.push(0);
          this.water.push(0);
        }

        if (days.Friday != null) {
          let t: number = ((days.Friday.time_use_water.avr + days.Friday.time_use_water.sd) / 60);
          let w: number = ((days.Friday.quatity_of_water.avr + days.Friday.quatity_of_water.sd) / 1000);

          this.time.push(t.toFixed(2));
          this.water.push(w.toFixed(2));
        } else if (days.Friday == null) {
          this.time.push(0);
          this.water.push(0);
        }

        if (days.Saturday != null) {
          let t: number = ((days.Saturday.time_use_water.avr + days.Saturday.time_use_water.sd) / 60);
          let w: number = ((days.Saturday.quatity_of_water.avr + days.Saturday.quatity_of_water.sd) / 1000);

          this.time.push(t.toFixed(2));
          this.water.push(w.toFixed(2));
        } else if (days.Saturday == null) {
          this.time.push(0);
          this.water.push(0);
        }

        if (days.Sunday != null) {
          let t: number = ((days.Sunday.time_use_water.avr + days.Sunday.time_use_water.sd) / 60);
          let w: number = ((days.Sunday.quatity_of_water.avr + days.Sunday.quatity_of_water.sd) / 1000);

          this.time.push(t.toFixed(2));
          this.water.push(w.toFixed(2));
        } else if (days.Sunday == null) {
          this.time.push(0);
          this.water.push(0);
        }

        this.createGraph();
        console.log(this.time);
        console.log(this.water);

        if (refresher) {
          refresher.complete();
        } else {
          this.loader.dismiss();
        }

      }, error => {
        if (refresher) {
          refresher.complete();
        } else {
          this.loader.dismiss();
        }

        if (error.status == 404) {
          this.alertError(404);
        } else {
          this.events.publish('alertError', error.status);
          this.navCtrl.pop();
        }


      });
  }

  alertError(status) {

    let prompt = this.alertCtrl.create({
      title: "<img src='assets/false.png'> ไม่พบข้อมูล",
      message: "<span>ไม่มีข้อมูล Outline Detection <br>ในอุปกรณ์นี้ !</span>",
      buttons: [{
        text: "ตกลง",
        handler: () => {
          this.navCtrl.pop();
        }
      }],
    });
    prompt.present();
  }

  load(refresher) {
    this.content.resize();
    this.getData(refresher);
  }

  doRefresh(refresher) {
    console.log('1');
    this.load(refresher);
  }



}
