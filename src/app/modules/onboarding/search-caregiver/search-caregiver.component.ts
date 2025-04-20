import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { CommonModule } from '@angular/common';
import { UserSummaryComponent } from '../../../shared/user-summary/user-summary.component';
import { CaptchaService } from '@app/core/services/captcha.service';

@Component({
  selector: 'app-search-caregiver',
  imports: [
    CommonModule,
    MatIconModule,
    UserSummaryComponent,
  ],
  providers: [
    MatSnackBar
  ],
  templateUrl: './search-caregiver.component.html',
  styleUrl: './search-caregiver.component.scss'
})
export class SearchCaregiverComponent {

  allUsers: Array<{
    firstName: string;
    lastName: string;
    profileImage: string;
    badgeColor: string;
    info: string;
    reviewText: string;
    userRating: number;
    address: { city: string };
    chargePerHour: number;
    yearsOfExperience: number;
  }> = [
      {
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

        address: { city: 'New York' },

        chargePerHour: 20,

        yearsOfExperience: 10,
      },
      {
        //Defaults Sample.
        firstName: "John",
        lastName: "Morrison",

        profileImage: "assets/img/john-morrison.png",
        badgeColor: "#E54545",

        info: "I am a compassionate and dedicated caregiver with 12 years of experience in providing personalized care to individuals of all ages. My approach focuses on fostering a safe, supportive",

        reviewText: "Brenda A. is an exceptional caregiver who goes above and beyond to provide compassionate and " +
          "professional care. Her attention to detail, patience, and ability to connect with those she cares for make her truly " +
          "stand out. Brenda is reliable, trustworthy, and always ensures the comfort and well-being of her clients. We highly " +
          "recommend her to anyone seeking dedicated and skilled caregiving services",

        userRating: 5,

        address: { city: 'New Jersey' },

        chargePerHour: 22,

        yearsOfExperience: 12,
      },
      {
        //Defaults Sample.
        firstName: "Zainab",
        lastName: "Ikhu",

        profileImage: "assets/img/sandra-michaels.png",
        badgeColor: "#7A5AF8",

        info: "I am a compassionate and dedicated caregiver with 12 years of experience in providing personalized care to individuals of all ages. My approach focuses on fostering a safe, supportive",

        reviewText: "Brenda A. is an exceptional caregiver who goes above and beyond to provide compassionate and " +
          "professional care. Her attention to detail, patience, and ability to connect with those she cares for make her truly " +
          "stand out. Brenda is reliable, trustworthy, and always ensures the comfort and well-being of her clients. We highly " +
          "recommend her to anyone seeking dedicated and skilled caregiving services",

        userRating: 5,

        address: { city: 'Oklahoma City' },

        chargePerHour: 21,

        yearsOfExperience: 11,
      }
    ];

  constructor(
    protected router: Router,
    protected authenticationService: AuthenticationService
  ) {
/**
 * TODO:
 * create landing page after login.
 * Then, work on the client search engine for caregiver
 */
  }

  handleFavorites(isLiked: boolean, user: any) {
    console.log("Is Liked: ", isLiked, user);
  }

  readMoreCallBack(isReadMore: boolean, user: any) {
    console.log("Is Read More: ", isReadMore, user);
  }

}
