import { Component, inject, input } from '@angular/core';
import { IncidentsStore } from '../incidents.store';
import { MatIconButton } from '@angular/material/button';

let incidentId = 0;

@Component({
  selector: 'padicare-incident,[padicare-incident]',
  exportAs: 'padicareIncident',
  imports: [
    MatIconButton
  ],
  templateUrl: './incident.component.html',
  styleUrl: './incident.component.scss',
  host: {
    'class': 'padicare-incident'
  }
})
export class IncidentComponent {
  private _incidentsStore = inject(IncidentsStore);

  incidentId = input(`incident-${incidentId++}`);

  close() {
    this._incidentsStore.hide();
  }
}
