import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { User, UserAddress } from '@app/core/models/user';
import { PhonePipe } from '@app/core/pipes/phone.pipe';
import { Invoice } from '@app/modules/client/billing/Invoice';

@Component({
  selector: 'app-invoice',
  imports: [
    CommonModule,
    PhonePipe
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnChanges {

  @Input() invoice: Invoice = {} as Invoice;

  public currentDate: string = new Date().toLocaleDateString();

  statusColors: { [key: string]: string } = {
    CREATED: 'bg-gradient-secondary',
    PAID: 'bg-gradient-success',
    FAILED: 'bg-gradient-danger',
    CANCELLED: 'bg-gradient-warning',
    EXPIRED: 'bg-gradient-muted',
    REFUNDED: 'bg-gradient-info'
  };

  constructor(
    public credentialsService: CredentialsService
  ) {
    this.currentDate = new Date().toLocaleDateString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invoice'] && changes['invoice'].currentValue && changes['invoice'].currentValue !== changes['invoice'].previousValue) {
      this.invoice = changes['invoice'].currentValue;
    }
  }

  get customer(): User {
    return this.credentialsService.user;
  }

  get customerAddress(): UserAddress {
    return this.credentialsService.userAddress
  }

}
