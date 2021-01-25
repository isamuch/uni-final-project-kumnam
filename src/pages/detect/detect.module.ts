import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetectPage } from './detect';

@NgModule({
  declarations: [
    DetectPage,
  ],
  imports: [
    IonicPageModule.forChild(DetectPage),
  ],
})
export class DetectPageModule {}
