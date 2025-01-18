import { Component } from '@angular/core';
import { LogService } from '../../core/logger/LogService';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Admin Pages Layout Component
@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet],
  providers: [],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(public logger: LogService) {
    this.logger.info('Admin Page Layouts!');
  }

}
