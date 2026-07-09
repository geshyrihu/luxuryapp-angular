import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FieldsetBase } from "@ui/base/fieldset.base";

@Component({
  selector: "ili-fieldset",

  template: `
    <fieldset class="ili-fieldset">
      @if (legend()) {
        <legend class="ili-fieldset-legend">{{ legend() }}</legend>
      }
      <ng-content />
    </fieldset>
  `,
  styles: [
    `
      .ili-fieldset {
        border: 1px solid var(--ds-border, #d7dbe3);
        border-radius: var(--ds-radius-md, 8px);
        padding: 1rem;
        margin: 0;
      }
      .ili-fieldset-legend {
        font-weight: 700;
        font-size: 0.875rem;
        padding: 0 0.5rem;
        color: var(--ds-text-primary, #1f2937);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class IliFieldset extends FieldsetBase {}
