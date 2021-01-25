import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutlinePage } from './outline';

@NgModule({
  declarations: [
    OutlinePage,
  ],
  imports: [
    IonicPageModule.forChild(OutlinePage),
  ],
})
export class OutlinePageModule {}
