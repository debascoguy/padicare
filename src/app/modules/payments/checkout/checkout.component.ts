import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { toCamelCase } from '@app/core/services/utils';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '@env/environments';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  publishableKey = environment.stripePublishableKey;
  checkoutEntityId: string | null = null;
  checkoutEntity: string | null = null;
  sessionId: string | null = null;
  returnUrl: string | null = null;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  @ViewChild('paymentElement') paymentElementRef!: ElementRef;

  isProcessing: boolean = false;

  constructor(
    protected credentialsService: CredentialsService,
    private httpClient: HttpClient,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkoutEntity = this.route.snapshot.paramMap.get('checkoutEntity');
    this.checkoutEntityId = this.route.snapshot.paramMap.get('checkoutEntityId');
    if (!this.checkoutEntityId || !this.checkoutEntity) {
      this.snackBar.open("Invalid checkout ID", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.checkoutEntity = toCamelCase(this.checkoutEntity ?? '');

    if (this.checkoutEntity == "bookingAppointment") {
      firstValueFrom(this.httpClient.get<any>("/caregiver/book/appointment/" + this.checkoutEntityId))
        .then(response => {
          if (response.status) {
            this.createCheckOutPaymentIntent({
              checkoutEntity: this.checkoutEntity,
              checkoutEntityId: this.checkoutEntityId,
              caregiverFeesId: response.data.caregiverFeesId,
              returnUrl: location.href.replace("checkout", "checkout-complete"),
              quantity: response.data.quantity || 1,
              mode: "payment"
            });
          }
        })
    }

  }

  async createCheckOutPaymentIntent(request: any) {
    this.stripe = await loadStripe(this.publishableKey);
    firstValueFrom(this.httpClient.post<any>("/payments/payment-intent", request))
      .then((response: ApiResponse) => {
        if (response.status) {
          if (this.stripe) {
            this.sessionId = response.data.id;
            this.returnUrl = location.href.replace("checkout", "checkout-complete") + `?sessionId=${this.sessionId}`;
            this.elements = this.stripe.elements({ clientSecret: response.data.client_secret });
            const payment = this.elements.create('payment');
            payment.mount(this.paymentElementRef.nativeElement);
          }
        }
      });
  }

  async handleSubmit() {
    if (!this.stripe || !this.elements) {
      return;
    }
    this.isProcessing = true;

    const _returnUrl = this.returnUrl ?
      this.returnUrl :
      location.href.replace("checkout", "checkout-complete") + `?sessionId=${this.sessionId}`;

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: _returnUrl,
      },
    });

    if (error) {
      console.error(error);
      this.snackBar.open("Payment failed: " + error.message, "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isProcessing = false;
      return;
    }

    this.snackBar.open("Payment successful", "Close", {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    // Redirect or perform any other action after successful payment
    window.location.href = location.href.replace("checkout", "checkout-complete");
  }

}
