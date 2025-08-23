import { filter, firstValueFrom } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { LogService } from '@app/core/logger/LogService';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { CaregiverPreferences } from '@app/core/models/login-context.model';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { CaptchaService } from '@app/core/services/captcha.service';
import { timeOfDay, addDays, now, isAM, isPM, toMysqlDateTime } from '@app/core/services/date-fns';
import { getCheckboxValues, isEmpty } from '@app/core/services/utils';
import { CaregiverQualities } from '@app/shared/enums/caregiver.qualities.enum';
import { CaregiverFees } from '@app/shared/types/caregiver-fees';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';

@Component({
  selector: 'app-caregiver-preference',
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatIconModule,
    MatCheckboxModule,
    MatSliderModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    ReplaceStringPipe
  ],
  providers: [
    MatSnackBar,
    provideNativeDateAdapter(),
    DatePipe
  ],
  templateUrl: './caregiver-preference.component.html',
  styleUrl: './caregiver-preference.component.scss'
})
export class CaregiverPreferenceComponent {

  isSubmitted: boolean = false;
  caregiverPreferences!: CaregiverPreferences;

  preferenceForm: FormGroup = new FormGroup({
    id: new FormControl(""),
    dailyPtoFrom: new FormControl(timeOfDay(now(), 22, 0, 0, 0), [Validators.required]), // default init to 10PM
    dailyPtoTo: new FormControl(addDays(timeOfDay(now(), 6, 0, 0, 0), 1), [Validators.required]), // default init to 6AM
    professionalSummary: new FormControl('', [Validators.required]),
    chargePerHour: new FormArray([]),
    yearsOfExperience: new FormControl(1, Validators.required),
    caregiverQualities: new FormArray(
      Object.entries(CaregiverQualities).map(([key, value]) => new FormControl(''))
    )
  });

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected httpClient: HttpClient,
    protected credentialsService: CredentialsService,
    protected authenticationService: AuthenticationService,
    public captchaService: CaptchaService
  ) {
    this.captchaService.setSubmitCallback(() => this.submit());
  }

  ngOnInit(): void {
    const formArray = this.preferenceForm.get('chargePerHour') as FormArray;
    formArray.clear();
    const caregiver = { id: this.credentialsService.user.id };
    const where = { caregiver, isDeleted: false };
    this.httpClient.post<ApiResponse>(`/caregiver/fees/find-by`, { where }).subscribe((response: ApiResponse) => {
      if (response.status) {
        response.data.forEach((caregiverFee: CaregiverFees) => {
          formArray.push(this.addCaregiverFee(caregiverFee));
        });
      }
    });
    this.authenticationService.getCaregiverPreferences().subscribe((response: ApiResponse) => {
      if (response.status) {
        this.patchForm(response.data);
      }
    });
  }

  addCaregiverFee(caregiverFee: CaregiverFees) {
    return new FormGroup({
      id: new FormControl(caregiverFee.id),
      careType: new FormControl(caregiverFee.productName, [Validators.required]),
      amount: new FormControl(caregiverFee.amount, [Validators.required]),
      currency: new FormControl(caregiverFee.currency || "USD", [Validators.required]),
      unit: new FormControl(caregiverFee.unit || "HOURLY", [Validators.required]),
    });
  }

  patchForm(savedPreferences: CaregiverPreferences) {
    this.caregiverPreferences = savedPreferences;
    this.preferenceForm.patchValue(savedPreferences);
    this.credentialsService.updateCredentialsField("clientOrCaregiverPreferences", this.caregiverPreferences);
  }

  morningRest() { // 6AM - 12PM
    this.preferenceForm.get("dailyPtoFrom")?.setValue(timeOfDay(now(), 6, 0, 0, 0));
    this.preferenceForm.get("dailyPtoTo")?.setValue(timeOfDay(now(), 12, 0, 0, 0));
  }

  afternoonRest() { // 12PM - 6PM
    this.preferenceForm.get("dailyPtoFrom")?.setValue(timeOfDay(now(), 12, 0, 0, 0));
    this.preferenceForm.get("dailyPtoTo")?.setValue(timeOfDay(now(), 18, 0, 0, 0));
  }

  nightRest() { // 10PM - 6AM (next day)
    this.preferenceForm.get("dailyPtoFrom")?.setValue(timeOfDay(now(), 22, 0, 0, 0));
    this.preferenceForm.get("dailyPtoTo")?.setValue(addDays(timeOfDay(now(), 6, 0, 0, 0), 1));
  }

  get isOvernightRest() {
    const dailyPtoFrom = this.preferenceForm.get("dailyPtoFrom")?.value || now();
    const dailyPtoTo = this.preferenceForm.get("dailyPtoTo")?.value || now();
    return (isPM(new Date(dailyPtoFrom)) && isAM(new Date(dailyPtoTo)));
  }

  get caregiverQualities() {
    return (this.preferenceForm.get('caregiverQualities') as FormArray).controls as FormControl[];
  }

  get CaregiverQualitiesEnum() {
    return Object.values(CaregiverQualities)
  }

  get chargePerHourFormGroups() {
    return (this.preferenceForm.get('chargePerHour') as FormArray).controls as FormGroup[];
  }

  submit() {
    if (this.preferenceForm.invalid) {
      return;
    }

    this.isSubmitted = true;
    const allData = {
      ...this.preferenceForm.value,
      caregiverQualities: (this.preferenceForm.value["caregiverQualities"]).filter((r: any) => !isEmpty(r)),
      dailyPtoFrom: toMysqlDateTime(new Date(this.preferenceForm.value["dailyPtoFrom"])),
      dailyPtoTo: toMysqlDateTime(new Date(this.preferenceForm.value["dailyPtoTo"]))
    };

    firstValueFrom(this.httpClient.post<ApiResponse>('/caregiver/preferences', allData))
    .then((response: ApiResponse) => {
      if (response && response.status) {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "SUCCESS",
            headerTitle: "Account Preference",
            message: "Account Preference Updated!",
          } as SnackBarParams
        });
        this.isSubmitted = false;
        this.credentialsService.updateCredentialsField("clientOrCaregiverPreferences", this.caregiverPreferences);
      } else {
        this.isSubmitted = false;
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error",
            message: response.message || "Unable to save caregiver details at this time. Please try again later!",
          } as SnackBarParams
        });
      }
    }).catch(error => {
      this.isSubmitted = false;
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: error.error.message || error.message || "Unable to save caregiver details at this time. Please try again later!",
        } as SnackBarParams
      });
      this.logger.error(error.error);
    });


  }

}
