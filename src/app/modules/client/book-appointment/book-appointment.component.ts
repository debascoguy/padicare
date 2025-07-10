import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContainer, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { OrderByPipe } from '@app/core/pipes/order-by.pipe';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { HeaderType } from '@app/modules/layouts/headers/header.type.enum';
import { CaregiverFees } from '@app/shared/types/caregiver-fees';
import { UserSummary } from '@app/shared/user-summary/UserSummary';
import { FeeFrequencyEnum } from '@app/shared/enums/fee-frequency.enum';
import { MatError, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as zipcodes from 'zipcodes';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-book-appointment',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatSelectModule,
    MatButton,
    MatDialogContent,
    MatDialogActions,
    MatError,
    MatHint,
    ReactiveFormsModule,
    ReplaceStringPipe,
    OrderByPipe
  ],
  providers: [
    MatSnackBar,
    provideNativeDateAdapter(),
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss'
})
export class BookAppointmentComponent implements OnInit {

  appointmentForm: FormGroup = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    caregiverFeesId: new FormControl('', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(160)]),
    appointmentDate: new FormControl('', [Validators.required]),
    appointmentTime: new FormControl('', [Validators.required]),
    additionalNotes: new FormControl('', [Validators.maxLength(255)]),
    serviceAddress: new FormGroup({
      houseNumber: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      country: new FormControl('USA', [Validators.required]),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    })
  });

  isManuallyEnteringServiceAddress: boolean = false;

  updateUserAddressWithServiceAddress: boolean = false;

  zipCodeInfo: zipcodes.ZipCode | null = null;

  protected allActiveCaregiverFees: CaregiverFees[] = [];

  protected selectedFee: CaregiverFees | null = null;

  public caregiverFeeOptions: CaregiverFees[] = [];

  quantityOptions: number[] = Array.from({ length: 160 }, (_, i) => i + 1);

  constructor(
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    private datePipe: DatePipe,
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

  ngOnInit() {
    this.dialogRef.afterOpened().subscribe(() => {
      this.appointmentForm.reset();
      this.findAllActiveCaregiverFees();
      // set serviceAddress to default to userAddress. User can override this on the interface.
      this.onManuallyEnteringServiceAddress();
    });
  }

  search() {
    if (this.serviceAddress?.get("zipcode")?.invalid) {
      return;
    }
    this.zipCodeInfo = zipcodes?.lookup(this.serviceAddress?.get("zipcode")?.value) || null;
    this.serviceAddress.get('city')?.setValue('');
    this.serviceAddress.get('state')?.setValue('');
    this.serviceAddress.get('country')?.setValue('');
    this.serviceAddress.get('longitude')?.setValue(null);
    this.serviceAddress.get('latitude')?.setValue(null);
    if (this.zipCodeInfo) {
      this.serviceAddress.patchValue(this.zipCodeInfo);
      this.serviceAddress.updateValueAndValidity();
    }
  }

  get serviceAddress() {
    return this.appointmentForm.get("serviceAddress") as FormGroup;
  }

  get HeaderType() {
    return HeaderType;
  }

  get caregiverName() {
    return this.data.user ? (this.data.user.firstName + ' ' + this.data.user.lastName) : '';
  }

  get quantityLabel() {
    if (this.selectedFee?.frequency == FeeFrequencyEnum.HOURLY) {
      this.quantityOptions = Array.from({ length: 24 }, (_, i) => i + 1);
      return "Total Hours";
    } else if (this.selectedFee?.frequency == FeeFrequencyEnum.DAILY) {
      this.quantityOptions = Array.from({ length: 7 }, (_, i) => i + 1);
      return "Total Days";
    } else if (this.selectedFee?.frequency == FeeFrequencyEnum.WEEKLY) {
      this.quantityOptions = Array.from({ length: 53 }, (_, i) => i + 1);
      return "Total Weeks";
    } else if (this.selectedFee?.frequency == FeeFrequencyEnum.MONTHLY) {
      this.quantityOptions = Array.from({ length: 12 }, (_, i) => i + 1);
      return "Total Months";
    } else {
      return "Total Hours";
    }
  }

  get filteredCaregiverFees() {
    const productName = this.appointmentForm.get('productName')?.value || "";
    return this.allActiveCaregiverFees.filter((fee) => fee.productName.trim() === productName.trim());
  }

  updateCaregiverFee() {
    const productName = this.appointmentForm.get('productName')?.value;
    if (!productName || !this.allActiveCaregiverFees || this.allActiveCaregiverFees.length === 0) {
      return;
    }

    if (!this.filteredCaregiverFees || this.filteredCaregiverFees.length === 0) {
      this.selectedFee = null;
      this.appointmentForm.patchValue({
        caregiverFeesId: ''
      });
      this.snackBar.open("No fees found for this caregiver for the selected service", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // If only one fee is available, auto select it
    this.selectedFee = this.filteredCaregiverFees.length == 1 ? this.filteredCaregiverFees[0] : null;
    if (this.selectedFee) {
      this.appointmentForm.patchValue({
        productName: this.selectedFee.productName,
        caregiverFeesId: this.selectedFee.id
      });
      return;
    }

    this.snackBar.open("Multiple fees found for this caregiver for the selected service. Please select one.", "Close", {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  onCaregiverFeeSelected() {
    const selectedFeeId = this.appointmentForm.get('caregiverFeesId')?.value;
    this.selectedFee = this.caregiverFeeOptions.find(fee => fee.id === selectedFeeId) || null;
    if (!this.selectedFee) {
      this.snackBar.open("Selected fee not found", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.appointmentForm.patchValue({
      caregiverFeesId: this.selectedFee.id,
      productName: this.selectedFee.productName
    });
  }

  findAllActiveCaregiverFees() {
    this.httpClient.get<ApiResponse>(`/caregiver/fees/find-all/active/by/${this.data.user.userId}`).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.allActiveCaregiverFees = response.data as CaregiverFees[];
        } else {
          this.snackBar.open(response.message || "Failed to find caregiver fees", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (err) => {
        console.error("Error fetching caregiver fees:", this.data.user.userId, err);
        this.snackBar.open("Failed to find caregiver fees", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onManuallyEnteringServiceAddress() {
    if (this.isManuallyEnteringServiceAddress) {
      this.serviceAddress?.reset();
    } else {
      this.serviceAddress?.patchValue(this.credentialsService.userAddress);
      this.serviceAddress?.updateValueAndValidity();
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

    const bookingAppintmentValue = {
      ...this.appointmentForm.value,
      quantity: parseInt(this.appointmentForm.get('quantity')?.value) || 1,
      appointmentTime: this.datePipe.transform(this.appointmentForm.value['appointmentTime'], 'HH:mm:ss'),
    };

    if (this.updateUserAddressWithServiceAddress) {
      const address = {
        ...this.serviceAddress.value,
        houseNumber: parseInt(this.serviceAddress.get("houseNumber")?.value || "0")
      }
      firstValueFrom(this.httpClient.post<ApiResponse>(`/access/onboarding/user/address`, address))
        .then((_: ApiResponse) => { console.log("User Address updated!") });
    }

    this.dialogRef.close({
      success: true,
      ...bookingAppintmentValue,
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
