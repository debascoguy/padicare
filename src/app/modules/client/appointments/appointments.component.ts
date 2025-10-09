import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '@app/shared/calendar/calendar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { ViewChangeInfo } from '@app/shared/calendar/view-change-info';
import { AppointmentsTableViewComponent } from './appointments-table-view/appointments-table-view.component';
import { BookAppointmentService } from '../book-appointment/book-appointment-service';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { AppointmentService } from './appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-appointments',
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    CalendarComponent,
    AppointmentsTableViewComponent
  ],
  providers: [
    MatSnackBar,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent implements OnInit {

  @Input() viewType: 'CALENDAR_VIEW' | 'TABLE_VIEW' | 'BOTH_VIEW' = 'BOTH_VIEW';

  userEvents: CalendarEvent[] = [];

  view: CalendarView = CalendarView.Month; // Default view is Month

  isLoading: boolean = true;
  showError: boolean = false;

  calendarEventActions: CalendarEventAction[] = [
    {
      id: 'ACCEPT',
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      cssClass: 'btn btn-outline-warning me-2',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editAppointment(event);
      },
    },
    {
      id: 'DELETE',
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      cssClass: 'btn btn-outline-danger me-1',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deleteAppointment(event);
      },
    },
  ];

  constructor(
    public credentialsService: CredentialsService,
    protected bookAppointmentService: BookAppointmentService,
    protected snackBar: MatSnackBar,
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

  bookAppointment() {
    this.router.navigate(["/" + this.credentialsService.userBaseRoute + '/find-caregiver']);
  }

  findAllUserAppointments(from: Date, to: Date) {
    this.isLoading = true;
    this.appointmentService.findAllUserAppointments(from, to)
      .subscribe({
        next: (userEvents: CalendarEvent[]) => {
          this.isLoading = false;
          this.userEvents = userEvents;
        },
        error: (err) => {
          this.isLoading = false;
          this.showError = true;
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Error",
              message: "Failed to fetch appointments"
            } as SnackBarParams
          });
          console.error("Error fetching user appointments:", err);
        }
      });
  }

  onHandleEvent($event: { action: string, calendarEvent: CalendarEvent<any> }) {
    this.appointmentService.showAppointmentDetails($event);
  }

  async onDraggableEvent(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent) {
    const { status } = await this.appointmentService.updateAppointmentStartAndEndDates(calendarEventTimesChangedEvent);
    if (status) {
      //Now, complete the move of the event as desired
      this.userEvents = this.userEvents.map((iEvent) => {
        if (iEvent === calendarEventTimesChangedEvent.event) {
          return {
            ...calendarEventTimesChangedEvent.event,
            start: calendarEventTimesChangedEvent.newStart,
            end: calendarEventTimesChangedEvent.newEnd,
          };
        }
        return iEvent;
      });
    }
  }

  editAppointment(calendarEvent: CalendarEvent) {
    this.appointmentService.editAppointment(calendarEvent);
  }

  deleteAppointment(calendarEvent: CalendarEvent) {
    this.appointmentService.deleteAppointment(calendarEvent, this.userEvents);
  }

}
