import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
      protected httpClient: HttpClient,
      protected router: Router
    ) {

    }

    stayLimited() {
      this.router.navigate(['/onboarding/client/select-caregiver']);
    }

    goPremium() {
      const subscriptionDetails = {};
      firstValueFrom(this.httpClient.post('/client/subscription/premium', subscriptionDetails))
      .then((response: any) => {
        if (response.status && response.status == true) {
          this.router.navigate(['/onboarding/client/select-caregiver']);
        }
      }).catch(error => {
        this.snackBar.open('ERROR: ' + error.error.message, 'close', { duration: 4000 });
      });
    }
}
