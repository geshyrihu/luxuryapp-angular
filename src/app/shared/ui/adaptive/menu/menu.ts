import { Component, inject } from "@angular/core";
import { MenuBase } from "@ui/base/menu.base";
import { MobileMenu } from "@ui/mobile/menu/menu";
import { AppMenu } from "@ui/web/menu/menu";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-menu",

  imports: [AppMenu, MobileMenu],
  template: `
    @if (platform.isMobile()) {
      <ili-menu [model]="model()" [popup]="popup()" [styleClass]="styleClass()"
        ><ng-content
      /></ili-menu>
    } @else {
      <app-menu [model]="model()" [popup]="popup()" [styleClass]="styleClass()"
        ><ng-content
      /></app-menu>
    }
  `,
})
export class LxMenu extends MenuBase {
  protected platform = inject(PlatformService);
}
