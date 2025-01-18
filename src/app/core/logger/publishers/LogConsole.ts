import { Observable, of } from "rxjs";
import { LogEntry } from "../LogEntry";
import { LogPublisher } from "./LogPublisher";

export class LogConsole extends LogPublisher {

  log (entry: LogEntry): Observable<boolean> {
      // Log to console
      console.log(entry.toString());
      return of(true);
  }

  clear(): Observable<boolean> {
      console.clear();
      return of(true);
  }

}
