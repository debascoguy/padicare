import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[padicareNavigationItemIcon]',
  exportAs: 'padicareNavigationItemIcon',
  host: {
    'class': 'padicare-navigation-item-icon'
  }
})
export class NavigationItemIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
