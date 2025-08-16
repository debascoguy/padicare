import { firstValueFrom } from 'rxjs';
import { Loader } from '@googlemaps/js-api-loader';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as zipcodes from 'zipcodes';
import { LogService } from '@app/core/logger/LogService';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Validation } from '@app/core/services/Validation';
import { EnvironmentService } from '@app/core/services/environment.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { DocumentUploaderComponent } from '@app/shared/document-uploader/document-uploader.component';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { CaptchaService } from '@app/core/services/captcha.service';
import { ProductsNameEnum } from '@app/shared/enums/products-name.enum';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { CaregiverQualities } from '@app/shared/enums/caregiver.qualities.enum';
import { getCheckboxValues } from '@app/core/services/utils';
import { now, timeOfDay, isAM, isPM, getDateDiffInHours, addDays, toMysqlDateTime } from '@app/core/services/date-fns';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-caregiver',
  templateUrl: './caregiver.component.html',
  styleUrls: ['./caregiver.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTimepickerModule,
    DocumentUploaderComponent,
    ReplaceStringPipe,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
  ],
  providers: [
    MatSnackBar,
    provideNativeDateAdapter()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaregiverComponent implements OnInit, AfterViewInit {

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
  step4bForm: FormGroup;
  step4cForm: FormGroup;
  step4dForm: FormGroup;
  step5Form: FormGroup;
  step6Form: FormGroup;

  showStep0Form: boolean = true;
  errorMessage: string = "City not found. Please check zipcode and try again";

  map: google.maps.Map | null = null;
  circle: google.maps.Circle | null = null;
  center: google.maps.LatLng | null = null;

  mapLoader: Loader | null = null;

  careReceiverOptions: Record<string, any> = {
    "CHILD_CARE": { label: "Child", icon: "fa-solid fa-baby-carriage" },
    "SENIOR_CARE": { label: "Senior", icon: "fa-solid fa-child-reaching" },
    "PET_CARE": { label: "Pet", icon: "fa-solid fa-paw" },
    "HOUSE_KEEPING": { label: "House", icon: "fa-solid fa-house-chimney-crack" }
  };

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected router: Router,
    protected authenticationService: AuthenticationService,
    protected environmentService: EnvironmentService,
    public captchaService: CaptchaService
  ) {
    const getStarted = sessionStorage.getItem('getStarted');
    const step0Data = !!getStarted ? JSON.parse(getStarted) : null;
    this.showStep0Form = true;
    this.step0Form = new FormGroup({
      longitude: new FormControl(0, [Validators.required, Validators.nullValidator]),
      latitude: new FormControl(0, [Validators.required, Validators.nullValidator]),
      zipcode: new FormControl(step0Data?.zipcode || '', [Validators.required, Validators.minLength(5)]),
      city: new FormControl(step0Data?.city || '', [Validators.required]),
      state: new FormControl(step0Data?.state || '', [Validators.required]),
      country: new FormControl(step0Data?.country || '', [Validators.required]),
      radius: new FormControl(20, [Validators.required]), //in miles
    });

    this.step1Form = new FormGroup({
      primaryCareType: new FormControl('', [Validators.required]),
    });

    this.step2Form = new FormGroup({
      careReadiness: new FormControl('', [Validators.required]),
    });

    this.step3Form = new FormGroup({
      otherCareTypes: new FormArray([]),
    });

    this.step4Form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', Validation.validateEmailField),
      cellPhone: new FormControl('', [Validators.required]),
      password: new FormControl('', Validation.validatePassword(8, /[!@#$%^&*(),.?":{}|<>]/)),
      confirmPassword: new FormControl('', Validation.validatePassword(8, /[!@#$%^&*(),.?":{}|<>]/)),
    }, Validation.matchingPasswords('password', 'confirmPassword'));

    this.step4bForm = new FormGroup({
      professionalSummary: new FormControl('', [Validators.required]),
      chargePerHour: new FormArray([]),
      yearsOfExperience: new FormControl(1, Validators.required),
    });

    this.step4cForm = new FormGroup({
      caregiverQualities: new FormArray(
        Object.entries(CaregiverQualities).map(([key, value]) => new FormControl(''))
      ),
    });

    this.step4dForm = new FormGroup({ // Default to night rest
      dailyPtoFrom: new FormControl(timeOfDay(now(), 22, 0, 0, 0)), // default init to 10PM
      dailyPtoTo: new FormControl(addDays(timeOfDay(now(), 6, 0, 0, 0), 1)) // default init to 6AM
    });

    this.step5Form = new FormGroup({
      identityDocument: new FormControl('', [Validators.required]),
      filename: new FormControl('', [Validators.required]),
      acceptTermsAndConditions: new FormControl(false, [Validators.requiredTrue]),
      acceptNotifications: new FormControl(false, [Validators.requiredTrue]),
      acceptLocation: new FormControl(false, [Validators.requiredTrue]),
      acceptEmail: new FormControl(false, [Validators.requiredTrue]),
      acceptSMS: new FormControl(false, [Validators.requiredTrue]),
      acceptPhone: new FormControl(false, [Validators.requiredTrue]),
      visibility: new FormControl(false, [Validators.requiredTrue])
    });

    this.step6Form = new FormGroup({
      backgroundCheck: new FormControl(false, [Validators.requiredTrue])
    });

    this.mapLoader = new Loader({
      apiKey: this.environmentService.getValue('googleMapApiKey'),
      version: 'weekly',
    });

    this.mapLoader.importLibrary('maps').then(() => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        this.map = new google.maps.Map(
          mapElement,
          {
            center: { lat: 0, lng: 0 },
            zoom: 8,
          }
        );
      } else {
        console.error('Map element not found');
      }
    });
    this.captchaService.setSubmitCallback(() => this.submit());
  }

  ngOnInit() {
    if (this.zipcode?.value && this.zipcode?.valid) {
      this.search();
      this.geocodeZipcode(this.zipcode?.value);
    }
  }

  ngAfterViewInit(): void {
    this.step0Form.get('zipcode')?.valueChanges.subscribe((value) => {
      if (value && value.length >= 5) {
        this.search();
        this.geocodeZipcode(value);
      }
    });

    this.step0Form.get('radius')?.valueChanges.subscribe((value) => {
      this.drawCircle(value);
    });

    this.email?.valueChanges.subscribe((value) => {
      firstValueFrom(this.authenticationService.validateEmail(AppUserType.careGiver, value))
        .then((response: any) => {
          if (response.status && response.status == true) {
            this.email?.setErrors({ uniqueEmail: false });
          }
        }).catch(error => {
          this.email?.setErrors({ email: true });
        });
    });

    this.stepper.selectionChange.subscribe((step: StepperSelectionEvent) => {
      if (step.selectedStep.label === "OtherCareTypes") {
        //Initialize the other care types form array based on the primary care type selected
        const formArray = this.step3Form.get('otherCareTypes') as FormArray;
        this.otherCareTypeValue.forEach((_) => {
          formArray.push(new FormControl(''));
        });
      }

      if (step.selectedStep.label === "ProfessionalPreference") {
        // Initialize the charge per hour form array based on the other care types selected
        const formArray = this.step4bForm.get('chargePerHour') as FormArray;
        formArray.clear();
        formArray.push(this.createNewCaregiverFee(this.primaryCareType?.value));
        this.otherCareTypeSelected.forEach((careTypeValue) => {
          formArray.push(this.createNewCaregiverFee(careTypeValue))
        });
      }
    });
  }

  createNewCaregiverFee(careTypeValue: ProductsNameEnum) {
    return new FormGroup({
      careType: new FormControl(careTypeValue, [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      currency: new FormControl('USD', [Validators.required]),
      frequency: new FormControl('HOURLY', [Validators.required]),
    })
  }
  
  get caregiverQualities() {
    return (this.step4cForm.get('caregiverQualities') as FormArray).controls as FormControl[];
  }

  get CaregiverQualitiesEnum() {
    return Object.values(CaregiverQualities)
  }

  get careReceiverValues() {
    return Object.keys(this.careReceiverOptions);
  }

  get email() {
    return this.step4Form.get('email');
  }

  get primaryCareType() {
    return this.step1Form.get('primaryCareType');
  }

  get otherCareTypeValue() {
    const copyOfCareReceiverOptions = { ...this.careReceiverOptions };
    delete copyOfCareReceiverOptions[this.primaryCareType?.value];
    return Object.keys(copyOfCareReceiverOptions);
  }

  get otherCareTypeSelected() {
    const otherCareTypes = this.step3Form.get('otherCareTypes')?.value;
    let step3FormValues = [];
    for (let i = 0; i < otherCareTypes.length; i++) {
      if (otherCareTypes[i] == true) {
        step3FormValues.push(this.otherCareTypeValue[i]);
      }
    }
    return step3FormValues as ProductsNameEnum[];
  }

  get otherCareTypes() {
    return (this.step3Form.get('otherCareTypes') as FormArray).controls as FormControl[];
  }

  get chargePerHourFormGroups() {
    return (this.step4bForm.get('chargePerHour') as FormArray).controls as FormGroup[];
  }

  get zipcode() {
    return this.step0Form.get('zipcode');
  }

  geocodeZipcode(zipcode: string) {
    this.mapLoader?.importLibrary('geocoding').then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: zipcode }, (results, status) => {
        if (status === 'OK') {
          this.center = results?.[0]?.geometry?.location || null;
          if (this.center) {
            this.map?.setCenter(this.center);
            this.drawCircle(this.step0Form.get('radius')?.value || 20);
          }
        } else {
          this.logger.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

  drawCircle(radiusInMiles: number) {
    this.circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: this.center,
      radius: (radiusInMiles * 1609.344), // convert miles to meters
    });
  }

  search() {
    if (this.zipcode?.invalid) {
      return;
    }
    const zipCodeInfo = zipcodes?.lookup(this.zipcode?.value) || null;
    this.step0Form.get('city')?.setValue('');
    this.step0Form.get('state')?.setValue('');
    this.step0Form.get('country')?.setValue('');
    this.step0Form.get('longitude')?.setValue(null);
    this.step0Form.get('latitude')?.setValue(null);
    if (zipCodeInfo) {
      this.step0Form.patchValue(zipCodeInfo);
      this.step0Form.updateValueAndValidity();
    }
  }

  onFileUpload({ fileBase64, fileInfo }: { fileBase64: string | null; fileInfo: File | null }) {
    if (fileBase64) {
      this.step5Form.patchValue({ identityDocument: fileBase64, filename: fileInfo?.name });
      this.step5Form.updateValueAndValidity();
    } else {
      this.step5Form.patchValue({ identityDocument: '', filename: '' });
      this.step5Form.updateValueAndValidity();
    }
  }

  morningRest() { // 6AM - 12PM
    this.step4dForm.get("dailyPtoFrom")?.setValue(timeOfDay(now(), 6, 0, 0, 0));
    this.step4dForm.get("dailyPtoTo")?.setValue(timeOfDay(now(), 12, 0, 0, 0));
  }

  afternoonRest() { // 12PM - 6PM
    this.step4dForm.get("dailyPtoFrom")?.setValue(timeOfDay(now(), 12, 0, 0, 0));
    this.step4dForm.get("dailyPtoTo")?.setValue(timeOfDay(now(), 18, 0, 0, 0));
  }

  nightRest() { // 10PM - 6AM (next day)
    this.step4dForm.get("dailyPtoFrom")?.setValue(timeOfDay(now(), 22, 0, 0, 0));
    this.step4dForm.get("dailyPtoTo")?.setValue(addDays(timeOfDay(now(), 6, 0, 0, 0), 1));
  }

  get isOvernightRest() {
    const dailyPtoFrom = this.step4dForm.get("dailyPtoFrom")?.value || now();
    const dailyPtoTo = this.step4dForm.get("dailyPtoTo")?.value || now();
    return (isPM(dailyPtoFrom) && isAM(dailyPtoTo));
  }

  get isLongOvernightRest() {
    const dailyPtoFrom = this.step4dForm.get("dailyPtoFrom")?.value || now();
    const dailyPtoTo = this.step4dForm.get("dailyPtoTo")?.value || now();
    return (isPM(dailyPtoFrom) && isAM(dailyPtoTo)) && getDateDiffInHours(dailyPtoFrom, addDays(dailyPtoTo, 1)) > 8;
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
      ...{ otherCareTypes: this.otherCareTypeSelected },
      ...this.step4Form.value,
      ...this.step4bForm.value,
      ...getCheckboxValues("caregiverQualities", this.step4cForm.value["caregiverQualities"], Object.keys(CaregiverQualities)),
      ...{
        dailyPtoFrom: toMysqlDateTime(this.step4dForm.value["dailyPtoFrom"]),
        dailyPtoTo: toMysqlDateTime(this.step4dForm.value["dailyPtoTo"])
      },
      ...this.step5Form.value,
      ...this.step6Form.value,
    };

    allData['backgroundCheck'] = allData['backgroundCheck'] ? 'INITIATED' : null;
    allData['radius'] = +allData['radius'];
    allData['latitude'] = +allData['latitude'];
    allData['longitude'] = +allData['longitude'];
    delete allData['confirmPassword'];

    firstValueFrom(this.authenticationService.registerCaregiver(allData)).then((response: any) => {
      if (response && response.status) {
        this.showSuccessMessage = true;
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "SUCCESS",
            headerTitle: "Account Created",
            message: "Account created successfully!",
          } as SnackBarParams
        });
        this.isSubmitted = false;
        this.router.navigate(['/caregiver/complete']);
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
