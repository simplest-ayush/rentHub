import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing } from '../../../core/models/models';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './listing-card.component.html',
})
export class ListingCardComponent {
  listing = input.required<Listing>();
  isFavourite = input(false);
  favouriteToggle = output<string>();
}