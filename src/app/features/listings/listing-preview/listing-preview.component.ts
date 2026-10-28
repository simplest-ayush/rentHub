import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LeaseType } from '../../../core/models/models';
import { ListingDraftService } from '../../../core/services/listing-draft.service';
import { ListingService } from '../../../core/services/listing.service';

@Component({
  selector: 'app-listing-preview',
  imports: [CurrencyPipe],
  templateUrl: './listing-preview.component.html',
})
export class ListingPreviewComponent {
  private drafts = inject(ListingDraftService);
  private listings = inject(ListingService);
  private router = inject(Router);

  draft = this.drafts.draft;

  readonly leaseLabels: Record<LeaseType, string> = {
    long: 'Long term (6+ months)',
    short: 'Short term',
    both: 'Both',
  };

  constructor() {
    if (!this.drafts.get()) {
      this.router.navigateByUrl('/listings/new');   // nothing to preview (e.g. page refresh)
    }
  }

  edit(): void {
    const d = this.drafts.get();
    if (!d) return;
    this.router.navigateByUrl(d.editId ? `/listings/${d.editId}/edit` : '/listings/new');
  }

  submit(): void {
    const d = this.drafts.get();
    if (!d) return;

    let id: string;
    if (d.editId) {
      this.listings.update(d.editId, d.data);
      id = d.editId;
    } else {
      id = this.listings.add(d.data).id;
    }
    this.drafts.clear();
    this.router.navigate(['/listings', id]);
  }
}