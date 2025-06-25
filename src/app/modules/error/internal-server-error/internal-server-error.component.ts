import { Component, inject } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';

@Component({
  selector: 'app-internal-server-error',
  imports: [
    MatAnchor,
    RouterLink,
    MatButton
  ],
  templateUrl: './internal-server-error.component.html',
  styleUrl: './internal-server-error.component.scss'
})
export class InternalServerErrorComponent {

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
