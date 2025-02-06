import { Component } from '@angular/core';
import { LogService } from '../../core/logger/LogService';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layouts/layout.module';
import { HeaderType } from '../layouts/headers/header.type.enum';

//Admin Pages Layout Component
@Component({
  selector: 'app-admin',
  imports: [LayoutModule, RouterOutlet],
  providers: [],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {

  constructor(public logger: LogService) {
    this.logger.info('Admin Page Layouts!');
  }

  get HeaderType() {
    return HeaderType;
  }
}
