import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SliderBase } from "@ui/base/slider.base";
import { SliderModule } from "primeng/slider";

/**
 * AppSlider — Wrapper sobre p-slider con etiqueta, valor y soporte de rango.
 * Uso: filtros de precio, scoring de leads, umbrales de configuración.
 */
@Component({
  selector: "app-slider",

  imports: [FormsModule, SliderModule],
  template: `
    <div class="app-slider-root">
      @if (label()) {
        <div class="app-slider-label-row">
          <label class="app-slider-label">{{ label() }}</label>
          @if (showValue()) {
            <span class="app-slider-value">
              {{ prefix() }}{{ range() ? rangeDisplay() : singleDisplay()
              }}{{ suffix() }}
            </span>
          }
        </div>
      }

      <!-- p-slider no expone disabled como input directo — se bloquea via wrapper -->
      <div [class.app-slider-disabled]="disabled()">
        <p-slider
          [(ngModel)]="value"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [range]="range()"
          styleClass="app-slider-track"
        />
      </div>

      <div class="app-slider-bounds">
        <span>{{ prefix() }}{{ min() }}{{ suffix() }}</span>
        <span>{{ prefix() }}{{ max() }}{{ suffix() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .app-slider-root {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }
      .app-slider-label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .app-slider-label {
        font-size: var(--ds-font-size-label);
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .app-slider-value {
        font-size: var(--ds-font-size-label);
        color: var(--ds-primary);
        font-weight: 600;
      }
      .app-slider-bounds {
        display: flex;
        justify-content: space-between;
        font-size: var(--ds-font-size-micro);
        color: var(--ds-text-muted);
      }
      /* PrimeNG slider DS overrides */
      .p-slider {
        background: var(--ds-border);
        border-radius: var(--ds-radius-full);
        height: 4px;
      }
      .p-slider .p-slider-range {
        background: var(--ds-primary);
        border-radius: var(--ds-radius-full);
      }
      .p-slider .p-slider-handle {
        background: var(--ds-bg-surface);
        border: 2px solid var(--ds-primary);
        width: 18px;
        height: 18px;
        border-radius: 50%;
        transition: box-shadow 0.15s;
      }
      .p-slider .p-slider-handle:focus {
        box-shadow: 0 0 0 3px var(--primary-200);
      }
      .app-slider-disabled {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSlider extends SliderBase {}
