import { DatePipe, TitleCasePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CredentialsService } from "@app/core/authentication/credentials.service";
import { ApiResponse } from "@app/core/models/api-repsonse";
import { AddressPipe } from "@app/core/pipes/address.pipe";
import { ReplaceStringPipe } from "@app/core/pipes/replace.string.pipe";
import { toMysqlDateTime, addHours, endOfDay, getFirstDayOfMonth, getFirstDayOfWeek, getLastDayOfMonth, getLastDayOfWeek, startOfDay, getDateDiffInHours, now, toSimpleTime } from "@app/core/services/date-fns";
import { ReloadComponent } from "@app/core/services/reload-component";
import { EventColor, CalendarEvent } from "calendar-utils";
import { BookAppointmentService } from "../book-appointment/book-appointment-service";
import { BookAppointment } from "./appointment";
import { CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from "angular-calendar";
import { catchError, firstValueFrom, map, of } from "rxjs";
import { ToastsComponent } from "@app/shared/toasts/toasts.component";
import { ToastsConfig } from "@app/shared/toasts/ToastsConfig";
import { AppointmentDetailsComponent } from "./appointment-details/appointment-details.component";
import { ConfirmDialogData } from "@app/shared/confirm-dialog/confirm-dialog-data";
import { ConfirmDialogComponent } from "@app/shared/confirm-dialog/confirm-dialog.component";
import { EnvironmentService } from "@app/core/services/environment.service";
import { AppointmentStatus } from "./appointment.status.enum";
import { AcceptOrRejectData } from "@app/modules/caregiver/appointments/accept-or-reject-appointment/accept-or-reject-data";
import { AcceptOrRejectAppointmentComponent } from "@app/modules/caregiver/appointments/accept-or-reject-appointment/accept-or-reject-appointment.component";

@Injectable({ providedIn: 'root' })
export class AppointmentService {

  public isLoading: boolean = false;

  public calendarEventActions: CalendarEventAction[] = [];

  public viewChangeStartDate: Record<CalendarView, (date: Date) => Date> = {
    [CalendarView.Month]: (date: Date) => startOfDay(getFirstDayOfMonth(date)),
    [CalendarView.Week]: (date: Date) => startOfDay(getFirstDayOfWeek(date)),
    [CalendarView.Day]: (date: Date) => startOfDay(date),
  };

  public viewChangeEndDate: Record<CalendarView, (date: Date) => Date> = {
    [CalendarView.Month]: (date: Date) => endOfDay(getLastDayOfMonth(date)),
    [CalendarView.Week]: (date: Date) => endOfDay(getLastDayOfWeek(date)),
    [CalendarView.Day]: (date: Date) => endOfDay(date),
  };

  public editableStatus = [
    AppointmentStatus.NEW,
    AppointmentStatus.SCHEDULED,
    AppointmentStatus.REJECTED,
    AppointmentStatus.CLIENT_NO_SHOW,
    AppointmentStatus.CAREGIVER_NO_SHOW
  ];

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService,
    public reloadComponent: ReloadComponent,
    public credentialsService: CredentialsService,
    protected bookAppointmentService: BookAppointmentService,
    protected snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private titleCasePipe: TitleCasePipe,
    private replaceStringPipe: ReplaceStringPipe,
    private addressPipe: AddressPipe,
    private dialog: MatDialog
  ) { }


  findAllUserAppointments(from: Date, to: Date, isEventDraggable: boolean = true) {
    this.isLoading = true;
    const startDateTime = toMysqlDateTime(from);
    const endDateTime = toMysqlDateTime(to);
    return this.httpClient.get<ApiResponse>(`/caregiver/book/appointment?from=${startDateTime}&to=${endDateTime}`).pipe(
      map((response: ApiResponse) => {
        if (response.status) {
          const userAppointments = (response.data || []) as BookAppointment[];
          return userAppointments.map(appointment => this.createCalendarEventFromAppointment(appointment, isEventDraggable))
        } else {
          this.snackBar.openFromComponent(
            ToastsComponent,
            ToastsConfig.getErrorConfig(response, "Error", "Failed to fetch user appointments")
          );
          return [] as BookAppointment[];
        }
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  isActionable(status: AppointmentStatus) {
    return status == AppointmentStatus.NEW ||
    status == AppointmentStatus.SCHEDULED ||
    status == AppointmentStatus.CAREGIVER_NO_SHOW ||
    status == AppointmentStatus.CLIENT_NO_SHOW;
  }

  createCalendarEventFromAppointment(appointment: BookAppointment, isEventDraggable: boolean) {
    const startDate = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const endDate = addHours(startDate, appointment.quantity);
    const serviceAddressInfo = this.addressPipe.transform(appointment.serviceAddress, 'full');
    const careType = this.titleCasePipe.transform(this.replaceStringPipe.transform(appointment.productName, "_", " "));
    const caregiverName = appointment.caregiver?.firstName + " " + appointment.caregiver?.lastName;
    const status = appointment.status.replaceAll("_", " ") || 'New';
    let title = careType || 'Appointment';
    title += " | Status: " + status;
    title += " | Caregiver: " + (caregiverName || 'Unknown Caregiver');
    title += " | Time: " + this.datePipe.transform(startDate, 'h:mm a') + " - " + this.datePipe.transform(endDate, 'h:mm a') || 'No Time';
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
      actions: this.isActionable(appointment.status) ? this.calendarEventActions : [],
      meta: {
        appointment,
        summaryInfo: {
          icon: 'info',
          title: "Appointment Details",
          careType,
          status,
          appointmentId: appointment.id,
          clientId: appointment.createdBy?.id || 0,
          caregiverId: appointment.caregiver?.id || 0,
          caregiverName,
          clientName: appointment.createdBy.firstName + " " + appointment.createdBy.lastName,
          serviceAddressInfo,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          serviceStartTime: this.datePipe.transform(startDate, 'h:mm a'),
          serviceEndTime: this.datePipe.transform(endDate, 'h:mm a'),
          totalHours: appointment.quantity
        }
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: isEventDraggable,
    } as CalendarEvent;
  }

  public showAppointmentDetails($event: { action: string, calendarEvent: CalendarEvent<any> }) {
    this.dialog.open(AppointmentDetailsComponent, {
      width: '600px',
      height: '400px',
      data: { event: $event.calendarEvent, action: $event.action }
    });
  }

  /**
   * @param calendarEventTimesChangedEvent
   * @returns
   */
  public async updateAppointmentStartAndEndDates(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent) {
    const { event: calendarEvent, newStart: newStartDate, newEnd: newEndDate } = calendarEventTimesChangedEvent;
    const appointment = calendarEvent.meta.appointment;
    const appointmentDateTime = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const newQuantity = getDateDiffInHours(newEndDate || newStartDate, newStartDate);
    if (!this.editableStatus.includes(appointment.status)) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Appointment is not in editable status!")
      );
      return { status: false };
    }
    if (newQuantity != appointment.quantity) {
      //NOT_ALLOWED: Can not drag and change appointment's total hours of service.
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Number of Hours of Service Paid For - Can Not Be Modified!")
      );
      return { status: false };
    }
    if (newStartDate.getTime() < now().getTime()) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "You can not schedule appointment to a past date & time.")
      );
      return { status: false };
    }
    if (appointmentDateTime.getTime() < now().getTime()) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Past service appointment - can not be changed. If your caregiver did not show up. Please request for cancellation.")
      );
      return { status: false };
    }

    let status = await this.bookAppointmentService.updateBookAppointment(
      calendarEvent.meta.appointment.id,
      {
        appointmentDate: newStartDate,
        appointmentTime: toSimpleTime(newStartDate)
      }
    );
    return { status };
  }

  editAppointment(calendarEvent: CalendarEvent) {
    const { meta } = calendarEvent;
    const { appointment, summaryInfo } = meta;
    const { caregiverName, serviceAddressInfo } = summaryInfo;
    const appointmentDateTime = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const appointmentServiceWindowInHours = this.environmentService.getValue('appointmentServiceWindowInHours', 24);
    if (!this.editableStatus.includes(appointment.status)) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Appointment is not in editable status!")
      );
      return;
    }
    if (!appointment || !appointment.id) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Invalid appointment data")
      );
      return;
    }
    if (!caregiverName || !serviceAddressInfo) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Missing caregiver or service address information")
      );
      return;
    }

    if (getDateDiffInHours(appointmentDateTime, now()) < appointmentServiceWindowInHours) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", `Cannot Edit past and/or service in-progress appointments. Edit window is ${appointmentServiceWindowInHours}-hours before start time!`)
      );
      return;
    }

    // Show confirmation dialog before editing
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '200px',
      data: {
        icon: 'edit',
        title: 'Edit ' + summaryInfo.careType + ' Appointment',
        message: `Are you sure you want to edit the appointment with ${caregiverName} at ${serviceAddressInfo}?`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Change Appointment',
        cancelButtonText: 'No, Cancel Editing'
      } as ConfirmDialogData
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookAppointmentService.changeBookAppointmentHandler(appointment, () => this.reloadComponent.reloadComponent(true));
      }
    });
  }

  /**
   * @param calendarEvent
   * @param userEvents | Parameter by reference. That is, update userEvents through the reference parameter.
   * @returns
   */
  deleteAppointment(calendarEvent: CalendarEvent, userEvents: CalendarEvent[]) {
    const { meta } = calendarEvent;
    const { appointment, summaryInfo } = meta;
    const { caregiverName, serviceAddressInfo } = summaryInfo;
    const appointmentDateTime = new Date(appointment.appointmentDate + ' ' + appointment.appointmentTime);
    const appointmentCancellationDeadlineInHours = this.environmentService.getValue('appointmentCancellationDeadlineInHours', 24);
    if (!this.editableStatus.includes(appointment.status)) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", 'Appointment is not in editable/deletable status!')
      );
      return;
    }
    if (!appointment || !appointment.id) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Invalid appointment data")
      );
      return;
    }
    if (!caregiverName || !serviceAddressInfo) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Missing caregiver or service address information")
      );
      return;
    }
    if (getDateDiffInHours(appointmentDateTime, now()) < appointmentCancellationDeadlineInHours) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", `Cannot delete past and/or service in-progress appointments. Delete window is ${appointmentCancellationDeadlineInHours}-hours before start time!`)
      );
      return;
    }

    // Show confirmation dialog before deleting
    this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      height: '200px',
      data: {
        icon: 'delete',
        title: 'Delete ' + summaryInfo.careType + ' Appointment',
        message: `Are you sure you want to delete the appointment with ${caregiverName} at ${serviceAddressInfo}?`,
        showCancelButton: true,
        showConfirmButton: true
      } as ConfirmDialogData
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookAppointmentService.deleteBookAppointmentHandler(
          appointment.id,
          () => userEvents = userEvents.filter(event => event !== calendarEvent)
        );
      }
    });
  }

  onAcceptOrRejectAppointment(calendarEvent: CalendarEvent, status: AppointmentStatus) {
    const { meta } = calendarEvent;
    const { appointment, summaryInfo } = meta;
    const { caregiverName, clientName, serviceAddressInfo } = summaryInfo;
    if (appointment.status != AppointmentStatus.SCHEDULED) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", 'Appointment is not in ' + (status == AppointmentStatus.ACCEPTED ? 'acceptable' : 'rejectable') + ' status!')
      );
      return;
    }
    if (!appointment || !appointment.id) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Invalid appointment data")
      );
      return;
    }
    if (!caregiverName || !clientName || !serviceAddressInfo) {
      this.snackBar.openFromComponent(
        ToastsComponent,
        ToastsConfig.getErrorConfig({}, "Error", "Missing caregiver or client name or service address information")
      );
      return;
    }
    this.dialog.open(AcceptOrRejectAppointmentComponent, {
      width: '500px',
      height: '400px',
      data: {
        appointmentId: appointment.id,
        status,
        clientName,
        careType: summaryInfo.careType,
        serviceAddressInfo
      } as AcceptOrRejectData
    }).afterClosed().subscribe((data: any) => {
      if (data && !(typeof data == 'boolean') ) {
        firstValueFrom(this.httpClient.post<ApiResponse>(`/caregiver/book/appointment/accept-or-reject-appointment`, data))
          .then((response: ApiResponse) => {
            if (response.status) {
              this.snackBar.openFromComponent(
                ToastsComponent,
                ToastsConfig.getSuccessConfig("Appointment", status ? "Acceptance Notification Sent" : "Rejection Notification Sent")
              );
              calendarEvent.meta.appointment = response.data;
              this.reloadComponent.reloadComponent(true);
            } else {
              this.snackBar.openFromComponent(
                ToastsComponent,
                ToastsConfig.getErrorConfig(response, "Error", "Error " + (status ? 'Accepting' : 'Rejecting') + " Appointment")
              );
            }
          });
      }
    });
  }

}
