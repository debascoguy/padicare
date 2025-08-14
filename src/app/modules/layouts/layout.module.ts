import { NgModule } from '@angular/core';
import { HeadersComponent } from './headers/headers.component';
import { FootersComponent } from './footers/footers.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';

const allComponent = [
  HeadersComponent,
  FootersComponent,
  SideNavbarComponent
];

@NgModule({
  imports: allComponent,
  declarations: [],
  exports: allComponent
})
export class LayoutModule { }
