import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';

import { Port3000Provider } from '../../providers/port3000/port3000';
import { MainPage } from '../main/main';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})


export class LoginPage {

  loader: any;

  email: string = "";
  password: string = "";

  checkHide: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private port3000: Port3000Provider,
    public menu: MenuController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

    this.menu.enable(false, "myMenu");
  }

  ionViewDidLoad() {
  }

  loginGetJWT() {
    this.showLoading();
    this.port3000.loginGetJWT(this.email, this.password)
      .then((data: any) => {
        
        console.log(data);
        localStorage.setItem("email", data.email);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("homeID", data.homesID[0]);
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("token", data.token);
        localStorage.setItem("first", "0");

        if (localStorage.getItem("alertOnOff") == "close") {
          localStorage.setItem("alertOnOff", "close");
        } else {
          localStorage.setItem("alertOnOff", "open");
        }

        if (localStorage.getItem("alertDetect") == "close") {
          localStorage.setItem("alertDetect", "close");
        } else {
          localStorage.setItem("alertDetect", "open");
        }

        this.menu.enable(true, "myMenu");
        this.navCtrl.setRoot(MainPage);
        this.loader.dismiss();
      }, error => {
        this.alertError(error.status);
        this.loader.dismiss();
        console.log(error);
      });
  }

  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: `<p>กรุณารอสักครู่...</p>`,
      showBackdrop: true
    });
    this.loader.present();
  }

  checkFocus() {
    this.checkHide = true;
  }

  checkBlur() {
    this.checkHide = false;
  }

  alertError(msg?) {
    if (msg == 0) {
      let alert = this.alertCtrl.create();
      alert.setTitle('<img src="assets/false.png"/> เชื่อมต่อล้มเหลว');
      alert.setMessage('<span>กรุณาตรวจสอบการเชื่อมต่อ<br>อินเตอร์เน็ตของท่าน</span>');
      alert.addButton({
        text: 'ตกลง'
      });
      alert.present();
    } else if (msg == 400) {
      let alert = this.alertCtrl.create();
      alert.setTitle('<img src="assets/false.png"/> ไม่พบบัญชีผู้ใช้');
      alert.setMessage('<span>กรุณาตรวจสอบความถูกต้องของ <br>email และ password</span>');
      alert.addButton({
        text: 'ตกลง'
      });
      alert.present();
    }
  }

}
