import { MatTimepickerModule } from '@angular/material/timepicker';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
import { DayOfWeekShortEnum } from '../../../shared/enums/schedules.enum';
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
import { getCheckboxValues } from '@app/core/services/utils';

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
    public captchaService: CaptchaService
  ) {
    this.step1Form = new FormGroup({
      careStartDate: new FormControl('', [Validators.required]),
      careEndDate: new FormControl(''),
      isFlexibleStartDate: new FormControl(false),
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

  get caregiverQualities() {
    return (this.step4Form.get('caregiverQualities') as FormArray).controls as FormControl[];
  }

  get dayOfWeekShortEnum() {
    return Object.values(DayOfWeekShortEnum);
  }

  get CaregiverQualitiesEnum() {
    return Object.values(CaregiverQualities)
  }

  formatLabel(value: number): string {
    return '$' + `${value}`;
  }

  submit() {
    this.isSubmitted = true;
    const allData = {
      ...this.step1Form.value,
      ...this.step3Form.value,
      ...getCheckboxValues("caregiverQualities", this.step4Form.value["caregiverQualities"], Object.keys(CaregiverQualities)),
      ...this.step5Form.value,
    };

    firstValueFrom(this.httpClient.post('/client/preferences', allData)).then((response: any) => {
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
