import { Component, inject, Input, OnInit } from '@angular/core';
import { HeaderType } from './header.type.enum';
import { CommonModule, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LayoutApiService } from '../layout-api.service';
import { MatDivider } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'padicare-basic-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
  imports: [CommonModule, NgIf, MatMenuModule, MatIcon, MatDivider]
})
export class HeadersComponent implements OnInit {

  @Input() headerType: HeaderType = HeaderType.LANDING;

  @Input() isFixed: boolean  = true;

  public layoutApi = inject(LayoutApiService);

  constructor() {
  }

  pageReload() {
    window.location.reload();
  }

  ngOnInit() {
  }

  get HeaderType() {
    return HeaderType;
  }

}
