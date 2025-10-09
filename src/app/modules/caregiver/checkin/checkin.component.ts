import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AddressPipe } from '@app/core/pipes/address.pipe';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';

@Component({
  selector: 'app-checkin',
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
  ],
  providers: [
    TitleCasePipe,
    MatSnackBar,
    DatePipe,
    ReplaceStringPipe,
    AddressPipe
  ],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.scss'
})
export class CheckinComponent implements OnInit {

  @Input() appointmentId: string | null = null;
  @Input() action: string | null = null; // 'checkin' => [in] or 'checkout' => [out]

  constructor(
    protected credentialsService: CredentialsService,
    private httpClient: HttpClient,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute,
    protected router: Router
  ) { }

  ngOnInit(): void {
    this.action = this.route.snapshot.paramMap.get('action') ?? this.action;
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId') ?? this.appointmentId;
  }

  get canCheckinOrCheckout() {
    return this.appointmentId && this.action;
  }

}
