import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { RouteData } from '../../core/models/navigation.model';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'access',
    component: AdminComponent,
    data: {
      title: 'Admin',
      breadcrumbs: [
        {
          text: 'Admin',
          link: 'admin'
        },
        {
          text: 'Access',
          active: true,
        },
      ],
      pageAuthorities: ['ADMIN']
    } as RouteData,
  },
];
