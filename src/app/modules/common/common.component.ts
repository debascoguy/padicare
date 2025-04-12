import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStore } from '../../store/app.store';
import {
  LayoutComponent,
  LayoutBodyComponent,
  LayoutHeaderComponent,
  LayoutTopbarComponent,
  HeadersComponent,
  FootersComponent
} from '../layouts';
import { AnnouncementComponent } from '../layouts/announcement';
import { IncidentsContainerComponent } from '../incidents';
import { HeaderType } from '../layouts/headers/header.type.enum';
import { LayoutFooterComponent } from "../layouts/layout-footer/layout-footer.component";
import { FooterType } from '../layouts/footers/footer.type';

@Component({
  imports: [
    RouterOutlet,
    LayoutComponent,
    LayoutBodyComponent,
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
