import { inject, Injectable, InjectionToken } from '@angular/core';

export const ENVIRONMENT = new InjectionToken<{ [key: string]: any }>('ENVIRONMENT');

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private _environment = inject(ENVIRONMENT, {
    optional: true
  }) || {};

  getValue(key: string, defaultValue?: any): any {
    return this._environment[key] || defaultValue;
  }

  setValue(key: string, value: any) {
    this._environment[key] = value;
  }

  get environment(): { [key: string]: any } {
    return this._environment;
  }
}
