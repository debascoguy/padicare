import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { LogService } from '../../../core/logger/LogService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    MatSnackBar
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {

  constructor(
      protected snackBar: MatSnackBar,
      protected logger: LogService,
      protected http: HttpClient,
      protected router: Router,
      protected authenticationService: AuthenticationService
    ) {

    }

    stayLimited() {
      this.router.navigate(['/onboarding/client/select-caregiver']);
    }

    goPremium() {
      this.router.navigate(['/onboarding/client/select-caregiver']);
    }
}
