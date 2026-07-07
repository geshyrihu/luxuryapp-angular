import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { MegaMenu } from "@ui/web/mega-menu/mega-menu";
import { MobileMegaMenu } from "@ui/mobile/mega-menu/mega-menu";
import { MegaMenuBase } from "@ui/base/mega-menu.base";

@Component({
  selector: "lx-mega-menu",
  standalone: true,
  imports: [MegaMenu, MobileMegaMenu],
  template: `
    @if (platform.isMobile()) {
      <ili-mega-menu [items]="items()" [orientation]="orientation()" />
    } @else {
      <app-mega-menu [items]="items()" [orientation]="orientation()" />
    }
  `,
})
export class LxMegaMenu extends MegaMenuBase {
  protected platform = inject(PlatformService);
}
