import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { CalendarComponent } from '@app/shared/calendar/calendar.component';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ApiResponse } from '@app/core/models/api-repsonse';
import { addHours, endOfDay, getDateDiffInHours, getFirstDayOfMonth, getFirstDayOfWeek, getLastDayOfMonth, getLastDayOfWeek, now, startOfDay, toMysqlDateTime, toSimpleTime } from '@app/core/services/date-fns';
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import { ViewChangeInfo } from '@app/shared/calendar/view-change-info';
import { BookAppointment } from './appointment';
import { AppointmentsTableViewComponent } from './appointments-table-view/appointments-table-view.component';
import { EventColor } from 'calendar-utils';
import { AddressPipe } from '@app/core/pipes/address.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';
import { EnvironmentService } from '@app/core/services/environment.service';
import { ConfirmDialogData } from '@app/shared/confirm-dialog/confirm-dialog-data';
import { BookAppointmentService } from '../book-appointment/book-appointment-service';
import { ReloadComponent } from '@app/core/services/reload-component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';

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
    TitleCasePipe,
    MatSnackBar,
    DatePipe,
    ReplaceStringPipe,
    AddressPipe
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent implements OnInit {

  userAppointments: BookAppointment[] = [];

  userEvents: CalendarEvent[] = [];
  view: CalendarView = CalendarView.Month; // Default view is Month

  @Input() viewType: 'CALENDAR_VIEW' | 'TABLE_VIEW' | 'BOTH_VIEW' = 'BOTH_VIEW';

  isLoading: boolean = true;
  showError: boolean = false;
  showSuccess: boolean = false;

  viewChangeStartDate: Record<CalendarView, (date: Date) => Date> = {
    [CalendarView.Month]: (date: Date) => startOfDay(getFirstDayOfMonth(date)),
    [CalendarView.Week]: (date: Date) => startOfDay(getFirstDayOfWeek(date)),
    [CalendarView.Day]: (date: Date) => startOfDay(date),
  };

  viewChangeEndDate: Record<CalendarView, (date: Date) => Date> = {
    [CalendarView.Month]: (date: Date) => endOfDay(getLastDayOfMonth(date)),
    [CalendarView.Week]: (date: Date) => endOfDay(getLastDayOfWeek(date)),
    [CalendarView.Day]: (date: Date) => endOfDay(date),
  };

  calendarEventActions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      cssClass: 'btn btn-outline-primary me-2',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editBookingAppointment(event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      cssClass: 'btn btn-outline-danger me-1',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deleteBookingAppointment(event);
      },
    },
  ];

  constructor(
    private environmentService: EnvironmentService,
    private httpClient: HttpClient,
    public credentialsService: CredentialsService,
    protected bookAppointmentService: BookAppointmentService,
    protected snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private titleCasePipe: TitleCasePipe,
    private replaceStringPipe: ReplaceStringPipe,
    private addressPipe: AddressPipe,
    protected route: ActivatedRoute,
    private dialog: MatDialog,
    public reloadComponent: ReloadComponent,
    protected router: Router
  ) { }

  ngOnInit() {
    //Default to current month view
    this.viewChangeHandler({ view: CalendarView.Month, viewDate: new Date() });
  }

  viewChangeHandler(viewChangeInfo: ViewChangeInfo) {
    const fromDate = this.viewChangeStartDate[viewChangeInfo.view](viewChangeInfo.viewDate);
    const toDate = this.viewChangeEndDate[viewChangeInfo.view](viewChangeInfo.viewDate);
    this.findAllUserAppointments(fromDate, toDate);
  }

  bookAppointment() {
    this.router.navigate(["/" + this.credentialsService.userBaseRoute + '/find-caregiver']);
  }

  findAllUserAppointments(from: Date, to: Date) {
    this.isLoading = true;
    const startDateTime = toMysqlDateTime(from);
    const endDateTime = toMysqlDateTime(to);
    this.httpClient.get<ApiResponse>(`/caregiver/book/appointment?from=${startDateTime}&to=${endDateTime}`).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.userAppointments = response.data || [];
          this.userEvents = this.userAppointments.map(appointment => this.createEventFromAppointment(appointment));
          this.isLoading = false;
        }
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

  createEventFromAppointment(appointment: BookAppointment) {
    const startDate = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const endDate = addHours(startDate, appointment.quantity);
    const serviceAddressInfo = this.addressPipe.transform(appointment.serviceAddress, 'full');
    const careType = this.titleCasePipe.transform(this.replaceStringPipe.transform(appointment.productName, "_", " "));
    const caregiverName = appointment.caregiver?.firstName + " " + appointment.caregiver?.lastName;
    let title = careType || 'Appointment';
    title += " | Caregiver: " + (caregiverName || 'Unknown Caregiver');
    title += " | Time: " + this.datePipe.transform(startDate, 'h:mm a') + " - " + this.datePipe.transform(endDate, 'h:mm a') || 'No Time';
    title += " | Location: " + serviceAddressInfo;
    return {
      title: title,
      start: startDate,
      allDay: false,
      end: endDate,
      color: {
        primary: '#0F62FE',
        secondary: '#F47CB4',
        secondaryText: '#000000'
      } as EventColor,
      actions: this.calendarEventActions,
      meta: {
        appointment,
        summaryInfo: {
          title: "Appointment Details",
          careType,
          appointmentId: appointment.id,
          clientId: this.credentialsService.user?.id || 0,
          caregiverId: appointment.caregiver?.id || 0,
          caregiverName,
          clientName: this.credentialsService.user.firstName + " " + this.credentialsService.user.lastName,
          serviceAddressInfo,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          serviceStartTime: this.datePipe.transform(startDate, 'h:mm a'),
          serviceEndTime: this.datePipe.transform(endDate, 'h:mm a'),
          totalHours: appointment.quantity
        },
        onDraggingEvent: (calendarEvent: CalendarEvent, newStartDate: Date, newEndDate: Date) =>
          this.updateAppointmentOnDraggableEvent(calendarEvent, newStartDate, newEndDate)
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    } as CalendarEvent;
  }


  editBookingAppointment(calendarEvent: CalendarEvent) {
    const { meta } = calendarEvent;
    const { appointment, summaryInfo } = meta;
    const { caregiverName, serviceAddressInfo } = summaryInfo;
    const appointmentDateTime = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const appointmentServiceWindowInHours = this.environmentService.getValue('appointmentServiceWindowInHours', 24);

    if (!appointment || !appointment.id) {
      this.snackBar.open("Invalid appointment data", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    if (!caregiverName || !serviceAddressInfo) {
      this.snackBar.open("Missing caregiver or service address information", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (getDateDiffInHours(appointmentDateTime, now()) < appointmentServiceWindowInHours) {
      this.snackBar.open(`Cannot Edit past and/or service in-progress appointments. Edit window is ${appointmentServiceWindowInHours}-hours before start time!`, "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Show confirmation dialog before editing
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '200px',
      data: {
        icon: 'edit',
        title: 'Edit Care Appointment',
        message: `Are you sure you want to edit the appointment with ${caregiverName} at ${serviceAddressInfo}?`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Change Appointment',
        cancelButtonText: 'No, Cancel Editing'
      } as ConfirmDialogData
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookAppointmentService.changeBookAppointmentHandler(appointment, () => this.reloadComponent.reloadComponent(true));
      } else {
        console.log('Delete action cancelled');
      }
    });
  }

  deleteBookingAppointment(calendarEvent: CalendarEvent) {
    const { meta } = calendarEvent;
    const { appointment, summaryInfo } = meta;
    const { caregiverName, serviceAddressInfo } = summaryInfo;
    const appointmentDateTime = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const appointmentCancellationDeadlineInHours = this.environmentService.getValue('appointmentCancellationDeadlineInHours', 24);
    if (!appointment || !appointment.id) {
      this.snackBar.open("Invalid appointment data", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    if (!caregiverName || !serviceAddressInfo) {
      this.snackBar.open("Missing caregiver or service address information", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    if (getDateDiffInHours(appointmentDateTime, now()) < appointmentCancellationDeadlineInHours) {
      this.snackBar.open(`Cannot delete past and/or service in-progress appointments. Delete window is ${appointmentCancellationDeadlineInHours}-hours before start time!`, "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Show confirmation dialog before deleting
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '200px',
      data: {
        icon: 'delete',
        title: 'Delete Care Appointment',
        message: `Are you sure you want to delete the appointment with ${caregiverName} at ${serviceAddressInfo}?`,
        showCancelButton: true,
        showConfirmButton: true
      } as ConfirmDialogData
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookAppointmentService.deleteBookAppointmentHandler(
          appointment.id,
          () => this.userEvents = this.userEvents.filter(event => event !== calendarEvent)
        );
      } else {
        console.log('Delete action cancelled');
      }
    });
  }

  async updateAppointmentOnDraggableEvent(calendarEvent: CalendarEvent, newStartDate: Date, newEndDate: Date) {
    const appointment = calendarEvent.meta.appointment;
    const appointmentDateTime = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const newQuantity = getDateDiffInHours(newEndDate, newStartDate);
    if (newQuantity != appointment.quantity) {
      //NOT_ALLOWED: Can not drag and change appointment's total hours of service.
      this.snackBar.open('Number of Hours of Service Paid For - Can Not Be Modified!', 'close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return { status: false };
    }
    if (newStartDate.getTime() < now().getTime()) {
      this.snackBar.open('You can not schedule appointment to a past date & time.', 'close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return { status: false };
    }
    if (appointmentDateTime.getTime() < now().getTime()) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Past service appointment - can not be changed. If your caregiver did not show up. Please request for cancellation.",
        } as SnackBarParams
      });
      return { status: false };
    }

    const fieldValue = {
      appointmentDate: newStartDate,
      appointmentTime: toSimpleTime(newStartDate)
    }

    let status = await this.bookAppointmentService.updateBookAppointment(
      calendarEvent.meta.appointment.id,
      fieldValue
    );
    return { status }
  }


}
