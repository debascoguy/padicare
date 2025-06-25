import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { toCamelCase } from '@app/core/services/utils';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {

  checkoutEntityId: string | null = null;
  checkoutEntity: string | null = null;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  @ViewChild('paymentElement') paymentElementRef!: ElementRef;

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
      console.log(this.checkoutEntity, this.checkoutEntityId);
      firstValueFrom(this.httpClient.get<any>("/caregiver/book/appointment/" + this.checkoutEntityId))
        .then(response => {
          if (response.status) {
            this.createCheckOutSession({
              productsPricesId: response.data.productsPrices.id,
              returnUrl: location.href.replace("checkout", "checkout-complete")
            });
          }
        })
    }
  }

  async createCheckOutSession(data: any) {
    const request = {
      checkoutEntity: this.checkoutEntity,
      checkoutEntityId: this.checkoutEntityId,
      productsPricesId: data.productsPricesId,
      returnUrl: data.returnUrl,
      quantity: 1,
      mode: "payment"
    }
     
    this.stripe = await loadStripe('pk_test_51RZ7T9IgED3szhOdif8E2Pz3kXUZBoLcC7nGNvdHsxzV9fnDMC8QYS2Wi1BYFhbUslXLn7pokmB4Va72AuwDiTLh00VwbzrtTj');

    firstValueFrom(this.httpClient.post<any>("/payments/pay/create-payment-intent", request))
    .then((response: ApiResponse) => {
      if (response.status) {
        console.log(response);
        if (this.stripe) {
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
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.elements.getElement('card')!,
    });
    if (error) {
      console.error(error);
      // Display error to the user
    } else {
      // Send paymentMethod.id to your backend for further processing
      console.log('Payment Method:', paymentMethod);
      return ;
    }
  }

}
