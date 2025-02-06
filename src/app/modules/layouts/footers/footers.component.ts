import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footers',
  templateUrl: './footers.component.html',
  styleUrls: ['./footers.component.scss'],
  imports: [CommonModule]
})
export class FootersComponent implements OnInit {

  currentYear: number;

  @Input() isFixed: boolean  = false;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
  }

}
