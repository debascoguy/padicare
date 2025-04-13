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
    path: 'password-reset',
    loadComponent: () => import('./password-reset/password-reset.component').then(c => c.PasswordResetComponent)
  },
  {
    path: 'set-new-password',
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
