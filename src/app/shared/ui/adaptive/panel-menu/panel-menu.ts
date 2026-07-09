import { Component, inject } from "@angular/core";
import { PanelMenuBase } from "@ui/base/panel-menu.base";
import { MobilePanelMenu } from "@ui/mobile/panel-menu/panel-menu";
import { AppPanelMenu } from "@ui/web/panel-menu/panel-menu";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-panel-menu",

  imports: [AppPanelMenu, MobilePanelMenu],
  template: `
    @if (platform.isMobile()) {
      <ili-panel-menu [model]="model()" [styleClass]="styleClass()"
        ><ng-content
      /></ili-panel-menu>
    } @else {
      <app-panel-menu [model]="model()" [styleClass]="styleClass()"
        ><ng-content
      /></app-panel-menu>
    }
  `,
})
export class LxPanelMenu extends PanelMenuBase {
  protected platform = inject(PlatformService);
}
