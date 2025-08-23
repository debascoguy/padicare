import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-appointments-table-view',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './appointments-table-view.component.html',
  styleUrl: './appointments-table-view.component.scss'
})
export class AppointmentsTableViewComponent {

  @Input() userEvents: CalendarEvent[] = [];

  refresh = new Subject<void>();

  @ViewChild('topPaginator') topPaginator!: MatPaginator;
  @ViewChild('bottomPaginator') bottomPaginator!: MatPaginator;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = this.pageSizeOptions[1];
  pageIndex: number = 0;
  startIndex: number = 0;
  endIndex: number = this.pageSize;

  pageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    if (this.endIndex > this.userEvents.length) {
      this.endIndex = this.userEvents.length;
    }
    if (!this.topPaginator.hasNextPage()) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  constructor(public credentialsService: CredentialsService){}
}
