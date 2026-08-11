import { Component, ViewEncapsulation } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { DateRangeBase } from "@ui/base/date-range.base";

@Component({
  selector: "ili-date-range",

  imports: [IonButton],
  template: `
    <div class="ili-date-range">
      <div class="ili-date-presets">
        @for (preset of presets; track preset.label) {
          <ion-button
            size="small"
            fill="outline"
            color="medium"
            (click)="applyPreset(preset)"
          >
            {{ preset.label }}
          </ion-button>
        }
      </div>

      <div class="ili-date-fields">
        <div class="ili-date-field">
          <label>Desde</label>
          <input
            type="date"
            [value]="value().start ? toInputDate(value().start!) : ''"
            (input)="onStartChange($event)"
          />
        </div>
        <span class="ili-date-sep">—</span>
        <div class="ili-date-field">
          <label>Hasta</label>
          <input
            type="date"
            [value]="value().end ? toInputDate(value().end!) : ''"
            (input)="onEndChange($event)"
          />
        </div>
      </div>

      @if (error()) {
        <small class="ili-date-error">{{ error() }}</small>
      }
    </div>
  `,
  styles: [
    `
      .ili-date-range {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .ili-date-presets {
        display: flex;
        gap: 0.35rem;
        flex-wrap: wrap;
      }
      .ili-date-fields {
        display: flex;
        gap: 0.5rem;
        align-items: flex-end;
      }
      .ili-date-field {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
      .ili-date-field label {
        font-size: 0.75rem;
        color: var(--ds-text-secondary);
        margin-bottom: 0.25rem;
      }
      .ili-date-field input {
        width: 100%;
        padding: 0.6rem 0.75rem;
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-input);
        background: var(--ds-bg-surface);
        color: var(--ds-text-primary);
        font-size: 0.95rem;
        outline: none;
        box-sizing: border-box;
      }
      .ili-date-field input:focus {
        border-color: var(--ds-border-focus);
      }
      .ili-date-sep {
        color: var(--ds-text-muted);
        padding-bottom: 0.6rem;
      }
      .ili-date-error {
        color: var(--ds-danger);
        font-size: 0.8125rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileDateRange extends DateRangeBase {}
