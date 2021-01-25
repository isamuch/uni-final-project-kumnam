import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//page
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { MonitorPage } from '../pages/monitor/monitor';
import { ControllerPage } from '../pages/controller/controller';
import { OutlinePage } from '../pages/outline/outline';
import { HistoryPage } from '../pages/history/history';
import { SettingMainPage } from '../pages/setting-main/setting-main';
import { ShowGraphPage } from '../pages/show-graph/show-graph';
import { AddDevicePage } from '../pages/add-device/add-device';
import { EditDevicePage } from '../pages/edit-device/edit-device';
import { SettingPage } from '../pages/setting/setting';
import { DetectPage } from '../pages/detect/detect';
import { GraphOutLinePage } from '../pages/graph-out-line/graph-out-line';
import { AccountPage } from '../pages/account/account';
import { AboutPage } from '../pages/about/about';
//for http provider
import { HttpModule } from '@angular/http';

//provider
import { Port3000Provider } from '../providers/port3000/port3000';
import { Port9090Provider } from '../providers/port9090/port9090';
import { Port3052Provider } from '../providers/port3052/port3052';
import { Port3030Provider } from '../providers/port3030/port3030';
import { Port4000Provider } from '../providers/port4000/port4000';
import { Port4040Provider } from '../providers/port4040/port4040';
import { Port3051Provider } from '../providers/port3051/port3051';

import { HideFabDirective } from "../directives/hide-fab/hide-fab";
import { DatePipe } from '@angular/common';
import { NgCalendarModule } from 'ionic2-calendar';

import { OneSignal } from '@ionic-native/onesignal';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

//import { Network } from '@ionic-native/network';

//import { Keyboard } from '@ionic-native/keyboard';
//import { Chart } from 'chart.js';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    MainPage,
    LoginPage,
    MonitorPage,
    ControllerPage,
    OutlinePage,
    HistoryPage,
    SettingMainPage,
    HideFabDirective,
    ShowGraphPage,
    AddDevicePage,
    EditDevicePage,
    SettingPage,
    DetectPage,
    GraphOutLinePage,
    AccountPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      scrollAssist: false, //add this line
      autoFocusAssist: false //add this line
    }),
    HttpModule,
    NgCalendarModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    MainPage,
    MonitorPage,
    ControllerPage,
    OutlinePage,
    HistoryPage,
    SettingMainPage,
    ShowGraphPage,
    AddDevicePage,
    EditDevicePage,
    SettingPage,
    DetectPage,
    GraphOutLinePage,
    AccountPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Port3000Provider,
    Port9090Provider,
    Port3052Provider,
    Port3030Provider,
    Port4000Provider,
    Port4040Provider,
    Port3051Provider,
    DatePipe,
    OneSignal,
    YoutubeVideoPlayer,
  ]
})
export class AppModule {}
