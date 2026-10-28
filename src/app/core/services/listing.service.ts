import { Injectable, inject, signal } from '@angular/core';
import { Listing } from '../models/models';
import { SEED_LISTINGS } from './seed-data';
import { StorageService } from './storage.service';

export type NewListing = Omit<Listing, 'id' | 'createdAt'>;

@Injectable({ providedIn: 'root' })
export class ListingService {
  private storage = inject(StorageService);
  private _listings = signal<Listing[]>(this.load());

  readonly listings = this._listings.asReadonly();

  getById(id: string): Listing | undefined {
    return this._listings().find(l => l.id === id);
  }

  getFeatured(count = 5): Listing[] {
    return [...this._listings()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, count);
  }

  add(data: NewListing): Listing {
    const listing: Listing = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.save([listing, ...this._listings()]);
    return listing;
  }

  update(id: string, changes: Partial<NewListing>): void {
    this.save(this._listings().map(l => (l.id === id ? { ...l, ...changes } : l)));
  }

  remove(id: string): void {
    this.save(this._listings().filter(l => l.id !== id));
  }

  private save(list: Listing[]): void {
    this._listings.set(list);
    this.storage.set('listings', list);
  }

  private load(): Listing[] {
    const saved = this.storage.get<Listing[] | null>('listings', null);
    if (saved) return saved;
    this.storage.set('listings', SEED_LISTINGS);
    return SEED_LISTINGS;
  }
}