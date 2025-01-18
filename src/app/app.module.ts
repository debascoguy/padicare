import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpInterceptorService } from './core/http/http-interceptor';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LogService } from './core/logger/LogService';
import { LogPublishersService } from './core/logger/LogPublishersService';
import { RouterOutlet } from '@angular/router';

// Angular Material

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    AppComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    LogService,
    LogPublishersService
  ],
})

export class AppModule {
}
