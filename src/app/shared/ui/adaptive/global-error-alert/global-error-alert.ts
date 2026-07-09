import { Component, inject } from "@angular/core";
import { GlobalErrorAlertBase } from "@ui/base/global-error-alert.base";
import { MobileGlobalErrorAlert } from "@ui/mobile/global-error-alert/global-error-alert";
import { GlobalErrorAlert } from "@ui/web/global-error-alert/global-error-alert";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-global-error-alert",

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
