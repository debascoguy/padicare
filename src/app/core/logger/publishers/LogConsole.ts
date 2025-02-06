import { Observable, of } from "rxjs";
import { LogEntry } from "../LogEntry";
import { LogPublisher } from "./LogPublisher";

export class LogConsole extends LogPublisher {

  log (entry: LogEntry): Observable<boolean> {
      // Log to console
      if (typeof entry.message == 'string') {
        console.log(entry.toString());
      } else {
        console.log(entry.toString(false), entry.message);
      }
      return of(true);
  }

  clear(): Observable<boolean> {
      console.clear();
      return of(true);
  }

}
