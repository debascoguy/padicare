"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthenticationService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var NumberToWord_1 = require("../services/NumberToWord");
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(credentialsService, sessionManagements, apiService) {
        this.credentialsService = credentialsService;
        this.sessionManagements = sessionManagements;
        this.apiService = apiService;
        this.apiService.suppressAlertError = true;
    }
    AuthenticationService.prototype.getCredentialsService = function () {
        return this.credentialsService;
    };
    AuthenticationService.prototype.getLoginPage = function () {
        return "/";
    };
    AuthenticationService.prototype.fetchUserProfileImage = function () {
        var _this = this;
        this.apiService.get("/document/profile-image").subscribe(function (response) {
            if (response.status && response.code == 200) {
                var files = response.data;
                files.label = files.doc_info.replaceAll("_", " ");
                files.fileSize = NumberToWord_1.NumberToWord.humanFileSize(files.file_size, false, 2);
                var imgSrc = 'data:' + files.file_type + ';base64,' + files.url;
                _this.credentialsService.updateCredentialsField('profileImage', imgSrc);
            }
        });
    };
    /**
     * Authenticates the user.
     * @param context The login parameters.
     * @return The user credentials.
     */
    AuthenticationService.prototype.login = function (context, remember) {
        var _this = this;
        return this.apiService.post("/auth/login", context).pipe(operators_1.map(function (response) {
            _this.sessionManagements.setItem('accessToken', response.token);
            _this.credentialsService.setCredentials(response, remember);
            return response;
        }), operators_1.catchError(function (error) {
            return rxjs_1.of(error);
        }));
    };
    AuthenticationService.prototype.register = function (context) {
        var _this = this;
        return this.apiService.post("/auth/create-user", context).pipe(operators_1.map(function (response) {
            if (!!response.status && response.code == 200) {
                _this.sessionManagements.setItem('accessToken', response.token);
                _this.credentialsService.setCredentials(response, false);
            }
            return response;
        }), operators_1.catchError(function (error) {
            return rxjs_1.of(error);
        }));
    };
    /**
     * Logs out the user and clear credentials.
     * @return True if the user was logged out successfully.
     */
    AuthenticationService.prototype.logout = function () {
        var _this = this;
        if (this.isLoggedIn()) {
            this.apiService.get("/auth/logout").pipe(operators_1.finalize(function () {
                _this.credentialsService.setCredentials();
                _this.credentialsService.clearStorage();
                return rxjs_1.of(true);
            })).subscribe(function (response) {
                _this.credentialsService.setCredentials();
                _this.credentialsService.clearStorage();
            });
            return rxjs_1.of(true);
        }
        else {
            this.credentialsService.setCredentials();
            this.credentialsService.clearStorage();
            return rxjs_1.of(true);
        }
    };
    AuthenticationService.prototype.isLoggedIn = function () {
        return this.credentialsService.isLoggedIn();
    };
    AuthenticationService.prototype.getLandingPage = function () {
        var _a, _b;
        var authorities = (_b = (_a = this.credentialsService) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.authorities;
        if (authorities === null || authorities === void 0 ? void 0 : authorities.includes("LOGIN")) {
            if (authorities === null || authorities === void 0 ? void 0 : authorities.includes("ADMIN")) {
                return '/admin/user-management';
            }
            else {
                return '/fx/dashboard';
            }
        }
        else {
            return '/auth/login';
        }
    };
    AuthenticationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
