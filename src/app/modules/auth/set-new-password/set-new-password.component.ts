import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { LogService } from '@app/core/logger/LogService';
import { CaptchaService } from '@app/core/services/captcha.service';
import { EnvironmentService } from '@app/core/services/environment.service';
import { Validation } from '@app/core/services/Validation';
import { PasswordMeterComponent } from '@app/components/password-meter/password-meter.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-set-new-password',
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
  templateUrl: './set-new-password.component.html',
  styleUrl: './set-new-password.component.scss'
})
export class SetNewPasswordComponent implements OnInit {

  changePasswordForm = new FormGroup({
    password: new FormControl('', Validation.validatePassword(8, /[!@#$%^&*(),.?":{}|<>]/)),
    confirmPassword: new FormControl('', Validation.validatePassword(8, /[!@#$%^&*(),.?":{}|<>]/)),
  }, Validation.matchingPasswords('password', 'confirmPassword'));

  isSubmitted: boolean = false;
  errorMessage: string | null = null;
  isSuccess: boolean = false;

  @ViewChild('notificationTemplate') notificationTemplate!: TemplateRef<any>;
  notificationMessage: string = "Password reset was successful! Please go to login";

  passwordStrength: number = 0;

  token: string | null = null;

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

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (!this.token) {
      this.errorMessage = "Invalid password reset verification link";
      this.snackBar.open(this.errorMessage, "OK", { duration: 3000 });
      this.logger.error("Password Reset Token is missing from URL");
    }
  }

  setPasswordStrength(ps: number) {
    this.passwordStrength = ps;
  }

  get passwordValue(): string {
    return this.changePasswordForm.get('password')?.value as string;
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    if (this.passwordStrength <= 3) {
      this.errorMessage = "Password is too Weak!";
      this.snackBar.open(this.errorMessage, 'close', { duration: 4000 });
      return;
    }

    this.isSubmitted = true;
    firstValueFrom(
      this.authenticationService.changePassword({token: this.token+"", newPassword: this.passwordValue})
    ).then((response: any) => {
      if (response.status) {
        this.isSubmitted = false;
        this.isSuccess = true;
        this.snackBar.openFromTemplate(this.notificationTemplate, { duration: 4000 }).afterDismissed().subscribe((_) => {
          this.router.navigate(['/auth/login']);
        });
      }
    }).catch(error => {
      this.isSubmitted = false;
      this.errorMessage = error.error.message;
      this.snackBar.open(error.error.message, 'close', { duration: 3000 });
    });
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

}
