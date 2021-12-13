import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectToTherapistPageRoutingModule } from './connect-to-therapist-routing.module';

import { ConnectToTherapistPage } from './connect-to-therapist.page';
import { TherapistPageRoutingModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectToTherapistPageRoutingModule,
    TherapistPageRoutingModule
  ],
  declarations: [ConnectToTherapistPage]
})
export class ConnectToTherapistPageModule {}
