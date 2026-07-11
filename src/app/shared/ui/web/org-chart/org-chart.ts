// @ts-nocheck
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { OrgChartBase } from "@ui/base/org-chart.base";
import { OrgChartModule } from "primeng/orgchart";

@Component({
  selector: "app-org-chart",

  imports: [CommonModule, OrgChartModule],
  template: `
    <p-orgChart
      [value]="value()"
      [(selection)]="selection"
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
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class OrgChart extends OrgChartBase {}
