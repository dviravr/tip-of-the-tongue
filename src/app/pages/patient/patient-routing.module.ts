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
    loadChildren: () => import('./patient-home/patient-home.module').then( m => m.PatientHomePageModule)
  },  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'words',
    loadChildren: () => import('./words/words.module').then( m => m.WordsPageModule)
  },
  {
    path: 'connect-to-therapist',
    loadChildren: () => import('./connect-to-therapist/connect-to-therapist.module').then( m => m.ConnectToTherapistPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientPageRoutingModule {}
