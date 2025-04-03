import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common'
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RoutingStateService {

  private history: string[] = [];

  constructor(private router: Router, private location: Location) {
  }

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.registerRoute(event.urlAfterRedirects);
      });
  }

  registerRoute(urlAfterRedirects: string): void {
    this.history.push(urlAfterRedirects);
  }

  back(routerLink?: any): void {
    if (!!routerLink) {
      this.router.navigate(routerLink);
    }
    else{
      if (this.history.length > 0) {
        this.goBack();
      }
      else{
        this.location.back();
      }
    }
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getCurrentUrl(): string {
    return this.history[this.history.length - 1] || environment.baseURL;
  }

  public goBack() {
    this.history.pop();
    this.router.navigate([this.getCurrentUrl()], { replaceUrl: true });
  }

}
