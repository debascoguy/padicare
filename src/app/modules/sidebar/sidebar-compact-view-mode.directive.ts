import { Directive } from '@angular/core';

@Directive({
  selector: '[padicareSidebarCompactViewMode]',
  exportAs: 'padicareSidebarCompactViewMode',
  standalone: true,
  host: {
    'class': 'padicare-sidebar-compact-view-mode',
  }
})
export class SidebarCompactViewModeDirective {
}
