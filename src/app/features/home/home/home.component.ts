import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EMPTY_FILTERS, ListingFilters, SORT_OPTIONS, SortKey } from '../../../core/models/filters';
import { Listing } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { InterestService } from '../../../core/services/interest.service';
import { ListingService } from '../../../core/services/listing.service';
import { CarouselComponent } from '../../../shared/ui/carousel/carousel.component';
import { PaginationComponent } from '../../../shared/ui/pagination/pagination.component';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ListingFiltersComponent } from '../listing-filters/listing-filters.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, CurrencyPipe, CarouselComponent, PaginationComponent,
    ListingCardComponent, ListingFiltersComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private listingService = inject(ListingService);
  private auth = inject(AuthService);
  private router = inject(Router);
  interest = inject(InterestService);

  readonly pageSize = 6;
  readonly sortOptions = SORT_OPTIONS;

  filters = signal<ListingFilters>(EMPTY_FILTERS);
  sortBy = signal<SortKey>('newest');
  page = signal(1);
  featuredIndex = signal(0);

  featured = computed(() => this.listingService.getFeatured(5));
  featuredListing = computed(() => this.featured()[this.featuredIndex()]);

  filtered = computed(() => {
    const f = this.filters();
    const q = f.location.trim().toLowerCase();
    const list = this.listingService.listings().filter(
      l =>
        (!q || [l.street, l.title, l.propertyName].some(s => s.toLowerCase().includes(q))) &&
        (f.minPrice === null || l.rent >= f.minPrice) &&
        (f.maxPrice === null || l.rent <= f.maxPrice) &&
        f.amenities.every(a => l.amenities.includes(a))
    );
    return this.sort(list, this.sortBy());
  });

  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  onFilters(filters: ListingFilters): void {
    this.filters.set(filters);
    this.page.set(1);
  }

  onSort(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortKey);
    this.page.set(1);
  }

  toggleFavourite(listingId: string): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth'], { queryParams: { mode: 'login', returnUrl: '/' } });
      return;
    }
    this.interest.toggle(listingId);
  }

  private sort(list: Listing[], key: SortKey): Listing[] {
    const copy = [...list];
    switch (key) {
      case 'priceAsc': return copy.sort((a, b) => a.rent - b.rent);
      case 'priceDesc': return copy.sort((a, b) => b.rent - a.rent);
      case 'areaDesc': return copy.sort((a, b) => b.sqft - a.sqft);
      default: return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }
}