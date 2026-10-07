import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { TapToTopBase } from "@ui/core/tap-to-top.base";
import { MobileTapToTop } from "@ui/mobile/tap-to-top/tap-to-top";
import { ScrollTop } from "@ui/web/tap-to-top/tap-to-top";

@Component({
  selector: "lux-scroll-top",

  imports: [ScrollTop, MobileTapToTop],
  template: `
    @if (platform.isMobile()) {
      <lux-tap-to-top-mobile />
    } @else {
      <lux-scroll-top-web />
    }
  `,
})
export class LxScrollTop extends TapToTopBase {
  protected platform = inject(PlatformService);
}
