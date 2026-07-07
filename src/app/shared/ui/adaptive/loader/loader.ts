import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppLoader } from "@ui/web/loader/loader";
import { MobileLoader } from "@ui/mobile/loader/mobile-loader";
import { LoaderBase } from "@ui/base/loader.base";

@Component({
  selector: "lx-loader",
  standalone: true,
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
