import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//pages
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { MonitorPage } from '../pages/monitor/monitor';
import { ControllerPage } from '../pages/controller/controller';
import { OutlinePage } from '../pages/outline/outline';
import { HistoryPage } from '../pages/history/history';
//import { DetectPage } from '../pages/detect/detect';

import { Port3030Provider } from '../providers/port3030/port3030';
import { Port3000Provider } from '../providers/port3000/port3000';

import * as io from 'socket.io-client';

import { OneSignal } from '@ionic-native/onesignal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any;
  activeMenu: string;
  @ViewChild(Nav) nav: Nav;
  account: object = {};
  activePage: string = "main";

  statusMenuControl: boolean = false;

  socketOnOff: io.Socket;
  socketDetect: io.Socket;

  constructor(
    platform: Platform, statusBar: StatusBar,
    splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public events: Events,
    private port3030: Port3030Provider,
    public ToastController: ToastController,
    public oneSignal: OneSignal,
    private port3000: Port3000Provider,
  ) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      let ls = {
        email: localStorage.getItem('email'),
        fullName: localStorage.getItem('fullName'),
        homeID: localStorage.getItem('homeID'),
        jwt: localStorage.getItem('jwt'),
        token: localStorage.getItem('token')
      }

      if (ls.email && ls.fullName && ls.homeID && ls.jwt && ls.jwt && ls.token != null) {
        this.rootPage = MainPage;
      } else {
        this.rootPage = LoginPage;
      }

      events.subscribe('getAccount', () => {
        this.getAccount();
      });

      events.subscribe('connectNoti', () => {
        this.checkDetect();
        this.checkOnOff();
        this.connet();
        this.onDetectNoti();
        this.onDeviceNoti();
      });

      events.subscribe('checkDetect', () => {
        this.checkDetect();
      });

      events.subscribe('checkOnOff', () => {
        this.checkOnOff();
      });

      events.subscribe('onDetectNoti', () => {
        this.onDetectNoti();
      });

      events.subscribe('offDetectNoti', () => {
        this.offDetectNoti();
      });

      events.subscribe('onDeviceNoti', () => {
        this.onDeviceNoti();
      });

      events.subscribe('offDeviceNoti', () => {
        this.offDeviceNoti();
      });

      events.subscribe('alertError', (data) => {
        this.alertError(data);
      });

      platform.pause.subscribe(() => {
        this.socketDetect.disconnect();
        this.socketOnOff.disconnect();

        let check = localStorage.getItem('alertDetect');
        if (check == 'open') {
          this.socketDetect.disconnect();
        } else if (check == 'close') {
          this.socketDetect.disconnect();
          console.log('close socketIO for detect');
        }

        let check2 = localStorage.getItem('alertOnOff');
        if (check2 == 'open') {
          this.socketDetect.disconnect();
        } else if (check2 == 'close') {
          console.log('close socketIO for detect');
        }
        localStorage.setItem('first', '0');

      });

      platform.resume.subscribe(() => {
        this.checkDetect();
        this.checkOnOff();
        localStorage.setItem('first', '1');
      });


    });



  }

  menuControl() {
    if (this.statusMenuControl == true) {
      this.statusMenuControl = false;
    } else {
      this.statusMenuControl = true;
    }
  }

  setPage(page) {
    if (page == "main") {
      this.nav.setRoot(MainPage);
      this.activePage = "main";
    } else if (page == "monitor") {
      this.nav.setRoot(MonitorPage);
      this.activePage = "monitor";
    } else if (page == "normal") {
      this.nav.setRoot(ControllerPage);
      this.activePage = "normal";
    } else if (page == "outline") {
      this.nav.setRoot(OutlinePage);
      this.activePage = "outline";
    } else if (page == "history") {
      this.nav.setRoot(HistoryPage);
      this.activePage = "history";
    } else if (page == "logout") {
      this.alertLogout();
    }
  }

  getAccount() {
    this.account = {
      email: localStorage.getItem("email"),
      fullName: localStorage.getItem("fullName"),
      homeID: localStorage.getItem("homeID"),
      jwt: localStorage.getItem("jwt"),
      token: localStorage.getItem("token"),
    }
    return this.account;
  }

  checkActive(page) {
    return page == this.activePage;
  }

  // Alert Logout

  alertLogout() {
    let confirm = this.alertCtrl.create({
      title: '<img src="assets/out.png" /> ออกจากระบบ ?',
      message: '<p>คุณต้องการออกจากระบบใช่ไหม ?</p>',
      buttons: [
        {
          text: 'ไม่ใช่',
        },
        {
          text: 'ใช่',
          handler: () => {

            this.socketDetect.disconnect();
            this.socketOnOff.disconnect();
            this.cancelNoti();
            localStorage.clear();
            this.nav.setRoot(LoginPage);

          }
        },
      ]
    });
    confirm.present();
  }


  // Toast On/Off Realtime (Socket IO)=============

  //=======================================

  connectOnOff() {
    let homeID = localStorage.getItem('homeID');
    this.socketOnOff = io('http://kumnam.me:4040');
    this.socketOnOff.on('connect', () => {
      this.socketOnOff.emit('create', homeID);
      this.socketOnOff.on('on change', (data) => {
        this.presentToast(data.config, data.deviceName, data.time, data.user);
      })
    });

    this.socketOnOff.on('reconnect', (attemptNumber) => {
      this.socketOnOff.disconnect();
      this.connectOnOff();
    });

  }

  // Alert Toast in App ======================
  presentToast(config, deviceName, time, user) {

    let status;
    if (config == 'LOW') {
      status = 'ปิด'
    } else if (config == 'HIGH') {
      status = 'เปิด'
    }

    let toast = this.ToastController.create({
      message: deviceName + ' ' + status + ' โดย ' + user,
      duration: 1000,
      position: 'top',
      cssClass: config,
      closeButtonText: 'เสร็จสิ้น',
      showCloseButton: true,

    });
    toast.present();
  }

  // Check On Off alert
  checkOnOff() {

    let check = localStorage.getItem('alertOnOff');
    if (check == 'open') {
      this.connectOnOff();
      console.log('open socketIO for on off');
    } else if (check == 'close') {
      this.socketOnOff.disconnect();
      console.log('close socketIO for on off');
    }
  }
  //===============================================

  //=======================================


  connectDetect() {
    let homeID = localStorage.getItem('homeID');
    this.socketDetect = io('http://kumnam.me:4040');

    this.socketDetect.on('connect', () => {
      console.log('test');
      this.socketDetect.emit('create', homeID);
      this.socketDetect.on('on alert', (data) => {
        let foundLeak: Array<any> = [{}];
        foundLeak = data.foundLeak;
        let name = '';
        foundLeak.forEach(element => {
          name += element.deviceName + " ";
        });
        console.log(foundLeak);
        console.log(data);
        let detecyBy = data.detectBy;
        let deviceNameFL = name;
        this.showConfirm(detecyBy, deviceNameFL, data.foundLeakID, data.logToken);
      });

      this.socketDetect.on('on close', (data) => {
        console.log(data);
        let time = new Date(data.time);
        let msg = 'น้ำรั่วเมื่อเวลา ' + time.toLocaleString() + ' ถูกจัดการโดย ' + data.readBy + ' แล้ว';
        this.alertFinish2(msg, 'normal');
        this.confirm.dismiss();

      });

      this.socketDetect.on('on warning', (data) => {
        let deviceName = data.deviceName;
        //let deviceID = data.deviceID;
        let msg = 'พบการใช้น้ำผิดปกติที่อุปกรณ์ ' + deviceName;
        this.alertFinish2(msg, 'danger');
      });
    });

    this.socketDetect.on('reconnect', (attemptNumber) => {
      this.socketDetect.disconnect();
      this.connectDetect();
    });

  }

  confirm: any;
  // Alert น้ำรั่ว=============================================
  showConfirm(detectBy, deviceNameFL, foundLeakID, logToken) {
    this.confirm = this.alertCtrl.create({
      title: 'ตรวจพบน้ำรั่วโดย ' + detectBy,
      message: '<span>ตรวจพบน้ำรั่วที่อุปกรณ์ ' + deviceNameFL + ' ต้องการปิดน้ำหรือไม่</span>',
      buttons: [
        {
          text: 'ไม่ใช่',
          handler: () => {
            console.log('Disagree clicked');
            this.port3030.detecOn(foundLeakID, detectBy, logToken)
              .then(data => {

              }, error => {
                this.alertError(error.status);
              });
          }
        },
        {
          text: 'ใช่',
          handler: () => {
            console.log('ปิดน้ำ');
            this.port3030.detecOff(foundLeakID, detectBy, logToken)
              .then(data => {

              }, error => {
                this.alertError(error.status);
              });
          }
        }
      ]
    });
    this.confirm.present();
  }

  checkDetect() {
    let check = localStorage.getItem('alertDetect');

    if (check == 'open') {
      this.connectDetect();
      console.log('open socketIO for detect');
    } else if (check == 'close') {
      this.socketDetect.disconnect();
      console.log('close socketIO for detect');
    }
  }

  alertFinish2(msg, status?) {
    //toastDanger
    let toast;
    if (status == 'danger') {
      toast = this.ToastController.create({
        message: msg,
        duration: 5000,
        position: 'top',
        closeButtonText: 'เสร็จสิ้น',
        showCloseButton: true,
        cssClass: 'toastDanger'
      });
    } else if (status == 'normal') {
      toast = this.ToastController.create({
        message: msg,
        duration: 5000,
        position: 'top',
        closeButtonText: 'เสร็จสิ้น',
        showCloseButton: true,
      });
    } else if (status == 'secondary') {
      toast = this.ToastController.create({
        message: msg,
        duration: 5000,
        position: 'top',
        closeButtonText: 'เสร็จสิ้น',
        showCloseButton: true,
        cssClass: 'toastSecondary'
      });
    }

    toast.present();
  }
  //=============================================


  //========================================

  connet() {
    this.oneSignal.startInit('ff0d8f37-ae4f-4969-9195-a3bb0956c336', '342151305902');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      // do something when notification is received
    });
    this.oneSignal.handleNotificationOpened().subscribe((data) => {
    });
    this.oneSignal.endInit();
  }

  onDetectNoti() {

    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;
        let id;
        let obj;
        homes.forEach(home => {
          id = home._id + 'detect';
          obj = { [id]: 'detect' }
          this.oneSignal.sendTags(obj);
        });

      }, error => {
        console.log(error);
      });

  }

  offDetectNoti() {
    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;
        let id;
        let obj;
        homes.forEach(home => {
          id = home._id + 'detect';
          obj = { [id]: '' }
          this.oneSignal.sendTags(obj);
        });

      }, error => {
        console.log(error);
      });
  }

  onDeviceNoti() {

    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;
        let id;
        let obj;
        homes.forEach(home => {
          id = home._id + 'device';
          obj = { [id]: 'device' }
          this.oneSignal.sendTags(obj);
        });

      }, error => {
        console.log(error);
      });
  }


  offDeviceNoti() {
    this.port3000.getUserInformation()
      .then((data: any) => {
        let homes = data.homes;
        let id;
        let obj;
        homes.forEach(home => {
          id = home._id + 'device';
          obj = { [id]: '' }
          this.oneSignal.sendTags(obj);
        });

      }, error => {
        console.log(error);
      });
  }

  cancelNoti() {
    this.offDetectNoti();
    this.offDeviceNoti();
  }

  //alert error
  alertError(msg?) {
    if (msg == 0) {
      let alert = this.alertCtrl.create();
      alert.setTitle('<img src="assets/false.png"/> เชื่อมต่อล้มเหลว');
      alert.setMessage('<span>กรุณาตรวจสอบการเชื่อมต่อ<br>อินเตอร์เน็ตของท่าน</span>');
      alert.addButton({
        text: 'ตกลง'
      });
      alert.present();
    }
  }


}

