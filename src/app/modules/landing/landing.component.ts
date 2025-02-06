import { HeaderType } from './../layouts/headers/header.type.enum';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileImageComponent } from '../../components/profile-image/profile-image.component';
import { StarRatingsComponent } from '../../components/star-ratings/star-ratings.component';
import { LayoutModule } from '../layouts/layout.module';
import { NgIf } from '@angular/common';
import * as zipcodes from 'zipcodes';
import { Router } from '@angular/router';

//Landing Pages Layout Component
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [
    NgbModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule,
    ProfileImageComponent,
    StarRatingsComponent
  ],
  providers: [MatSnackBar]
})
export class LandingComponent implements OnInit {

  form: FormGroup;
  zipCodeInfo: zipcodes.ZipCode | null = null;
  isSubmitted: boolean = false;

  errorMessage: string = "City not found. Please check zipcode and try again";

  constructor(
    protected _snackBar: MatSnackBar, 
    private modalService: NgbModal,
    private router: Router
  ) {
    this.form = new FormGroup({
      longitude: new FormControl(0, [Validators.required, Validators.nullValidator]),
      latitude: new FormControl(0, [Validators.required, Validators.nullValidator]),
      zipcode: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    });
   }

  ngOnInit() {
  }

  clear() {
    this.isSubmitted = false;
    this.form.reset();
  }

  get zipcode() {
    return this.form.get('zipcode');
  }

  search() {
    if (this.zipcode?.invalid) {
      this.isSubmitted = false;
      return;
    }
    this.zipCodeInfo = zipcodes?.lookup(this.zipcode?.value) || null;
    this.form.get('city')?.setValue('');
    this.form.get('state')?.setValue('');
    this.form.get('country')?.setValue('');
    this.form.get('longitude')?.setValue(null);
    this.form.get('latitude')?.setValue(null);
    if (this.zipCodeInfo) {
      this.form.patchValue(this.zipCodeInfo);
      this.form.updateValueAndValidity();
    }
  }

  getStarted() {
    this.isSubmitted = true;
    if (this.form.valid) {
      sessionStorage.setItem('getStarted', JSON.stringify(this.form.value));
      this.router.navigate(['/onboarding']);
    } else {
      this._snackBar.open(this.errorMessage, 'close', {duration: 3000})
      .afterDismissed().subscribe((_) => {
        this.clear();
      });
    }
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  get HeaderType() {
    return HeaderType;
  }

}
