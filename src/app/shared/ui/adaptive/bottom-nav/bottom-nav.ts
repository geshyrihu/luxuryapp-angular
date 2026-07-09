import { Component, inject } from "@angular/core";
import { BottomNavBase } from "@ui/base/bottom-nav.base";
import { MobileBottomNav } from "@ui/mobile/bottom-nav/bottom-nav";
import { BottomNav } from "@ui/web/bottom-nav/bottom-nav";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-bottom-nav",

  imports: [BottomNav, MobileBottomNav],
  template: `
    @if (platform.isMobile()) {
      <ili-bottom-nav
        [items]="items()"
        [(activeId)]="activeId"
        [ariaLabel]="ariaLabel()"
        (navChange)="navChange.emit($event)"
      />
    } @else {
      <app-bottom-nav
        [items]="items()"
        [(activeId)]="activeId"
        [ariaLabel]="ariaLabel()"
        (navChange)="navChange.emit($event)"
      />
    }
  `,
})
export class LxBottomNav extends BottomNavBase {
  protected platform = inject(PlatformService);
}
