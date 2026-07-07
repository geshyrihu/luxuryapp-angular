import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RatingModule } from "primeng/rating";
import { ButtonModule } from "primeng/button";
import { RatingBase } from "@ui/base/rating.base";

/**
 * AppRating — Wrapper sobre p-rating con etiqueta, tooltips y modo readonly.
 * PrimeNG 21 p-rating inputs válidos: readonly, stars, iconOnClass, iconOffClass, autofocus.
 * Disabled y cancel se manejan a nivel wrapper con CSS + botón externo.
 */
@Component({
  selector: "app-rating",
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, ButtonModule],
  template: `
    <div class="app-rating-root">
      @if (label()) {
        <label class="app-rating-label">{{ label() }}</label>
      }

      <div class="app-rating-row" [class.app-rating-disabled]="disabled()">
        <p-rating
          [(ngModel)]="value"
          [stars]="stars()"
          [readonly]="readonly() || disabled()"
          (ngModelChange)="changed.emit($event)"
        />

        <!-- Boton limpiar — reemplaza la propiedad cancel eliminada en PrimeNG 17+ -->
        @if (allowCancel() && value() && !readonly() && !disabled()) {
          <button
            class="app-rating-clear"
            type="button"
            title="Limpiar"
            (click)="clear()"
          >✕</button>
        }

        @if (showLabel()) {
          <span class="app-rating-text">{{ ratingLabel() }}</span>
        }
      </div>

      @if (hint()) {
        <span class="app-rating-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [`
    .app-rating-root {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .app-rating-label {
      font-size: var(--ds-font-size-label, 0.875rem);
      color: var(--ds-text-secondary);
      font-weight: 500;
    }
    .app-rating-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .app-rating-disabled {
      opacity: 0.55;
      pointer-events: none;
      cursor: not-allowed;
    }
    .app-rating-clear {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid var(--ds-border-strong, #cbd5e1);
      background: none;
      font-size: 0.625rem;
      color: var(--ds-text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .app-rating-clear:hover {
      background: var(--ds-danger-light, #ffdad6);
      border-color: var(--ds-danger, #ba1a1a);
      color: var(--ds-danger, #ba1a1a);
    }
    .app-rating-text {
      font-size: var(--ds-font-size-label, 0.875rem);
      color: var(--ds-text-primary);
      font-weight: 600;
    }
    .app-rating-hint {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppRating extends RatingBase {}
