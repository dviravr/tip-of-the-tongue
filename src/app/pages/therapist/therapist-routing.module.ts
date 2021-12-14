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
  },
  {
    path: 'my-patients',
    loadChildren: () => import('./my-patients/my-patients.module').then( m => m.MyPatientsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TherapistPageRoutingModule {}
