import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStore } from '../../store/app.store';
import {
  LayoutComponent,
  LayoutBodyComponent,
  LayoutHeaderComponent,
  LayoutSidebarComponent,
  LayoutTopbarComponent,
  HeadersComponent,
  FootersComponent
} from '../layouts';
import { AnnouncementComponent } from '../layouts/announcement';
import { SidebarComponent } from '../sidebar';
import { IncidentsContainerComponent } from '../incidents';
import { HeaderType } from '../layouts/headers/header.type.enum';
import { LayoutFooterComponent } from "../layouts/layout-footer/layout-footer.component";
import { FooterType } from '../layouts/footers/footer.type';

@Component({
  imports: [
    RouterOutlet,
    SidebarComponent,
    LayoutComponent,
    LayoutBodyComponent,
    LayoutSidebarComponent,
    LayoutHeaderComponent,
    AnnouncementComponent,
    LayoutTopbarComponent,
    IncidentsContainerComponent,
    HeadersComponent,
    LayoutFooterComponent,
    FootersComponent,
],
  templateUrl: './common.component.html'
})
export class CommonComponent {
  private _appStore = inject(AppStore);
  announcement = computed(() => {
    return this._appStore.announcement();
  });

  onClose() {
    this._appStore.setAnnouncement(null);
  }

  get HeaderType() {
      return HeaderType;
  }

  get FooterType() {
    return FooterType;
}

}
