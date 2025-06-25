import { Component, inject, Input, OnInit } from '@angular/core';
import { HeaderType } from './header.type.enum';
import { CommonModule, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LayoutApiService } from '../layout-api.service';
import { MatDivider } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileImageComponent } from '@app/shared/profile-image/profile-image.component';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'padicare-basic-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
  imports: [CommonModule, NgIf, MatMenuModule, MatIcon, MatDivider, ProfileImageComponent]
})
export class HeadersComponent implements OnInit {

  @Input() headerType: HeaderType = HeaderType.LANDING;

  @Input() isTransparent: boolean = false;

  @Input() headerText = '';

  @Input() isFixed: boolean  = true;

  public layoutApi = inject(LayoutApiService);

  constructor(protected authenticationService: AuthenticationService, protected router: Router) {
  }

  pageReload() {
    window.location.reload();
  }

  ngOnInit() {
  }

  get HeaderType() {
    return HeaderType;
  }

  logout() {
    this.authenticationService.logout().subscribe((response: boolean) => {
      if (response) {
        this.router.navigate([this.authenticationService.getLoginPage()]);
      }
    })
  }

}
