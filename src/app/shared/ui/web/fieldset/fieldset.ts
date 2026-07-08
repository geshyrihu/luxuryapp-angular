import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { FieldsetModule } from "primeng/fieldset";
import { FieldsetBase } from "@ui/base/fieldset.base";

@Component({
  selector: "app-fieldset",
  standalone: true,
  imports: [FieldsetModule],
  template: `
    <p-fieldset [legend]="legend()" [toggleable]="toggleable()" [collapsed]="collapsed()">
      <ng-content />
    </p-fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppFieldset extends FieldsetBase {}
