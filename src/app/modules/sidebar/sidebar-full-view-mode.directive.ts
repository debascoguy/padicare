import { Directive } from '@angular/core';

@Directive({
  selector: '[padicareSidebarFullViewMode]',
  exportAs: 'padicareSidebarFullViewMode',
  standalone: true,
  host: {
    'class': 'padicare-sidebar-full-view-mode',
  }
})
export class SidebarFullViewModeDirective {

}
