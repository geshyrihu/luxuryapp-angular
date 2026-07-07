import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

@Component({
  selector: "lx-action-sheet",
  standalone: true,
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
