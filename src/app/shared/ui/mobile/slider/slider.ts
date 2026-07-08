import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonRange } from "@ionic/angular/standalone";
import { SliderBase } from "@ui/base/slider.base";

@Component({
  selector: "ili-slider",

  imports: [CommonModule, IonRange],
  template: `
    <div class="ili-slider-root">
      @if (label()) {
        <div class="ili-slider-label-row">
          <label class="ili-slider-label">{{ label() }}</label>
          @if (showValue()) {
            <span class="ili-slider-value">
              {{ prefix() }}{{ range() ? rangeDisplay() : singleDisplay()
              }}{{ suffix() }}
            </span>
          }
        </div>
      }

      <ion-range
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [dualKnobs]="range()"
        [disabled]="disabled()"
        [value]="ionValue()"
        (ionInput)="onIonInput($event)"
      >
        <span slot="start" class="ili-slider-bound">
          {{ prefix() }}{{ min() }}{{ suffix() }}
        </span>
        <span slot="end" class="ili-slider-bound">
          {{ prefix() }}{{ max() }}{{ suffix() }}
        </span>
      </ion-range>
    </div>
  `,
  styles: [
    `
      .ili-slider-root {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
      }
      .ili-slider-label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .ili-slider-label {
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .ili-slider-value {
        font-size: 0.875rem;
        color: var(--ds-primary, #003d9b);
        font-weight: 600;
      }
      .ili-slider-bound {
        font-size: 0.75rem;
        color: var(--ds-text-muted);
      }
      ion-range {
        --bar-background: var(--ds-border, #e2e8f0);
        --bar-background-active: var(--ds-primary, #003d9b);
        --knob-background: var(--ds-primary, #003d9b);
        padding-inline: 0.25rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileSlider extends SliderBase {
  /** Convierte el value del base al formato que espera ion-range. */
  protected ionValue(): number | { lower: number; upper: number } {
    const v = this.value();
    if (this.range() && Array.isArray(v)) {
      return { lower: v[0], upper: v[1] };
    }
    return typeof v === "number" ? v : this.min();
  }

  protected onIonInput(event: CustomEvent): void {
    const detail = (event as CustomEvent<{ value: unknown }>).detail.value;
    if (
      this.range() &&
      detail &&
      typeof detail === "object" &&
      "lower" in detail
    ) {
      const r = detail as { lower: number; upper: number };
      this.value.set([r.lower, r.upper]);
    } else if (typeof detail === "number") {
      this.value.set(detail);
    }
  }
}
