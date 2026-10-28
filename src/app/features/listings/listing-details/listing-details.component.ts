import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LeaseType } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { InterestService } from '../../../core/services/interest.service';
import { ListingService } from '../../../core/services/listing.service';
import { notBlank } from '../../../shared/validators';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-listing-details',
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule, CommentsComponent],
  templateUrl: './listing-details.component.html',
})
export class ListingDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listings = inject(ListingService);
  auth = inject(AuthService);
  interest = inject(InterestService);

  private id = this.route.snapshot.paramMap.get('id') ?? '';
  listing = computed(() => this.listings.listings().find(l => l.id === this.id));
  isOwner = computed(() => this.listing()?.ownerId === this.auth.user()?.id);

  selectedPhoto = signal(0);
  inquirySent = signal(false);
  inquiry = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, notBlank, Validators.minLength(10), Validators.maxLength(500)],
  });

  readonly leaseLabels: Record<LeaseType, string> = {
    long: 'Long term (6+ months)',
    short: 'Short term',
    both: 'Both',
  };

  toggleFavourite(): void {
    if (!this.requireLogin()) return;
    this.interest.toggle(this.id);
  }

  sendInquiry(): void {
    if (!this.requireLogin()) return;
    if (this.inquiry.invalid) {
      this.inquiry.markAsTouched();
      return;
    }
    this.interest.sendInquiry(this.id, this.inquiry.value);
    this.inquiry.reset();
    this.inquirySent.set(true);
  }

  private requireLogin(): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigate(['/auth'], { queryParams: { mode: 'login', returnUrl: this.router.url } });
    return false;
  }
}