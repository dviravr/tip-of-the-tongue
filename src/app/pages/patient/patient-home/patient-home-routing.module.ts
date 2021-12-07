import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientHomePage } from './patient-home.page';

const routes: Routes = [
  {
    path: '',
    component: PatientHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientHomePageRoutingModule {}
