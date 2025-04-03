import { Directive } from '@angular/core';

@Directive({
  selector: '[padicareIncidentIcon]',
  exportAs: 'padicareIncidentIcon',
  host: {
    'class': 'padicare-incident-icon'
  }
})
export class IncidentIconDirective {

}
