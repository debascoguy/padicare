import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { LogService } from '@app/core/logger/LogService';
import { CaptchaService } from '@app/core/services/captcha.service';
import { EnvironmentService } from '@app/core/services/environment.service';
import { Validation } from '@app/core/services/Validation';
import { PasswordMeterComponent } from '@app/shared/password-meter/password-meter.component';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-change-password',
  imports: [
    CommonModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatError,
    MatIcon,
    PasswordMeterComponent,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  changePasswordForm = new FormGroup({
    password: new FormControl('', Validation.validatePassword(8, /[!@#$%^&*(),.?":{}|<>]/)),
    confirmPassword: new FormControl('', Validation.validatePassword(8, /[!@#$%^&*(),.?":{}|<>]/)),
  }, Validation.matchingPasswords('password', 'confirmPassword'));

  isSubmitted: boolean = false;
  errorMessage: string | null = null;
  isSuccess: boolean = false;

  notificationMessage: string = "Password reset was successful! Please go to login";

  passwordStrength: number = 0;

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected authenticationService: AuthenticationService,
    protected environmentService: EnvironmentService,
    public captchaService: CaptchaService
  ) {
    this.captchaService.setSubmitCallback(() => this.onSubmit());
  }

  setPasswordStrength(ps: number) {
    this.passwordStrength = ps;
  }

  get passwordValue(): string {
    return this.changePasswordForm.get('password')?.value as string;
  }

  reset() {
    this.isSubmitted = false;
    this.isSuccess = false;
    this.passwordStrength = 0;
    this.changePasswordForm.reset();
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.changePasswordForm.invalid) {
      return;
    }
    if (this.passwordStrength <= 3) {
      this.errorMessage = "Password is too Weak!";
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: this.errorMessage,
        } as SnackBarParams
      });
      return;
    }

    this.isSubmitted = true;
    firstValueFrom(
      this.authenticationService.updatePassword(this.passwordValue)
    ).then((response: any) => {
      if (response.status) {
        this.isSubmitted = false;
        this.isSuccess = true;
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          duration: 4000,
          data: {
            type: "SUCCESS",
            headerTitle: "Password Changed Successfully",
            message: "Password reset was successful! Please go to login"
          } as SnackBarParams
        }).afterDismissed().subscribe(() => {
          this.reset();
        });
      }
    }).catch(error => {
      this.isSubmitted = false;
      this.errorMessage = error.error.message;
      this.snackBar.open(error.error.message, 'close', { duration: 3000 }).afterDismissed().subscribe(() => {
        this.reset();
      });
    });
  }

}
