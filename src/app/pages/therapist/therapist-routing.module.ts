import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./therapist-home/therapist-home.module').then( m => m.TherapistHomePageModule)
  },  {
    path: 'my-patient',
    loadChildren: () => import('./my-patient/my-patient.module').then( m => m.MyPatientPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TherapistPageRoutingModule {}
