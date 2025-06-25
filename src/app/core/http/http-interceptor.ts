import { HttpHeadersHelpers } from './HttpHeadersHelpers';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, share, switchMap } from 'rxjs/operators';
import { CredentialsService } from '../authentication/credentials.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnvironmentService } from '../services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  static readonly DEFAULT_ERROR_TITLE: string = "Something went wrong";

  constructor(
    private credentialService: CredentialsService,
    private authService: AuthenticationService,
    protected snackBar: MatSnackBar,
    private envService: EnvironmentService
  ) { }

  getHeaders(request: HttpRequest<any>) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //ApiPrefixInterceptor: Test if NOT external request, Append Server URL
    const isInternal = !/^(http|https):/i.test(request.url);
    const isJson = /\.json$/i.test(request.url);
    const serverUrl = this.envService.getValue('serverUrl');
    const renewTokenUrl = this.envService.getValue('renewTokenUrl');

    const url = isInternal && !isJson ? (serverUrl + request.url) : request.url;

    if (isInternal) {
      const authorizationHeader = this.credentialService.isAuthenticated() ?

        //AuthenticationInterceptor: Test if Authenticated, Append Authorization Header
        (
          (request.url == renewTokenUrl) ?
            HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.refreshToken + '') :
            HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.token + '')
        ) :

        //isCentralApiInterceptor: This uses json for request/response!
        HttpHeadersHelpers.getJsonContentTypeHeaders();

      request = request.clone({
        url: url,
        setHeaders: authorizationHeader
      });
    } else {
      request = request.clone({ url });
    }

    return next.handle(request).pipe(catchError(err => {
      let httpErrorCode = err.status;
      let retryUrl = request.url;
      const isLoggedIn = this.authService.isLoggedIn();
      if (isLoggedIn && (httpErrorCode === HttpStatusCode.Unauthorized || httpErrorCode === HttpStatusCode.Forbidden)) {
        //Renew Token
        const renewTokenRequest = request.clone({
          url: serverUrl + renewTokenUrl,
          setHeaders: HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.refreshToken + ''),
          method: 'GET'
        });

        return next.handle(renewTokenRequest).pipe(
          switchMap((response: any) => {
            if (response instanceof HttpResponse && response.status == HttpStatusCode.Ok) {
              this.credentialService.setCredentials(response.body.data, true);
              //Then, Retry Request
              const retryRequest = request.clone({
                url: retryUrl,
                setHeaders: HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.token + '')
              });
              return next.handle(retryRequest).pipe(share());
            }
            return of(response);
          })
        );
      }
      if (!isLoggedIn && (httpErrorCode === HttpStatusCode.Unauthorized || httpErrorCode === HttpStatusCode.Forbidden)) {
        this.authService.logout().subscribe((_) => {
          console.log("Unauthorized Request!");
        });
      }
      return this.handleErrors(err);
    })).pipe(share());
  }

  private handleErrors(error: any): Observable<any> {
    let msg: string = "";
    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    console.error('An error occurred ', msg, error);
    this.snackBar.open(error.error.message, 'close', {
      duration: 3000
    });
    return throwError(() => error);
  }

}
