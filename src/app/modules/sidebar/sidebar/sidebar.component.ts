import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LayoutApiService } from '@app/modules/layouts';

@Component({
  selector: 'padicare-sidebar',
  exportAs: 'padicareSidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  sideNavMode: 'side' | 'over' | 'push' = 'push'; //default to push

  hasBackdrop: boolean = true; //default to true

  _layoutApi = inject(LayoutApiService);

   sidebarShown = computed(() => {
     return this._layoutApi.isSidebarShown('root')
   });

   toggleSidebar(): void {
     if (this.sidebarShown()) {
       this._layoutApi.hideSidebar('root');
     } else {
       this._layoutApi.showSidebar('root');
     }
   }

  showFiller = false;





}
