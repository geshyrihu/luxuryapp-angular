import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonButton, IonTextarea } from "@ionic/angular/standalone";
import { CommentThreadBase } from "@ui/base/comment-thread.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-comment-thread",

  imports: [FormsModule, IonButton, IonTextarea, AppIcon],
  template: `
    <div class="ili-ct">
      @if (title()) {
        <h4 class="ili-ct-title">
          <app-icon icon="mdi:comment-multiple-outline" />
          {{ title() }}
          @if (comments().length > 0) {
            ({{ comments().length }})
          }
        </h4>
      }

      @if (comments().length === 0) {
        <div class="ili-ct-empty">
          <app-icon icon="mdi:comment-outline" class="text-2xl" />
          <span>Sin comentarios aún. Sé el primero.</span>
        </div>
      } @else {
        <div class="ili-ct-list">
          @for (c of comments(); track c.id) {
            <div class="ili-ct-item">
              <div class="ili-ct-avatar" [style.background]="avatarBg(c)">
                @if (c.avatarUrl) {
                  <img
                    [src]="c.avatarUrl"
                    [alt]="c.authorName"
                    class="ili-ct-avatar-img"
                  />
                } @else {
                  {{ c.authorInitials ?? initials(c.authorName) }}
                }
              </div>
              <div class="ili-ct-bubble">
                <div class="ili-ct-meta">
                  <strong>{{ c.authorName }}</strong>
                  <span class="ili-ct-time">{{ c.timestamp }}</span>
                  @if (c.edited) {
                    <span class="ili-ct-edited">(editado)</span>
                  }
                </div>
                <p class="ili-ct-text">{{ c.text }}</p>
                @if (c.reactions?.length) {
                  <div class="ili-ct-reactions">
                    @for (r of c.reactions!; track r.emoji) {
                      <button
                        type="button"
                        class="ili-ct-reaction"
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

      @if (!readonly()) {
        <div class="ili-ct-form">
          <ion-textarea
            [(ngModel)]="newText"
            [rows]="2"
            [placeholder]="placeholder()"
            [disabled]="submitting()"
            fill="outline"
            autoGrow="true"
          ></ion-textarea>
          <ion-button
            expand="block"
            size="small"
            [disabled]="!newText.trim() || submitting()"
            (click)="submitComment()"
          >
            <app-icon icon="mdi:send" slot="start" />
            Comentar
          </ion-button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-ct {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .ili-ct-title {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--ds-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin: 0;
      }
      .ili-ct-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem;
        color: var(--ds-text-muted);
        font-size: 0.8125rem;
        background: var(--ds-bg-elevated, #f1f3ff);
        border-radius: var(--ds-radius-md, 6px);
      }
      .ili-ct-list {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }
      .ili-ct-item {
        display: flex;
        gap: 0.625rem;
        align-items: flex-start;
      }
      .ili-ct-avatar {
        flex-shrink: 0;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        font-weight: 700;
        color: #fff;
        overflow: hidden;
      }
      .ili-ct-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .ili-ct-bubble {
        flex: 1;
        background: var(--ds-bg-elevated, #f1f3ff);
        border-radius: 0 var(--ds-radius-md, 6px) var(--ds-radius-md, 6px)
          var(--ds-radius-md, 6px);
        padding: 0.625rem 0.875rem;
      }
      .ili-ct-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
        font-size: 0.8125rem;
        color: var(--ds-text-primary);
      }
      .ili-ct-time {
        font-size: 0.72rem;
        color: var(--ds-text-muted);
      }
      .ili-ct-edited {
        font-size: 0.72rem;
        color: var(--ds-text-muted);
        font-style: italic;
      }
      .ili-ct-text {
        font-size: 0.85rem;
        color: var(--ds-text-primary);
        margin: 0;
        white-space: pre-wrap;
      }
      .ili-ct-reactions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        margin-top: 0.375rem;
      }
      .ili-ct-reaction {
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: 9999px;
        padding: 0.2rem 0.55rem;
        font-size: 0.75rem;
      }
      .ili-ct-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileCommentThread extends CommentThreadBase {}
