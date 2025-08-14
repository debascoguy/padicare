import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingComponent } from './modules/landing/landing.component';
import { RouteData } from './core/models/navigation.model';
import { AuthenticationGuard } from './core/authentication/authentication.guard';
import { AuthenticationAdminGuard } from './core/authentication/authentication.admin.guard';
import { AuthenticationChildrenGuard } from './core/authentication/authentication.children.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/_'
      },
      {
        path: '_',
        component: LandingComponent,
        data: {
          title: 'Padicare',
          breadcrumbs: [
            {
              text: 'Padicare',
              active: true
            }
          ],
        } as RouteData,
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./modules/auth/auth.component').then(m => m.AuthComponent),
    loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.authRoutes)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./modules/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    loadChildren: () => import('./modules/onboarding/onboarding.routes').then(m => m.onboardingRoutes),
  },
  {
    path: 'user',
    loadComponent: () => import('./modules/user/user.component').then(m => m.UserComponent),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'user/:tab',
    loadComponent: () => import('./modules/user/user.component').then(m => m.UserComponent),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'caregiver',
    loadComponent: () => import('./modules/caregiver/caregiver.component').then(m => m.CaregiverComponent),
    loadChildren: () => import('./modules/caregiver/caregiver-routing.module').then(m => m.caregiverRoutes),
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationChildrenGuard]
  },
  {
    path: 'client',
    loadComponent: () => import('./modules/client/client.component').then(m => m.ClientComponent),
    loadChildren: () => import('./modules/client/client-routing.module').then(m => m.clientRoutes),
    canActivate: [AuthenticationGuard],
    canActivateChild: [AuthenticationChildrenGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./modules/layouts/common/common.component').then(m => m.CommonComponent),
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AuthenticationAdminGuard]
  },
  {
    path: 'error',
    loadComponent: () => import('./modules/layouts/common/common.component').then(m => m.CommonComponent),
    loadChildren: () => import('./modules/error/error-routing.module').then(m => m.errorRoutes),
  },
];
