import { Component, OnInit } from '@angular/core';
import { LayoutModule } from '../layouts/layout.module';
import { RouterOutlet } from '@angular/router';
import { HeaderType } from '../layouts/headers/header.type.enum';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  imports: [
    LayoutModule,
    RouterOutlet
  ],
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  get HeaderType() {
    return HeaderType;
  }
}
