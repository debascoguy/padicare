import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[padicareSidebarNavItemIcon]'
})
export class SidebarNavItemIconDirective {
  readonly templateRef = inject(TemplateRef);
}
