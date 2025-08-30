import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerts',
  imports: [
    NgIf
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertsComponent {

  @Input() message: string = "This is an alert message and it can be an html content";

  @Input() type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING' | 'PRIMARY' | 'SECONDARY' | 'DARK' | 'LIGHT' = 'INFO';

  @Input() isDismissible: boolean = true;

  @Input() additionalClasses: string = "";

  private typeToClassMap: { [key: string]: string } = {
    'SUCCESS': 'alert-success',
    'ERROR': 'alert-danger',
    'INFO': 'alert-info',
    'WARNING': 'alert-warning',
    'PRIMARY': 'alert-primary',
    'SECONDARY': 'alert-secondary',
    'DARK': 'alert-dark',
    'LIGHT': 'alert-light'
  };

  get alertClass() {
    return 'alert ' +
    (this.typeToClassMap[this.type] || this.typeToClassMap['INFO']) +
    (this.isDismissible ? ' alert-dismissible text-white' : '') +
    ' ' + this.additionalClasses;
  }

}
