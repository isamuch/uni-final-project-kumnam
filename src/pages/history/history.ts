import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,Events } from 'ionic-angular';

import { DatePipe } from '@angular/common';
import { Port3052Provider } from '../../providers/port3052/port3052';


@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  //loader: any;

  eventSource;
  viewTitle;
  isToday: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  event: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private datepipe: DatePipe,
    private port3052: Port3052Provider,
    private alertCtrl: AlertController,
    public events: Events,
    //public loadingCtrl: LoadingController, 
  ) {
    //this.loading();
    this.event = "ไม่มีรายการใดบันทึก";
  }

  ionViewWillEnter() {
    //this.loader.present();
    //    this.loadEvents();
  }

  //loading() {
  //  this.loader = this.loadingCtrl.create({
  //    content: `<p>กรุณารอสักครู่...</p>`,
  //    duration: 200,
  //  });
  //}

  //+++++++++++++++++

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  today() {
    this.calendar.currentDate = new Date();
    let latest_date = this.datepipe.transform(new Date(), 'yyyy/M/d');
    this.getByDay(latest_date);
  }

  onTimeSelected(ev) {
    //console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
    //  (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    let latest_date = this.datepipe.transform(ev.selectedTime, 'yyyy/M/d');
    this.getByDay(latest_date);
  }

  //++++++++++++

  getByDay(day) {
    this.port3052.getByDay(day)
      .then((data: any) => {
        let realData = ((data.sumData / 1000) / 1000).toFixed(4)
        console.log(realData);
        this.event = day + " จำนวนการใช้น้ำ " + realData + " หน่วย";
        let txt1 = "จำนวนการใช้น้ำ " + realData + " หน่วย";
        let txt2 = "(" + day + ")";

        this.alert(txt1, txt2);
      }, error => {
        if (error.status == 0) {
          this.events.publish('alertError', error.status);
        } else {
          console.log(error);
          this.event = "ไม่มีรายการใดบันทึก";
          this.alert(this.event, "");
        }
      });
  }

  getByMonth() {
    let latest_date = this.datepipe.transform(this.viewTitle, 'yyyy/M');
    this.port3052.getByMonth(latest_date)
      .then((data: any) => {
        let realData = ((data.sumData / 1000) / 1000).toFixed(4)
        let cost = (data.cost).toFixed(2);
        let text1 = realData + " หน่วย ";
        let text2 = "(" + cost + " บาท)";
        this.showCostMonth(text1, text2);
      }, error => {
        this.events.publish('alertError',error.status); 
        console.log(error);
      });
  }

  showCostMonth(text1, text2) {
    let alert = this.alertCtrl.create();
    alert.setTitle("<img src='assets/coins.png'> จำนวนค่าใช้จ่าย");
    alert.setMessage('<p>' + text1 + text2 + '</p>');
    alert.addButton({
      text: 'ตกลง'
    });
    alert.present();
  }

  alert(txt1, txt2) {
    let alert = this.alertCtrl.create();
    alert.setTitle("<img src='assets/drop.png'> จำนวนการใช้น้ำ");
    alert.setMessage(`<p>` + txt1 + `<br>` + txt2 + `</p>`);
    alert.addButton({
      text: 'ตกลง'
    });
    alert.present();
  }

  //createRandomEvents() {
  //  console.log('ok');
  //  var events = [];
  //  for (var i = 0; i < 50; i += 1) {
  //    var date = new Date();
  //    var eventType = Math.floor(Math.random() * 2);
  //    var startDay = Math.floor(Math.random() * 90) - 45;
  //    var endDay = Math.floor(Math.random() * 2) + startDay;
  //    var startTime;
  //    var endTime;
  //    if (eventType === 0) {
  //      startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
  //      if (endDay === startDay) {
  //        endDay += 1;
  //      }
  //      endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
  //      events.push({
  //        title: 'All Day - ' + i,
  //        startTime: startTime,
  //        endTime: endTime,
  //        allDay: true
  //      });
  //    }
  //  }
  //  return events;
  //}
//
  //loadEvents() {
  //  this.eventSource = this.createRandomEvents();
  //}





}
