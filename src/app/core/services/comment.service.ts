import { Injectable, inject, signal } from '@angular/core';
import { Comment } from '../models/models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private storage = inject(StorageService);
  private _comments = signal<Comment[]>(this.storage.get<Comment[]>('comments', []));

  forListing(listingId: string): Comment[] {
    return this._comments().filter(c => c.listingId === listingId);
  }

  add(data: Omit<Comment, 'id' | 'createdAt'>): void {
    const comment: Comment = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const next = [...this._comments(), comment];
    this._comments.set(next);
    this.storage.set('comments', next);
  }
}