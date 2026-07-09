import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { DataView } from "@ui/web/data-view/data-view";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-data-view",

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
