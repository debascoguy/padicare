import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string,  words: number = 20, limit: number = 0, ellipsis: string = '...'): string {
    if (value.length <= limit) {
      return value;
    }
    let truncatedWords = words > 0 ? value?.split(' ')?.slice(0, words)?.join(' ') : value;
    truncatedWords = limit > 0 ? truncatedWords.substring(0, limit) : truncatedWords;
    return truncatedWords + ellipsis;
  }

}
