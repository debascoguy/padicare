import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InvoicesComponent } from '../invoices/invoices.component';
import { PaymentMethodsComponent } from '../payment-methods/payment-methods.component';

@Component({
  selector: 'app-billing',
  imports: [
    CommonModule,
    InvoicesComponent,
    PaymentMethodsComponent
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {

  constructor() { }

}
