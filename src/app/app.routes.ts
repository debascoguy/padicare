import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminComponent } from './modules/admin/admin.component';
import { adminRoutes } from './modules/admin/admin.routes';
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
    path: 'admin',
    component: AdminComponent,
    loadChildren: () => adminRoutes,
  },
];
