import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';

@Component({
  selector: 'app-registration-complete',
  imports: [
    CommonModule
  ],
  templateUrl: './registration-complete.component.html',
  styleUrl: './registration-complete.component.scss'
})
export class RegistrationCompleteComponent implements AfterViewInit {

  countDownTotalInSeconds = 10;

  constructor(public credentialsService: CredentialsService, protected router: Router) { }

  ngAfterViewInit() {
    setInterval(() => {
      this.countDownTotalInSeconds -= 1;
      if (this.countDownTotalInSeconds == 0) {
        this.router.navigate([this.credentialsService.dashboard]);
      }
    }, 1000);
  }

}
