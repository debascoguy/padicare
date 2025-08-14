import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { CalendarEvent } from 'calendar-utils';
import { colors } from './colors';
import { endOfDay, isSameDay, isSameMonth, startOfDay } from '../../core/services/date-fns';
import { CalendarModule } from './CalendarModule';
import { ViewChangeInfo } from './view-change-info';
import { Subject } from 'rxjs';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';


@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    CalendarModule,
    ReplaceStringPipe
  ],
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month; //Default view is Month

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  @Output() viewChange = new EventEmitter<ViewChangeInfo>();

  @Input() userEvents: CalendarEvent[] = [];

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  activeDayIsOpen: boolean = false;

  refresh = new Subject<void>();

  constructor(private modal: NgbModal) { }

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

  async eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent) {
    const onDraggingEvent = event.meta.onDraggingEvent;
    if (onDraggingEvent) {
      const { status } = await onDraggingEvent(event, newStart, newEnd);
      if (status) {
        this.userEvents = this.userEvents.map((iEvent) => {
          if (iEvent === event) {
            return {
              ...event,
              start: newStart,
              end: newEnd,
            };
          }
          return iEvent;
        });
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
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

  deleteEvent(eventToDelete: CalendarEvent) {
    this.userEvents = this.userEvents.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
    const viewChangeInfo = new ViewChangeInfo();
    viewChangeInfo.view = this.view;
    viewChangeInfo.viewDate = this.viewDate;
    this.viewChange.emit(viewChangeInfo);
  }

  viewDateChangeHandler() {
    this.activeDayIsOpen = false;
    const viewChangeInfo = new ViewChangeInfo();
    viewChangeInfo.view = this.view;
    viewChangeInfo.viewDate = this.viewDate;
    this.viewChange.emit(viewChangeInfo);
  }

}

