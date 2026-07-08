import { Component, inject } from "@angular/core";
import { OrgChartBase } from "@ui/base/org-chart.base";
import { MobileOrgChart } from "@ui/mobile/org-chart/org-chart";
import { OrgChart } from "@ui/web/org-chart/org-chart";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-org-chart",

  imports: [OrgChart, MobileOrgChart],
  template: `
    @if (platform.isMobile()) {
      <ili-org-chart [value]="value()" [(selection)]="selection" />
    } @else {
      <app-org-chart [value]="value()" [(selection)]="selection" />
    }
  `,
})
export class LxOrgChart extends OrgChartBase {
  protected platform = inject(PlatformService);
}
