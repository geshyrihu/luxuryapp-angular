import { Component, inject } from "@angular/core";
import { TapToTopBase } from "@ui/base/tap-to-top.base";
import { MobileTapToTop } from "@ui/mobile/tap-to-top/tap-to-top";
import { ScrollTop } from "@ui/web/tap-to-top/tap-to-top";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-scroll-top",

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
