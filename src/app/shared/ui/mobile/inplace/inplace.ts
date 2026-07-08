import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { InplaceBase } from "@ui/base/inplace.base";

@Component({
  selector: "ili-inplace",

  imports: [CommonModule],
  template: `
    <div class="ili-inplace">
      @if (!active()) {
        <div class="ili-inplace-display" (click)="active.set(true)">
          <ng-content select="[inplaceDisplay]" />
          <button class="ili-inplace-edit-btn" aria-label="Editar">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>
          </button>
        </div>
      }
      @if (active()) {
        <div class="ili-inplace-content">
          <ng-content select="[inplaceContent]" />
          @if (closable()) {
            <button
              class="ili-inplace-close-btn"
              (click)="active.set(false)"
              aria-label="Cerrar"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-inplace {
        display: block;
      }
      .ili-inplace-display {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: var(--ds-radius-sm, 4px);
        transition: background 0.15s;
      }
      .ili-inplace-display:active {
        background: var(--ds-bg-elevated, #f1f5f9);
      }
      .ili-inplace-edit-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--ds-primary, #003d9b);
        padding: 0.25rem;
      }
      .ili-inplace-content {
        padding: 0.5rem;
      }
      .ili-inplace-close-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--ds-border, #e2e8f0);
        background: var(--ds-bg-input, #ffffff);
        cursor: pointer;
        color: var(--ds-text-secondary, #64748b);
        border-radius: var(--ds-radius-sm, 4px);
        padding: 0.375rem;
        margin-top: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MobileInplace extends InplaceBase {}
