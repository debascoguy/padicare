import { inject, Injectable } from '@angular/core';
import { GlobalStore } from '../../../global.state';

@Injectable({
  providedIn: 'root'
})
export class ScreenLoaderService {
  private _globalStore = inject(GlobalStore);

  show(): void {
    console.log(this._globalStore);
    this._globalStore.setScreenLoading(true);
  }

  hide(): void {
    this._globalStore.setScreenLoading(false);
  }
}
