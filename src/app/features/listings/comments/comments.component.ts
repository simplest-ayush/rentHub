import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Comment } from '../../../core/models/models';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../../core/services/comment.service';
import { notBlank } from '../../../shared/validators';

interface Thread {
  comment: Comment;
  replies: Comment[];
}

const MAX_LENGTH = 500;

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  template: `
    <section class="rounded-xl border bg-white p-6 shadow-sm" aria-label="Comments">
      <h2 class="mb-4 text-xl font-bold">Comments ({{ count() }})</h2>

      @for (t of threads(); track t.comment.id) {
        <div class="mb-3 rounded-lg border p-3">
          <p class="text-sm font-semibold">
            {{ t.comment.userName }}
            @if (t.comment.userId === ownerId()) {
              <span class="ml-1 rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-700">Landlord</span>
            }
            <span class="ml-2 text-xs font-normal text-gray-500">{{ t.comment.createdAt | date: 'medium' }}</span>
          </p>
          <p class="mt-1 whitespace-pre-line text-sm text-gray-700">{{ t.comment.text }}</p>

          @if (auth.isLoggedIn()) {
            <button type="button" class="mt-2 text-xs text-teal-700 hover:underline"
              (click)="startReply(t.comment.id)">Reply</button>
          }

          @for (r of t.replies; track r.id) {
            <div class="ml-6 mt-3 border-l-2 border-teal-200 pl-3">
              <p class="text-sm font-semibold">
                {{ r.userName }}
                @if (r.userId === ownerId()) {
                  <span class="ml-1 rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-700">Landlord</span>
                }
                <span class="ml-2 text-xs font-normal text-gray-500">{{ r.createdAt | date: 'medium' }}</span>
              </p>
              <p class="mt-1 whitespace-pre-line text-sm text-gray-700">{{ r.text }}</p>
            </div>
          }

          @if (replyingTo() === t.comment.id) {
            <div class="ml-6 mt-3">
              <textarea rows="2" class="input" [formControl]="replyText"
                aria-label="Your reply" placeholder="Write a reply"></textarea>
              @if (replyText.touched && replyText.invalid) {
                <p class="error">
                  @if (replyText.hasError('maxlength')) { Reply cannot exceed ${MAX_LENGTH} characters }
                  @else { Reply cannot be empty }
                </p>
              }
              <div class="mt-2 flex gap-2">
                <button type="button" class="btn" (click)="submitReply(t.comment.id)">Reply</button>
                <button type="button" class="btn-outline" (click)="cancelReply()">Cancel</button>
              </div>
            </div>
          }
        </div>
      } @empty {
        <p class="mb-4 text-sm text-gray-500">No comments yet. Be the first to ask a question.</p>
      }

      @if (auth.isLoggedIn()) {
        <label for="new-comment" class="mb-1 mt-4 block text-sm">Leave a Comment</label>
        <textarea id="new-comment" rows="3" class="input" [formControl]="newComment"></textarea>
        @if (newComment.touched && newComment.invalid) {
          <p class="error">
            @if (newComment.hasError('maxlength')) { Comment cannot exceed ${MAX_LENGTH} characters }
            @else { Comment cannot be empty }
          </p>
        }
        <button type="button" class="btn mt-2" (click)="submitComment()">Submit</button>
      } @else {
        <p class="mt-4 text-sm">
          <a routerLink="/auth" [queryParams]="{ mode: 'login', returnUrl: router.url }"
            class="text-teal-700 hover:underline">Login</a> to leave a comment.
        </p>
      }
    </section>
  `,
})
export class CommentsComponent {
  // input.required<string>() creates an input signal
  listingId = input.required<string>();
  ownerId = input.required<string>();

  auth = inject(AuthService);
  router = inject(Router);
  private service = inject(CommentService);

  private validators = [Validators.required, notBlank, Validators.maxLength(MAX_LENGTH)];
  newComment = new FormControl('', { nonNullable: true, validators: this.validators });
  replyText = new FormControl('', { nonNullable: true, validators: this.validators });
  replyingTo = signal<string | null>(null);

  private all = computed(() => this.service.forListing(this.listingId()));
  count = computed(() => this.all().length);

  threads = computed<Thread[]>(() => {
    const all = this.all();
    const byTime = (a: Comment, b: Comment) => a.createdAt.localeCompare(b.createdAt);
    return all
      .filter(c => !c.parentId)
      .sort(byTime)
      .map(comment => ({
        comment,
        replies: all.filter(r => r.parentId === comment.id).sort(byTime),
      }));
  });

  submitComment(): void {
    this.post(this.newComment, null);
  }

  submitReply(parentId: string): void {
    if (this.post(this.replyText, parentId)) this.replyingTo.set(null);
  }

  startReply(commentId: string): void {
    this.replyText.reset();
    this.replyingTo.set(commentId);
  }

  cancelReply(): void {
    this.replyingTo.set(null);
  }

  private post(control: FormControl<string>, parentId: string | null): boolean {
    const user = this.auth.user();
    if (!user) return false;
    if (control.invalid) {
      control.markAsTouched();
      return false;
    }
    this.service.add({
      listingId: this.listingId(),
      userId: user.id,
      userName: user.name,
      text: control.value.trim(),
      parentId,
    });
    control.reset();
    return true;
  }
}