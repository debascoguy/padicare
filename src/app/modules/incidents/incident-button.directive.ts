import { Directive } from '@angular/core';

@Directive({
  selector: '[padicareIncidentButton]',
  exportAs: 'padicareIncidentButton',
  host: {
    'class': 'padicare-incident-button',
  }
})
export class IncidentButtonDirective {

}
