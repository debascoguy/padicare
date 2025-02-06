import { LogLevel } from './LogLevel';

export class LogEntry {
  entryDate: Date = new Date();

  message: string | object = '';

  level: LogLevel = LogLevel.Debug;

  extraInfo: any[] = [];

  logWithDate: boolean = true;

  toString(appendMessage: boolean = true): string {
    let ret: string = '';

    if (this.logWithDate) {
      ret = new Date() + ' - ';
    }

    ret += 'Type: ' + LogLevel[this.level];
    if (appendMessage) {
      ret += ' - Message: ' + this.message;
    }
    if (this.extraInfo.length) {
      ret += ' - Extra Info: ' + this.formatParams(this.extraInfo);
    }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');
    // Is there at least one object in the array?
    if (params.some((p) => typeof p == 'object')) {
      ret = '';
      // Build comma-delimited string
      for (let item of params) {
        ret += JSON.stringify(item) + ',';
      }
    }
    return ret;
  }
}
