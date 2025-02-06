import { CredentialsService } from './../../../core/authentication/credentials.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ZipCode } from './../../../../../node_modules/@types/zipcodes/index.d';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as zipcodes from 'zipcodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReplaceStringPipe } from '../../../core/pipes/replace.string.pipe';
import { Validation } from '../../../core/services/Validation';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { LogService } from '../../../core/logger/LogService';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { SecondaryCareTypeEnums } from '../../../enums/secondary.care.type.enum';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    CommonModule,
    ReplaceStringPipe
  ],
  providers: [
    MatSnackBar,
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientComponent implements OnInit, AfterViewInit {

  @ViewChild('notificationTemplate') notificationTemplate!: TemplateRef<any>;
  notificationMessage: string = "Account created successfully!";

  @ViewChild('stepper') stepper!: MatStepper;
  isLinear: boolean = true;

  hidePassword: boolean = true;

  showSuccessMessage = false;
  isSubmitted: boolean = false;

  step0Form: FormGroup;
  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;
  step5Form: FormGroup;
  step6Form: FormGroup;

  showStep0Form: boolean = false;
  zipCodeInfo: ZipCode | null = null;
  errorMessage: string = "City not found. Please check zipcode and try again";

  careReceiverOptions: Record<string, any> = {
    "CHILD_CARE": { label: "Child", icon: "fa-solid fa-baby-carriage" },
    "SENIOR_CARE": { label: "Senior", icon: "fa-solid fa-child-reaching" },
    "PET_CARE": { label: "Pet", icon: "fa-solid fa-paw" },
    "HOUSE_KEEPING": { label: "House", icon: "fa-solid fa-house-chimney-crack" }
  };

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected http: HttpClient,
    protected router: Router,
    protected authenticationService: AuthenticationService
  ) {
    const getStarted = sessionStorage.getItem('getStarted');
    const step0Data = !!getStarted ? JSON.parse(getStarted) : null;
    this.showStep0Form = !step0Data;
    this.step0Form = new FormGroup({
      longitude: new FormControl(0, [Validators.required, Validators.nullValidator]),
      latitude: new FormControl(0, [Validators.required, Validators.nullValidator]),
      zipcode: new FormControl(step0Data?.zipcode || '', [Validators.required]),
      city: new FormControl(step0Data?.city || '', [Validators.required]),
      state: new FormControl(step0Data?.state || '', [Validators.required]),
      country: new FormControl(step0Data?.country || '', [Validators.required]),
    });
    this.step1Form = new FormGroup({
      primaryCareType: new FormControl('', [Validators.required]),
    });
    this.step2Form = new FormGroup({
      carePeriod: new FormControl('', [Validators.required]),
    });
    this.step3Form = new FormGroup({
      secondaryCareType: new FormControl('', [Validators.required]),
    });
    this.step4Form = new FormGroup({
      //e.g: Init with First CareReceiver Date of birth
      careReceiversDOB: new FormArray([new FormControl('', [Validators.required])]),
    });
    this.step5Form = new FormGroup({
      otherCareTypes: new FormArray([]),
    });
    this.step6Form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validation.validatePassword(8)),
    });
  }

  ngAfterViewInit(): void {
    this.stepper.selectionChange.subscribe((step: StepperSelectionEvent) => {
      if (step.selectedStep.label == "OtherCareTypes") {
        this.initStep5Form();
      }
    });
  }

  ngOnInit() {}

  get zipcode() {
    return this.step0Form.get('zipcode');
  }

  search() {
    if (this.zipcode?.invalid) {
      return;
    }
    this.zipCodeInfo = zipcodes?.lookup(this.zipcode?.value) || null;
    this.step0Form.get('city')?.setValue('');
    this.step0Form.get('state')?.setValue('');
    this.step0Form.get('country')?.setValue('');
    this.step0Form.get('longitude')?.setValue(null);
    this.step0Form.get('latitude')?.setValue(null);
    if (this.zipCodeInfo) {
      this.step0Form.patchValue(this.zipCodeInfo);
      this.step0Form.updateValueAndValidity();
    }
  }

  getStarted() {
    if (this.step0Form.invalid) {
      this.snackBar.open(this.errorMessage, 'close', { duration: 3000 })
        .afterDismissed().subscribe((_) => {
          this.step0Form.reset();
        });
    }
  }

  initStep5Form() {
    const formArray = this.step5Form.get('otherCareTypes') as FormArray;
    this.otherCareReceiverValues.forEach((_) => {
      formArray.push(new FormControl(''));
    });
  }

  get primaryCareType() {
    return this.step1Form.get('primaryCareType');
  }

  get secondaryCareTypeOptions() {
    const primaryCareTypeName = this.primaryCareType?.value as keyof typeof SecondaryCareTypeEnums || 'CHILD_CARE';
    return SecondaryCareTypeEnums?.[primaryCareTypeName] as unknown as Record<string, string>;
  }

  get secondaryCareTypeOptionsKeys() {
    return Object.keys(this.secondaryCareTypeOptions);
  }

  get otherCareReceiverValues() {
    const copyOfCareReceiverOptions = { ...this.careReceiverOptions };
    delete copyOfCareReceiverOptions[this.primaryCareType?.value];
    return Object.keys(copyOfCareReceiverOptions);
  }

  get otherCareTypes() {
    return (this.step5Form.get('otherCareTypes') as FormArray).controls as FormControl[];
  }

  get careReceiverValues() {
    return Object.keys(this.careReceiverOptions);
  }

  get careReceiverTitle() {
    return this.careReceiverOptions[this.primaryCareType?.value]?.label || '';
  }

  get careReceivers() {
    return (this.step4Form.get('careReceiversDOB') as FormArray).controls as FormControl[];
  }

  get careReceiversDOB() {
    return this.step4Form.get('careReceiversDOB') as FormArray;
  }

  addCareReceivers() {
    const control = new FormControl('', Validators.required);
    this.careReceiversDOB.push(control);
  }

  removeCareReceiver(index: number) {
    if (this.careReceiversDOB.length > 1) {
      this.careReceiversDOB.removeAt(index);
    } else {
      this.snackBar.open('At least 1 Care Receiver is Required!', 'close', { duration: 3000 });
    }
  }

  getOtherCareTypeValues() {
    const otherCareTypes = this.step5Form.get('otherCareTypes')?.value;
    let step5FormValues = [];
    for (let i = 0; i < otherCareTypes.length; i++) {
      if (otherCareTypes[i] == true) {
        step5FormValues.push(this.otherCareReceiverValues[i]);
      }
    }
    return { otherCareTypes: step5FormValues };
  }

  submit() {
    if (this.step6Form.invalid) {
      return;
    }

    this.isSubmitted = true;
    const allData = {
      ...this.step0Form.value,
      ...this.step1Form.value,
      ...this.step2Form.value,
      ...this.step3Form.value,
      ...this.step4Form.value,
      ...this.getOtherCareTypeValues(),
      ...this.step6Form.value,
    };

    this.authenticationService.registerClient(allData)
    .subscribe((response: any) => {
      if (response.status) {
        this.showSuccessMessage = true;
        this.snackBar.openFromTemplate(this.notificationTemplate, {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 2000
        }).afterDismissed().subscribe((_) => {
          this.isSubmitted = false;
          this.router.navigate(['/onboarding/client/account']);
        });
      }
    });
  }

}
