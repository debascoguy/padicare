import { Status } from './../../../../../node_modules/@inquirer/core/dist/commonjs/lib/theme.d';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LogEntry } from "../LogEntry";
import { map, Observable, of } from "rxjs";
import { LogPublisher } from "./LogPublisher";

@Injectable({
    providedIn  : 'root'
})
export class LogWebApi extends LogPublisher {

    constructor(private http: HttpClient) {
        super();
    }

    log(record: LogEntry): Observable<boolean> {
        const url = '/app/error/log';
        return this.http.post(url, record).pipe(map((response: any) => <boolean>response.status));
    }

    clear(): Observable<boolean> {
      // const url = '/app/error/log';
      // this.http.delete(url).pipe(map(response => response));
      return of(true);
    }
}