
export enum AppointmentStatus {
  NEW = "NEW", // New Appointment
  ACCEPTED = "ACCEPTED", // Accepted Appointment By Caregiver
  REJECTED = "REJECTED", // Rejected Appointment By Caregiver
  SCHEDULED = "SCHEDULED", // Accepted and Payment is processed (PAID)
  SERVICED = "SERVICED", // Caregiver fulfilled appointment obligation.
  SERVICED_WITH_COMPLAINT = "SERVICED_WITH_COMPLAINT", // Caregiver fulfilled appointment obligation BUT Client complained about the quality of service
  SERVICED_WITH_DISCOMFORT = "SERVICED_WITH_DISCOMFORT", // Caregiver fulfilled appointment obligation and also complained about the client
  CLIENT_NO_SHOW = "CLIENT_NO_SHOW", // Client failed to Show up for the appointment
  CAREGIVER_NO_SHOW = "CAREGIVER_NO_SHOW" // Caregiver failed to show up for the appointment
}
