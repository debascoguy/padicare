import { NgModule } from '@angular/core';
import { HeadersComponent } from './headers/headers.component';
import { FootersComponent } from './footers/footers.component';

const allComponent = [
  HeadersComponent,
  FootersComponent
];

@NgModule({
  imports: allComponent,
  declarations: [],
  exports: allComponent
})
export class LayoutModule { }
