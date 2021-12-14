import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPatientsPageRoutingModule } from './my-patients-routing.module';

import { MyPatientsPage } from './my-patients.page';
import { TherapistPageRoutingModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPatientsPageRoutingModule,
    TherapistPageRoutingModule
  ],
  declarations: [MyPatientsPage]
})
export class MyPatientsPageModule {}
