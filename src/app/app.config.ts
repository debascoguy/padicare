import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptorService } from './core/http/http-interceptor';
import { LogService } from './core/logger/LogService';
import { LogPublishersService } from './core/logger/LogPublishersService';
import { ENVIRONMENT, EnvironmentService } from './core/services/environment.service';
import { environment } from '../environments/environments';
import { PageTitleStrategyService } from './core/services/page-title-strategy.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@angular/material/core';
import { GlobalStore } from '../global.state';
import { LayoutSidebarStore } from './modules/layouts/layout.store';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { CaptchaService } from './core/services/captcha.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, TitleCasePipe } from '@angular/common';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    // provideHttpClient(withFetch()), importProvidersFrom(MatNativeDateModule), importProvidersFrom(MatSnackBarModule),
    provideStore(),
    provideNativeDateAdapter(),
    provideAppInitializer(() => {
      const envService = inject(EnvironmentService);
      const globalStore = inject(GlobalStore);
      const layoutSidebarStore = inject(LayoutSidebarStore);
      return new Promise((resolve, reject) => {
        layoutSidebarStore.showSidebarVisibility('root', true); // show or hide main sidebar on initial state
        globalStore.setPageTitle(envService.getValue('pageTitle'));
        resolve(true);
      });
    }),
    MatSnackBar,
    DatePipe,
    TitleCasePipe,
    provideNativeDateAdapter(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: ENVIRONMENT,
      useValue: environment
    },
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategyService
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.invisibleCaptchaClientSideKey,
        size: 'invisible',
      } as RecaptchaSettings,
    },
    CaptchaService,
    LogService,
    LogPublishersService
  ]
};
