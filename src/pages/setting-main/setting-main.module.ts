import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingMainPage } from './setting-main';

@NgModule({
  declarations: [
    SettingMainPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingMainPage),
  ],
})
export class SettingMainPageModule {}
