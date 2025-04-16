import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CredentialsService } from './credentials.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationAdminGuard implements CanActivate {

    constructor(private router: Router, private credentialsService: CredentialsService) { }

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.credentialsService.isAdmin()) {
            return true;
        }

        console.log('Not An Admin, redirecting to login...');
        this.router.navigate(['/auth/login'], {
            queryParams: { redirect: state.url },
            replaceUrl: true,
        });
        return false;
    }

}
