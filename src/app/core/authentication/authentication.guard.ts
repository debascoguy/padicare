import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ChildActivationEnd } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';
import { CredentialsService } from './credentials.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {

  constructor(private router: Router, private credentialsService: CredentialsService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialsService.isLoggedIn()) {
      return true;
    }

    // console.log('Not authenticated, redirecting and adding redirect url...');
    this.router.navigate(['/auth/login'], {
      queryParams: { redirect: state.url },
      replaceUrl: true,
    });
    return false;
  }

}
