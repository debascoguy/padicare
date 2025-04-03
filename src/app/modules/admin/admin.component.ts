import { MatIcon } from '@angular/material/icon';
import { Component } from '@angular/core';
import { LogService } from '../../core/logger/LogService';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-admin',
  imports: [MatCardModule, MatIcon],
  providers: [],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {

  constructor(public logger: LogService) {
    this.logger.info('Admin Page Layouts!');
  }

}
