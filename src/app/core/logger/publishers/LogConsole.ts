import { Observable, of } from "rxjs";
import { LogEntry } from "../LogEntry";
import { LogPublisher } from "./LogPublisher";
import { LogLevel } from "../LogLevel";

export class LogConsole extends LogPublisher {

  log (entry: LogEntry): Observable<boolean> {
      // If the entry is not a string, convert it to a string
      // and append the message to the string
      // If the entry is a string, just log it
      const messagebody = typeof entry.message == 'string' ? entry.toString() : [entry.toString(false), entry.message];

      if (entry.level == LogLevel.All) {
          console.log(messagebody);
      } else if (entry.level == LogLevel.Debug) {
          console.debug(messagebody);
      } else if (entry.level == LogLevel.Info) {
          console.info(messagebody);
      } else if (entry.level == LogLevel.Warn) {
          console.warn(messagebody);
      } else if (entry.level == LogLevel.Error || entry.level == LogLevel.Fatal) {
          console.error(messagebody);
      } else if (entry.level == LogLevel.Dir) {
          console.dir(messagebody);
      } else if (entry.level == LogLevel.Off) {
        console.time("");
      } else {
        console.log(messagebody);
      }
      return of(true);
  }

  clear(): Observable<boolean> {
      console.clear();
      return of(true);
  }

}
