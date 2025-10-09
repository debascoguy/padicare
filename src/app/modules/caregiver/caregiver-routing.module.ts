import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteData } from '@app/core/models/navigation.model';

export const caregiverRoutes: Routes = [
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
  {
    path: 'appointments',
    loadComponent: () => import('./appointments/appointments.component').then(c => c.AppointmentsComponent),
    data: {
      title: 'Caregiver | Dashboard',
      breadcrumbs: [
        {
          text: 'Dashboard',
          link: "/caregiver/dashboard"
        },
        {
          text: 'Appointments',
          active: true
        }
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'payout',
    loadComponent: () => import('./payout/payout.component').then(c => c.PayoutComponent),
    data: {
      title: 'Caregiver | Dashboard',
      breadcrumbs: [
        {
          text: 'Dashboard',
          link: "/client/dashboard"
        },
        {
          text: 'Cash Out',
          active: true
        }
      ],
      pageAuthorities: []
    } as RouteData,
  },
];

@NgModule({
  imports: [RouterModule.forChild(caregiverRoutes)],
  exports: [RouterModule]
})
export class CaregiverRoutingModule { }
