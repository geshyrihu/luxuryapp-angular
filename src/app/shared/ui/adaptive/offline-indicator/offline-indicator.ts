import { Component, inject } from "@angular/core";
import { OfflineIndicatorBase } from "@ui/base/offline-indicator.base";
import { MobileOfflineIndicator } from "@ui/mobile/offline-indicator/offline-indicator";
import { OfflineIndicator } from "@ui/web/offline-indicator/offline-indicator";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-offline-indicator",

  imports: [OfflineIndicator, MobileOfflineIndicator],
  template: `
    @if (platform.isMobile()) {
      <ili-offline-indicator />
    } @else {
      <app-offline-indicator />
    }
  `,
})
export class LxOfflineIndicator extends OfflineIndicatorBase {
  protected platform = inject(PlatformService);
}
