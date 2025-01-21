import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptorService } from './core/http/http-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';import { LogService } from './core/logger/LogService';
import { LogPublishersService } from './core/logger/LogPublishersService';


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    LogService,
    LogPublishersService
  ]
};
