import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./signin/signin.component').then(c => c.SigninComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent)
  },
  {
    path: 'set-new-password/:token',
    loadComponent: () => import('./set-new-password/set-new-password.component').then(c => c.SetNewPasswordComponent)
  },
  {
    path: 'switch',
    loadComponent: () => import('./switch/switch.component').then(c => c.SwitchComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
