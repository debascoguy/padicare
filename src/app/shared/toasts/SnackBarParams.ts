
export class SnackBarParams {

  public type: 'SUCCESS' | 'INFO' | 'WARNING' | 'DANGER' = "INFO";

  public headerTitle: string = "Material Dashboard"

  public message: string = "Hello, world! This is a notification message."

  public headerSecondaryLabel: string = "" // e.g: 11 mins ago
}