import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-ratings',
  templateUrl: './star-ratings.component.html',
  styleUrls: ['./star-ratings.component.scss'],
  imports: [NgFor, NgClass]
})
export class StarRatingsComponent implements OnInit {

  @Input() faSize: 'fa-2xs' | 'fa-xs' | 'fa-sm' | '' | 'fa-lg' | 'fa-xl' | 'fa-2xl' = '';

  @Input() score = 5; //Level 1 to 5 --> Lowest = 1 and Highest = 5

  MAX_SCORE: number = 5;

  constructor() { }

  ngOnInit() {
    if (this.score > this.MAX_SCORE) {
      throw new Error("Invalid Rating Score. Ratings must be within 1 to 5. Lowest = 1, Highest = 5");
    }
  }

  get ratingScored() {
    let stars: number[] = [];
    for (let i = 1; i <= this.score; i++) {
      stars.push(i);
    }
    return stars;
  }

  get ratingNotScored() {
    let stars: number[] = [];
    const result = this.MAX_SCORE - this.score;
    for (let i = 1; i <= result; i++) {
      stars.push(i);
    }
    return stars;
  }

}
