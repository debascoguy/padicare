import { Injectable } from '@angular/core';
import { LogPublisher } from './publishers/LogPublisher';
import { LogConsole } from './publishers/LogConsole';
import { LogLocalStorage } from './publishers/LogLocalStorage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogPublisherConfig } from './publishers/LogPublisherConfig';
import { LogWebApi } from './publishers/LogWebApi';
import { environment } from '../../../environments/environments';

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
    if (environment.logger.console) {
      this.publishers.push(new LogConsole());
    }
    if (environment.logger.localStorage) {
      this.publishers.push(new LogLocalStorage());
    }
    if (environment.logger.webApi) {
      this.publishers.push(new LogWebApi(this.http));
    }
  }

}
