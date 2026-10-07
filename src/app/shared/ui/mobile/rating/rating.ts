import { Component, ViewEncapsulation } from "@angular/core";
import { RatingBase } from "@ui/core/rating.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-rating-mobile",

  imports: [AppIconMobile],
  template: `
    <div class="lux-rating-mobile-root">
      @if (label()) {
        <label class="lux-rating-mobile-label">{{ label() }}</label>
      }

      <div
        class="lux-rating-mobile-row"
        [class.lux-rating-mobile-disabled]="disabled() || readonly()"
      >
        @for (s of starRange(); track s) {
          <button
            type="button"
            class="lux-rating-mobile-star"
            [disabled]="readonly() || disabled()"
            (click)="setValue(s)"
          >
            <lux-icon-mobile
              [icon]="(value() ?? 0) >= s ? 'material-symbols-light:star' : 'material-symbols-light:star-outline'"
            />
          </button>
        }

        @if (allowCancel() && value() && !readonly() && !disabled()) {
          <button
            type="button"
            class="lux-rating-mobile-clear"
            title="Limpiar"
            (click)="clear()"
          >
            ✕
          </button>
        }

        @if (showLabel()) {
          <span class="lux-rating-mobile-text">{{ ratingLabel() }}</span>
        }
      </div>

      @if (hint()) {
        <span class="lux-rating-mobile-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .lux-rating-mobile-root {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .lux-rating-mobile-label {
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .lux-rating-mobile-row {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .lux-rating-mobile-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .lux-rating-mobile-star {
        background: none;
        border: none;
        padding: 0.25rem;
        font-size: 1.6rem;
        line-height: 1;
        color: var(--ds-accent-text-warning);
        cursor: pointer;
        display: inline-flex;
      }
      .lux-rating-mobile-clear {
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
      .lux-rating-mobile-text {
        margin-left: 0.5rem;
        font-size: 0.875rem;
        color: var(--ds-text-primary);
        font-weight: 600;
      }
      .lux-rating-mobile-hint {
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileRating extends RatingBase {}

