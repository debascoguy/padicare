import { MatSnackBarConfig } from "@angular/material/snack-bar";
import { SnackBarParams } from "./SnackBarParams";


export class ToastsConfig {

  static defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    duration: 4000
  };

  static getErrorConfig(error: any, headerTitle: string, defaultMessage: string) {
    return {
      ...ToastsConfig.defaultConfig,
      data: {
        type: "DANGER",
        headerTitle: headerTitle || "Error",
        message: error?.error?.message || error?.message || defaultMessage,
      } as SnackBarParams
    }
  }

  static getWarningConfig(headerTitle: string, message: string) {
    return {
      ...ToastsConfig.defaultConfig,
      data: {
        type: "WARNING",
        headerTitle: headerTitle || "Warning",
        message: message,
      } as SnackBarParams
    }
  }

  static getInfoConfig(headerTitle: string, message: string) {
    return {
      ...ToastsConfig.defaultConfig,
      data: {
        type: "INFO",
        headerTitle: headerTitle || "Info",
        message: message,
      } as SnackBarParams
    }
  }

  static getSuccessConfig(headerTitle: string, message: string) {
    return {
      ...ToastsConfig.defaultConfig,
      data: {
        type: "SUCCESS",
        headerTitle: headerTitle || "Success",
        message: message,
      } as SnackBarParams
    }
  }

}
