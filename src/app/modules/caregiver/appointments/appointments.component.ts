import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '@app/shared/calendar/calendar.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddressPipe } from '@app/core/pipes/address.pipe';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { BookAppointment } from '@app/modules/client/appointments/appointment';
import { CalendarEventAction, CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { EnvironmentService } from '@app/core/services/environment.service';
import { ReloadComponent } from '@app/core/services/reload-component';
import { BookAppointmentService } from '@app/modules/client/book-appointment/book-appointment-service';
import { ViewChangeInfo } from '@app/shared/calendar/view-change-info';
import { AppointmentService } from '@app/modules/client/appointments/appointment.service';
import { AppointmentsTableViewComponent } from '@app/modules/client/appointments/appointments-table-view/appointments-table-view.component';

@Component({
  selector: 'app-caregiver-appointments',
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    CalendarComponent,
    AppointmentsTableViewComponent
  ],
  providers: [
    TitleCasePipe,
    MatSnackBar,
    DatePipe,
    ReplaceStringPipe,
    AddressPipe
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent {

  userAppointments: BookAppointment[] = [];

  userEvents: CalendarEvent[] = [];
  view: CalendarView = CalendarView.Month; // Default view is Month

  @Input() viewType: 'CALENDAR_VIEW' | 'TABLE_VIEW' | 'BOTH_VIEW' = 'BOTH_VIEW';

  isLoading: boolean = true;
  showError: boolean = false;
  showSuccess: boolean = false;

  calendarEventActions: CalendarEventAction[] = [
    {
      label: '<i class="fa-solid fa-check-circle"></i>',
      a11yLabel: 'Accept',
      cssClass: 'btn btn-outline-success me-2',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.onAcceptAppointment(event);
      },
    },
    {
      label: '<i class="fa-solid fa-ban"></i>',
      a11yLabel: 'Reject',
      cssClass: 'btn btn-outline-danger me-1',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.onRejectAppointment(event);
      },
    },
  ];

  constructor(
    public credentialsService: CredentialsService,
    protected bookAppointmentService: BookAppointmentService,
    protected snackBar: MatSnackBar,
    protected route: ActivatedRoute,
    public reloadComponent: ReloadComponent,
    protected router: Router,
    protected appointmentService: AppointmentService
  ) {
    this.appointmentService.calendarEventActions = this.calendarEventActions;
  }

  ngOnInit() {
    //Default to current month view
    this.viewChangeHandler({ view: CalendarView.Month, viewDate: new Date() });
  }

  viewChangeHandler(viewChangeInfo: ViewChangeInfo) {
    const fromDate = this.appointmentService.viewChangeStartDate[viewChangeInfo.view](viewChangeInfo.viewDate);
    const toDate = this.appointmentService.viewChangeEndDate[viewChangeInfo.view](viewChangeInfo.viewDate);
    this.findAllUserAppointments(fromDate, toDate);
  }

  findAllUserAppointments(from: Date, to: Date) {
    this.isLoading = true;
    this.appointmentService.findAllUserAppointments(from, to, false)
      .subscribe({
        next: (userEvents: CalendarEvent[]) => {
          this.isLoading = false;
          this.userEvents = userEvents;
        },
        error: (err) => {
          this.isLoading = false;
          this.showError = true;
          console.error("Error fetching user appointments:", err);
          this.snackBar.open("Failed to fetch appointments", "Close", {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onHandleEvent($event: { action: string, calendarEvent: CalendarEvent<any> }) {
    this.appointmentService.showAppointmentDetails($event);
  }

  onAcceptAppointment(calendarEvent: CalendarEvent) {

  }

  onRejectAppointment(calendarEvent: CalendarEvent) {

  }

}
