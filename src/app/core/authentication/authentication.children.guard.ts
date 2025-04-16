import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, ChildActivationEnd, CanActivateChild } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CredentialsService } from './credentials.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationChildrenGuard implements CanActivateChild {

  constructor(private router: Router, private credentialsService: CredentialsService) { }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.credentialsService.isLoggedIn()) {
      const pageAuthorities = !!route.data?.['pageAuthorities'] ? route.data['pageAuthorities'] : [];
      const userAuthorities = this.credentialsService.authorities;

      let haveAccess = true;
      if (pageAuthorities.length > 0) {
        haveAccess = userAuthorities.length > 0 ? pageAuthorities.every((authority: string) => userAuthorities.includes(authority)) : false;
      }

      if (!haveAccess) {
        this.router.navigate(['/error/401']);
      }

      return haveAccess;
    }

    // console.log('Not authenticated, redirecting and adding redirect url...');
    this.router.navigate(['/auth/login'], {
      queryParams: { redirect: state.url },
      replaceUrl: true,
    });
    return false;
  }

}
