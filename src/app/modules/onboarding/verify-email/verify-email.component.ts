import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { LogService } from '@app/core/logger/LogService';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {

  token: string | null = null;
  emailVerificationStatus: 'NONE' | 'IN_PROGRESS' | 'ERROR' | 'VERIFIED' = 'NONE';

  constructor(
    protected snackBar: MatSnackBar,
    protected logger: LogService,
    protected authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.verifyEmail();
    }
    else {
      this.snackBar.open("Invalid email verification link", "OK", { duration: 3000 });
      this.logger.error("Email verification token is missing from URL");
    }
  }

  verifyEmail() {
    this.emailVerificationStatus = 'IN_PROGRESS';
    console.log(this.emailVerificationStatus);
    firstValueFrom(this.authenticationService.verifyEmail(this.token+"")).then((response: any) => {
      if (response.status) {
        this.emailVerificationStatus = 'VERIFIED';
        this.snackBar.open("Email verified successfully", "OK", { duration: 3000 });
        console.log(this.emailVerificationStatus);
      } else {
        this.emailVerificationStatus = 'ERROR';
        this.snackBar.open("Email verification failed", "OK", { duration: 3000 });
        console.log(this.emailVerificationStatus);
      }
    }).catch(error => {
      this.emailVerificationStatus = 'ERROR';
      this.snackBar.open("Email verification link is invalid and/or expired", "OK", { duration: 3000 });
      console.log(this.emailVerificationStatus);
    });
  }

}
