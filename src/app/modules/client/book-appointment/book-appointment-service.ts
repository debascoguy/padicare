import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CredentialsService } from "@app/core/authentication/credentials.service";
import { AppUserType } from "@app/shared/enums/app.user.type.enum";
import { UserSummary } from "@app/shared/user-summary/UserSummary";
import { BookAppointment } from "../appointments/appointment";
import { bookingAppointmentComponent } from "./book-appointment.component";
import { ApiResponse } from "@app/core/models/api-repsonse";
import { firstValueFrom } from "rxjs";
import { ToastsComponent } from "@app/shared/toasts/toasts.component";
import { ToastsConfig } from "@app/shared/toasts/ToastsConfig";
import { SnackBarParams } from "@app/shared/toasts/SnackBarParams";

@Injectable({ providedIn: 'root' })
export class BookAppointmentService {

  constructor(
    protected credentialsService: CredentialsService,
    private httpClient: HttpClient,
    protected snackBar: MatSnackBar,
    protected modalDialogService: MatDialog,
    protected router: Router
  ) { }

  findCaregiversCareTypes(caregiversId: string[]) {
    return this.httpClient.post('/caregiver/care-types/find-all/by/ids', { caregiversId });
  }

  async updateBookAppointment(bookingAppointmentId: string, fieldValue: any) {
    return await firstValueFrom(this.httpClient.patch(`/caregiver/book/appointment/${bookingAppointmentId}`, fieldValue))
      .then((response: any) => {
        if (response.status) {
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "SUCCESS",
              headerTitle: "Appointment Updates",
              message: "Appointment Updated Successfully",
            } as SnackBarParams
          });
          return response.status;
        } else {
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Appointment Updates",
              message: response.message || "Error Saving Appointment",
            } as SnackBarParams
          });
          return false;
        }
      }, (error) => {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error",
            message: "Failed to edit appointment. Please try again.",
          } as SnackBarParams
        });
        return false;
      });
  }

  saveBookAppointment(bookingAppointment: BookAppointment, successCallback: Function) {
    this.httpClient.post('/caregiver/book/appointment', { ...bookingAppointment }).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "SUCCESS",
              headerTitle: "Appointment",
              message: "Appointment Created Successfully",
            } as SnackBarParams
          });
          successCallback(response);
        } else {
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Error Saving Appointment",
              message: response.message || "Error Saving Appointment",
            } as SnackBarParams
          });
        }
      },
      error: (error) => {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error Saving Appointment",
            message: "Failed to edit appointment. Please try again.",
          } as SnackBarParams
        });
      }
    });
  }

  deleteBookAppointmentHandler(appointmentId: string, successCallback: Function) {
    this.httpClient.delete<ApiResponse>(`/caregiver/book/appointment/${appointmentId}`).subscribe({
      next: (response: ApiResponse) => {
        if (response.status) {
          successCallback();
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "SUCCESS",
              headerTitle: "Appointment Deleted",
              message: "Appointment deleted successfully",
            } as SnackBarParams
          });
        } else {
          this.snackBar.openFromComponent(ToastsComponent, {
            ...ToastsConfig.defaultConfig,
            data: {
              type: "DANGER",
              headerTitle: "Error",
              message: response.message || "Failed to delete appointment",
            } as SnackBarParams
          });
        }
      },
      error: (err) => {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "Error",
            message: "Failed to delete appointment",
          } as SnackBarParams
        });
      }
    });
  }


  changeBookAppointmentHandler(bookingAppointment: BookAppointment, successCallback: Function) {
    if (!bookingAppointment) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Invalid care appointment data!",
        } as SnackBarParams
      });
      return;
    }

    if (this.credentialsService.userType !== AppUserType.client && this.credentialsService.userType !== AppUserType.both) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Only clients can edit care appointments with caregivers",
        } as SnackBarParams
      });
      return;
    }

    this.modalDialogService.open(bookingAppointmentComponent, {
      data: { bookingAppointment, isEdit: true },
      width: '750px',
      disableClose: false,
      autoFocus: false,
    }).afterClosed().subscribe((result) => {
      if (result && result.success) {
        const { success, ...data } = result;
        this.saveBookAppointment(data, successCallback);
      }
    });
  }


  bookAppointmentHandler(isBookAppointment: boolean, user: UserSummary) {
    if (!isBookAppointment) {
      return;
    }

    if (this.credentialsService.userType !== AppUserType.client && this.credentialsService.userType !== AppUserType.both) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Only clients can book care appointments with caregivers",
        } as SnackBarParams
      });
      return;
    }

    if (!user || !user.userId) {
      this.snackBar.openFromComponent(ToastsComponent, {
        ...ToastsConfig.defaultConfig,
        data: {
          type: "DANGER",
          headerTitle: "Error",
          message: "Invalid caregiver selected",
        } as SnackBarParams
      });
      return;
    }

    this.modalDialogService.open(bookingAppointmentComponent, {
      data: { user, isEdit: false },
      width: '750px',
      disableClose: false,
      autoFocus: false,
    }).afterClosed().subscribe((result) => {
      if (result && result.success) {
        const { success, ...data } = result;
        this.saveBookAppointment(
          data,
          (response: any) => this.router.navigate(['/client/invoice/' + response.data.id])
        );
      }
    });
  }

}
