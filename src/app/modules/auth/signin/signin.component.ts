import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validation } from '@app/core/services/Validation';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { LogService } from '@app/core/logger/LogService';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { firstValueFrom } from 'rxjs';
import { User } from '@app/core/models/user';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { CaptchaService } from '@app/core/services/captcha.service';

@Component({
  selector: 'app-signin',
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
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
  ],
  providers: [
    MatSnackBar
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  loginForm: FormGroup;
  public isSubmitted = false;
  public loginError = false;

  constructor(
    protected logger: LogService,
    protected snackBar: MatSnackBar,
    protected router: Router,
    protected authenticationService: AuthenticationService,
    public captchaService: CaptchaService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validation.validateEmailField]),
      password: new FormControl('', [Validation.validatePassword(8)])
    });
    this.captchaService.setSubmitCallback(() => this.onSubmit());
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackBar.open("Invalid Login Request!", 'close', { duration: 3000 });
      return;
    }

    this.isSubmitted = true;
    if (this.loginForm.valid) {
      firstValueFrom(this.authenticationService.login(this.loginForm.value, true)).then((response: any) => {
        if (response.status) {
          const user = response.data.user as User;
          switch (user.userType) {
            case AppUserType.client:
              this.router.navigate(['/client']);
              break;
            case AppUserType.careGiver:
              this.router.navigate(['/caregiver']);
              break;
            default:
              this.router.navigate(['/auth/switch']);
          }
        } else {
          this.isSubmitted = false;
        }
      }).catch(error => {
        this.isSubmitted = false;
        this.loginError = error.error.message;
        this.snackBar.open(error.error.message, 'close', { duration: 3000 });
        // if (error.error.statusCode == HttpStatusCode.Unauthorized) {
        //   console.log(error);
        // }
        // if (error.error.statusCode == HttpStatusCode.Forbidden) {
        //   console.log(error);
        // }
      });
    }
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

}
