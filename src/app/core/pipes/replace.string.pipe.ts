import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceString'
})
export class ReplaceStringPipe implements PipeTransform {

  transform(value: string, find: string, replace: string): string {
    if (!value || !find || !replace) {
      return value;
    }
    return (value || "").replaceAll(find, replace);
  }

}
