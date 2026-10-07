import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { LoaderBase } from "@ui/core/loader.base";
import { MobileLoader } from "@ui/mobile/loader/mobile-loader";
import { AppLoader } from "@ui/web/loader/loader";

@Component({
  selector: "lux-loader",

  imports: [AppLoader, MobileLoader],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <lux-loader-mobile />
    } @else {
      <lux-loader-web />
    }
  `,
})
export class LxLoader extends LoaderBase {
  protected platform = inject(PlatformService);
}
