import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackBarParams } from './SnackBarParams';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';

@Component({
  selector: 'app-toasts',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatCardHeader
  ],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.scss'
})
export class ToastsComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<ToastsComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarParams
  ) { }

  get className() {
    return "text-" + this.data.type.toLocaleLowerCase()
  }

  close() {
    this.snackBarRef.dismiss();
  }
}
