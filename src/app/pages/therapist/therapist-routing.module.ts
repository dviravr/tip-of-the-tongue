import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'therapist-home',
    pathMatch: 'full'
  },
  {
    path: 'therapist-home',
    loadChildren: () => import('./therapist-home/therapist-home.module').then( m => m.TherapistHomePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TherapistPageRoutingModule {}
