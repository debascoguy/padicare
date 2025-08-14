import { CalendarView } from "angular-calendar";

export class ViewChangeInfo {

  view: CalendarView = CalendarView.Month; // Default view is Month
  
  viewDate: Date = new Date();
}