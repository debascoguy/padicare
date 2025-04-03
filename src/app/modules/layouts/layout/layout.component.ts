import { booleanAttribute, Component, computed, inject, input } from '@angular/core';
import { LAYOUT } from '../types';

let nextId = 0;

@Component({
  selector: 'padicare-layout',
  exportAs: 'padicareLayout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: [
    {
      provide: LAYOUT,
      useExisting: LayoutComponent
    }
  ],
  host: {
    'class': 'padicare-layout',
    '[class.is-window-mode]': 'windowMode()'
  }
})
export class LayoutComponent {
  layoutId = input<string>(`layout-${nextId++}`);
  windowMode = input(false, {
    transform: booleanAttribute
  });
}
