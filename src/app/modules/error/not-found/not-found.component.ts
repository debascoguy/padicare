import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AppUserType } from '@app/enums/app.user.type.enum';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterLink,
    MatAnchor,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  public credentialService: CredentialsService = inject(CredentialsService);

  dashboard() {
    if (!this.credentialService.isLoggedIn()) {
      return null;
    }

    if (this.credentialService.activePortal == AppUserType.careGiver) {
      return "/caregiver/dashboard"
    }

    if (this.credentialService.activePortal == AppUserType.client) {
      return "/client/dashboard"
    }

    return null;
  }

}
