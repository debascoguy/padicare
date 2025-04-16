import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteData } from '@app/core/models/navigation.model';

export const clientRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    data: {
      title: 'Caregiver | Dashboard',
      breadcrumbs: [
        {
          text: 'Dashboard',
          active: true
        }
      ],
      pageAuthorities: []
    } as RouteData,
  },
];

@NgModule({
  imports: [RouterModule.forChild(clientRoutes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
