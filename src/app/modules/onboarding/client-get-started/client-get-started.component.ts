import { Component } from '@angular/core';
import { ProfileImageComponent } from '../../../components/profile-image/profile-image.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/authentication.service';

@Component({
  selector: 'app-client-get-started',
  imports: [
    ProfileImageComponent,
  ],
  templateUrl: './client-get-started.component.html',
  styleUrl: './client-get-started.component.scss'
})
export class ClientGetStartedComponent {

  constructor(
    protected router: Router,
    protected authenticationService: AuthenticationService
  ) {

  }


}
