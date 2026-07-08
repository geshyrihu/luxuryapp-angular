import { Component, inject } from "@angular/core";
import { DividerBase } from "@ui/base/divider.base";
import { AppDivider } from "@ui/web/divider/divider";
import { IliDivider } from "@ui/mobile/divider/divider";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-divider",
  standalone: true,
  imports: [AppDivider, IliDivider],
  template: `
    @if (platform.isMobile()) {
      <ili-divider [layout]="layout()" />
    } @else {
      <app-divider [layout]="layout()" />
    }
  `,
})
export class LxDivider extends DividerBase {
  protected platform = inject(PlatformService);
}
