import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { environment } from '@env/environments';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment-methods',
  imports: [
    CommonModule
  ],
  providers: [
    MatSnackBar,
    provideNativeDateAdapter(),
    DatePipe
  ],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss'
})
export class PaymentMethodsComponent {

  @ViewChild('paymentElementRef') paymentElementRef!: ElementRef;
  private elements: any;
  showAddCard: boolean = false;
  isProcessing: boolean = false;
  showSuccess: boolean = false;
  showError: boolean = false;
  isEditing: boolean = false;
  returnUrl: string = location.href + '?sessionId=';

  stripe: Stripe | null = null;
  publishableKey = environment.stripePublishableKey;
  paymentMethods: any = [];

  cardTypes: { [key: string]: string } = {
    'visa': 'Visa',
    'mastercard': 'MasterCard',
    'amex': 'American Express',
  }

  constructor(
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute,
    private router: Router
  ) {
    this.findAllUserPaymentMethods();
    this.initStripe();
  }

  async ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    const setup_intent = this.route.snapshot.queryParamMap.get('setup_intent') || '';
    if (setup_intent == sessionId) {
      //Hide other query params
      this.router.navigate([location.href + '?sessionId=' + sessionId], { replaceUrl: true });
    }
    if (sessionId) {
      this.showSuccess = true;
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "SUCCESS",
          headerTitle: "Payment Method",
          message: "Payment method completed successfully!",
        } as SnackBarParams
      });
    }
  }

  async initStripe() {
    this.stripe = await loadStripe(this.publishableKey);
  }

  findAllUserPaymentMethods() {
    this.httpClient.get<ApiResponse>(`/payments/billing/payment-methods`).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.paymentMethods = response.data?.filter((method: any) => method.type === 'card') || [];
        }
      },
      error: (err) => {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error",
            message: "Failed to fetch payment methods",
          } as SnackBarParams
        });
      }
    });
  }

  async setUpIntent(paymentMethodId: string | null) {
    this.showAddCard = true;
    const url = paymentMethodId ?
      `/payments/billing/payment-methods/edit-setup-intent/${paymentMethodId}` :
      `/payments/billing/payment-methods/new-setup-intent`;
    if (paymentMethodId) {
      this.isEditing = true;
    }
    firstValueFrom(this.httpClient.get<ApiResponse>(url))
      .then((response: ApiResponse) => {
        if (response.status) {
          if (this.stripe) {
            this.returnUrl = location.href + `?sessionId=${response.data.id}`;
            this.elements = this.stripe.elements({ clientSecret: response.data.client_secret });
            const payment = this.elements.create('payment');
            payment.mount(this.paymentElementRef.nativeElement);
          }
        } else {
          this.showError = true;
          this.isProcessing = false;
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Payment Method Error",
              message: response.message || 'Failed to create/edit payment method',
            } as SnackBarParams
          });
        }
      }, (err) => {
        this.showAddCard = false;
        this.isProcessing = false;
        this.showError = true;
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Payment Method Error",
            message: "Failed to creating or editing payment method for adding payment method!",
          } as SnackBarParams
        });
      });
  }

  async addCardToCustomer() {
    this.setUpIntent(null);
  }

  cancelAddCard() {
    this.showAddCard = false;
    this.isProcessing = false;
    if (this.elements) {
      this.elements.clear();
    }
  }

  async savePaymentMethod() {
    if (!this.stripe || !this.elements) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Payment Method Error",
          message: "Stripe is not initialized properly!",
        } as SnackBarParams
      });
      return;
    }

    if (this.isEditing) {
      this.showSuccess = true;
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "SUCCESS",
          headerTitle: "Payment Method",
          message: "Payment method updated successfully!",
        } as SnackBarParams
      });
      this.isEditing = false;
      this.cancelAddCard();
      return;
    }

    this.isProcessing = true;
    const result = await this.stripe?.confirmSetup({
      elements: this.elements,
      confirmParams: {
        return_url: this.returnUrl, // Your success URL
      },
    });

    if (result?.error) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Payment Error",
          message: result.error.message || 'Failed to add payment method',
        } as SnackBarParams
      });
      return;
    }
    this.isProcessing = false;
    this.showAddCard = false;
  }

  editCard(customerId: string, paymentMethodId: string) {
    this.setUpIntent(paymentMethodId);
  }

}
