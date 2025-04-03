import { Component, OnInit } from '@angular/core';
import { LayoutModule } from '../layouts/layout.module';
import { RouterOutlet } from '@angular/router';
import { HeaderType } from '../layouts/headers/header.type.enum';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [
    LayoutModule,
    RouterOutlet
  ],
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  get HeaderType() {
    return HeaderType;
  }
}
