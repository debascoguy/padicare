import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validation } from '@app/core/services/Validation';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { LogService } from '@app/core/logger/LogService';
import { CaptchaService } from '@app/core/services/captcha.service';
import { EnvironmentService } from '@app/core/services/environment.service';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { firstValueFrom } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
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
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  isSubmitted: boolean = false;
  errorMessage: string | null = null;
  isSuccess: boolean = false;

  @ViewChild('notificationTemplate') notificationTemplate!: TemplateRef<any>;
  notificationMessage: string = "Password Reset Link has Been Sent To The Registered User Email Address!";

  private resetPasswordPage = location.href.toLowerCase().replace("forgot-password", "set-new-password");

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validation.validateEmailField]),
    resetPasswordUrl: new FormControl(this.resetPasswordPage, [Validators.required]),
  });

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected router: Router,
    protected authenticationService: AuthenticationService,
    protected environmentService: EnvironmentService,
    public captchaService: CaptchaService
  ) {
    this.captchaService.setSubmitCallback(() => this.onSubmit());
  }

  onSubmit() {
    if (this.forgetPasswordForm.invalid) {
      this.snackBar.open("Invalid Login Request!", 'close', { duration: 3000 });
      return;
    }

    this.isSubmitted = true;
    if (this.forgetPasswordForm.valid) {
      firstValueFrom(this.authenticationService.resetPassword(this.forgetPasswordForm.value)).then((response: any) => {
        if (response.status) {
          this.isSuccess = true;
          this.snackBar.openFromTemplate(this.notificationTemplate, { duration: 3000 });
          this.forgetPasswordForm.reset();
        } else {
          this.errorMessage = response.data;
        }
        this.isSubmitted = false;
      }).catch(error => {
        this.isSubmitted = false;
        this.errorMessage = error.error.message;
        this.snackBar.open(error.error.message, 'close', { duration: 3000 });
      });
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

}
