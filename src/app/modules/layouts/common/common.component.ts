import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStore } from '../../../store/app.store';
import {
  LayoutComponent,
  HeadersComponent,
  FootersComponent
} from '..';
import { AnnouncementComponent } from '../announcement';
import { HeaderType } from '../headers/header.type.enum';
import { FooterType } from '../footers/footer.type';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AppUserType } from '@app/enums/app.user.type.enum';

@Component({
  imports: [
    RouterOutlet,
    LayoutComponent,
    AnnouncementComponent,
    HeadersComponent,
    FootersComponent,
],
  templateUrl: './common.component.html'
})
export class CommonComponent {

  private _appStore = inject(AppStore);

  protected credentialService: CredentialsService = inject(CredentialsService);

  announcement = computed(() => {
    return this._appStore.announcement();
  });


  onClose() {
    this._appStore.setAnnouncement(null);
  }

  get headerType(): HeaderType {

    if (!this.credentialService.isLoggedIn()) {
      return HeaderType.AUTH;
    }

    if (this.credentialService.isAdmin()) {
      return HeaderType.ADMIN;
    }

    if (this.credentialService.activePortal == AppUserType.careGiver) {
      return HeaderType.CAREGIVER;
    }

    if (this.credentialService.activePortal == AppUserType.client) {
      return HeaderType.CLIENT;
    }

    return HeaderType.LANDING;
  }

  get footerType(): FooterType {
    if (!this.credentialService.isLoggedIn()) {
      return FooterType.BASIC;
    }
    return FooterType.PRIMARY;
  }

  // get HeaderType() {
  //     return HeaderType;
  // }

  // get FooterType() {
  //   return FooterType;
  // }

}
