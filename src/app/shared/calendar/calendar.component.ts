import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import { colors } from './colors';
import { endOfDay, isSameDay, isSameMonth, startOfDay } from '../../core/services/date-fns';
import { CalendarModule } from './CalendarModule';
import { ViewChangeInfo } from './view-change-info';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    CalendarModule
  ],
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {

  @Input() userEvents: CalendarEvent[] = [];

  @Output() viewChange = new EventEmitter<ViewChangeInfo>();

  @Output() isHandleEvent = new EventEmitter<{ action: string, calendarEvent: CalendarEvent }>();

  @Output() isDraggingEvent = new EventEmitter<CalendarEventTimesChangedEvent>();

  view: CalendarView = CalendarView.Month; //Default view is Month

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  activeDayIsOpen: boolean = false;

  refresh = new Subject<void>();

  constructor() { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  async eventTimesChanged(calendarEventTimesChangedEvent: CalendarEventTimesChangedEvent) {
    this.isDraggingEvent.emit(calendarEventTimesChangedEvent);
  }

  handleEvent(action: string, calendarEvent: CalendarEvent): void {
    this.isHandleEvent.emit({action, calendarEvent });
  }

  addEventExample(): void {
    this.userEvents = [
      ...this.userEvents,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEventExample(eventToDelete: CalendarEvent) {
    this.userEvents = this.userEvents.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
    this.emitViewChangeInfo();
  }

  viewDateChangeHandler() {
    this.activeDayIsOpen = false;
    this.emitViewChangeInfo();
  }

  emitViewChangeInfo() {
    const viewChangeInfo = new ViewChangeInfo();
    viewChangeInfo.view = this.view;
    viewChangeInfo.viewDate = this.viewDate;
    this.viewChange.emit(viewChangeInfo);
  }

}

