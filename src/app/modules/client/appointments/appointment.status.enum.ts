
export enum AppointmentStatus {
  NEW = "NEW", // New Appointment
  ACCEPTED = "ACCEPTED", // Accepted Appointment By Caregiver
  REJECTED = "REJECTED", // Rejected Appointment By Caregiver
  SCHEDULED = "SCHEDULED", // Accepted and Payment is processed (PAID)
  CHECKED_IN = "CHECKED_IN", // Caregiver has checked-in for the appointment
  CHECKED_OUT = "CHECKED_OUT", // Caregiver has checked-out for the appointment
  CANCELED_BY_CLIENT = "CANCELED_BY_CLIENT", // Canceled by Client
  CANCELED_BY_CAREGIVER = "CANCELED_BY_CAREGIVER", // Canceled by Caregiver
  CANCELED_BY_PADICARE = "CANCELED_BY_PADICARE", // Canceled by PadiCare (Admin)
  SERVICED = "SERVICED", // Caregiver fulfilled appointment obligation.
  SERVICED_WITH_COMPLAINT = "SERVICED_WITH_COMPLAINT", // Caregiver fulfilled appointment obligation BUT Client complained about the quality of service
  SERVICED_WITH_DISCOMFORT = "SERVICED_WITH_DISCOMFORT", // Caregiver fulfilled appointment obligation and also complained about the client
  SERVICED_WITH_COMPLAINT_AND_DISCOMFORT = "SERVICED_WITH_COMPLAINT_AND_DISCOMFORT", // Both Client and Caregiver complained about each other
  CLIENT_NO_SHOW = "CLIENT_NO_SHOW", // Client failed to Show up for the appointment
  CAREGIVER_NO_SHOW = "CAREGIVER_NO_SHOW" // Caregiver failed to show up for the appointment
}
