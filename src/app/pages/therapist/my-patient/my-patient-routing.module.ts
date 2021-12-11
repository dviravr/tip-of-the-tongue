import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPatientPage } from './my-patient.page';

const routes: Routes = [
  {
    path: '',
    component: MyPatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPatientPageRoutingModule {}
