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

  get user() {
    return this.credentials?.user;
  }

  get activePortalLowercase() {
    return this.authenticationService.getCredentialsService().activePortal?.toLowerCase();
  }

  pageReload() {
    window.location.reload();
  }

}
