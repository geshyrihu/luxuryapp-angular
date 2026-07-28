import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { OrgChartBase } from "@ui/base/org-chart.base";
import { OrganizationChartModule } from "primeng/organizationchart";

@Component({
  selector: "app-org-chart",
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [OrganizationChartModule],
  template: `
    <p-orgChart
      [value]="value()"
      [selection]="selection()"
      (selectionChange)="selection.set($event)"
      selectionMode="single"
      styleClass="w-full"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrgChart extends OrgChartBase {}
