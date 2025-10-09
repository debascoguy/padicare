import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { ReloadComponent } from '@app/core/services/reload-component';
import { InvoicesComponent } from '@app/modules/client/invoices/invoices.component';
import { PaymentMethodsComponent } from '@app/modules/client/payment-methods/payment-methods.component';
import { AlertsComponent } from '@app/shared/alerts/alerts.component';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { CaregiverAccounts } from '@app/shared/types/caregiver-accounts';
import { environment } from '@env/environments';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payout',
  imports: [
    CommonModule,
    InvoicesComponent,
    PaymentMethodsComponent,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AlertsComponent
  ],
   providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  templateUrl: './payout.component.html',
  styleUrl: './payout.component.scss'
})
export class PayoutComponent {

  stripe: Stripe | null = null;
  publishableKey = environment.stripePublishableKey;

  @ViewChild('paymentElementRef') paymentElementRef!: ElementRef;
  private elements: any;
  showPayout: boolean = false;
  showError: boolean = false;
  showSuccess: boolean = false;
  isProcessing: boolean = false;
  payoutId: string | null = null;
  caregiverAccounts: CaregiverAccounts  = {
    id: '',
    available: 0,
    incoming_credit: 0,
    outgoing_debit: 0,
    currency: 'USD',
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  paymentMethodDetails: any;
  isLinear: boolean = true;

  payoutStep1 = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    currency: new FormControl('USD', [Validators.required]),
  });

  payoutStep2 = new FormGroup({
    destination: new FormControl('', [Validators.required]),
  });

  payoutStep3 = new FormGroup({
    method: new FormControl('instant', [Validators.required]),
    statement_descriptor: new FormControl('PadiCare Payout', [])
  });

  constructor(
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    protected reloadComponent: ReloadComponent
  ) {
    this.initStripe();
    this.getCaregiverAccountsBalance();
  }

  async initStripe() {
    this.stripe = await loadStripe(this.publishableKey);
  }

  getCaregiverAccountsBalance() {
    firstValueFrom(this.httpClient.get<ApiResponse>("/payments/payouts/caregiver-account-balance")).then((response: ApiResponse) => {
      if (response.status) {
        this.caregiverAccounts = response.data;
        this.payoutStep1.controls['currency'].setValue(this.caregiverAccounts.currency);
        // Set max validator to available balance
        this.payoutStep1.controls['amount'].setValidators([Validators.required, Validators.max(this.caregiverAccounts.available), Validators.min(1)]);
        this.payoutStep1.controls['amount'].updateValueAndValidity();

      }
    }, (err) => {
      this.snackBar.openFromComponent(ToastsComponent, ToastsConfig.getErrorConfig(err, "Balance Error", 'Failed to load balance'));
    });
  }

  getSelectedPaymentMethod(paymentMethodId: string) {
    this.payoutStep2.controls['destination'].setValue(paymentMethodId);
  }

  getSelectedPaymentMethodDetails(paymentMethodDetails: any) {
    this.paymentMethodDetails = paymentMethodDetails;
    if (paymentMethodDetails.type == "card") {
      this.payoutStep3.controls['method'].setValue('instant');
    } else {
      this.payoutStep3.controls['method'].setValue('standard');
    }
  }

  async payoutSetup() {
    const formData = {
      amount: this.payoutStep1.value.amount ? Number(this.payoutStep1.value.amount) * 100 : 0,
      currency: this.payoutStep1.value.currency,
      destination: this.payoutStep2.value.destination,
      method: this.payoutStep3.value.method,
      statement_descriptor: this.payoutStep3.value.statement_descriptor
    }
    firstValueFrom(this.httpClient.post<ApiResponse>("/payments/payouts", formData))
      .then((response: ApiResponse) => {
        if (response.status) {
          this.showPayout = true;
          if (this.stripe) {
            this.payoutId = response.data.id;
            this.showSuccess = true;
            this.isProcessing = false;
            this.elements = this.stripe.elements({ clientSecret: response.data.client_secret });
            const payment = this.elements.create('payment');
            payment.mount(this.paymentElementRef.nativeElement);
          }
        } else {
          this.showError = true;
          this.isProcessing = false;
          this.snackBar.openFromComponent(ToastsComponent, ToastsConfig.getErrorConfig(response, "Payout Error", response.message || 'Failed to create/edit payout'));
        }
      }, (err) => {
        this.isProcessing = false;
        this.showError = true;
        this.snackBar.openFromComponent(ToastsComponent, ToastsConfig.getErrorConfig(err, "Payout Error", 'Failed to creating or editing payout!'));
      });
  }

  cashOut() {
    this.isProcessing = true;
    if (this.stripe && this.elements) {
      console.log("Confirming payout: ", this.payoutStep1.value, this.payoutId);
    }
  }

  cancelPayout() {
    this.showPayout = false;
    this.isProcessing = false;
    if (this.stripe && this.elements) {
      this.elements.clear();
    }
    firstValueFrom(this.httpClient.get<ApiResponse>(`/payments/payouts/${this.payoutId}/cancel`)).then((response: ApiResponse) => {
      if (response.status) {
        this.reloadComponent.reload(true);
      } else {
        this.snackBar.openFromComponent(ToastsComponent, ToastsConfig.getErrorConfig(response, "Payout Error", response.message || 'Failed to load payouts'));
      }
    }, (err) => {
      this.snackBar.openFromComponent(ToastsComponent, ToastsConfig.getErrorConfig(err, "Payout Error", 'Failed to load payouts'));
    });
  }

}
