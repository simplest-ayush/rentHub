export interface ListingFilters {
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  amenities: string[];
}

export const EMPTY_FILTERS: ListingFilters = {
  location: '',
  minPrice: null,
  maxPrice: null,
  amenities: [],
};

export type SortKey = 'newest' | 'priceAsc' | 'priceDesc' | 'areaDesc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'priceAsc', label: 'Price: low to high' },
  { value: 'priceDesc', label: 'Price: high to low' },
  { value: 'areaDesc', label: 'Area: largest first' },
];