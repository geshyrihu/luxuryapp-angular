import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { MenubarBase } from "@ui/core/menubar.base";
import { MobileMenubar } from "@ui/mobile/menubar/menubar";
import { Menubar } from "@ui/web/menubar/menubar";

@Component({
  selector: "lux-menubar",

  imports: [Menubar, MobileMenubar],
  template: `
    @if (platform.isMobile()) {
      <ili-menubar
        [items]="items()"
        [orientation]="orientation()"
        [(activeItem)]="activeItem"
      />
    } @else {
      <app-menubar
        [items]="items()"
        [orientation]="orientation()"
        [(activeItem)]="activeItem"
      />
    }
  `,
})
export class LxMenubar extends MenubarBase {
  protected platform = inject(PlatformService);
}
