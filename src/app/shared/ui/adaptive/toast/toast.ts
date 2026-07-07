import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { PrimeNgCustomToast } from "@ui/web/primeng-custom-toast/primeng-custom-toast";
import { MobileToast } from "@ui/mobile/toast/toast";
import { ToastBase } from "@ui/base/toast.base";

@Component({
  selector: "lx-toast",
  standalone: true,
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
