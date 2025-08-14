import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '@app/shared/calendar/calendar.component';

@Component({
  selector: 'app-caregiver-appointments',
  imports: [
    CommonModule,
    FormsModule,
    CalendarComponent,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent {

}
