import { Component, computed, input, model } from '@angular/core';
import { Listing } from '../../../core/models/models';

@Component({
  selector: 'app-carousel',
  template: `
    @if (current(); as c) {
      <div class="relative h-64 overflow-hidden rounded-xl bg-gray-200 md:h-96">
        <img [src]="c.photos[0]" [alt]="c.title" class="h-full w-full object-cover" />
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <p class="font-semibold">{{ c.title }}</p>
        </div>
        <button type="button" (click)="prev()" aria-label="Previous listing"
          class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white hover:bg-black/70">‹</button>
        <button type="button" (click)="next()" aria-label="Next listing"
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white hover:bg-black/70">›</button>
      </div>
    }
  `,
})
export class CarouselComponent {
  listings = input.required<Listing[]>();
  index = model(0);
  current = computed(() => this.listings()[this.index()]);

  next(): void {
    this.index.update(i => (i + 1) % this.listings().length);
  }

  prev(): void {
    this.index.update(i => (i - 1 + this.listings().length) % this.listings().length);
  }
}