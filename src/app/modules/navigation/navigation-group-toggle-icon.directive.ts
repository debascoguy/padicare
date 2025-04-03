import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[padicareNavigationGroupToggleIcon]',
  exportAs: 'padicareNavigationGroupToggleIcon',
  host: {
    'class': 'padicare-navigation-group-toggle-icon'
  }
})
export class NavigationGroupToggleIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
