import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { landingRoutes } from './landing.routes';
import { RouterModule } from '@angular/router';

const routes = landingRoutes;

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LandingComponent,
  ],
  declarations: []
})
export class LandingModule { }
