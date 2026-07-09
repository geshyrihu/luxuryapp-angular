import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FieldsetBase } from "@ui/base/fieldset.base";
import { FieldsetModule } from "primeng/fieldset";

@Component({
  selector: "app-fieldset",

  imports: [FieldsetModule],
  template: `
    <p-fieldset
      [legend]="legend()"
      [toggleable]="toggleable()"
      [collapsed]="collapsed()"
    >
      <ng-content />
    </p-fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppFieldset extends FieldsetBase {}
