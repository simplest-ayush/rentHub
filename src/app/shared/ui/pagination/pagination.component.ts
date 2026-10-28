import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    @if (pageCount() > 1) {
      <nav class="flex flex-wrap justify-center gap-1" aria-label="Pagination">
        <button type="button" (click)="go(page() - 1)" [disabled]="page() === 1"
          class="rounded border px-3 py-1 disabled:opacity-40">Prev</button>
        @for (p of pages(); track p) {
          <button type="button" (click)="go(p)" class="rounded border px-3 py-1"
            [class.bg-teal-600]="p === page()" [class.text-white]="p === page()"
            [attr.aria-current]="p === page() ? 'page' : null">{{ p }}</button>
        }
        <button type="button" (click)="go(page() + 1)" [disabled]="page() === pageCount()"
          class="rounded border px-3 py-1 disabled:opacity-40">Next</button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  total = input.required<number>();
  pageSize = input(6);
  page = model(1);

  pageCount = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  pages = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i + 1));

  go(p: number): void {
    this.page.set(Math.min(Math.max(1, p), this.pageCount()));
  }
}