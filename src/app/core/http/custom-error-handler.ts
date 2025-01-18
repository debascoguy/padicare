// import {ErrorHandler, Injectable} from "@angular/core";
// import {Router} from "@angular/router";
// import { ToastService } from '@modules/bootstrap/toast/ToastService';
// import { AuthenticationService } from '../authentication/authentication.service';

// @Injectable({
//     providedIn: 'root'
// })
// export class CustomErrorHandler implements ErrorHandler {

//   static readonly REFRESH_PAGE_ON_TOAST_CLICK_MESSAGE: string = "An error occurred: Please click this message to refresh";
//   static readonly DEFAULT_ERROR_TITLE: string = "Something went wrong";
  
//   constructor(private router: Router, private authService: AuthenticationService, private toastr: ToastService){};
               

//   public handleError(error: any) {
//     console.error(error);
//     let httpErrorCode = error.httpErrorCode;
//     switch (httpErrorCode) {
//       case 401:
//           this.router.navigateByUrl(this.authService.getLoginPage());
//           break;
//       case 403:
//           this.router.navigateByUrl(this.authService.getLoginPage());
//           break;
//       case 400:
//          this.showError(error.message);
//           break;
//       default:
//          this.showError(CustomErrorHandler.REFRESH_PAGE_ON_TOAST_CLICK_MESSAGE);
//     }
//   }
  
//   private showError(message:string){
//     this.toastr.showDanger(message, CustomErrorHandler.DEFAULT_ERROR_TITLE);
//   }
// }