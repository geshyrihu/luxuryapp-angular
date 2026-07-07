import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { ScrollTop } from "@ui/web/tap-to-top/tap-to-top";
import { MobileTapToTop } from "@ui/mobile/tap-to-top/tap-to-top";
import { TapToTopBase } from "@ui/base/tap-to-top.base";

@Component({
  selector: "lx-scroll-top",
  standalone: true,
  imports: [ScrollTop, MobileTapToTop],
  template: `
    @if (platform.isMobile()) {
      <ili-tap-to-top />
    } @else {
      <app-scroll-top />
    }
  `,
})
export class LxScrollTop extends TapToTopBase {
  protected platform = inject(PlatformService);
}
