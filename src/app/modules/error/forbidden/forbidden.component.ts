import { Component, inject } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';

@Component({
  selector: 'app-forbidden',
  imports: [
    MatAnchor,
    RouterLink
  ],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {

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
