import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Menubar } from "@ui/web/menubar/menubar";
import { MobileMenubar } from "@ui/mobile/menubar/menubar";
import { MenubarBase } from "@ui/base/menubar.base";

@Component({
  selector: "lx-menubar",
  standalone: true,
  imports: [Menubar, MobileMenubar],
  template: `
    @if (platform.isMobile()) {
      <ili-menubar [items]="items()" [orientation]="orientation()" [(activeItem)]="activeItem" />
    } @else {
      <app-menubar [items]="items()" [orientation]="orientation()" [(activeItem)]="activeItem" />
    }
  `,
})
export class LxMenubar extends MenubarBase {
  protected platform = inject(PlatformService);
}
