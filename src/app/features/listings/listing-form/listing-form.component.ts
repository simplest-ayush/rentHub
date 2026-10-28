import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AMENITIES, LeaseType, PriceMode } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { ListingDraftService } from '../../../core/services/listing-draft.service';
import { ListingService, NewListing } from '../../../core/services/listing.service';
import { SharedModule } from '../../../shared/shared-module';

const MAX_PHOTOS = 5;
const MAX_DESCRIPTION = 1400;
const PHONE_PATTERN = /^[0-9+\-\s]{7,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const atLeastOnePhoto: ValidatorFn = control =>
  (control.value as string[]).length >= 1 ? null : { required: true };

@Component({
  selector: 'app-listing-form',
  imports: [SharedModule],
  templateUrl: './listing-form.component.html',
})
export class ListingFormComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private listings = inject(ListingService);
  private drafts = inject(ListingDraftService);

  readonly amenities = AMENITIES;
  readonly propertyTypes = ['Apartment', 'Building', 'Independent House', 'Villa'];
  readonly maxDescription = MAX_DESCRIPTION;
  readonly maxPhotos = MAX_PHOTOS;

  editId: string | null = this.route.snapshot.paramMap.get('id');
  submitted = signal(false);
  photoError = signal('');

  form = this.fb.group({
    propertyType: ['', Validators.required],
    propertyName: ['', [Validators.required, Validators.minLength(2)]],
    shared: this.fb.control<boolean | null>(null, Validators.required),
    street: ['', [Validators.required, Validators.minLength(5)]],
    sqft: this.fb.control<number | null>(null, [Validators.required, Validators.min(50), Validators.max(100000)]),
    beds: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(20)]),
    leaseType: this.fb.control<LeaseType | null>(null, Validators.required),
    rent: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    negotiable: false,
    priceMode: this.fb.control<PriceMode | null>(null, Validators.required),
    furnished: this.fb.control<boolean | null>(null, Validators.required),
    amenities: this.fb.group(Object.fromEntries(AMENITIES.map(a => [a, false]))),
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(MAX_DESCRIPTION)]],
    contactName: ['', [Validators.required, Validators.minLength(2)]],
    contactPhone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    contactEmail: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    photos: this.fb.control<string[]>([], atLeastOnePhoto),
  });

  get f() {
    return this.form.controls;
  }

  descriptionLength = computed(() => this.f.description.value.length);

  constructor() {
    const user = this.auth.user();
    if (!user) return; // the auth guard prevents this

    const draft = this.drafts.get();
    if (draft && draft.editId === this.editId) {
      this.patch(draft.data);                       // coming back from Preview
    } else if (this.editId) {
      const existing = this.listings.getById(this.editId);
      if (!existing || existing.ownerId !== user.id) {
        this.router.navigateByUrl('/');             // not found or not yours
        return;
      }
      this.patch(existing);
    } else {
      this.form.patchValue({ contactName: user.name, contactEmail: user.email });
    }
  }

  show(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  onPreview(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.drafts.set({ editId: this.editId, data: this.toListing() });
    this.router.navigateByUrl('/listings/preview');
  }

  async onFiles(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    this.photoError.set('');

    const current = this.f.photos.value;
    const room = MAX_PHOTOS - current.length;
    const images = files.filter(file => file.type.startsWith('image/'));

    if (images.length < files.length) {
      this.photoError.set('Only image files are allowed');
    } else if (images.length > room) {
      this.photoError.set(`You can upload at most ${MAX_PHOTOS} photos`);
    }

    try {
      const resized = await Promise.all(images.slice(0, Math.max(room, 0)).map(file => this.resize(file)));
      this.f.photos.setValue([...current, ...resized]);
    } catch {
      this.photoError.set('One of the images could not be read');
    }
    this.f.photos.markAsTouched();
  }

  removePhoto(index: number): void {
    this.f.photos.setValue(this.f.photos.value.filter((_, i) => i !== index));
    this.f.photos.markAsTouched();
  }

  private patch(d: NewListing): void {
    this.form.patchValue({
      ...d,
      amenities: Object.fromEntries(AMENITIES.map(a => [a, d.amenities.includes(a)])),
    });
  }

  private toListing(): NewListing {
    const v = this.form.getRawValue();
    return {
      ownerId: this.auth.user()!.id,
      propertyType: v.propertyType,
      propertyName: v.propertyName.trim(),
      shared: v.shared!,
      street: v.street.trim(),
      sqft: v.sqft!,
      beds: v.beds!,
      leaseType: v.leaseType!,
      rent: v.rent!,
      negotiable: v.negotiable,
      priceMode: v.priceMode!,
      furnished: v.furnished!,
      amenities: AMENITIES.filter(a => v.amenities[a]),
      title: v.title.trim(),
      description: v.description.trim(),
      contactName: v.contactName.trim(),
      contactPhone: v.contactPhone.trim(),
      contactEmail: v.contactEmail.trim(),
      photos: v.photos,
    };
  }

  // Shrinks images so several photos fit inside the ~5 MB localStorage limit
  private resize(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Invalid image'));
        img.onload = () => {
          const scale = Math.min(1, 800 / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
}