import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { OrgChartModule } from "primeng/orgchart";
import { OrgChartBase } from "@ui/base/org-chart.base";

@Component({
  selector: "app-org-chart",
  standalone: true,
  imports: [CommonModule, OrgChartModule],
  template: `
    <p-orgChart
      [value]="value()"
      [(selection)]="selection"
      selectionMode="single"
      styleClass="w-full"
    />
  `,
  styles: [`
    :host { display: block; width: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class OrgChart extends OrgChartBase {}
