import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AppUserType } from '@app/enums/app.user.type.enum';

@Component({
  selector: 'app-switch',
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardActions,
    MatButton,
  ],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent {

  constructor(protected router: Router, private credentialsService: CredentialsService) { }

  go(url: string) {
    const portals = {
      "client": AppUserType.client,
      "caregiver": AppUserType.careGiver
    };
    const key = url.replaceAll("/", "") as keyof typeof portals;
    if (key in portals) {
      this.credentialsService.updateCredentialsField('activePortal', portals[key]);
    } else {
      console.error(`Invalid portal key: ${key}`);
    }
    this.router.navigate([url]);
  }

}
