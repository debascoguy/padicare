import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { CredentialsService } from './credentials.service';
import { NumberToWord } from '../services/NumberToWord';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { environment } from '../../../environments/environments';

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
    return "/";
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
    return this.httpClient.post("/auth/login", context).pipe(
      map((response: any) => {
        this.credentialsService.setCredentials(response.data, remember);
        return response;
      }),
      catchError(error => {
        return of(error);
      })
    );
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

  register(context: any): Observable<any> {
    return this.httpClient.post("/auth/create-user", context).pipe(
      map((response: any) => {
        if (!!response.status && response.code == 200) {
          console.log(response.data);
          this.credentialsService.setCredentials(response.data, false);
        }
        return response;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  registerClient(context: any) {
    return this.httpClient.post('/auth/register/client', context).pipe(
      map((response: any) => {
        if (!!response.status) {
          this.credentialsService.setCredentials(response.data, true);
        }
        return response;
      }),
      catchError(error => {
        return of(error);
      })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    if (this.isLoggedIn()) {
      this.httpClient.get("/auth/logout").pipe(finalize(() => {
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

  getLandingPage() {
    const authorities = this.credentialsService?.credentials?.authorities;
    if (authorities?.includes("LOGIN")) {
      if (authorities?.includes("ADMIN")) {
        return '/admin/user-management';
      }
      else {
        return '/client/dashboard';
      }
    }
    else {
      return '/auth/login';
    }
  }

}
