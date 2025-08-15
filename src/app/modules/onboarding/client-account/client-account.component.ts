import { MatTimepickerModule } from '@angular/material/timepicker';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '../../../core/logger/LogService';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { DayOfWeekShortEnum, SeasonOfDay } from '../../../shared/enums/schedules.enum';
import { CaregiverQualities } from '../../../shared/enums/caregiver.qualities.enum';
import { SecondaryCareTypeEnums } from '../../../shared/enums/secondary.care.type.enum';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { CaptchaService } from '@app/core/services/captcha.service';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { CredentialsService } from '@app/core/authentication/credentials.service';

@Component({
  selector: 'app-client-account',
  templateUrl: './client-account.component.html',
  styleUrls: ['./client-account.component.scss'],
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientAccountComponent {
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  step5Form: FormGroup;

  secondaryCareTypeOptions: SecondaryCareTypeEnums = {};

  showSpecificTimePicker: boolean = false;
  isSubmitted: boolean = false;

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected httpClient: HttpClient,
    protected credentialsService: CredentialsService,
    protected router: Router,
    private datePipe: DatePipe,
    public captchaService: CaptchaService
  ) {
    this.step1Form = new FormGroup({
      careStartDate: new FormControl('', [Validators.required]),
      careEndDate: new FormControl(''),
      isFlexibleStartDate: new FormControl(false),
    });
    this.step2Form = new FormGroup({
      dayOfWeek: new FormArray(
        Object.entries(DayOfWeekShortEnum).map(([key, value]) => new FormControl(''))
      ),
      timeOfDay: new FormArray(
        Object.entries(SeasonOfDay).map(([key, value]) => new FormControl(''))
      ),
      specificTimeOfDay: new FormControl(''),
      isFlexibleSchedule: new FormControl(false)
    });
    this.step3Form = new FormGroup({
      payRangeFrom: new FormControl('', [Validators.required]),
      payRangeTo: new FormControl('', [Validators.required]),
    });
    this.step4Form = new FormGroup({
      caregiverQualities: new FormArray(
        Object.entries(CaregiverQualities).map(([key, value]) => new FormControl(''))
      ),
    });
    this.step5Form = new FormGroup({
      additionalComments: new FormControl(''),
    });
    this.captchaService.setSubmitCallback(() => this.submit());
  }

  get dayOfWeek() {
    return (this.step2Form.get('dayOfWeek') as FormArray).controls as FormControl[];
  }

  get timeOfDay() {
    return (this.step2Form.get('timeOfDay') as FormArray).controls as FormControl[];
  }

  get caregiverQualities() {
    return (this.step4Form.get('caregiverQualities') as FormArray).controls as FormControl[];
  }

  get dayOfWeekShortEnum() {
    return Object.values(DayOfWeekShortEnum);
  }

  get timeOfDayEnum() {
    return Object.values(SeasonOfDay);
  }

  get CaregiverQualitiesEnum() {
    return Object.values(CaregiverQualities)
  }

  getCheckboxValues(fieldName: string, formValues: any = [], enumsArray: any = []) {
    let result: any = {};
    let validFormValues: any = [];
    for (let i = 0; i < formValues.length; i++) {
      if (formValues[i] == true) {
        validFormValues.push(enumsArray[i]);
      }
    }
    result[fieldName] = validFormValues;
    return result;
  }

  formatLabel(value: number): string {
    return '$' + `${value}`;
  }

  submit() {
    this.isSubmitted = true;
    const allData = {
      ...this.step1Form.value,
      ...this.getCheckboxValues("dayOfWeek", this.step2Form.value["dayOfWeek"], this.dayOfWeekShortEnum),
      ...this.getCheckboxValues("timeOfDay", this.step2Form.value["timeOfDay"], this.timeOfDayEnum),
      specificTimeOfDay: this.datePipe.transform(this.step2Form.value['specificTimeOfDay'], 'HH:mm:ss'),
      isFlexibleSchedule: this.step2Form.value['isFlexibleSchedule'],
      ...this.step3Form.value,
      ...this.getCheckboxValues("caregiverQualities", this.step4Form.value["caregiverQualities"], Object.keys(CaregiverQualities)),
      ...this.step5Form.value,
    };

    firstValueFrom(this.httpClient.post('/access/onboarding/client/preference', allData)).then((response: any) => {
      if (response.status) {
        this.isSubmitted = false;
        this.credentialsService.updateCredentialsField('clientPreference', response.data);
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "SUCCESS",
            headerTitle: "Account Created Successfully",
            message: "Account Required: Email Verification Needed",
          } as SnackBarParams
        });
        this.router.navigate(['/onboarding/client/complete']);
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
