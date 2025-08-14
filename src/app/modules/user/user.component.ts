import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LayoutModule } from '../layouts/layout.module';
import { HeaderType } from '../layouts/headers/header.type.enum';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    LayoutModule,
    PreferencesComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  protected selectedTab: string | null = null;

  protected isEditingUserProfile: boolean = false;

  public TABS: Record<string, string> = {
    "profile" : "Profile",
    "preferences": "Preferences",
    "change-password": "Change Password"
  }

  constructor(
    protected authenticationService: AuthenticationService,
    protected router: Router,
    protected route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.paramMap.get('tab') || "profile";
    this.isEditingUserProfile = false;
  }

  toggleEditingProfile(isEditingUserProfile: boolean) {
    this.isEditingUserProfile = isEditingUserProfile;
  }

  switchTab(tab: string) {
    this.selectedTab = tab;
  }

  get HeaderType() {
    return HeaderType;
  }

  get credentials() {
    return this.authenticationService.getCredentialsService().credentials;
  }

  get user() {
    return this.credentials?.user;
  }

}
