import { Component, Input, OnInit } from '@angular/core';
import { HeaderType } from './header.type.enum';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
  imports: [NgIf]
})
export class HeadersComponent implements OnInit {

  @Input() headerType: HeaderType = HeaderType.LANDING;

  constructor() { }

  ngOnInit() {
  }

  get HeaderType() {
    return HeaderType;
  }

}
