import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ToastBase } from "@ui/core/toast.base";
import { MobileToast } from "@ui/mobile/toast/toast";
import { AppToast } from "@ui/web/toast/toast";
import { PlatformService } from "@core/services/platform.service";

@Component({
  selector: "lux-toast",

  imports: [AppToast, MobileToast],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ili-toast />
    } @else {
      <app-toast />
    }
  `,
})
export class LxToast extends ToastBase {
  protected platform = inject(PlatformService);
}
