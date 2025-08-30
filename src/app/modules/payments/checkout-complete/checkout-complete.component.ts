import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';

@Component({
  selector: 'app-checkout-complete',
  imports: [CommonModule],
  templateUrl: './checkout-complete.component.html',
  styleUrl: './checkout-complete.component.scss'
})
export class CheckoutCompleteComponent implements OnInit {

  redirectStatus: string | null = null;

  constructor(
    protected credentialsService: CredentialsService,
    private httpClient: HttpClient,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute
  ) {
    if (!this.credentialsService.isLoggedIn()) {
      this.snackBar.open("Please login to proceed with checkout", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('sessionId') || this.route.snapshot.queryParamMap.get('payment_intent');
    if (!sessionId) {
      this.snackBar.open("Invalid session ID", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Check for redirect status: This is typically used to determine if the payment was successful or not
    this.redirectStatus = this.route.snapshot.queryParamMap.get('redirect_status') || null;
    if (this.redirectStatus && this.redirectStatus !== 'succeeded') {
      // If the redirect status is not 'succeeded', it means the payment was not successful
      this.markPaymentAsComplete(sessionId);
      this.snackBar.open("Payment was not successful", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.markPaymentAsComplete(sessionId);
  }

  markPaymentAsComplete(sessionId: string) {
    this.httpClient.get<ApiResponse>('/payments/payment-intent/checkout/' + sessionId).subscribe({
      next: (response) => {
        if (response.status) {
          this.snackBar.open("Checkout completed successfully!", "Close", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        } else {
          this.snackBar.open(response.message || "Checkout failed", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        this.snackBar.open("An error occurred while completing checkout", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

}
