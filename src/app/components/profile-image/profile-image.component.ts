import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
  imports: [NgIf]
})
export class ProfileImageComponent implements OnInit {

  @Input() size: 'XSMALL' | 'SMALL' | 'NORMAL' | 'LARGE' | 'XLARGE' = 'NORMAL'; //Default to NORMAL
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() badgeColor: string = '#E54545';

  constructor() {
  }

  ngOnInit(): void {
  }

  get badgeStyle() {
    return "color: " + this.badgeColor + ";" +
            "--fa-border-color: white;--fa-border-radius: 100%;--fa-border-width: 0.2em;--fa-border-padding: none;";
  }
}
