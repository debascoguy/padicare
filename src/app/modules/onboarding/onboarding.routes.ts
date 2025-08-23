import { Routes } from '@angular/router';
import { RouteData } from '../../core/models/navigation.model';
import { CaregiverComponent } from './caregiver/caregiver.component';
import { ClientComponent } from './client/client.component';
import { ClientAccountComponent } from './client-account/client-account.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { RegistrationCompleteComponent } from './registration-complete/registration-complete.component';

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
    path: 'client/complete',
    component: RegistrationCompleteComponent,
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
          text: 'Account Created',
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
    path: 'caregiver/complete',
    component: RegistrationCompleteComponent,
    data: {
      title: 'Offer Caregiver',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Offer Caregiver',
          link: 'caregiver'
        },
        {
          text: 'Account Created',
          active: true
        },
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'verify/email/:token',
    component: VerifyEmailComponent,
    data: {
      title: 'Verify Email',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Verify Email',
          active: true,
        },
      ],
      pageAuthorities: []
    } as RouteData,
  },
  {
    path: 'verify/phone/:token',
    component: VerifyEmailComponent,
    data: {
      title: 'Verify Phone',
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Verify Phone',
          active: true,
        },
      ],
      pageAuthorities: []
    } as RouteData,
  }
];
