import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderCareTypes',
  standalone: true
})
export class OrderCareTypesPipe implements PipeTransform {
  transform(value: any): any {
    if (!Array.isArray(value)) {
      throw new Error('Order By value should be an array');
    }

    const sorted = value.sort((a, b) => {
      if (a['category'] == 'PRIMARY' && b['category'] != 'PRIMARY') {
        return -1;
      } else if (a['category'] == 'SECONDARY' && b['category'] != 'SECONDARY') {
        return 1;
      } else {
        return 0;
      }
    });

    return sorted;
  }
}
