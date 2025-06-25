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
  {
    path: 'checkout/:checkoutEntity/:checkoutEntityId',
    loadComponent: () => import('../payments/checkout/checkout.component').then(c => c.CheckoutComponent),
    data: {
      title: 'Client | Checkout',
      breadcrumbs: [
        {
          text: 'Dashboard',
          link: '/client/dashboard'
        },
        {
          text: 'Checkout',
          active: true
        }
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'checkout-complete/:checkoutEntity/:checkoutEntityId',
    loadComponent: () => import('../payments/checkout-complete/checkout-complete.component').then(c => c.CheckoutCompleteComponent),
    data: {
      title: 'Client | Checkout Processed',
      breadcrumbs: [
        {
          text: 'Dashboard',
          link: '/client/dashboard'
        },
        {
          text: 'Checkout',
          link: '/client/checkout/:checkoutEntity/:checkoutEntityId'
        },
        {
          text: 'Checkout',
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
