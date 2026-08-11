import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { KnobBase } from "@ui/base/knob.base";
import { KnobModule } from "primeng/knob";

@Component({
  selector: "app-knob",

  imports: [FormsModule, KnobModule],
  template: `
    <p-knob
      [(ngModel)]="value"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [size]="size()"
      [valueColor]="color()"
      [rangeColor]="rangeColor()"
    />
  `,
  styles: [
    `
      .p-knob {
        outline: none;
      }
      .p-knob:focus-visible {
        box-shadow: var(--ds-shadow-focus);
        border-radius: 50%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppKnob extends KnobBase {
  rangeColor(): string {
    return "var(--ds-border)";
  }
}
