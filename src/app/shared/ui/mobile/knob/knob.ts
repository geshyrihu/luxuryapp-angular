import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { KnobBase } from "@ui/base/knob.base";

@Component({
  selector: "ili-knob",

  imports: [FormsModule],
  template: `
    <div class="ili-knob-root">
      <input
        type="range"
        class="ili-knob-input"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
        [style.width.px]="size()"
      />
      <span class="ili-knob-value">{{ value() }}</span>
    </div>
  `,
  styles: [
    `
      .ili-knob-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      .ili-knob-input {
        -webkit-appearance: none;
        appearance: none;
        height: 6px;
        border-radius: 3px;
        background: var(--ds-border);
        outline: none;
      }
      .ili-knob-input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--ds-primary);
        border: 2px solid var(--ds-bg-surface);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
      .ili-knob-input::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--ds-primary);
        border: 2px solid var(--ds-bg-surface);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
      .ili-knob-value {
        font-size: var(--ds-font-size-label);
        color: var(--ds-text-primary);
        font-weight: 600;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileKnob extends KnobBase {}
