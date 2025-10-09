import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ReloadComponent {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  reload(self: boolean, urlToNavigateTo?: string) {
    const url = self ? this.router.url : urlToNavigateTo;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
        // console.log(`After navigation I am on:${this.router.url}`);
      });
    });
  }

  reloadComponent(self: boolean, urlToNavigateTo?: string) {
    this.reload(self, urlToNavigateTo);
  }

  reloadPage() {
    window.location.reload();
  }

  removeQueryParams(queryParams: any = {}) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams, // if empty --> Clears all query parameters
      queryParamsHandling: 'merge' // Optional: controls how query params are handled
    });
  }

}
