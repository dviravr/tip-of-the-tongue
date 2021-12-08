import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/gaurds/auth.guard';
import { UserTypeEnum } from './core/enum/userType.enum';
import { canActivate, redirectLoggedInTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'therapist',
    loadChildren: () => import('./pages/therapist/therapist.module').then(m => m.TherapistPageModule),
    canActivate: [AuthGuard],
    data: {
      requiredUserType: UserTypeEnum.therapist
    }
  },
  {
    path: 'patient',
    loadChildren: () => import('./pages/patient/patient.module').then(m => m.PatientPageModule),
    canActivate: [AuthGuard],
    data: {
      requiredUserType: UserTypeEnum.patient
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    // ...canActivate(() => redirectLoggedInTo(['first-login']))
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
