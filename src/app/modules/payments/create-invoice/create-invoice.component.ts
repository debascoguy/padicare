import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { PaymentMethodsComponent } from '@app/modules/client/payment-methods/payment-methods.component';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-invoice',
  imports: [
    CommonModule,
    PaymentMethodsComponent,
    MatButtonModule
  ],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss'
})
export class CreateInvoiceComponent implements OnInit {

  paymentMethodId!: string;
  appointmentId: string | null = null;
  collectionMethod: 'charge_automatically' | 'send_invoice' = 'send_invoice';

  constructor(
    protected credentialsService: CredentialsService,
    private httpClient: HttpClient,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId');
  }

  getSelectedPaymentMethod(paymentMethodId: string) {
    this.paymentMethodId = paymentMethodId;
  }

  get canCreateInvoice() {
    return this.appointmentId && this.paymentMethodId;
  }

  createInvoice() {
    if (!this.canCreateInvoice) {
      return;
    }
    firstValueFrom(this.httpClient.post<ApiResponse>("/payments/invoices/create-invoice", {
      appointmentId: this.appointmentId,
      paymentMethodId: this.paymentMethodId,
      collectionMethod: this.collectionMethod
    })).then((response: ApiResponse) => {
      if (response.status) {
        this.snackBar.openFromComponent(
          ToastsComponent,
          ToastsConfig.getSuccessConfig("Appointment Scheduled", "Congratulations you have successfully booked your care appointment!")
        );
        this.router.navigate(['/' + this.credentialsService.userBaseRoute + '/appointments']);
      }
    }).catch(error => {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig(error, "Appointment Scheduling Error", "Unable to create invoice to schedule the appointment!")
      );
    })
  }

}
