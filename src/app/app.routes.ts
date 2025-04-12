import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingComponent } from './modules/landing/landing.component';
import { RouteData } from './core/models/navigation.model';

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
    loadComponent: () => import('./modules/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.authRoutes)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./modules/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    loadChildren: () => import('./modules/onboarding/onboarding.routes').then(m => m.onboardingRoutes)
  },
  {
    path: 'admin',
    loadComponent: () => import('./modules/common/common.component').then(m => m.CommonComponent),
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.adminRoutes)
  },
];
