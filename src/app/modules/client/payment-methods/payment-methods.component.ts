import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { endOfMonth, isGreaterThan, now } from '@app/core/services/date-fns';
import { ReloadComponent } from '@app/core/services/reload-component';
import { AlertsComponent } from '@app/shared/alerts/alerts.component';
import { ConfirmDialogData } from '@app/shared/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { environment } from '@env/environments';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-payment-methods',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    AlertsComponent
  ],
  providers: [
    MatSnackBar,
    provideNativeDateAdapter(),
    DatePipe
  ],
  templateUrl: './payment-methods.component.html',
  styleUrl: './payment-methods.component.scss'
})
export class PaymentMethodsComponent implements AfterViewInit {

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

  customerInfo: any;
  @Input() isSelectPaymentMethod: boolean = false;
  @Output() selectedPaymentMethod = new EventEmitter<any>();
  paymentMethodId = "";


  constructor(
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    protected reloadComponent: ReloadComponent
  ) {
    this.findAllCustomerInfoAndPaymentMethods();
    this.initStripe();
  }

  ngAfterViewInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    const setup_intent = this.route.snapshot.queryParamMap.get('setup_intent') || '';
    if (setup_intent == sessionId) {
      this.reloadComponent.removeQueryParams({ sessionId: sessionId });
    }
    if (sessionId) {
      this.showSuccess = true;
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "SUCCESS",
          headerTitle: "Payment Method",
          message: "Payment method saved successfully!",
        } as SnackBarParams
      }).afterDismissed().subscribe((_) => {
        this.showSuccess = false;
      });
    }
  }

  async initStripe() {
    this.stripe = await loadStripe(this.publishableKey);
  }

  findAllCustomerInfoAndPaymentMethods() {
    const customerInfo = this.httpClient.get<ApiResponse>("/payments/billing/customer-info");
    const customerPaymentMethods = this.httpClient.get<ApiResponse>(`/payments/payment-methods`);
    forkJoin([customerInfo, customerPaymentMethods]).subscribe({
      next: ([customerInfoResponse, customerPaymentMethodsResponse]) => {
        this.customerInfo = customerInfoResponse.data;
        this.paymentMethods = customerPaymentMethodsResponse.data?.filter((method: any) => method.type === 'card') || [];
      },
      error: (err) => {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error",
            message: err.message || "Failed to fetch payment methods",
          } as SnackBarParams
        });
      }
    });
  }

  async setUpIntent() {
    this.showAddCard = true;
    firstValueFrom(this.httpClient.get<ApiResponse>("/payments/payment-methods/new-setup-intent"))
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
    this.setUpIntent();
  }

  cancelAddCard() {
    this.showAddCard = false;
    this.isProcessing = false;
    if (this.elements) {
      this.elements.clear();
    }
  }

  isCustomerDefaultPaymentMethod(paymentMethodId: string) {
    if (this.customerInfo?.invoice_settings?.default_payment_method == paymentMethodId) {
      return true;
    }
    if (this.customerInfo?.default_source == paymentMethodId) {
      return true;
    }
    return false;
  }

  isCardExpired(exp_month: number, exp_year: number) {
    const date = endOfMonth(new Date(exp_year, exp_month, 1, 23, 59, 59, 999));
    return isGreaterThan(now(), date);
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

    this.isProcessing = true;
    const result = await this.stripe?.confirmSetup({
      elements: this.elements,
      confirmParams: {
        return_url: this.returnUrl, // Your success URL
      },
    });

    this.isProcessing = false;
    this.showAddCard = false;
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
  }

  setAsDefaultPaymentMethod(paymentMethod: any) {
    const { id, customer } = paymentMethod;
    const data = {
      customerId: customer,
      paymentMethodId: id
    };
    this.httpClient.patch<ApiResponse>("/payments/payment-methods/default", data).subscribe({
      next: (response: ApiResponse) => {
        if (response.status) {
          this.snackBar.openFromComponent(
            ToastsComponent,
            ToastsConfig.getSuccessConfig("Payment Method", "Default Payment Method Updated")
          );
          this.customerInfo = response.data;
        } else {
          this.snackBar.openFromComponent(
            ToastsComponent,
            ToastsConfig.getErrorConfig(response, "Payment Method Error", "Updating Default Payment Method Failed!")
          );
        }
      }, error: (err) => {
        this.snackBar.openFromComponent(
          ToastsComponent,
          ToastsConfig.getErrorConfig(err, "Payment Method Error", "Updating Default Payment Method Failed!")
        );
      }
    });
  }

  editCard(paymentMethod: any) {
    paymentMethod.isEdit = true;
  }

  updateCard(paymentMethod: any) {
    paymentMethod.isEdit = false;
    const { id: paymentMethodId, card, customer: customerId } = paymentMethod;
    const { exp_month, exp_year } = card;
    const data = {
      customerId,
      paymentMethodId,
      expirationMonth: parseInt(exp_month),
      expirationYear: parseInt(exp_year)
    }
    this.httpClient.patch<ApiResponse>("/payments/payment-methods", data).subscribe({
      next: (response: ApiResponse) => {
        if (response.status) {
          this.snackBar.openFromComponent(
            ToastsComponent,
            ToastsConfig.getSuccessConfig("Payment Method", "Card Expiration Month/Year Updated")
          );
          paymentMethod = response.data;
        } else {
          this.snackBar.openFromComponent(
            ToastsComponent,
            ToastsConfig.getErrorConfig(response, "Payment Method Error", "Updating Payment Method Failed!")
          );
        }
      }, error: (err) => {
        this.snackBar.openFromComponent(
          ToastsComponent,
          ToastsConfig.getErrorConfig(err, "Payment Method Error", "Updating Payment Method Failed!")
        );
      }
    });
  }

  deleteCard(paymentMethod: any) {
    const { id, card, customer } = paymentMethod;
    const data = {
      customerId: customer,
      paymentMethodId: id
    };
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '220px',
      data: {
        icon: 'delete',
        title: 'Delete Payment Card',
        message: `Are you sure you want to permanently delete this card? Once deleted, it cannot be added. Use the edit button to update month / year`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'No, Cancel Delete Request'
      } as ConfirmDialogData
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.httpClient.post<ApiResponse>("/payments/payment-methods", data).subscribe({
          next: (response: ApiResponse) => {
            if (response.status) {
              this.snackBar.openFromComponent(
                ToastsComponent,
                ToastsConfig.getSuccessConfig("Payment Method", "Card Expiration Month/Year Updated")
              );
              this.paymentMethods = this.paymentMethods.filter((pm: { id: string; }) => pm.id != paymentMethod.id);
            } else {
              this.snackBar.openFromComponent(
                ToastsComponent,
                ToastsConfig.getErrorConfig(response, "Payment Method Error", "Updating Payment Method Failed!")
              );
            }
          }, error: (err) => {
            this.snackBar.openFromComponent(
              ToastsComponent,
              ToastsConfig.getErrorConfig(err, "Payment Method Error", "Updating Payment Method Failed!")
            );
          }
        });
      } else {
        console.log('Delete action cancelled');
      }
    });
  }

  onSelectPaymentMethod(event: MatRadioChange) {
    this.selectedPaymentMethod.emit(event.value);
  }
}
