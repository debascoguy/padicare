import { CredentialsService } from '@app/core/authentication/credentials.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { UserSummaryComponent } from '@app/shared/user-summary/user-summary.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    UserSummaryComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  searchForm!: FormGroup;
  errorMessage: string | null = null;

  searchedResults: [] = [];

  constructor(
    protected credentialsService: CredentialsService,
    private httpClient: HttpClient,
    protected snackBar: MatSnackBar
  ) {
    this.searchForm = new FormGroup({
      zipcode: new FormControl(this.credentialsService.userAddress.zipcode || '', [Validators.required]),
      radius: new FormControl(this.credentialsService.userAddress.radius || 20, [
        Validators.required,
        Validators.min(5),
        Validators.max(60)
      ])
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe((_) => {
      this.search();
    })
  }

  get zipcode() {
    return this.searchForm.get('zipcode');
  }

  get radius() {
    return this.searchForm.get('radius');
  }

  search() {
    if (this.searchForm.invalid) {
      return ;
    }
    console.log(this.searchForm.value);
    firstValueFrom(this.httpClient.post('/caregiver/search', this.searchForm.value)).then((response: any) => {
      if (response.status) {

      }
    }).catch(error => {
      this.errorMessage = error.error.message;
      this.snackBar.open(error.error.message, 'close', { duration: 3000 });
    });
  }

  isLikedHandler(isLiked: boolean) {

  }

  isReadMoreHandler(isReadMore: boolean) {

  }

}
