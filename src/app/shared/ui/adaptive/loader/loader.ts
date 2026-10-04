import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LoaderBase } from "@ui/core/loader.base";
import { MobileLoader } from "@ui/mobile/loader/mobile-loader";
import { AppLoader } from "@ui/web/loader/loader";
import { PlatformService } from "@core/services/platform.service";

@Component({
  selector: "lux-loader",

  imports: [AppLoader, MobileLoader],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ili-loader />
    } @else {
      <app-loader />
    }
  `,
})
export class LxLoader extends LoaderBase {
  protected platform = inject(PlatformService);
}

