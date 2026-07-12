import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { DateRangeBase } from "@ui/base/date-range.base";
import { ButtonModule } from "primeng/button";

export {
  type DateRangeValue,
  type PresetRange,
} from "@ui/base/date-range.base";

@Component({
  selector: "app-date-range",

  imports: [ButtonModule],
  template: `
    <div class="date-range-root flex flex-column gap-2">
      <div class="flex gap-2 flex-wrap">
        @for (preset of presets; track preset.label) {
          <p-button
            [label]="preset.label"
            size="small"
            severity="secondary"
            [outlined]="true"
            (onClick)="applyPreset(preset)"
          />
        }
      </div>
      <div class="flex gap-2 align-items-center">
        <div class="flex flex-column flex-1">
          <label class="text-xs text-color-secondary mb-1">Desde</label>
          <input
            type="date"
            class="date-input"
            [value]="value().start ? toInputDate(value().start!) : ''"
            (input)="onStartChange($event)"
          />
        </div>
        <span class="text-color-muted mt-4">—</span>
        <div class="flex flex-column flex-1">
          <label class="text-xs text-color-secondary mb-1">Hasta</label>
          <input
            type="date"
            class="date-input"
            [value]="value().end ? toInputDate(value().end!) : ''"
            (input)="onEndChange($event)"
          />
        </div>
      </div>
      @if (error()) {
        <small class="text-danger">{{ error() }}</small>
      }
    </div>
  `,
  styles: [
    `
      .date-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-input);
        background: var(--ds-bg-surface);
        color: var(--ds-text-primary);
        font-family: var(--ds-font-family-base);
        font-size: var(--ds-font-size-body);
        outline: none;
        transition: border-color 0.15s;
        box-sizing: border-box;
      }
      .date-input:focus {
        border-color: var(--ds-border-focus);
        box-shadow: var(--ds-shadow-focus);
      }
      .date-input:disabled {
        font-style: italic;
        cursor: not-allowed;
        opacity: 0.55;
        background: var(--ds-bg-sunken);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class DateRange extends DateRangeBase {}
