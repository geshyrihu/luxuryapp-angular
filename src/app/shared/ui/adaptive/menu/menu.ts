import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppMenu } from "@ui/web/menu/menu";
import { MobileMenu } from "@ui/mobile/menu/menu";
import { MenuBase } from "@ui/base/menu.base";

@Component({
  selector: "lx-menu",
  standalone: true,
  imports: [AppMenu, MobileMenu],
  template: `
    @if (platform.isMobile()) {
      <ili-menu [model]="model()" [popup]="popup()" [styleClass]="styleClass()"><ng-content/></ili-menu>
    } @else {
      <app-menu [model]="model()" [popup]="popup()" [styleClass]="styleClass()"><ng-content/></app-menu>
    }
  `,
})
export class LxMenu extends MenuBase {
  protected platform = inject(PlatformService);
}
