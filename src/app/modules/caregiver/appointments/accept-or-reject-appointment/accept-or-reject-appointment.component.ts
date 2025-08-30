import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AcceptOrRejectData } from './accept-or-reject-data';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { now } from '@app/core/services/date-fns';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppointmentStatus } from '@app/modules/client/appointments/appointment.status.enum';

@Component({
  selector: 'app-accept-or-reject-appointment',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './accept-or-reject-appointment.component.html',
  styleUrl: './accept-or-reject-appointment.component.scss'
})
export class AcceptOrRejectAppointmentComponent {

  form: FormGroup;
  label = "Acceptance/Rejection Note for Client";
  placeholder = "Acceptance/Rejection Note for Client";

  constructor(
    public dialogRef: MatDialogRef<AcceptOrRejectData>,
    @Inject(MAT_DIALOG_DATA) public data: AcceptOrRejectData
  ) {
    this.form = new FormGroup({
      appointmentId: new FormControl(data.appointmentId, [Validators.required]),
      status: new FormControl(data.status, [Validators.required]),
      acceptanceRejectionDate: new FormControl(now(), [Validators.required]),
      acceptanceRejectionNote: new FormControl('', [Validators.required])
    });
    if (data.status == AppointmentStatus.ACCEPTED) {
      this.label = "Acceptance Note for Client";
      this.placeholder = "Ex. See you soon, Please get xyz ready for my arrival";
    }
    if (data.status == AppointmentStatus.REJECTED) {
      this.label = "Reason for Rejection - Visible to Client";
      this.placeholder = "Reason for Rejection - Visible to Client";
    }
  }

  acceptAppointment(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  rejectAppointment(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(true);
  }
}
