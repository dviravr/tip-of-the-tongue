import { NgModule } from '@angular/core';
import { TipHeaderComponent } from './components/tip-header/tip-header.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [TipHeaderComponent],
  imports: [
    IonicModule
  ],
  exports: [TipHeaderComponent],
})
export class TherapistPageRoutingModule {}
