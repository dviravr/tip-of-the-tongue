import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPage } from './login.page';
import { AuthGuard } from '../../core/gaurds/auth.guard';

const routes: Routes = [
  {
    path: 'first-login',
    loadChildren: () => import('./first-login/first-login.module').then(m => m.FirstLoginPageModule),
    // canActivate: [AuthGuard]
  },
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
