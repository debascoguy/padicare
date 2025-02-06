import { Routes } from '@angular/router';
import { RouteData } from '../../core/models/navigation.model';
import { CaregiverComponent } from './caregiver/caregiver.component';
import { ClientComponent } from './client/client.component';
import { ClientAccountComponent } from './client-account/client-account.component';
import { SubscriptionComponent } from './subscription/subscription.component';

export const onboardingRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'client'
  },
  {
    path: 'client',
    component: ClientComponent,
    data: {
      title: 'Find Care',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Find Care',
          active: true,
        },
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'client/account',
    component: ClientAccountComponent,
    data: {
      title: 'Find Care',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Find Care',
          link: 'client'
        },
        {
          text: 'Client Account',
          active: true,
        },
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'client/subscription',
    component: SubscriptionComponent,
    data: {
      title: 'Find Care',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Find Care',
          link: 'client'
        },
        {
          text: 'Client Account',
          link: 'client/account'
        },
        {
          text: 'Subscription',
          active: true
        },
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'caregiver',
    component: CaregiverComponent,
    data: {
      title: 'Offer Care',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Offer Care',
          active: true,
        },
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'caregiver/subscription',
    component: SubscriptionComponent,
    data: {
      title: 'Find Care',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Find Care',
          link: 'caregiver'
        },
        {
          text: 'Caregiver Account',
          link: 'caregiver/account'
        },
        {
          text: 'Subscription',
          active: true
        },
      ],
      pageAuthorities: []
    } as RouteData,
  },
];
