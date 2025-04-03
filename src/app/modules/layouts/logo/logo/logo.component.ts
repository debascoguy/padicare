import { Component, input } from '@angular/core';
import { LogoAppearance } from '../types';

@Component({
  selector: 'padicare-logo,[padicare-logo]',
  exportAs: 'padicareLogo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  host: {
    'class': 'padicare-logo',
    '[class.is-text]': 'appearance() === "text"',
    '[class.is-image]': 'appearance() === "image"',
  }
})
export class LogoComponent {
  appearance = input<LogoAppearance>('text');

}
