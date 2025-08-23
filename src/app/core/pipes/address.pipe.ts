import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { UserAddress } from '../models/user';

@Injectable({
  providedIn: 'root' // Makes the pipe injectable as a service
})
@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(address: UserAddress, format: 'short' | 'full'): string {
    if (!address) {
      return '';
    }
    if (format === 'short') {
      return `${address.city}, ${address.state} - ${address.zipcode}`;
    }
    return `${address.houseNumber} ${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.zipcode}`;
  }

}
