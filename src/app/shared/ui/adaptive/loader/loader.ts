import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LoaderBase } from "@ui/base/loader.base";
import { MobileLoader } from "@ui/mobile/loader/mobile-loader";
import { AppLoader } from "@ui/web/loader/loader";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-loader",

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
