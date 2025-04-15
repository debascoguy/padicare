import { Injectable } from "@angular/core";
import { RecaptchaErrorParameters } from "ng-recaptcha";

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {

  public captchaResponse = "";

  public submitCallBack!: Function;

  constructor() {}

  public setSubmitCallback(submitCallBack: Function) {
    this.submitCallBack = submitCallBack;
  }

  public getSubmitCallback() {
    return this.submitCallBack;
  }

  public resolved(captchaResponse: string | null): void {
    this.captchaResponse = captchaResponse ? `${JSON.stringify(captchaResponse)}\n` : "";
    this.submitCallBack();
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    this.captchaResponse = `ERROR; error details (if any) have been logged to console\n`;
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

}