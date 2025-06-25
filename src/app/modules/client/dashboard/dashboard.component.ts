import { BookAppointmentComponent } from './../book-appointment/book-appointment.component';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchCaregiverComponent } from '@app/modules/onboarding/search-caregiver/search-caregiver.component';
import { UserSummary } from '@app/shared/user-summary/UserSummary';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SearchCaregiverComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    protected credentialsService: CredentialsService,
    protected snackBar: MatSnackBar,
    protected modalDialogService: MatDialog,
    protected router: Router
  ) {

  }

  ngOnInit(): void {

  }

  bookAppointmentHandler(user: UserSummary) {
    if (!this.credentialsService.isLoggedIn()) {
      this.snackBar.open("Please login to book an appointment", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    if (this.credentialsService.userType !== AppUserType.client && this.credentialsService.userType !== AppUserType.both) {
      this.snackBar.open("Only clients can book appointments with caregivers", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    if (!user || !user.userId) {
      this.snackBar.open("Invalid caregiver selected", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.modalDialogService.open(BookAppointmentComponent, {
      data: { user },
      width: '650px',
      disableClose: false,
      autoFocus: false,
  }).afterClosed().subscribe((result) => {
      if (result && result.success) {
        const { success, ...data } = result;
        this.httpClient.post('/caregiver/book/appointment', {...data}).subscribe({
          next: (response: any) => {
            if (response.status) {
              this.router.navigate(['/client/checkout/booking-appointment/' + response.data.id]);
            }
          },
          error: (error) => {
            this.snackBar.open("Failed to book appointment. Please try again.", "Close", {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });


    
  }

}
