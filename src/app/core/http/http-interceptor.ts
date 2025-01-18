import { HttpHeadersHelpers } from './HttpHeadersHelpers';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, share } from 'rxjs/operators';
import { CredentialsService } from '../authentication/credentials.service';
import { environment } from '../../../environments/environments';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  static readonly DEFAULT_ERROR_TITLE: string = "Something went wrong";

  constructor(
    private credentialService: CredentialsService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //ApiPrefixInterceptor: Test if NOT external request, Append Server URL
    const isCentralApi = !/^(http|https):/i.test(request.url);
    const isJson = /\.json$/i.test(request.url);
    if (isCentralApi && !isJson) {
      request = request.clone({ url: environment.serverUrl + request.url });
    }

    if (isCentralApi) {
      request = request.clone({
        setHeaders: this.credentialService.isAuthenticated() ?
                    //AuthenticationInterceptor: Test if Authenticated, Append Authorization Header
                    HttpHeadersHelpers.getJsonContentTypeHeadersWithToken(this.credentialService.token+'') :
                    //isCentralApiInterceptor: This uses json for request/response!
                    HttpHeadersHelpers.getJsonContentTypeHeaders()
      });
    }
    
    return next.handle(request).pipe(catchError(err => {
      let httpErrorCode = err.status;
      if (httpErrorCode === HttpStatusCode.Unauthorized
        || httpErrorCode === HttpStatusCode.Forbidden) {
        this.authService.logout();
        this.router.navigate([this.authService.getLoginPage()]);
      }
      return this.handleErrors(err);
    })).pipe(share());
  }

  private handleErrors(error: any): Observable<any> {
    let errors: string[] = [];
    let msg: string = "";
    msg = "Status: " + error.status;
    msg += " - Status Text: " + error.statusText;
    // if (error.json()) {
    //   msg += " - Exception Message: " + error.json().exceptionMessage;
    // }
    errors.push(msg);
    console.error('An error occurred ', errors);
    return throwError(errors);
  }

}
