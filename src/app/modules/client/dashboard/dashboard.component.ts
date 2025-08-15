import { CredentialsService } from '@app/core/authentication/credentials.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchCaregiverComponent } from '@app/modules/onboarding/search-caregiver/search-caregiver.component';
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

  constructor(protected credentialsService: CredentialsService ) {
  }

  ngOnInit(): void {

  }

}
