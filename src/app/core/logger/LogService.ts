import { Injectable } from '@angular/core';
import { LogLevel } from './LogLevel';
import { LogEntry } from './LogEntry';
import { LogPublisher } from './publishers/LogPublisher';
import { LogPublishersService } from './LogPublishersService';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private logLevel: LogLevel = LogLevel.All;
  private logWithDate = true;

  publishers: LogPublisher[];

  constructor(public publishersService: LogPublishersService) {
    this.publishers = this.publishersService.publishers;
  }

  private shouldLog(level: LogLevel): boolean {
    return ((level >= this.logLevel && level !== LogLevel.Off) || this.logLevel === LogLevel.All);
  }

  private publishLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry();
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;
      for (let logger of this.publishers) {
        logger.log(entry).subscribe(response => response);
      }
    }
  }

  clear() {
    for (let logger of this.publishers) {
      logger.clear();
    }
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.publishLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.publishLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.publishLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.publishLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.publishLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.publishLog(msg, LogLevel.All, optionalParams);
  }

}
