import { Injectable } from '@angular/core';
import { User, UserAddress } from '../models/user';
import { LoginContext } from '../models/login-context.model';
import { SecuredLocalStorage } from '../services/SecuredLocalStorage';
import { SecuredSessionStorage } from '../services/SecuredSessionStorage';
import { AppUserType } from '@app/enums/app.user.type.enum';


const credentialsKey = 'credentials';
const refreshTokenKey = "refreshToken"

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: LoginContext | null = null;

  constructor(
    protected securedLocalStorage: SecuredLocalStorage,
    protected securedSessionStorage: SecuredSessionStorage
  ) {
    const savedCredentials = securedSessionStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  isLoggedIn() {
    return this.isAuthenticated() && this.token ? true : false;
  }

  hasAuthority(authority: string) {
    return this.credentials?.authorities?.map((x: string) => x.toLowerCase()).includes(authority.toLowerCase());
  }

  isAdmin() {
    return this.isLoggedIn() ? this.hasAuthority('ADMIN') : false;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): LoginContext | null {
    return this._credentials;
  }

  get id() {
    return this.user?.id;
  }

  get user(): User {
    return !!this.credentials ? this.credentials.user : {} as User;
  }

  get userAddress(): UserAddress {
    return !!this.credentials && this.credentials.userAddress ? this.credentials.userAddress : {} as UserAddress;
  }

  get userPreference(): any {
    return !!this.credentials ? this.credentials?.userPreferences : {};
  }

  get clientPreference(): any {
    return !!this.credentials ? this.credentials?.clientPreferences : {};
  }

  get activePortal(): AppUserType | null | undefined {
    return !!this.credentials ? this.credentials?.activePortal : null;
  }

  get profileImage() {
    if (!!this.credentials) {
      return !!this.credentials.profileImage ? this.credentials.profileImage : "./assets/images/avatars/1.jpg";
    }
    else {
      return "./assets/images/avatars/1.jpg";
    }
  }

  get userNameAcronym() {
    if (!!this.credentials) {
      return this.user?.firstName?.charAt(0) + this.user?.lastName?.charAt(0);
    }
    return "";
  }

  get authorities(): string[] {
    return !!this.credentials ? this.credentials.authorities : [];
  }

  get token(): string | null {
    return !!this.credentials ? this.credentials.token : null;
  }

  get refreshToken(): string | null {
    return !!this.credentials ? this.credentials.refreshToken : null;
  }

  set refreshToken(token: string) {
    this.securedLocalStorage.setItem(refreshTokenKey, token);
  }

  /**
   * Update the user credentials.
   * Mostly needed if user changed username and needs to update it in loginContext
   * @param credentials The user credentials.
   */
  updateCredentials(credentials?: LoginContext) {
    this.securedSessionStorage.setItem(credentialsKey, JSON.stringify(credentials));
    this._credentials = credentials || null;
  }

  updateCredentialsField(field: string, value: any) {
    let credentials = this.credentials;
    if (!credentials) {
      return ;
    }
    if (field == refreshTokenKey) {
      this.refreshToken = value;
    } else {
      credentials[field] = value;
      this.updateCredentials(credentials);
    }
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: LoginContext, remember?: boolean) {
    this._credentials = credentials || null;
    if (credentials) {
      this.securedSessionStorage.setItem(credentialsKey, JSON.stringify(credentials));
      if (remember) {
        this.refreshToken = credentials.refreshToken;
      }
    } else {
      this.securedSessionStorage.removeItem(credentialsKey);
    }
  }


  clearCredentials() {
    this.securedSessionStorage.clear();
    this.securedLocalStorage.clear();
  }

}
