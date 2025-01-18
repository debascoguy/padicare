import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Landing Pages Layout Component
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [MatSnackBar],
})
export class LandingComponent implements OnInit {

  constructor(protected _snackBar: MatSnackBar, private modalService: NgbModal) { }

  ngOnInit() {
    this._snackBar.open("Testing - Hello World!", 'close', {duration: 3000});
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

}
