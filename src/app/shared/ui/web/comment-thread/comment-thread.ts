import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommentThreadBase } from "@ui/base/comment-thread.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "primeng/button";
import { TextareaModule } from "primeng/textarea";

export { type Comment } from "@ui/base/comment-thread.base";

/**
 * AppCommentThread — Hilo de comentarios/notas colaborativas en registros CRM/ERP.
 * Soporta añadir, mostrar y reaccionar a comentarios. Emite `submit` con el texto nuevo.
 */
@Component({
  selector: "app-comment-thread",

  imports: [CommonModule, FormsModule, ButtonModule, TextareaModule, AppIcon],
  template: `
    <div class="comment-thread">
      <!-- Title -->
      @if (title()) {
        <h4 class="comment-thread-title">
          <app-icon icon="mdi:comment-multiple-outline" />
          {{ title() }}
          @if (comments().length > 0) {
            ({{ comments().length }})
          }
        </h4>
      }

      <!-- Comment list -->
      @if (comments().length === 0) {
        <div class="comment-empty">
          <app-icon icon="mdi:comment-outline" class="text-2xl" />
          <span>Sin comentarios aún. Sé el primero.</span>
        </div>
      } @else {
        <div class="comment-list">
          @for (c of comments(); track c.id) {
            <div class="comment-item">
              <!-- Avatar -->
              <div class="comment-avatar" [style.background]="avatarBg(c)">
                @if (c.avatarUrl) {
                  <img
                    [src]="c.avatarUrl"
                    [alt]="c.authorName"
                    class="comment-avatar-img"
                  />
                } @else {
                  {{ c.authorInitials ?? initials(c.authorName) }}
                }
              </div>

              <!-- Bubble -->
              <div class="comment-bubble">
                <div class="comment-meta">
                  <strong class="comment-author">{{ c.authorName }}</strong>
                  <span class="comment-time">{{ c.timestamp }}</span>
                  @if (c.edited) {
                    <span class="comment-edited">(editado)</span>
                  }
                </div>
                <p class="comment-text">{{ c.text }}</p>

                @if (c.reactions?.length) {
                  <div class="comment-reactions">
                    @for (r of c.reactions!; track r.emoji) {
                      <button
                        class="comment-reaction-btn"
                        (click)="
                          react.emit({ commentId: c.id, emoji: r.emoji })
                        "
                      >
                        {{ r.emoji }} {{ r.count }}
                      </button>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- New comment form -->
      @if (!readonly()) {
        <div class="comment-form">
          <textarea
            pTextarea
            [(ngModel)]="newText"
            [rows]="2"
            [placeholder]="placeholder()"
            [disabled]="submitting()"
            class="comment-textarea"
            (keydown.ctrl.enter)="submitComment()"
          ></textarea>
          <div class="comment-form-actions">
            <span class="comment-form-hint">Ctrl+Enter para enviar</span>
            <p-button
              label="Comentar"
              icon="mdi:send"
              size="small"
              [disabled]="!newText.trim() || submitting()"
              [loading]="submitting()"
              (onClick)="submitComment()"
            />
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .comment-thread {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .comment-thread-title {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 600;
        color: var(--ds-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin: 0;
      }
      .comment-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem;
        color: var(--ds-text-muted);
        font-size: var(--ds-font-size-help, 0.8125rem);
        background: var(--ds-bg-elevated, #f1f3ff);
        border-radius: var(--ds-radius-md, 6px);
      }
      .comment-list {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }
      .comment-item {
        display: flex;
        gap: 0.625rem;
        align-items: flex-start;
      }
      /* Avatar */
      .comment-avatar {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.625rem;
        font-weight: 700;
        color: #fff;
        overflow: hidden;
      }
      .comment-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      /* Bubble */
      .comment-bubble {
        flex: 1;
        background: var(--ds-bg-elevated, #f1f3ff);
        border-radius: 0 var(--ds-radius-md, 6px) var(--ds-radius-md, 6px)
          var(--ds-radius-md, 6px);
        padding: 0.625rem 0.875rem;
      }
      .comment-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }
      .comment-author {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-primary);
      }
      .comment-time {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      .comment-edited {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
        font-style: italic;
      }
      .comment-text {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-primary);
        margin: 0;
        white-space: pre-wrap;
      }
      /* Reactions */
      .comment-reactions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        margin-top: 0.375rem;
      }
      .comment-reaction-btn {
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-full, 9999px);
        padding: 0.15rem 0.5rem;
        font-size: var(--ds-font-size-micro, 0.75rem);
        cursor: pointer;
        transition: border-color 0.15s;
      }
      .comment-reaction-btn:hover {
        border-color: var(--ds-primary);
      }
      /* Form */
      .comment-form {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .comment-textarea {
        width: 100%;
        resize: vertical;
        border: 1.5px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        padding: 0.5rem 0.75rem;
        font-size: var(--ds-font-size-body, 0.9375rem);
        font-family: var(--ds-font-family-base);
        color: var(--ds-text-primary);
        background: var(--ds-bg-surface, #fff);
        transition: border-color 0.15s;
      }
      .comment-textarea:focus {
        outline: none;
        border-color: var(--ds-primary, #003d9b);
        box-shadow: 0 0 0 3px var(--ds-primary-200, #b2c5ff);
      }
      .comment-form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .comment-form-hint {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppCommentThread extends CommentThreadBase {}
