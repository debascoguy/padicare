import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

@Component({
  selector: 'app-side-navbar',
  imports: [
    CommonModule
  ],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {

  constructor(
    protected authenticationService: AuthenticationService,
    protected router: Router,
    protected route: ActivatedRoute
  ) { }

  get credentials() {
    return this.authenticationService.getCredentialsService().credentials;
  }

  get isClientSide() {
    return this.authenticationService.getCredentialsService().isClientSide;
  }

  get isCaregiverSide() {
    return this.authenticationService.getCredentialsService().isCaregiverSide;
  }

  get user() {
    return this.credentials?.user;
  }

  get userBaseRoute() {
    return this.authenticationService.getCredentialsService().userBaseRoute;
  }

  pageReload() {
    window.location.reload();
  }

}
