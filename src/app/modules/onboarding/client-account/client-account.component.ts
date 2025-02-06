import { CredentialsService } from './../../../core/authentication/credentials.service';
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
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { DayOfWeekShortEnum, SeasonOfDay } from '../../../enums/schedules.enum';
import { CaregiverQualities } from '../../../enums/caregiver.qualities.enum';
import { CareCategoryEnum } from '../../../enums/care.category.enum';
import { SecondaryCareTypeEnums } from '../../../enums/secondary.care.type.enum';
import { Router } from '@angular/router';
import { SecuredSessionStorage } from '../../../core/services/SecuredSessionStorage';

@Component({
  selector: 'app-client-account',
  templateUrl: './client-account.component.html',
  styleUrls: ['./client-account.component.scss'],
  imports: [
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
      CommonModule
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
    private datePipe: DatePipe
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
  }

  // getClientPreferencePrimaryCareType() {
  //   const clientPreference =  this.authenticationService.getCredentialsService().clientPreference;
  //   const primaryCareType = clientPreference?.clientCareTypes?.filter((c: any) => c.category == CareCategoryEnum.Primary)?.[0];
  //   return primaryCareType?.careType as keyof typeof SecondaryCareTypeEnums || 'PET_CARE';
  // }

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
      specificTimeOfDay:  this.datePipe.transform(this.step2Form.value['specificTimeOfDay'], 'HH:mm:ss'),
      isFlexibleSchedule: this.step2Form.value['isFlexibleSchedule'],
      ...this.step3Form.value,
      ...this.getCheckboxValues("caregiverQualities", this.step4Form.value["caregiverQualities"], Object.keys(CaregiverQualities)),
      ...this.step5Form.value,
    };

    this.httpClient.post('/onboarding/client/preference', allData).subscribe((response: any) => {
      if (response.status) {
        this.isSubmitted = false;
        this.credentialsService.updateCredentialsField('clientPreference', response.data);
        this.router.navigate(['/onboarding/client/subscription']);
      }
    });
  }
}
