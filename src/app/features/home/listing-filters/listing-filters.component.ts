import { Component, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ListingFilters } from '../../../core/models/filters';
import { AMENITIES } from '../../../core/models/models';

const priceRange: ValidatorFn = group => {
  const min = group.get('minPrice')?.value;
  const max = group.get('maxPrice')?.value;
  return min !== null && max !== null && min > max ? { range: true } : null;
};

@Component({
  selector: 'app-listing-filters',
  imports: [ReactiveFormsModule],
  templateUrl: './listing-filters.component.html',
})
export class ListingFiltersComponent {
  private fb = inject(NonNullableFormBuilder);

  amenities = AMENITIES;
  filtersChange = output<ListingFilters>();

  form = this.fb.group(
    {
      location: [''],
      minPrice: this.fb.control<number | null>(null, [Validators.min(0)]),
      maxPrice: this.fb.control<number | null>(null, [Validators.min(0)]),
      amenities: this.fb.group(Object.fromEntries(AMENITIES.map(a => [a, false]))),
    },
    { validators: priceRange }
  );

  constructor() {
    this.form.valueChanges.pipe(debounceTime(250), takeUntilDestroyed()).subscribe(() => {
      if (this.form.invalid) return;
      const v = this.form.getRawValue();
      this.filtersChange.emit({
        location: v.location,
        minPrice: v.minPrice,
        maxPrice: v.maxPrice,
        amenities: AMENITIES.filter(a => v.amenities[a]),
      });
    });
  }

  reset(): void {
    this.form.reset();
  }
}