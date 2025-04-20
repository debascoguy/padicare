import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteData } from '@app/core/models/navigation.model';

export const errorRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'not-found'
  },
  {
    path: 'internal-server-error',
    title: 'Internal Server Error',
    loadComponent: () => import('./internal-server-error/internal-server-error.component').then(c => c.InternalServerErrorComponent),
    data: {
      title: 'Internal Server Error',
      breadcrumbs: [
        {
          text: 'Internal Server Error',
          active: true
        }
      ],
    } as RouteData,
  },
  {
    path: 'forbidden',
    title: 'Forbidden',
    loadComponent: () => import('./forbidden/forbidden.component').then(c => c.ForbiddenComponent),
    data: {
      title: 'Forbidden',
      breadcrumbs: [
        {
          text: 'Forbidden',
          active: true
        }
      ],
    } as RouteData,
  },
  {
    path: 'not-found',
    title: 'Not Found',
    loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent),
    data: {
      title: 'Not Found',
      breadcrumbs: [
        {
          text: 'Not Found',
          active: true
        }
      ],
    } as RouteData,
  },
  {
    path: 'unauthorized',
    title: 'Not Authorized',
    loadComponent: () => import('./unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent),
    data: {
      title: 'Not Authorized',
      breadcrumbs: [
        {
          text: 'Not Authorized',
          active: true
        }
      ],
    } as RouteData,
  },
];

@NgModule({
  imports: [RouterModule.forChild(errorRoutes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
