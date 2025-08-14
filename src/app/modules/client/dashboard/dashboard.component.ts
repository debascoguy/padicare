import { CredentialsService } from '@app/core/authentication/credentials.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchCaregiverComponent } from '@app/modules/onboarding/search-caregiver/search-caregiver.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppointmentsComponent } from '../appointments/appointments.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SearchCaregiverComponent,
    AppointmentsComponent
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

}
