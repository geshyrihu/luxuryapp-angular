import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { BottomNav } from "@ui/web/bottom-nav/bottom-nav";
import { MobileBottomNav } from "@ui/mobile/bottom-nav/bottom-nav";
import { BottomNavBase } from "@ui/base/bottom-nav.base";

@Component({
  selector: "lx-bottom-nav",
  standalone: true,
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
