import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InterestService } from '../../../core/services/interest.service';
import { ListingService } from '../../../core/services/listing.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private listingService = inject(ListingService);
  private interest = inject(InterestService);
  auth = inject(AuthService);

  confirmingId = signal<string | null>(null);

  myListings = computed(() =>
    this.listingService.listings().filter(l => l.ownerId === this.auth.user()?.id)
  );

  favourites = computed(() => {
    const ids = this.interest.favouriteIds();
    return this.listingService.listings().filter(l => ids.includes(l.id));
  });

  receivedInquiries = computed(() => {
    const titles = new Map(this.myListings().map(l => [l.id, l.title]));
    return this.interest
      .inquiries()
      .filter(i => titles.has(i.listingId))
      .map(i => ({ ...i, listingTitle: titles.get(i.listingId)! }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

  removeFavourite(listingId: string): void {
    this.interest.toggle(listingId);
  }

  askDelete(id: string): void {
    this.confirmingId.set(id);
  }

  cancelDelete(): void {
    this.confirmingId.set(null);
  }

  confirmDelete(id: string): void {
    this.listingService.remove(id);
    this.confirmingId.set(null);
  }
}