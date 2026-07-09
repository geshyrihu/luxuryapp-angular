import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ToastBase } from "@ui/base/toast.base";
import { MobileToast } from "@ui/mobile/toast/toast";
import { PrimeNgCustomToast } from "@ui/web/primeng-custom-toast/primeng-custom-toast";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-toast",

  imports: [PrimeNgCustomToast, MobileToast],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ili-toast />
    } @else {
      <primeng-custom-toast />
    }
  `,
})
export class LxToast extends ToastBase {
  protected platform = inject(PlatformService);
}
