import { Component, inject } from "@angular/core";
import { BlockUIBase } from "@ui/base/block-ui.base";
import { MobileBlockUI } from "@ui/mobile/block-ui/block-ui";
import { AppBlockUI } from "@ui/web/block-ui/block-ui";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-block-ui",

  imports: [AppBlockUI, MobileBlockUI],
  template: `
    @if (platform.isMobile()) {
      <ili-block-ui [blocked]="blocked()" [fullScreen]="fullScreen()">
        <ng-content />
      </ili-block-ui>
    } @else {
      <app-block-ui [blocked]="blocked()" [fullScreen]="fullScreen()">
        <ng-content />
      </app-block-ui>
    }
  `,
})
export class LxBlockUI extends BlockUIBase {
  protected platform = inject(PlatformService);
}
