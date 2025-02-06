import { HttpHeadersHelpers } from './HttpHeadersHelpers';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, map, share, switchMap } from 'rxjs/operators';
import { CredentialsService } from '../authentication/credentials.service';
import { environment } from '../../../environments/environments';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginContext } from '../models/login-context.model';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  static readonly DEFAULT_ERROR_TITLE: string = "Something went wrong";

  constructor(
    private credentialService: CredentialsService,
    private authService: AuthenticationService,
    private router: Router,
    protected snackBar: MatSnackBar
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //ApiPrefixInterceptor: Test if NOT external request, Append Server URL
    const isCentralApi = !/^(http|https):/i.test(request.url);
    const isJson = /\.json$/i.test(request.url);
    const url = request.url;
    if (isCentralApi && !isJson) {
      request = request.clone({ url: environment.serverUrl + url });
    }

    if (isCentralApi) {
      request = request.clone({
        setHeaders: this.credentialService.isAuthenticated() ?

                    //AuthenticationInterceptor: Test if Authenticated, Append Authorization Header
                    (
                      (url == environment.renewTokenUrl) ?
                      HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.refreshToken+'') :
                      HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.token+'')
                    ) :

                    //isCentralApiInterceptor: This uses json for request/response!
                    HttpHeadersHelpers.getJsonContentTypeHeaders()
      });
    }

    return next.handle(request).pipe(catchError(err => {
      let httpErrorCode = err.status;
      let retryUrl = request.url;
      const isLoggedIn = this.authService.isLoggedIn();
      if (isLoggedIn && (httpErrorCode === HttpStatusCode.Unauthorized || httpErrorCode === HttpStatusCode.Forbidden)) {
        //Renew Token
        const renewTokenRequest = request.clone({
          url: environment.serverUrl + environment.renewTokenUrl,
          setHeaders: HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.refreshToken+''),
          method: 'GET'
        });
        return next.handle(renewTokenRequest).pipe(
          switchMap((response: any) => {
            if (response instanceof HttpResponse && response.status == HttpStatusCode.Ok) {
              this.credentialService.setCredentials(response.body.data, true);
              //Then, Retry Request
              const retryRequest = request.clone({
                url: retryUrl,
                setHeaders: HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.token+'')
              });
              return next.handle(retryRequest).pipe(share());
            }
            return of(response);
          })
        );
      }
      if (!isLoggedIn && (httpErrorCode === HttpStatusCode.Unauthorized || httpErrorCode === HttpStatusCode.Forbidden)) {
        this.authService.logout().subscribe((_) => {
          console.log("Unathorized Request!");
        });
      }
      return this.handleErrors(err);
    })).pipe(share());
  }

  private handleErrors(error: any): Observable<any> {
    let msg: string = "";
    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    console.error('An error occurred ', msg);
    console.error('An error occurred ', error);
    this.snackBar.open(error.error.message, 'close', {
      duration: 3000
    });
    return of(error);
  }

}
