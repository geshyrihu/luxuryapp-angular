import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { GlobalErrorAlert } from "@ui/web/global-error-alert/global-error-alert";
import { MobileGlobalErrorAlert } from "@ui/mobile/global-error-alert/global-error-alert";
import { GlobalErrorAlertBase } from "@ui/base/global-error-alert.base";

@Component({
  selector: "lx-global-error-alert",
  standalone: true,
  imports: [GlobalErrorAlert, MobileGlobalErrorAlert],
  template: `
    @if (platform.isMobile()) {
      <ili-global-error-alert />
    } @else {
      <app-global-error-alert />
    }
  `,
})
export class LxGlobalErrorAlert extends GlobalErrorAlertBase {
  protected platform = inject(PlatformService);
}
