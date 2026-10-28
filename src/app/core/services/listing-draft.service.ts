import { Injectable, signal } from '@angular/core';
import { NewListing } from './listing.service';

export interface ListingDraft {
  editId: string | null;   // null = creating a new listing
  data: NewListing;
}

@Injectable({ providedIn: 'root' })
export class ListingDraftService {
  private _draft = signal<ListingDraft | null>(null);
  readonly draft = this._draft.asReadonly();

  get(): ListingDraft | null {
    return this._draft();
  }

  set(draft: ListingDraft): void {
    this._draft.set(draft);
  }

  clear(): void {
    this._draft.set(null);
  }
}