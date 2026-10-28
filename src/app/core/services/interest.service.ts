import { Injectable, computed, inject, signal } from '@angular/core';
import { Inquiry } from '../models/models';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class InterestService {
  private storage = inject(StorageService);
  private auth = inject(AuthService);

  // ---------- Favourites: userId -> listing ids ----------
  private map = signal<Record<string, string[]>>(this.storage.get('favourites', {}));

  readonly favouriteIds = computed(() => {
    const user = this.auth.user();
    return user ? (this.map()[user.id] ?? []) : [];
  });

  isFavourite(listingId: string): boolean {
    return this.favouriteIds().includes(listingId);
  }

  toggle(listingId: string): void {
    const user = this.auth.user();
    if (!user) return;
    const current = this.map()[user.id] ?? [];
    const next = current.includes(listingId)
      ? current.filter(id => id !== listingId)
      : [...current, listingId];
    const updated = { ...this.map(), [user.id]: next };
    this.map.set(updated);
    this.storage.set('favourites', updated);
  }

  // ---------- Inquiries ----------
  private _inquiries = signal<Inquiry[]>(this.storage.get<Inquiry[]>('inquiries', []));
  readonly inquiries = this._inquiries.asReadonly();

  sendInquiry(listingId: string, message: string): boolean {
    const user = this.auth.user();
    if (!user) return false;
    const inquiry: Inquiry = {
      id: crypto.randomUUID(),
      listingId,
      fromUserId: user.id,
      fromName: user.name,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [...this._inquiries(), inquiry];
    this._inquiries.set(next);
    this.storage.set('inquiries', next);
    return true;
  }
}