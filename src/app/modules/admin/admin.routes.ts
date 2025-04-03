import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { RouteData } from '../../core/models/navigation.model';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'access'
  },
  {
    path: 'access',
    component: AdminComponent,
    data: {
      title: 'Admin Access',
      breadcrumbs: [
        {
          text: 'Access',
          active: true,
        },
      ],
      pageAuthorities: ['ADMIN']
    } as RouteData,
  },
];
