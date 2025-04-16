import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutModule } from '../layouts/layout.module';
import { HeaderType } from '../layouts/headers/header.type.enum';

@Component({
  selector: 'app-client',
  imports: [
    LayoutModule,
    RouterOutlet
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  get HeaderType() {
    return HeaderType;
  }
  
}
