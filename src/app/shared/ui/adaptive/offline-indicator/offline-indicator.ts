import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { OfflineIndicatorBase } from "@ui/core/offline-indicator.base";
import { MobileOfflineIndicator } from "@ui/mobile/offline-indicator/offline-indicator";
import { OfflineIndicator } from "@ui/web/offline-indicator/offline-indicator";

@Component({
  selector: "lux-offline-indicator",

  imports: [OfflineIndicator, MobileOfflineIndicator],
  template: `
    @if (platform.isMobile()) {
      <ili-offline-indicator />
    } @else {
      <lux-offline-indicator-web />
    }
  `,
})
export class LxOfflineIndicator extends OfflineIndicatorBase {
  protected platform = inject(PlatformService);
}
