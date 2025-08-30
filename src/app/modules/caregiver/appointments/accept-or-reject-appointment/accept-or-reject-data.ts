import { AppointmentStatus } from "@app/modules/client/appointments/appointment.status.enum";

export interface AcceptOrRejectData {
  appointmentId: string;
  status: AppointmentStatus;
  clientName: string;
  serviceAddressInfo: string;
  careType: string;
}
