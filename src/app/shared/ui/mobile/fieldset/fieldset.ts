import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FieldsetBase } from "@ui/core/fieldset.base";

@Component({
  selector: "lux-fieldset-mobile",
  template: `
    <fieldset class="lux-fieldset-mobile">
      @if (legend()) {
        <legend class="lux-fieldset-mobile-legend">{{ legend() }}</legend>
      }
      <ng-content />
    </fieldset>
  `,
  styles: [
    `
      .lux-fieldset-mobile {
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        padding: 1rem;
        margin: 0;
      }
      .lux-fieldset-mobile-legend {
        font-weight: 700;
        font-size: 0.875rem;
        padding: 0 0.5rem;
        color: var(--ds-text-primary);
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliFieldset extends FieldsetBase {}
