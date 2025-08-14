import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { PhonePipe } from '@app/core/pipes/phone.pipe';
import { CaregiverPreferences, ClientPreferences } from '@app/core/models/login-context.model';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';
import { Validation } from '@app/core/services/Validation';
import { firstValueFrom, forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as zipcodes from 'zipcodes';
import { ApiResponse } from '@app/core/models/api-repsonse';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatCheckboxModule,
    PhonePipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnChanges {

  @Input()
  isEditing: boolean = false;

  @ViewChild('notificationTemplate') notificationTemplate!: TemplateRef<any>;
  notificationMessage: string = "User Profile Updated Successfully";

  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', Validation.validateEmailField),
    cellPhone: new FormControl('', [Validators.required]),
  });

  userAddress: FormGroup = new FormGroup({
    houseNumber: new FormControl('', [Validators.required]),
    street: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required]),
    country: new FormControl('USA', [Validators.required]),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
  });

  zipCodeInfo: zipcodes.ZipCode | null = null;

  clientPreferences: ClientPreferences | null = null;
  caregiverPreferences: CaregiverPreferences | null = null;

  isSubmitted: boolean = false;
  errorMessage: string = "";


  constructor(
    protected authenticationService: AuthenticationService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected snackBar: MatSnackBar
  ) {
    if (this.credentials?.activePortal == AppUserType.careGiver) {
      this.caregiverPreferences = (this.credentials?.clientOrCaregiverPreferences as CaregiverPreferences) ?? null;
    } else {
      this.clientPreferences = (this.credentials?.clientOrCaregiverPreferences as ClientPreferences) ?? null;
    }
  }

  ngOnInit(): void {
    if (this.user) {
      this.profileForm.patchValue(this.user);
      this.profileForm?.updateValueAndValidity();
    }
    if (this.credentials?.userAddress) {
      this.userAddress?.patchValue(this.credentials.userAddress);
      this.userAddress?.updateValueAndValidity();
      this.search();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user) {
      this.profileForm.patchValue(this.user)
    }
  }

  search() {
    if (this.userAddress?.get("zipcode")?.invalid) {
      return;
    }
    this.zipCodeInfo = zipcodes?.lookup(this.userAddress?.get("zipcode")?.value) || null;
    this.userAddress.get('city')?.setValue('');
    this.userAddress.get('state')?.setValue('');
    this.userAddress.get('country')?.setValue('');
    this.userAddress.get('longitude')?.setValue(null);
    this.userAddress.get('latitude')?.setValue(null);
    if (this.zipCodeInfo) {
      this.userAddress.patchValue(this.zipCodeInfo);
      this.userAddress.updateValueAndValidity();
    }
  }

  submit() {
    if (this.profileForm.invalid || this.userAddress.invalid) {
      this.errorMessage = "Invalid Input: Please Enter All Required Fields!"
      return;
    }

    this.isSubmitted = true;

    const userData = {
      ...this.user,
      ...this.profileForm.value
    }
    const address = {
      ...this.credentials?.userAddress,
      ...this.userAddress.value,
      houseNumber: parseInt(this.userAddress.get("houseNumber")?.value || "0")
    }

    forkJoin([
      this.authenticationService.register(userData),
      this.authenticationService.saveUserAddress(address)
    ]).subscribe(
    ([userResponse, userAddressResponse]) => {
      if (userResponse.status && userAddressResponse.status) {
        this.isSubmitted = false;
        this.isEditing = false;
        this.snackBar.openFromTemplate(this.notificationTemplate, { duration: 4000 });
      }
    }, error => {
      this.isSubmitted = false;
      this.errorMessage = error.error.message;
      this.snackBar.open(error.error.message, 'close', { duration: 3000 });
    });
  }

  get credentials() {
    return this.authenticationService.getCredentialsService().credentials;
  }

  get user() {
    return this.credentials?.user;
  }

  get professionalSummary() {
    const prefs = this.caregiverPreferences as { professionalSummary?: string } | undefined;
    return prefs?.professionalSummary || "";
  }


}
