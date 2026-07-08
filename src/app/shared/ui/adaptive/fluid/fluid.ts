import { Component, inject } from "@angular/core";
import { FluidBase } from "@ui/base/fluid.base";
import { MobileFluid } from "@ui/mobile/fluid/fluid";
import { AppFluid } from "@ui/web/fluid/fluid";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-fluid",

  imports: [AppFluid, MobileFluid],
  template: `
    @if (platform.isMobile()) {
      <ili-fluid>
        <ng-content />
      </ili-fluid>
    } @else {
      <app-fluid>
        <ng-content />
      </app-fluid>
    }
  `,
})
export class LxFluid extends FluidBase {
  protected platform = inject(PlatformService);
}
