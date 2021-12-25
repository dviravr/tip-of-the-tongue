import { NgModule } from '@angular/core';
import { TipHeaderComponent } from './components/tip-header/tip-header.component';
import { IonicModule } from '@ionic/angular';
import { ProfileComponent } from './components/profile/profile.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [TipHeaderComponent, ProfileComponent],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule
  ],
  exports: [TipHeaderComponent, ProfileComponent],
})
export class TherapistPageRoutingModule {}
