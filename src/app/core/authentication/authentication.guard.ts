import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ChildActivationEnd } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';
import { CredentialsService } from './credentials.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {

    constructor(private router: Router,
        private credentialsService: CredentialsService,
        private httpClient : HttpClient
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.credentialsService.isLoggedIn()) {
            return this.validatePermission();
        }

        console.log('Not authenticated, redirecting and adding redirect url...');
        this.router.navigate(['/auth/login'], {
            queryParams: { redirect: state.url },
            replaceUrl: true,
        });
        return false;
    }

    validatePermission() {
        let haveAccess = true;
         this.router.events.pipe(filter(event => event instanceof ChildActivationEnd))
         .pipe(finalize(() => {
            if (haveAccess) {
                this.validateSession();
            }
         }))
         .subscribe(event => {
            let snapshot = (event as ChildActivationEnd).snapshot;
            while (snapshot.firstChild !== null) {
                snapshot = snapshot.firstChild;
            }
            const pageAuthorities = !!snapshot.data?.['pageAuthorities'] ? snapshot.data['pageAuthorities'] : [];
            const userAuthorities = this.credentialsService.authorities;

            if (pageAuthorities.length > 0) {
                haveAccess = userAuthorities.length > 0 ? pageAuthorities.every((authority:string) => userAuthorities.includes(authority)) : false;
            }
            else {
                haveAccess = true;
            }

            if (!haveAccess) {
                this.router.navigate(['/error/401']);
            }
        });
        return haveAccess;
    }

    validateSession() {
        //HttpInterceptor will append the session token in the request for validation.
        this.httpClient.get("/session/validate-session")
        .subscribe((response:any) => {
            if (!response.status || response.code==401 || response.code==403) {
                alert("Invalid/Expired Browsing Session");
                this.router.navigate(['/auth/login']);
            }
        });
    }
}
