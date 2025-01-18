"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CredentialsService = void 0;
var core_1 = require("@angular/core");
var credentialsKey = 'credentials';
/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
var CredentialsService = /** @class */ (function () {
    function CredentialsService(sessionManagements) {
        this.sessionManagements = sessionManagements;
        this._credentials = null;
        var savedCredentials = this.sessionManagements.getItem(credentialsKey);
        if (savedCredentials) {
            this._credentials = JSON.parse(savedCredentials);
        }
    }
    /**
     * Checks is the user is authenticated.
     * @return True if the user is authenticated.
     */
    CredentialsService.prototype.isAuthenticated = function () {
        return !!this.credentials;
    };
    CredentialsService.prototype.isLoggedIn = function () {
        return this.isAuthenticated() && this.sessionManagements.getItem('accessToken') ? true : false;
    };
    CredentialsService.prototype.hasAuthority = function (authority) {
        var _a;
        return (_a = this.credentials) === null || _a === void 0 ? void 0 : _a.authorities.map(function (x) { return x.toLowerCase(); }).includes(authority.toLowerCase());
    };
    CredentialsService.prototype.isAdmin = function () {
        return this.isLoggedIn() ? this.hasAuthority('ADMIN') : false;
    };
    Object.defineProperty(CredentialsService.prototype, "credentials", {
        /**
         * Gets the user credentials.
         * @return The user credentials or null if the user is not authenticated.
         */
        get: function () {
            return this._credentials;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CredentialsService.prototype, "user", {
        get: function () {
            return !!this.credentials ? this.credentials.user : {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CredentialsService.prototype, "profileImage", {
        get: function () {
            if (!!this.credentials) {
                return !!this.credentials.profileImage ? this.credentials.profileImage : "./assets/images/avatars/1.jpg";
            }
            else {
                return "./assets/images/avatars/1.jpg";
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CredentialsService.prototype, "authorities", {
        get: function () {
            return !!this.credentials ? this.credentials.authorities : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CredentialsService.prototype, "token", {
        get: function () {
            return !!this.credentials ? this.credentials.token : null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Update the user credentials.
     * Mostly needed if user changed username and needs to update it in loginContext
     * @param credentials The user credentials.
     */
    CredentialsService.prototype.updateCredentials = function (credentials) {
        this.sessionManagements.setItem(credentialsKey, JSON.stringify(credentials));
        this._credentials = credentials || null;
    };
    CredentialsService.prototype.updateCredentialsField = function (field, value) {
        var credentials = this.credentials;
        if (!!credentials) {
            credentials[field] = value;
            this.updateCredentials(credentials);
        }
    };
    /**
     * Sets the user credentials.
     * The credentials may be persisted across sessions by setting the `remember` parameter to true.
     * Otherwise, the credentials are only persisted for the current session.
     * @param credentials The user credentials.
     * @param remember True to remember credentials across sessions.
     */
    CredentialsService.prototype.setCredentials = function (credentials, remember) {
        this._credentials = credentials || null;
        if (credentials) {
            this.sessionManagements.setItem(credentialsKey, JSON.stringify(credentials));
        }
        else {
            this.sessionManagements.removeItem(credentialsKey);
        }
    };
    CredentialsService.prototype.clearStorage = function () {
        this.sessionManagements.clear();
    };
    CredentialsService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CredentialsService);
    return CredentialsService;
}());
exports.CredentialsService = CredentialsService;
