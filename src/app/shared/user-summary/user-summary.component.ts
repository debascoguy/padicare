import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
import { ProfileImageComponent } from '../profile-image/profile-image.component';
import { StarRatingsComponent } from '../star-ratings/star-ratings.component';
import { UserAddress } from '../../core/models/user';

@Component({
  selector: 'app-user-summary',
  imports: [
    CommonModule,
    MatIconModule,
    ProfileImageComponent,
    StarRatingsComponent,
    TruncatePipe
  ],
  templateUrl: './user-summary.component.html',
  styleUrl: './user-summary.component.scss'
})
export class UserSummaryComponent {

  liked: boolean = false;
  readMore: boolean = false;

  @Output() isLiked = new EventEmitter<boolean>();
  @Output() isReadMore = new EventEmitter<boolean>();

  @Input() user: {
    firstName: string,
    lastName: string,
    profileImage: string,
    address: UserAddress,
    badgeColor: string,
    info: string,
    reviewText: string,
    userRating: number,
    chargePerHour: number,
    yearsOfExperience: number,
  } = {
    //Defaults Sample.
    firstName: "Brenda",
    lastName: "Aina",

    profileImage: "assets/img/sandra-michaels.png",
    badgeColor: "#7A5AF8",

    info: "I am a compassionate and dedicated caregiver with 12 years of experience in providing personalized care to individuals of all ages. My approach focuses on fostering a safe, supportive",

    reviewText: "Brenda A. is an exceptional caregiver who goes above and beyond to provide compassionate and " +
    "professional care. Her attention to detail, patience, and ability to connect with those she cares for make her truly " +
    "stand out. Brenda is reliable, trustworthy, and always ensures the comfort and well-being of her clients. We highly " +
    "recommend her to anyone seeking dedicated and skilled caregiving services",

    userRating: 5,

    address: {city: 'New York'},

    chargePerHour: 20,

    yearsOfExperience: 10,
  };

  toggleLike() {
    this.liked = !this.liked;
    this.isLiked.emit(this.liked);
  }

  toggleReadMore() {
    this.readMore = !this.readMore;
    this.isReadMore.emit(this.readMore);
  }


}
