import { Component, ViewChild } from '@angular/core';
import { JsPdfExportComponent } from '@app/shared/js-pdf-export/js-pdf-export.component';
import { Invoice } from '../billing/Invoice';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-invoices',
   imports: [
      CommonModule,
      ReplaceStringPipe,
      InvoiceComponent,
      JsPdfExportComponent
    ],
    providers: [
      MatSnackBar,
      provideNativeDateAdapter(),
      DatePipe
    ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent {

  @ViewChild('invoicePdf', { static: false }) invoicePdf!: JsPdfExportComponent;
  showInvoice: boolean = false;
  selectedInvoice: Invoice = {} as Invoice;
  invoiceLists: Invoice[] = [];

  statusColors: { [key: string]: string } = {
    CREATED: 'bg-gradient-secondary',
    PAID: 'bg-gradient-success',
    FAILED: 'bg-gradient-danger',
    CANCELLED: 'bg-gradient-warning',
    EXPIRED: 'bg-gradient-muted',
    REFUNDED: 'bg-gradient-info'
  };

  constructor(
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    private datePipe: DatePipe,
    protected route: ActivatedRoute,
    private router: Router
  ) {
    this.findAllUserInvoices();
  }

  findAllUserInvoices() {
    this.httpClient.get<ApiResponse>(`/payments/billing/invoices`).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.invoiceLists = response.data;
        }
      },
      error: (err) => {
        console.error("Error fetching payment methods:", err);
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

  downloadPdf(invoice: Invoice) {
    this.showInvoice = true;
    this.httpClient.get<ApiResponse>(`/payments/billing/invoices/${invoice.id}`).subscribe({
      next: async (response: ApiResponse) => {
        if (response.status) {
          this.selectedInvoice = response.data;
          await this.invoicePdf.generatePdfFromComponent(
            `invoice_${this.selectedInvoice.invoiceNumber}_${this.datePipe.transform(new Date(), 'yyyy-MM-dd')}`,
            { orientation: 'p', unit: 'mm', format: 'a4' }
          );
          this.showInvoice = false;
        } else {
          this.showInvoice = false;
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Error",
              message: response.message || "Failed to download invoice PDF",
            } as SnackBarParams
          });
        }
      },
      error: (err) => {
        this.showInvoice = false;
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error downloading PDF",
            message: "Failed to download invoice PDF",
          } as SnackBarParams
        });
      }
    });
  }

}
