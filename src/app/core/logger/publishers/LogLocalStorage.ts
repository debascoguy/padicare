import { Observable, of } from "rxjs";
import { LogEntry } from "../LogEntry";
import { LogPublisher } from "./LogPublisher";

export class LogLocalStorage extends LogPublisher {
  constructor() {
      super();
      this.location = "logging"; // Set location in LocalStorage
  }

  // Append log entry to local storage
  log(entry: LogEntry): Observable<boolean> {
      let ret: boolean = false;
      let values: LogEntry[];
      try {
          values = JSON.parse(localStorage.getItem(this.location) ?? '[]');
          values.push(entry);
          localStorage.setItem(this.location, JSON.stringify(values));
          ret = true;
      } catch (ex) {
          // Display error in console
          console.log(ex);
      }
      return of(ret);
  }

  // Clear all log entries from local storage
  clear(): Observable<boolean> {
      localStorage.removeItem(this.location);
      return of(true);
  }

}
