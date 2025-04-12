import { afterNextRender, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RoutingStateService } from './core/services/routing-state.service';
import { filter } from 'rxjs';
import { InactivityTrackerService } from './core/services/inactivity-tracker.service';
import { ScreenLoaderService } from './core/services/screen-loader.service';
import { LogService } from './core/logger/LogService';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    // PageLoadingBarComponent,
    // ScreenLoaderComponent,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Padicare';

  loadingText = signal('Application Loading');
  pageLoaded = signal(false);

  private _platformId = inject(PLATFORM_ID);
  private _routingState = inject(RoutingStateService);
  private _inactivityTracker = inject(InactivityTrackerService);
  private _screenLoader = inject(ScreenLoaderService);
  private _router = inject(Router);
  private _logger = inject(LogService);

  constructor() {
    afterNextRender(() => {
      // Scroll a page to top if url changed
      this._router.events
        .pipe( filter(event=> event instanceof NavigationEnd) )
        .subscribe((event: any) => {
          window.scrollTo({
            top: 0,
            left: 0
          });
          setTimeout(() => {
            this._screenLoader.hide();
            this.pageLoaded.set(true);
          }, 2000);

          //Register the route
          this._routingState.registerRoute(event.urlAfterRedirects);
        });

      // this._analyticsService.trackPageViews();
      this._inactivityTracker.setupInactivityTimer()
        .subscribe(() => {
          this._logger.info('Inactive mode has been activated!', new Date());
          // Perfom some actions when user is inactive - e.g. logout or show a modal to keep session alive
          // this._inactivityTracker.reset();
        });
    });
  }

  sanitizeData(data: any, params: any) {
    for (const [field, value] of Object.entries(params)) {
      let reg = ":" + field;
      let valueData = <string>value;
      valueData = valueData.replace("-", " ").toUpperCase();

      if (data.title && data.title.indexOf(reg) > -1) {
        data.title = data.title.replace(reg, valueData);
      }

      if (data.breadcrumbs) {
        for (let i = 0; i < data.breadcrumbs.length; i++) {
          if (data.breadcrumbs[i].text && data.breadcrumbs[i].text.indexOf(reg) > -1) {
            data.breadcrumbs[i].text = data.breadcrumbs[i].text.replace(reg, valueData);
          }
          if (data.breadcrumbs[i].link && data.breadcrumbs[i].link.indexOf(reg) > -1) {
            data.breadcrumbs[i].link = data.breadcrumbs[i].link.replace(reg, valueData);
          }
        }
      }
    }
    return data;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      // setTimeout(() => {
      //   this.loadingText.set('Initializing Modules');
      // }, 1500);
    }
    // this._seoService.trackCanonicalChanges(this._envService.getValue('siteUrl'));
  }

}
