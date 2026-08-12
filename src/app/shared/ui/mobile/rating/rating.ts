import { Component, ViewEncapsulation } from "@angular/core";
import { RatingBase } from "@ui/base/rating.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-rating",

  imports: [AppIcon],
  template: `
    <div class="ili-rating-root">
      @if (label()) {
        <label class="ili-rating-label">{{ label() }}</label>
      }

      <div
        class="ili-rating-row"
        [class.ili-rating-disabled]="disabled() || readonly()"
      >
        @for (s of starRange(); track s) {
          <button
            type="button"
            class="ili-rating-star"
            [disabled]="readonly() || disabled()"
            (click)="setValue(s)"
          >
            <app-icon
              [icon]="(value() ?? 0) >= s ? 'material-symbols-light:star' : 'material-symbols-light:star-outline'"
            />
          </button>
        }

        @if (allowCancel() && value() && !readonly() && !disabled()) {
          <button
            type="button"
            class="ili-rating-clear"
            title="Limpiar"
            (click)="clear()"
          >
            ✕
          </button>
        }

        @if (showLabel()) {
          <span class="ili-rating-text">{{ ratingLabel() }}</span>
        }
      </div>

      @if (hint()) {
        <span class="ili-rating-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .ili-rating-root {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .ili-rating-label {
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .ili-rating-row {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .ili-rating-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .ili-rating-star {
        background: none;
        border: none;
        padding: 0.25rem;
        font-size: 1.6rem;
        line-height: 1;
        color: var(--ds-accent-text-warning);
        cursor: pointer;
        display: inline-flex;
      }
      .ili-rating-clear {
        width: 24px;
        height: 24px;
        margin-left: 0.25rem;
        border-radius: 50%;
        border: 1px solid var(--ds-border-strong);
        background: none;
        font-size: 0.7rem;
        color: var(--ds-text-muted);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .ili-rating-text {
        margin-left: 0.5rem;
        font-size: 0.875rem;
        color: var(--ds-text-primary);
        font-weight: 600;
      }
      .ili-rating-hint {
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileRating extends RatingBase {}
