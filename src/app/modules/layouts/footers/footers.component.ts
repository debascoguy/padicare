import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FooterType } from './footer.type';

@Component({
  selector: 'padicare-basic-footers',
  templateUrl: './footers.component.html',
  styleUrls: ['./footers.component.scss'],
  imports: [CommonModule]
})
export class FootersComponent implements OnInit {

  currentYear: number;

  @Input() isFixed: boolean  = false;

  @Input() footerType = FooterType.PRIMARY;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
  }

  get footerClass() {
    let fClass = 'text-center p-2 ' + this.footerType;
    if (this.isFixed) {
      fClass += 'footer-fixed';
    }
    return fClass;
  }

  getIconColor(footerType: FooterType) {
    switch (footerType) {
      case FooterType.DARK:
        return 'text-light';
      case FooterType.LIGHT:
        return 'text-dark';
      case FooterType.PRIMARY:
        return 'text-light';
      default:
        return 'text-dark';
    }
  }

}
