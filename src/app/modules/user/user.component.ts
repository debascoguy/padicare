import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LayoutModule } from '../layouts/layout.module';
import { HeaderType } from '../layouts/headers/header.type.enum';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './preferences/preferences.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { ClientPreferenceComponent } from './client-preference/client-preference.component';
import { CaregiverPreferenceComponent } from './caregiver-preference/caregiver-preference.component';
import { ReplaceStringPipe } from '@app/core/pipes/replace.string.pipe';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    LayoutModule,
    PreferencesComponent,
    ProfileComponent,
    ChangePasswordComponent,
    ClientPreferenceComponent,
    CaregiverPreferenceComponent,
    ReplaceStringPipe
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
    public credentialsService: CredentialsService,
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
    return this.credentialsService.credentials;
  }

  get user() {
    return this.credentials?.user;
  }

}
