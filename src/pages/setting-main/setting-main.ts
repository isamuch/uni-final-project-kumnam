import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, Events } from 'ionic-angular';

import { Port3051Provider } from '../../providers/port3051/port3051';
import { Port3000Provider } from '../../providers/port3000/port3000';

import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-setting-main',
  templateUrl: 'setting-main.html',
})
export class SettingMainPage {

  @ViewChild(Content) content: Content;

  loader: any;

  page: string;
  homeName: string;
  inOutActive: boolean;
  outLineActive: boolean;
  outLineWeek: number;

  users: Array<{
    no: number,
    email: string
  }> = [];
  homeOwner: string;
  email: string;
  num: number;

  max: string;
  min: string;
  rate: string;

  costRate: Array<{
    min?: number,
    max?: number,
    rate?: number
  }>;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public port3051: Port3051Provider,
    public port3000: Port3000Provider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public events: Events,
  ) {
  }

  ionViewWillEnter() {
    this.content.resize();    
    this.getPage();
    this.getInformationUser();
  }

  loading() {
    this.loader = this.loadingCtrl.create({
      content: `<p>กรุณารอสักครู่...</p>`,
    });
    this.loader.present();
  }


  normalSetting() {
    let homeName = this.homeName;
    let inOutActive = this.inOutActive;
    let outLineActive = this.outLineActive;
    let outLineWeek = this.outLineWeek;

    this.port3051.settingHomeNormal(homeName, inOutActive, outLineActive, outLineWeek)
      .then(data => {
        console.log(data);
      }, error => {
        
      });
  }

  getInformationUser(refresher?) {
    this.port3000.getUserInformation()
      .then((data: any) => {
        this.getHomes(data.homes,refresher);
      }, error => {
        if (refresher){
          refresher.complete();
        }
        this.events.publish('alertError',error.status);
      });
  }

  getHomes(homes, refresher?) {
    this.users = [];
    let localHomeID = localStorage.getItem('homeID');
    homes.forEach(home => {
      if (localHomeID == home._id) {
        this.homeName = home.homeName;

        let setting = home.setting.leak_detect;
        this.inOutActive = setting.inout_active;
        this.outLineActive = setting.outline_active;
        this.outLineWeek = setting.outline_week;


        this.costRate = home.setting.costRate;
        let homeOwner = home.homeOwner;
        this.num = 1;
        home.usersID.forEach(user => {
          let data;
          if (homeOwner == user) {
            this.homeOwner = user;
            data = {
              no: this.num,
              email: user,
              homeOwner: ' (เจ้าของบ้าน)'
            }
          } else {
            data = {
              no: this.num,
              email: user
            }
          }

          this.users.push(data);
          this.num++;
        });

        this.email = localStorage.getItem('email');
        console.log(this.users);

        this.costRate.pop();
        this.min = this.costRate[this.costRate.length - 1].max + 1 + '';
        this.rate = this.costRate[this.costRate.length - 1].rate + '';

        if (refresher){
          refresher.complete();
        }
      }
    });
  }

  showWeek() {
    let alert = this.alertCtrl.create();
    alert.setTitle('จำนวนสัปดาห์เก็บข้อมูล');

    for (let i = 4; i <= 20; i += 4) {
      let ii = i + "";
      if (this.outLineWeek == i) {
        alert.addInput({
          type: 'radio',
          label: ii,
          value: ii,
          checked: true
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: ii,
          value: ii,
        });
      }
    }

    alert.addButton('ยกเลิก');
    alert.addButton({
      text: 'บันทึก',
      handler: data => {
        this.outLineWeek = data;
        this.normalSetting();
      }
    });
    alert.present();
  }

  editHomeName() {

    let prompt = this.alertCtrl.create({
      title: 'แก้ไขชื่อบ้าน',
      message: "<p>สามารถเแก้ไขชื่อบ้านของคุณได้</p>",
      inputs: [
        {
          name: "homeName",
          placeholder: 'ชื่อบ้าน',
          value: this.homeName,
          checked: true,
        },
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          handler: data => {
          }
        },
        {
          text: 'บันทึก',
          handler: data => {
            this.homeName = data.homeName;
            this.normalSetting();
          }
        }
      ]
    });

    prompt.present().then(() => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });
  }

  getPage() {
    this.page = this.navParams.get('pages');
    console.log(this.navParams.get('pages'));
  }

  //=====================================

  test() {
    console.log(this.costRate);
  }

  addRow() {
    let min = parseInt(this.min);
    let max = parseInt(this.max);
    let rate = parseInt(this.rate);

    if (max > min && max < 999 && rate > 0) {
      let data = {
        min: min,
        max: max,
        rate: rate,
      }
      this.costRate.push(data);
      this.setCostRate(this.costRate, 'เพิ่ม');


      this.min = this.costRate[this.costRate.length - 1].max + 1 + '';
      this.max = '';
      this.rate = this.costRate[this.costRate.length - 1].rate + '';

    } else {
      this.toastFinish('กรุณากรอกข้อมูลให้ถูกต้อง');
    }



  }

  delRow() {
    this.costRate.pop();
    this.setCostRate(this.costRate, 'ลบ');
    this.min = this.costRate[this.costRate.length - 1].max + 1 + '';
  }

  setCostRate(costRate2, msg) {
    let cr = costRate2;

    cr.push({
      min: cr[cr.length - 1].max + 1,
      rate: cr[cr.length - 1].rate,
    });

    this.port3051.setCostRate(cr)
      .then((data: any) => {
        this.toastFinish(msg + 'แถวสำเร็จ');
      }, error => {
      });
    console.log(this.costRate);
    this.costRate.pop();
  }

  delMember(member) {
    this.loading();
    console.log('del member');
    console.log(member);

    this.port3051.delMember(member)
      .then((data: any) => {
        console.log(data);
        this.users = [];
        this.getInformationUser();
        this.page = 'member';
        this.loader.dismiss();
        this.toastFinish('ลบสมาชิกสำเร็จ');
      }, error => {
      });
  }

  addMember(member) {
    this.loading();
    console.log('add member');
    console.log(member);
    this.port3051.addMember(member)
      .then((data: any) => {
        console.log(data);
        this.users = [];
        this.getInformationUser();
        this.page = 'member';
        this.loader.dismiss();
        this.toastFinish('เพิ่มสมาชิกสำเร็จ');
      }, error => {
        let msg;
        this.users.forEach(user => {
          if (user.email == member) {
            msg = 'มีสมาชิกนี้ในบ้านแล้ว';
          } else {
            msg = 'ไม่พบสมาชิกนี้ในระบบ';
          }
        });
        this.loader.dismiss();
        this.toastFinish(msg);


      });
  }

  alertAddMember() {
    let prompt = this.alertCtrl.create({
      title: '<img src="assets/add_member.png" /> เพิ่มสมาชิก ?',
      inputs: [
        {
          name: 'email',
          placeholder: 'กรุณากรอกอีเมลของสมาชิก'
        },
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'เพิ่ม',
          handler: data => {
            this.addMember(data.email);
          }
        }
      ]
    });
    prompt.present().then(() => {
      const firstInput: any = document.querySelector('ion-alert input');
      firstInput.focus();
      return;
    });
  }

  alertDelMember(msg) {
    let alert = this.alertCtrl.create({
      title: '<img src="assets/delete_member.png" /> ลบสมาชิก ?',
      message: `<p>สมาชิก ` + msg + `</p>`,
      buttons: [
        {
          text: 'ไม่ใช่',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ใช่',
          handler: data => {
            this.delMember(msg);
          }
        }
      ]
    });
    alert.present();
  }

  toastFinish(msg) {

    let toast;

    if (msg === 'ไม่พบสมาชิกนี้ในระบบ') {
      toast = this.toastCtrl.create({
        message: msg,
        duration: 2500,
        position: 'top',
        cssClass: 'toastDanger'        
      });

    } else if (msg === 'มีสมาชิกนี้ในบ้านแล้ว') {
      toast = this.toastCtrl.create({
        message: msg,
        duration: 2500,
        position: 'top',
        cssClass: 'toastDanger'
      });

    } else if (msg === 'กรุณากรอกข้อมูลให้ถูกต้อง') {
      toast = this.toastCtrl.create({
        message: msg,
        duration: 2500,
        position: 'top',
        cssClass: 'toastDanger'
      });

    } else {
      toast = this.toastCtrl.create({
        message: msg,
        duration: 2500,
        position: 'top',
        cssClass: 'toastSecondary'
      });
    }

    toast.present();
  }

  load(refresher) {
    this.content.resize();
    this.getInformationUser(refresher);
  }

  doRefresh(refresher) {
    this.load(refresher);
  }



}

