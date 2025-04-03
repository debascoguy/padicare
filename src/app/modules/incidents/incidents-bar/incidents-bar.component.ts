import { Component, HostListener, inject } from '@angular/core';
import { INCIDENTS } from '../properties';
import { IncidentsComponent } from '../incidents/incidents.component';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'padicare-incidents-bar',
  exportAs: 'padicareIncidentsBar',
  imports: [
    MatIconButton
  ],
  templateUrl: './incidents-bar.component.html',
  styleUrl: './incidents-bar.component.scss',
  host: {
    'class': 'padicare-incidents-bar'
  }
})
export class IncidentsBarComponent {
  private _parent = inject<IncidentsComponent>(INCIDENTS, { optional: true });

  @HostListener('click', ['$event'])
  private _handleClick() {
    this._parent?.toggleVisibility();
  }
}
