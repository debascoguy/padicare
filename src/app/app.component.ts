import { Component } from '@angular/core';
import { ChildActivationEnd, Router, RouterOutlet } from '@angular/router';
import { LogService } from './core/logger/LogService';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RoutingStateService } from './core/services/RoutingState.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Padicare';

  constructor(
    private titleService: Title,
    public router: Router,
    public routingState: RoutingStateService,
    public log: LogService
  ) {
    this.log.info(this.title + ' Says Hello!');
    this.router.events
      .pipe(filter((event: any) => event instanceof ChildActivationEnd))
      .subscribe(event => {
        let snapshot = (event as ChildActivationEnd).snapshot;
        while (snapshot.firstChild !== null) {
          snapshot = snapshot.firstChild;
        }
        let data = this.sanitizeData(snapshot.data, snapshot.params);
        this.titleService.setTitle(data.title || this.title);
      });
    this.routingState.loadRouting();
  }

  onActivate(event: any) {
    window.scroll(0, 0);
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

}
