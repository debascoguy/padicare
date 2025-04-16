import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutModule } from '../layouts/layout.module';
import { HeaderType } from '../layouts/headers/header.type.enum';

@Component({
  selector: 'app-caregiver',
  imports: [
    LayoutModule,
    RouterOutlet
  ],
  templateUrl: './caregiver.component.html',
  styleUrl: './caregiver.component.scss'
})
export class CaregiverComponent {

  get HeaderType() {
    return HeaderType;
  }

}
