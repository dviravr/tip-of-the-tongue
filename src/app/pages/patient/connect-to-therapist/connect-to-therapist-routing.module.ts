import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectToTherapistPage } from './connect-to-therapist.page';

const routes: Routes = [
  {
    path: ':therapistId',
    component: ConnectToTherapistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectToTherapistPageRoutingModule {}
