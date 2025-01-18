import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { LoginContext } from '../models/login-context.model';


const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
    providedIn: 'root',
})
export class CredentialsService {
    private _credentials: LoginContext | null = null;

    constructor() {
        const savedCredentials = sessionStorage.getItem(credentialsKey);
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
        return this.isAuthenticated() && sessionStorage.getItem('token') ? true : false;
    }

    hasAuthority(authority:string){
        return this.credentials?.authorities.map((x: string) => x.toLowerCase()).includes(authority.toLowerCase());
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

    get user(): User {
        return !!this.credentials ? this.credentials.user : {} as User;
    }

    get profileImage() {
        if (!!this.credentials){
            return !!this.credentials.profileImage ? this.credentials.profileImage : "./assets/images/avatars/1.jpg";
        }
        else{
            return "./assets/images/avatars/1.jpg";
        }
    }

    get authorities(): string[] {
        return !!this.credentials ? this.credentials.authorities : [];
    }

    get token(): string|null {
        return !!this.credentials ? this.credentials.token : null;
    }

    get refeshToken(): string|null {
      return !!this.credentials ? this.credentials.refreshToken : null;
  }

    /**
     * Update the user credentials.
     * Mostly needed if user changed username and needs to update it in loginContext
     * @param credentials The user credentials.
     */
    updateCredentials(credentials?: LoginContext) {
        sessionStorage.setItem(credentialsKey, JSON.stringify(credentials));
        this._credentials = credentials || null;
    }

    updateCredentialsField(field: string, value: any) {
        let credentials = this.credentials;
        if (!!credentials) {
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
            sessionStorage.setItem(credentialsKey, JSON.stringify(credentials));
        } else {
            sessionStorage.removeItem(credentialsKey);
        }
    }


    clearStorage() {
        sessionStorage.clear();
    }

}
