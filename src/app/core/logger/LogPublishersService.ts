import { Injectable } from '@angular/core';
import { LogPublisher } from './publishers/LogPublisher';
import { LogConsole } from './publishers/LogConsole';
import { LogLocalStorage } from './publishers/LogLocalStorage';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { LogPublisherConfig } from './publishers/LogPublisherConfig';
import { LogWebApi } from './publishers/LogWebApi';

@Injectable({
  providedIn: 'root'
})
export class LogPublishersService {

  PUBLISHERS_FILE = 'assets/log-publishers.json';

  // Public properties
  publishers: LogPublisher[] =  [];

  constructor(private http: HttpClient) {
    this.buildPublishers();
  }

  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get<any>(this.PUBLISHERS_FILE);
  }

  // buildPublishers(): void {
  //   this.getLoggers().subscribe((response) => {
  //     const activePublishers = response?.filter((p: any) => p.isActive) || [];
  //     activePublishers.forEach((pub: any) => {
  //       let publisher = null;
  //       switch (pub.loggerName.toLowerCase()) {
  //         case "console":
  //           publisher = new LogConsole();
  //           break;
  //         case "localstorage":
  //           publisher = new LogLocalStorage();
  //           break;
  //         case "webapi":
  //           publisher = new LogWebApi(this.http);
  //           break;
  //       }
  //       if (publisher != null) {
  //         publisher.location = pub.loggerLocation;
  //         this.publishers.push(publisher);
  //       }
  //     });
  //   });
  // }

  // Build publishers array
  buildPublishers(): void {
    this.publishers.push(new LogConsole());
    this.publishers.push(new LogLocalStorage());
    this.publishers.push(new LogWebApi(this.http));
  }

}
