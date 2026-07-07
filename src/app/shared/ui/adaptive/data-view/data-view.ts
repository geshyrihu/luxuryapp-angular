import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { DataView } from "@ui/web/data-view/data-view";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "lx-data-view",
  standalone: true,
  imports: [DataView, DataViewMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <app-data-view-mobile />
    } @else {
      <app-data-view />
    }
  `,
})
export class LxDataView {
  protected platform = inject(PlatformService);
}
