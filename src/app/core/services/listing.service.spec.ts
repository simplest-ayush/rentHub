import { TestBed } from '@angular/core/testing';
import { ListingService, NewListing } from './listing.service';

describe('ListingService', () => {
  let service: ListingService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingService);
  });

  const sample = (): NewListing => {
    const { id, createdAt, ...data } = service.listings()[0];
    return { ...data, title: 'Test listing' };
  };

  it('loads the 8 seed listings', () => {
    expect(service.listings().length).toBe(8);
  });

  it('adds a listing at the top and persists it', () => {
    const added = service.add(sample());
    expect(service.listings()[0].id).toBe(added.id);
    expect(service.listings().length).toBe(9);
    expect(localStorage.getItem('listings')).toContain('Test listing');
  });

  it('updates a listing', () => {
    service.update('seed-1', { rent: 1234 });
    expect(service.getById('seed-1')?.rent).toBe(1234);
  });

  it('removes a listing', () => {
    service.remove('seed-1');
    expect(service.getById('seed-1')).toBeUndefined();
    expect(service.listings().length).toBe(7);
  });

  it('returns at most 5 featured listings, newest first', () => {
    const featured = service.getFeatured(5);
    expect(featured.length).toBe(5);
    expect(featured[0].id).toBe('seed-1');
  });
});