import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { ToastBase } from "@ui/core/toast.base";
import { MobileToast } from "@ui/mobile/toast/toast";
import { AppToast } from "@ui/web/toast/toast";

@Component({
  selector: "lux-toast",

  imports: [AppToast, MobileToast],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ili-toast />
    } @else {
      <lux-toast-web />
    }
  `,
})
export class LxToast extends ToastBase {
  protected platform = inject(PlatformService);
}
