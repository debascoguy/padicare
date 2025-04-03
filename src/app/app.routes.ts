import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { adminRoutes } from './modules/admin/admin.routes';
import { LandingComponent } from './modules/landing/landing.component';
import { RouteData } from './core/models/navigation.model';
import { onboardingRoutes } from './modules/onboarding/onboarding.routes';

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
    path: 'onboarding',
    loadComponent: () => import('./modules/onboarding/onboarding.component').then(m => m.OnboardingComponent),
    loadChildren: () => onboardingRoutes
  },
  {
    path: 'admin',
    loadComponent: () => import('./modules/common/common.component').then(m => m.CommonComponent),
    loadChildren: () => adminRoutes,
  },
];
