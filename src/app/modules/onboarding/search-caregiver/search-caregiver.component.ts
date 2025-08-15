import { Component, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { UserSummaryComponent } from '../../../shared/user-summary/user-summary.component';
import { UserSummary } from '@app/shared/user-summary/UserSummary';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BookAppointmentService } from '@app/modules/client/book-appointment/book-appointment-service';

@Component({
  selector: 'app-search-caregiver',
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatProgressSpinner,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    UserSummaryComponent,
    MatPaginatorModule
  ],
  providers: [
    MatSnackBar
  ],
  templateUrl: './search-caregiver.component.html',
  styleUrl: './search-caregiver.component.scss'
})
export class SearchCaregiverComponent {

  @Output() bookAppointmentAction = new EventEmitter<UserSummary>();

  @ViewChild('topPaginator') topPaginator!: MatPaginator;
  @ViewChild('bottomPaginator') bottomPaginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = this.pageSizeOptions[1];
  pageIndex: number = 0;
  startIndex: number = 0;
  endIndex: number = this.pageSize;

  pageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    if (this.endIndex > this.searchedResults.length) {
      this.endIndex = this.searchedResults.length;
    }
    if (!this.topPaginator.hasNextPage()) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  searchForm!: FormGroup;
  errorMessage: string | null = null;
  // badgeColors: "#7A5AF8" | "#E54545"; // Default badge color
  searchedResults: UserSummary[] = [];
  isSearching: boolean = false;

  constructor(
    protected credentialsService: CredentialsService,
    private httpClient: HttpClient,
    protected snackBar: MatSnackBar,
    protected modalDialogService: MatDialog,
    protected router: Router,
    protected bookAppointmentService: BookAppointmentService
  ) {
    this.searchForm = new FormGroup({
      zipcode: new FormControl(this.credentialsService.userAddress.zipcode || '', [Validators.required, Validators.minLength(5)]),
      radius: new FormControl(this.credentialsService.userAddress.radius || 10, [
        Validators.required,
        Validators.min(2),
        Validators.max(30)
      ])
    });
  }

  ngOnInit(): void {
    this.search();
    this.searchForm.valueChanges.subscribe((_) => {
      this.search();
    })
  }

  get searchedResultsCount(): number {
    return this.searchedResults.length;
  }

  get zipcode() {
    return this.searchForm.get('zipcode');
  }

  get radius() {
    return this.searchForm.get('radius');
  }

  search() {
    if (this.searchForm.invalid) {
      return;
    }

    this.isSearching = true;
    const formValues = { ...this.searchForm.value, radius: parseInt(this.radius?.value + "") }
    const address = this.credentialsService.userAddress;
    const searchRequest = this.zipcode?.value == address.zipcode ?
      {
        ...formValues,
        latitude: parseFloat(address.latitude + ""),
        longitude: parseFloat(address.longitude + "")
      } : formValues;
    firstValueFrom(this.httpClient.post('/caregiver/search', searchRequest)).then((response: any) => {
      this.searchedResults = response.status ? response.data : [];
      this.isSearching = false;
      if (this.credentialsService.isClientSide) {
        this.findCaregiversCareTypes(this.searchedResults.map((user: UserSummary) => user.userId));
      }
    }).catch(error => {
      this.isSearching = false;
      this.errorMessage = error.error.message;
      this.snackBar.open(error.error.message, 'close', { duration: 4000 });
    });
  }

  findCaregiversCareTypes(caregiversId: string[]) {
    if (!caregiversId || caregiversId.length === 0) {
      return;
    }

    firstValueFrom(this.httpClient.post('/caregiver/care-types/find-all/by/ids', { caregiversId })).then((response: any) => {
      if (response.status) {
        Object.entries(response.data).forEach(([userId, caregiverCareTypes]) => {
          this.searchedResults.forEach((user: UserSummary, index: number) => {
            if (user.userId === userId) {
              this.searchedResults[index].caregiverCareTypes = caregiverCareTypes as [];
            }
          });
        });
      }
    }).catch(error => {
      console.log(error);
      this.errorMessage = error.error.message;
      this.snackBar.open(error.error.message, 'close', { duration: 4000 });
    });
  }

  isLikedHandler(isLiked: boolean, user: UserSummary) {
    console.log("Is Liked: ", isLiked, user);
  }

  isReadMoreHandler(isReadMore: boolean, user: UserSummary) {
    console.log("Is Read More: ", isReadMore, user);
  }

  bookAppointmentHandler(isBookAppointment: boolean, user: UserSummary) {
    this.bookAppointmentService.bookAppointmentHandler(isBookAppointment, user);
  }

}
