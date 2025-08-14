import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { CredentialsService } from './credentials.service';
import { NumberToWord } from '../services/NumberToWord';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { HttpHeadersHelpers } from '../http/HttpHeadersHelpers';
import { AppUserType } from '@app/shared/enums/app.user.type.enum';
import { ApiResponse } from '../models/api-repsonse';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient
  ) {}

  getCredentialsService(): CredentialsService {
    return this.credentialsService;
  }

  getLoginPage() {
    return "/auth/login";
  }

  fetchUserProfileImage() {
    this.httpClient.get("/document/profile-image").subscribe((response: any) => {
      if (response.status && response.code == 200) {
        let files = response.data;
        files.label = files.doc_info.replaceAll("_", " ");
        files.fileSize = NumberToWord.humanFileSize(files.file_size, false, 2);
        const imgSrc = 'data:' + files.file_type + ';base64,' + files.url;
        this.credentialsService.updateCredentialsField('profileImage', imgSrc);
      }
    });
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: any, remember: boolean): Observable<any> {
    return this.httpClient.post("/access/auth/login", context).pipe(
      map((response: any) => {
        if (response.status) {
          response.data.activePortal = response.data.user.userType;
          this.credentialsService.setCredentials(response.data, remember);
        }
        return response;
      })
    );
  }

  resetPassword(context: {email: string, resetPasswordUrl: string}): Observable<any> {
    return this.httpClient.post("/access/auth/reset-password", context);
  }

  changePassword(context: {token: string, newPassword: string}): Observable<any> {
    const headers = HttpHeadersHelpers.getAuthorization(context.token);
    return this.httpClient.post("/access/auth/change-password", { newPassword: context.newPassword }, { headers });
  }

  updatePassword(newPassword: string): Observable<any> {
    return this.httpClient.post("/access/auth/change-password", { newPassword });
  }

  renewToken() {
    return this.httpClient.get(environment.renewTokenUrl).pipe(
      map((response: any) => {
        if (response.status) {
          this.credentialsService.setCredentials(response.data, true);
        }
        return response;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  validateEmail(userType: AppUserType, email: string) {
    return this.httpClient.get(`/access/auth/validate/email/${userType}/${email}`);
  }

  register(context: any): Observable<any> {
    return this.httpClient.post("/access/auth/register", context).pipe(
      map((response: any) => {
        if (!!response.status) {
          this.credentialsService.updateCredentials(response.data);
        }
        return response;
      }));
  }

  registerClient(context: any) {
    return this.httpClient.post('/access/auth/register/client', context).pipe(
      map((response: any) => {
        if (!!response.status) {
          this.credentialsService.setCredentials(response.data, true);
        }
        return response;
      }));
  }

  registerCaregiver(context: any) {
    return this.httpClient.post('/access/auth/register/caregiver', context).pipe(
      map((response: any) => {
        if (!!response.status) {
          this.credentialsService.setCredentials(response.data, true);
        }
        return response;
      }));
  }

  saveUserAddress(address: any) {
     return this.httpClient.post<ApiResponse>('/access/onboarding/user/address', address).pipe(
      map((response: any) => {
        if (!!response.status) {
          this.credentialsService.updateCredentialsField('userAddress', response.data);
        }
        return response;
      }));
  }

  verifyEmail(token : string) {
    const headers = HttpHeadersHelpers.getAuthorization(token);
    return this.httpClient.get("/access/onboarding/verify/email", { headers }).pipe(
      map((response: any) => {
        if (!!response.status) {
          this.credentialsService.setCredentials(response.data, true);
        }
        return response;
      }));
  }

  verifyPhone(token : string) {
    const headers = HttpHeadersHelpers.getAuthorization(token);
    return this.httpClient.get("/access/onboarding/verify/phone", { headers }).pipe(
      map((response: any) => {
        if (!!response.status) {
          this.credentialsService.setCredentials(response.data, true);
        }
        return response;
      }));
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    if (this.isLoggedIn()) {
      this.httpClient.get("/access/auth/logout").pipe(finalize(() => {
        this.credentialsService.clearCredentials();
        return of(true);
      })).subscribe((response: any) => {
        this.credentialsService.clearCredentials();
      });
      return of(true);
    }
    else {
      this.credentialsService.clearCredentials();
      return of(true);
    }
  }

  isLoggedIn() {
    return this.credentialsService.isLoggedIn();
  }

}
