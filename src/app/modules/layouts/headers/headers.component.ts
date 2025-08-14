import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HeaderType } from './header.type.enum';
import { CommonModule, NgIf } from '@angular/common';
import { LayoutApiService } from '../layout-api.service';
import { MatMenuModule } from '@angular/material/menu';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Breadcrumb, RouteData } from '@app/core/models/navigation.model';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';

@Component({
  selector: 'padicare-basic-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
  imports: [CommonModule, NgIf, MatMenuModule]
})
export class HeadersComponent implements OnInit {

  @Input() headerType: HeaderType = HeaderType.LANDING;

  @Input() isTransparent: boolean = false;

  @Input() headerText = '';

  @Input() isFixed: boolean  = true;

  currentUrl: string  = "";
  currentRoutePath: string  = "";
  routeData: RouteData = {} as RouteData;
  breadcrumbs: Breadcrumb[] = [];

  public layoutApi = inject(LayoutApiService);

  constructor(
    protected authenticationService: AuthenticationService,
    protected router: Router,
    protected activatedRoute: ActivatedRoute
  ) { }

  pageReload() {
    window.location.reload();
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.currentRoutePath = this.activatedRoute.snapshot.url.map(segment => segment.path).join('/');
    this.routeData = (this.activatedRoute.snapshot.firstChild?.data || {}) as unknown as RouteData;
    this.breadcrumbs = this.routeData?.breadcrumbs || [];
  }

  switch() {
    if (this.credentials?.activePortal == AppUserType.client) {
      this.router.navigate(["/client"]);
    } else {
      this.router.navigate(["/caregiver"]);
    }
  }

  get credentials() {
    return this.authenticationService.getCredentialsService().credentials;
  }

  get user() {
    return this.credentials?.user;
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
