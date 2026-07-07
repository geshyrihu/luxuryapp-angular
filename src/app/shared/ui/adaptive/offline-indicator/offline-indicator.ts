import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { OfflineIndicator } from "@ui/web/offline-indicator/offline-indicator";
import { MobileOfflineIndicator } from "@ui/mobile/offline-indicator/offline-indicator";
import { OfflineIndicatorBase } from "@ui/base/offline-indicator.base";

@Component({
  selector: "lx-offline-indicator",
  standalone: true,
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
