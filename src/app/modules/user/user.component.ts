import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutModule } from '../layouts/layout.module';
import { HeaderType } from '../layouts/headers/header.type.enum';
import { MatTabsModule } from '@angular/material/tabs';
import { PreferencesComponent } from "./preferences/preferences.component";
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user',
  imports: [
    LayoutModule,
    MatIcon,
    MatTabsModule,
    PreferencesComponent,
    ProfileComponent,
    ChangePasswordComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  get HeaderType() {
    return HeaderType;
  }

}
