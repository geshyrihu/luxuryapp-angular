// @ts-nocheck

import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { OrgChartBase } from "@ui/base/org-chart.base";
import { OrgChartModule } from "primeng/orgchart";

@Component({
  selector: "app-org-chart",

  imports: [OrgChartModule],
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
