import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPatientPageRoutingModule } from './my-patient-routing.module';

import { MyPatientPage } from './my-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPatientPageRoutingModule
  ],
  declarations: [MyPatientPage]
})
export class MyPatientPageModule {}
