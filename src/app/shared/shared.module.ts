import { NgModule } from '@angular/core';
import { TipHeaderComponent } from './components/tip-header/tip-header.component';
import { IonicModule } from '@ionic/angular';
import { ProfileComponent } from './components/profile/profile.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TipHeaderComponent, ProfileComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [TipHeaderComponent, ProfileComponent],
})
export class TherapistPageRoutingModule {}
