import { Component, inject, viewChild } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { MenuBase } from "@ui/core/menu.base";
import { MobileMenu } from "@ui/mobile/menu/menu";
import { AppMenu } from "@ui/web/menu/menu";

@Component({
  selector: "lux-menu",

  imports: [AppMenu, MobileMenu],
  template: `
    @if (platform.isMobile()) {
      <lux-menu-mobile [model]="model()" [popup]="popup()" [styleClass]="styleClass()"
        ><ng-content
      /></lux-menu-mobile>
    } @else {
      <lux-menu-web
        #webMenu
        [model]="model()"
        [popup]="popup()"
        [styleClass]="styleClass()"
        ><ng-content
      /></lux-menu-web>
    }
  `,
})
export class LxMenu extends MenuBase {
  protected platform = inject(PlatformService);
  private webMenuRef = viewChild<AppMenu>("webMenu");

  toggle(): void {
    this.webMenuRef()?.toggle();
  }
}
