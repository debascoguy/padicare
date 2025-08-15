import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ChildActivationEnd } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';
import { CredentialsService } from './credentials.service';
import { ToastsComponent } from '@app/shared/toasts/toasts.component';
import { ToastsConfig } from '@app/shared/toasts/ToastsConfig';
import { SnackBarParams } from '@app/shared/toasts/SnackBarParams';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {

  constructor(
    private router: Router,
    private credentialsService: CredentialsService,
    protected snackBar: MatSnackBar
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialsService.isLoggedIn()) {
      if (!this.credentialsService.isUserEnabled) {
        this.snackBar.openFromComponent(ToastsComponent, {
          ...ToastsConfig.defaultConfig,
          data: {
            type: "DANGER",
            headerTitle: "In-active Account",
            message: "Please activate your account to access major functionalities",
          } as SnackBarParams
        });
      }
      return true;
    }

    console.log('Not authenticated, redirecting and adding redirect url...');
    this.snackBar.openFromComponent(ToastsComponent, {
      ...ToastsConfig.defaultConfig,
      data: {
        type: "DANGER",
        headerTitle: "Invalid User Session",
        message: "Invalid user session. Please login / re-login to continue",
      } as SnackBarParams
    });

    this.router.navigate(['/auth/login'], {
      queryParams: { redirect: state.url },
      replaceUrl: true,
    });
    return false;
  }

}
