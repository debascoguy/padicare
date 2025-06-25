import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { OrderByPipe } from '@app/core/pipes/order-by.pipe';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { HeadersComponent } from '@app/modules/layouts';
import { HeaderType } from '@app/modules/layouts/headers/header.type.enum';
import { ProductsPrices } from '@app/shared/types/products-prices';
import { UserSummary } from '@app/shared/user-summary/UserSummary';

@Component({
  selector: 'app-book-appointment',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReplaceStringPipe,
    OrderByPipe,
    HeadersComponent
  ],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss'
})
export class BookAppointmentComponent {

  appointmentForm: FormGroup = new FormGroup({
    productName: new FormControl('', Validators.required),
    productsPricesId: new FormControl('', Validators.required),
    appointmentDate: new FormControl('', Validators.required),
    appointmentTime: new FormControl('', Validators.required),
    additionalNotes: new FormControl('', Validators.maxLength(500))
  });

  productsPricesOptions: ProductsPrices[] = []; // This will hold the products prices fetched from the API


  constructor(
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    protected dialogRef: MatDialogRef<BookAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserSummary }
  ) {
    if (!data || !data.user || !data.user.userId) {
      this.snackBar.open("Invalid caregiver selected", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.dialogRef.close();
    }
  }

  get HeaderType() {
      return HeaderType;
  }

  get caregiverName() {
    return this.data.user ? (this.data.user.firstName + ' ' + this.data.user.lastName ) : '';
  }

  findProductsPricesOption() {
    const productName = this.appointmentForm.get('productName')?.value;
    if (productName) {
      const where = {  productName, isActive: true };
      this.httpClient.post<any>(`/payments/products-prices/find-by`, { where }).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.productsPricesOptions = response.data as ProductsPrices[];
          } else {
            this.snackBar.open(response.message || "Failed to find product prices", "Close", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (err) => {
          this.snackBar.open("Failed to find product prices for the selected product/service", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  bookAppointment() {
    if (this.appointmentForm.invalid) {
      this.snackBar.open("Please fill all required fields", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.dialogRef.close({
      success: true,
      ...this.appointmentForm.value,
      caregiverId: this.data.user.userId
    });
  }

  closeModal() {
    this.dialogRef.close();
    this.snackBar.open("Appointment booking cancelled", "Close", {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
