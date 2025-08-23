import { BookAppointment } from './../appointments/appointment';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
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
import { debounceTime, firstValueFrom, fromEvent, map, of } from 'rxjs';
import { timeToDate } from '@app/core/services/date-fns';
import { UserAddress } from '@app/core/models/user';
import { Availability } from './availability';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';


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
export class bookingAppointmentComponent implements OnInit {

  @ViewChild("availabilityInfo") availabilityInfo!: ElementRef;

  appointmentForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    productName: new FormControl('', [Validators.required]),
    caregiverFeesId: new FormControl('', [Validators.required]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(160)]),
    appointmentDate: new FormControl('', [Validators.required]),
    appointmentTime: new FormControl('', [Validators.required]),
    additionalNotes: new FormControl('', [Validators.maxLength(255)]),
    serviceAddress: new FormGroup({
      id: new FormControl(''),
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

  protected caregiverAvailabilities: Availability[] = [];

  protected selectedFee: CaregiverFees | null = null;

  public caregiverFeeOptions: CaregiverFees[] = [];

  quantityOptions: number[] = Array.from({ length: 160 }, (_, i) => i + 1);

  enableToggleServiceAddress: boolean = true;

  constructor(
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private modal: NgbModal,
    protected dialogRef: MatDialogRef<bookingAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserSummary, isEdit: boolean, bookingAppointment?: BookAppointment }
  ) {
    if (!data.isEdit && (!data || !data.user || !data.user.userId)) { // New Booking Appointment
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Invalid caregiver selected",
        } as SnackBarParams
      });
      this.dialogRef.close();
    }
  }

  ngOnInit() {
    if (this.isNew) {
      this.patchAddress(this.credentialsService.userAddress || {}).subscribe((_) => {
        if (this.serviceAddress?.invalid) {
          this.isManuallyEnteringServiceAddress = true;
          this.enableToggleServiceAddress = false;
        }
      });
    }
    this.patchAppointmentForm();
    this.dialogRef.afterOpened().subscribe(() => {
      this.findAllActiveCaregiverFees();
      this.findAllCaregiverAvailability();
    });
  }

  openAvailabilityModal(): void {
    this.modal.open(this.availabilityInfo, { size: 'md' });
  }

  patchAppointmentForm() {
    if (this.data.isEdit && this.data.bookingAppointment) {
      this.data.user = {
        userId: this.data.bookingAppointment.caregiver.id,
        firstName: this.data.bookingAppointment.caregiver.firstName,
        lastName: this.data.bookingAppointment.caregiver.lastName,
        email: this.data.bookingAppointment.caregiver.email
      } as UserSummary;
      this.appointmentForm.get("id")?.setValue(this.data.bookingAppointment.id);
      this.appointmentForm.get("caregiverFeesId")?.setValue(this.data.bookingAppointment.caregiver.id);
      this.appointmentForm.get("productName")?.setValue(this.data.bookingAppointment.productName);
      this.appointmentForm.get("quantity")?.setValue(this.data.bookingAppointment.quantity);
      this.appointmentForm.get("appointmentDate")?.setValue(this.data.bookingAppointment.appointmentDate);
      this.appointmentForm.get("appointmentTime")?.setValue(timeToDate(this.data.bookingAppointment.appointmentTime));
      this.appointmentForm.get("additionalNotes")?.setValue(this.data.bookingAppointment.additionalNotes);
      this.patchAddress(this.data.bookingAppointment.serviceAddress);
      this.appointmentForm.updateValueAndValidity();
    }
  }

  get isEdit() {
    return this.data.isEdit;
  }

  get isNew() {
    return !this.data.isEdit;
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
    if (this.selectedFee?.unit == FeeFrequencyEnum.HOURLY) {
      this.quantityOptions = Array.from({ length: 24 }, (_, i) => i + 1);
      return "Total Hours";
    } else if (this.selectedFee?.unit == FeeFrequencyEnum.DAILY) {
      this.quantityOptions = Array.from({ length: 7 }, (_, i) => i + 1);
      return "Total Days";
    } else if (this.selectedFee?.unit == FeeFrequencyEnum.WEEKLY) {
      this.quantityOptions = Array.from({ length: 53 }, (_, i) => i + 1);
      return "Total Weeks";
    } else if (this.selectedFee?.unit == FeeFrequencyEnum.MONTHLY) {
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
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "No fees found for this caregiver for the selected service",
        } as SnackBarParams
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

    this.snackBar.openFromComponent(ToastsComponent, {
      ...ToastsConfig.defaultConfig,
      data: {
        type: "DANGER",
        headerTitle: "Error",
        message: "Multiple fees found for this caregiver for the selected service. Please select one.",
      } as SnackBarParams
    });
  }

  onCaregiverFeeSelected() {
    const selectedFeeId = this.appointmentForm.get('caregiverFeesId')?.value;
    this.selectedFee = this.caregiverFeeOptions.find(fee => fee.id === selectedFeeId) || null;
    if (!this.selectedFee) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Selected fee not found",
        } as SnackBarParams
      });
      return;
    }
    this.appointmentForm.patchValue({
      caregiverFeesId: this.selectedFee.id,
      productName: this.selectedFee.productName
    });
  }

  findAllActiveCaregiverFees() {
    const caregiver = { id: this.data.user.userId };
    const where = { caregiver, isDeleted: false };
    this.httpClient.post<ApiResponse>(`/caregiver/fees/find-by`, { where }).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.allActiveCaregiverFees = response.data as CaregiverFees[];
        } else {
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Error",
              message: response.message || "Failed to find caregiver fees"
            } as SnackBarParams
          });
        }
      },
      error: (err) => {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error",
            message: "Failed to find caregiver fees - " + err.message
          } as SnackBarParams
        });
      }
    });
  }

  findAllCaregiverAvailability() {
    this.httpClient.get<ApiResponse>(`/caregiver/availability/all/${this.data.user.userId}`).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.caregiverAvailabilities = response.data as Availability[];
          this.caregiverAvailabilities = this.caregiverAvailabilities.sort((a, b) => {
            return new Date(a.available).getTime() - new Date(b.available).getTime()
          });
        } else {
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Error",
              message: response.message || "Failed to find caregiver availability"
            } as SnackBarParams
          });
        }
      },
      error: (err) => {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error",
            message: "Failed to find caregiver availability - " + err.message
          } as SnackBarParams
        });
      }
    });
  }

  get showAvailabilityControl() {
    return !!this.caregiverAvailabilities;
  }

  onManuallyEnteringServiceAddress() {
    const defaultAddress = this.isNew ? this.credentialsService.userAddress : this.data.bookingAppointment?.serviceAddress;
    if (this.isManuallyEnteringServiceAddress) { // Toggle ON
      this.serviceAddress?.reset();
    } else { // Toggle OFF
      this.patchAddress(defaultAddress || {});
    }
  }

  patchAddress(defaultAddress: UserAddress) {
    const { id, ...address } = defaultAddress as { id?: any;[key: string]: any };
    this.serviceAddress?.patchValue(address || {});
    if (this.isEdit && id) {
      this.serviceAddress?.get("id")?.setValue(id);
    }
    this.serviceAddress?.updateValueAndValidity();
    this.search();
    return of(true);
  }

  bookingAppointment() {
    if (this.appointmentForm.invalid) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Please fill all required fields"
        } as SnackBarParams
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
      //Adding caregiverId to payload
      caregiverId: this.data.user.userId
    });
  }

  closeModal() {
    this.dialogRef.close();
    const message = this.isNew ? "Care - appointment booking cancelled!" : "Care - editing of appointment cancelled!";
    this.snackBar.openFromComponent(ToastsComponent, {
      ...ToastsConfig.defaultConfig,
      data: {
        type: "INFO",
        headerTitle: "Information",
        message: message
      } as SnackBarParams
    });
  }
}
