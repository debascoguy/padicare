import { Directive } from '@angular/core';

@Directive({
  selector: '[padicareIncidentsToggleIcon]',
  exportAs: 'padicareIncidentsToggleIcon',
  host: {
    'class': 'padicare-incidents-toggle-icon',
  }
})
export class IncidentsToggleIconDirective {

}
