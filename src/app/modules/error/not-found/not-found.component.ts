import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';

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

}
