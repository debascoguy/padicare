import { CredentialsService } from '@app/core/authentication/credentials.service';
import { Component, TemplateRef, ViewChild, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { CaptchaService } from '@app/core/services/captcha.service';
import { Router } from '@angular/router';
import { LogService } from '@app/core/logger/LogService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preferences',
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
  ],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent {

  preferenceForm = new FormGroup({
    acceptTermsAndConditions: new FormControl(false, [Validators.required]),
    acceptNotifications: new FormControl(false, [Validators.required]),
    acceptLocation: new FormControl(false, [Validators.required]),
    acceptEmail: new FormControl(false, [Validators.required]),
    acceptSMS: new FormControl(false, [Validators.required]),
    acceptPhone: new FormControl(false, [Validators.required]),
    visibility: new FormControl(false, [Validators.required]),
  });


  @ViewChild('notificationTemplate') notificationTemplate!: TemplateRef<any>;
  notificationMessage: string = "User Preference Updated successfully!";

  showSuccessMessage = false;

  isLoading: boolean = false;
  isSubmitted: boolean = false;

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected router: Router,
    protected httpClient: HttpClient,
    protected credentialsService: CredentialsService
  ) {
    this.preferenceForm.patchValue(this.currentUserPreference);
  }

  get currentUserPreference() {
    return this.credentialsService.userPreference;
  }

  get activePortal(): AppUserType | null | undefined {
    return this.credentialsService.activePortal;
  }

  get AppUserType() {
    return AppUserType;
  }

  reset() {
    this.preferenceForm.reset();
    this.preferenceForm.patchValue(this.currentUserPreference);
    this.isLoading = false;
    this.isSubmitted = false;
  }

  submitPreferences() {

    this.isSubmitted = true;
    this.isLoading = true;

    if (this.preferenceForm.invalid) {
      this.reset();
      this.snackBar.open("Please fill in all required fields.", 'OK', { duration: 3000 });
      return;
    }

    const userPreference = {
      ...this.currentUserPreference,
      ...this.preferenceForm.value
    }

    firstValueFrom(this.httpClient.post('/access/onboarding/user/preference', userPreference)).then((response: any) => {
      if (response.status) {
        this.credentialsService.updateCredentialsField('userPreference', response.data);
        this.showSuccessMessage = true;
        this.snackBar.open(this.notificationMessage, 'OK', { duration: 4000 }).afterDismissed().subscribe(() => {
          this.showSuccessMessage = false;
          this.reset();
        });
      }
    }).catch(error => {
      this.reset();
      this.snackBar.open(error.error.message, 'close', { duration: 3000 });
    });

    // Uncomment the following lines to simulate a successful submissions
    // setTimeout(() => {
    //   this.isLoading = false;
    //   this.showSuccessMessage = true;
    //   this.snackBar.open(this.notificationMessage, 'OK', { duration: 3000 });
    // }, 2000);
  }

}
