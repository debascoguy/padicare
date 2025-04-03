import { Directive } from '@angular/core';

@Directive({
  selector: '[padicareNavigationItemBadge]',
  exportAs: 'padicareNavigationItemBadge',
  standalone: true,
  host: {
    'class': 'padicare-navigation-item-badge',
  }
})
export class NavigationItemBadgeDirective {
}
