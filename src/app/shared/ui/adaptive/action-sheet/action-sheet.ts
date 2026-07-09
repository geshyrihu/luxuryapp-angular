import { Component, inject } from "@angular/core";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-action-sheet",

  imports: [ActionMenu, MobileActionMenu],
  template: `
    @if (platform.isMobile()) {
      <ili-action-menu><ng-content /></ili-action-menu>
    } @else {
      <app-action-menu><ng-content /></app-action-menu>
    }
  `,
})
export class LxActionSheet {
  protected platform = inject(PlatformService);
}
