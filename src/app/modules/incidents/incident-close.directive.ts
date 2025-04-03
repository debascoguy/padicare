import { Directive } from '@angular/core';

@Directive({
  selector: '[padicareIncidentClose]',
  exportAs: 'padicareIncidentClose',
  host: {
    'class': 'padicare-incident-close'
  }
})
export class IncidentCloseDirective {

}
