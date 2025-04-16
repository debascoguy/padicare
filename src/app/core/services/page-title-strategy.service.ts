import { inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GlobalStore } from '../../../global.state';

@Injectable({
  providedIn: 'root'
})
export class PageTitleStrategyService extends TitleStrategy {
  private _title = inject(Title);
  private _globalStore = inject(GlobalStore);

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this._title.setTitle(`${title} | ${this._globalStore.pageTitle()}`);
    } else {
      this._title.setTitle(this._globalStore.pageTitle());
    }
  }

  override buildTitle(snapshot: RouterStateSnapshot): string {
    let title = '';
    let snapshotData = snapshot.root;
    while (snapshotData.firstChild !== null) {
      snapshotData = snapshotData.firstChild;
    }
    let data = this.sanitizeData(snapshotData.data, snapshotData.params);
    if (data && data.title) {
      title = data.title;
    }
    return title;
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
