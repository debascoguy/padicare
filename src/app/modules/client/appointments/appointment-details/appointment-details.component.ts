import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { ConfirmDialogData } from '@app/shared/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
import { CalendarEvent } from 'calendar-utils';

@Component({
  selector: 'app-appointment-details',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIcon,
    ReplaceStringPipe
  ],
  providers: [
    MatSnackBar,
  ],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss'
})
export class AppointmentDetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {event: CalendarEvent, action: string}
  ) { }

   onConfirm(): void {
    this.dialogRef.close(true);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

}
