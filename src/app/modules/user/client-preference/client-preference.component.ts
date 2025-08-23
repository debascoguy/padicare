import { AuthenticationService } from './../../../core/authentication/authentication.service';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { LogService } from '@app/core/logger/LogService';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { ClientPreferences } from '@app/core/models/login-context.model';
import { CaptchaService } from '@app/core/services/captcha.service';
import { parseDate } from '@app/core/services/date-fns';
import { getCheckboxValues } from '@app/core/services/utils';
import { CaregiverQualities } from '@app/shared/enums/caregiver.qualities.enum';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { RecaptchaModule, RecaptchaFormsModule, RecaptchaErrorParameters } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-client-preference',
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
  ],
  providers: [
    MatSnackBar,
    provideNativeDateAdapter(),
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './client-preference.component.html',
  styleUrl: './client-preference.component.scss'
})
export class ClientPreferenceComponent implements OnInit {

  showSpecificTimePicker: boolean = false;
  isSubmitted: boolean = false;
  clientPreferences!: ClientPreferences;

  preferenceForm: FormGroup = new FormGroup({
    id: new FormControl(""),
    careStartDate: new FormControl('', [Validators.required]),
    careEndDate: new FormControl(''),
    isFlexibleStartDate: new FormControl(false),
    payRangeFrom: new FormControl('', [Validators.required]),
    payRangeTo: new FormControl('', [Validators.required]),
    caregiverQualities: new FormArray(
      Object.entries(CaregiverQualities).map(([key, value]) => new FormControl(''))
    ),
    additionalComments: new FormControl('')
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
    this.authenticationService.getClientPreferences().subscribe((response: ApiResponse) => {
      if (response.status) {
        this.patchForm(response.data);
      }
    });
  }

  patchForm(savedPreferences: ClientPreferences) {
    this.clientPreferences = savedPreferences;
    this.preferenceForm.get("id")?.setValue(savedPreferences.id);
    this.preferenceForm.get("isFlexibleSchedule")?.setValue(savedPreferences.isFlexibleSchedule);
    this.preferenceForm.get("isFlexibleStartDate")?.setValue(savedPreferences.isFlexibleStartDate);
    this.preferenceForm.get("payRangeFrom")?.setValue(savedPreferences.payRangeFrom);
    this.preferenceForm.get("payRangeTo")?.setValue(savedPreferences.payRangeTo);
    this.preferenceForm.get("additionalComments")?.setValue(savedPreferences.additionalComments);
    const careStartDate = parseDate(savedPreferences?.careStartDate || new Date());
    const careEndDate = parseDate(savedPreferences?.careEndDate || new Date());
    if (savedPreferences.careStartDate) {
      this.preferenceForm.get("careStartDate")?.setValue(careStartDate);
    }
    if (savedPreferences.careEndDate && careEndDate.getTime() > careStartDate.getTime()) {
      this.preferenceForm.get("careEndDate")?.setValue(careEndDate);
    }
    if (savedPreferences.caregiverQualities) {
      const caregiverQualities = <string[]>savedPreferences.caregiverQualities;
      this.caregiverQualities.forEach((control, index) => {
        if (caregiverQualities.includes(this.caregiverQualitiesValues[index])) {
          control.setValue(true);
        }
      });
    }
  }

  get caregiverQualities() {
    return (this.preferenceForm.get('caregiverQualities') as FormArray).controls as FormControl[];
  }

  get CaregiverQualitiesEnum() {
    return Object.values(CaregiverQualities)
  }

  get caregiverQualitiesValues(): string[] {
    return Object.keys(CaregiverQualities)
  }

  formatLabel(value: number): string {
    return '$' + `${value}`;
  }

  submit() {
    this.isSubmitted = true;
    const allData = {
      ...this.preferenceForm.value,
      ...getCheckboxValues("caregiverQualities", this.preferenceForm.value["caregiverQualities"], Object.keys(CaregiverQualities)),
    };

    firstValueFrom(this.httpClient.post('/client/preferences', allData)).then((response: any) => {
      if (response.status) {
        this.isSubmitted = false;
        this.credentialsService.updateCredentialsField('clientOrCaregiverPreferences', response.data);
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "SUCCESS",
            headerTitle: "Account Updated",
            message: "Account Preference Updated Successfully",
          } as SnackBarParams
        });
      }
    }).catch(error => {
      this.isSubmitted = false;
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Validation Error",
          message: error.error.message,
        } as SnackBarParams
      });
    });
  }

}
