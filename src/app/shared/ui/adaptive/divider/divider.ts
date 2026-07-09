import { Component, inject } from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";
import { IliDivider } from "@ui/mobile/divider/divider";
import { AppDivider } from "@ui/web/divider/divider";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-divider",

  imports: [AppDivider, IliDivider],
  template: `
    @if (platform.isMobile()) {
      <ili-divider [layout]="layout()"><ng-content /></ili-divider>
    } @else {
      <app-divider [layout]="layout()"><ng-content /></app-divider>
    }
  `,
})
export class LxDivider extends DividerBase {
  protected platform = inject(PlatformService);
}
