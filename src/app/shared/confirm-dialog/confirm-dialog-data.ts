export interface ConfirmDialogData {
  title: string;
  message: string;
  html?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  icon?: string; // Optional icon class for the dialog
  showCancelButton?: boolean; // Optional flag to show/hide cancel button
  showConfirmButton?: boolean; // Optional flag to show/hide confirm button
  customStyles?: { [key: string]: string }; // Optional custom styles for the dialog
  data?: any; // Optional data to pass to the dialog
}
